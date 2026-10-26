"""
SES Email Forwarder Lambda

Receives SES inbound email notifications, fetches the raw email from S3,
rewrites headers, and forwards to the configured destination via SES.
"""

import os
import email
import json
import logging

import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

FORWARD_TO = os.environ["FORWARD_TO"]
FROM_EMAIL = os.environ["FROM_EMAIL"]
S3_BUCKET = os.environ["S3_BUCKET"]
MAIL_REGION = os.environ.get("MAIL_REGION", "us-east-1")

s3 = boto3.client("s3")
ses = boto3.client("ses", region_name=MAIL_REGION)


def handler(event, context):
    logger.info("Received event: %s", json.dumps(event, default=str))

    record = event["Records"][0]
    ses_notification = record["ses"]
    mail = ses_notification["mail"]
    message_id = mail["messageId"]

    # Fetch raw email from S3
    s3_key = f"inbound/{message_id}"
    logger.info("Fetching s3://%s/%s", S3_BUCKET, s3_key)

    try:
        obj = s3.get_object(Bucket=S3_BUCKET, Key=s3_key)
        raw_email = obj["Body"].read()
    except Exception:
        logger.exception("Failed to fetch email from S3")
        raise

    # Parse and rewrite headers
    msg = email.message_from_bytes(raw_email)

    original_from = msg.get("From", "unknown")
    original_subject = msg.get("Subject", "(no subject)")

    # Rewrite From to our verified domain (required by SES)
    # Put original sender in Reply-To so replies go to the right place
    msg.replace_header("From", f"AlphaGalData Forwarded <{FROM_EMAIL}>")

    if msg.get("Reply-To"):
        msg.replace_header("Reply-To", original_from)
    else:
        msg["Reply-To"] = original_from

    # Prefix subject so you know it's forwarded
    if not original_subject.startswith("Fwd:"):
        msg.replace_header("Subject", f"Fwd: {original_subject}")

    # Set destination
    msg.replace_header("To", FORWARD_TO)

    # Remove headers that can cause delivery issues
    for header in ["Return-Path", "DKIM-Signature", "Sender"]:
        if header in msg:
            del msg[header]

    # Send via SES
    try:
        response = ses.send_raw_email(
            Source=FROM_EMAIL,
            Destinations=[FORWARD_TO],
            RawMessage={"Data": msg.as_bytes()},
        )
        logger.info("Forwarded message %s → %s (SES ID: %s)",
                     message_id, FORWARD_TO, response["MessageId"])
    except Exception:
        logger.exception("Failed to forward email via SES")
        raise

    return {"status": "forwarded", "messageId": message_id}
