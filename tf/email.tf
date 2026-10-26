# ──────────────────────────────────────────────────────────────
# Email forwarding: info@alphagaldata.com → personal email
# SES receives inbound email → S3 → Lambda forwards to target
# ──────────────────────────────────────────────────────────────

variable "email_forward_to" {
  description = "Email address to forward inbound mail to (set in email.auto.tfvars, gitignored)"
  type        = string
}

variable "email_from_prefix" {
  description = "The local part of the receiving address (e.g. info)"
  type        = string
  default     = "info"
}

# S3 bucket for storing raw inbound emails
resource "aws_s3_bucket" "ses_emails" {
  bucket = "alphagal-ses-emails"
}

resource "aws_s3_bucket_lifecycle_configuration" "ses_emails_lifecycle" {
  bucket = aws_s3_bucket.ses_emails.id
  rule {
    id     = "expire-old-emails"
    status = "Enabled"
    filter {}
    expiration {
      days = 30
    }
  }
}

resource "aws_s3_bucket_policy" "ses_emails_policy" {
  bucket = aws_s3_bucket.ses_emails.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowSESPuts"
        Effect    = "Allow"
        Principal = { Service = "ses.amazonaws.com" }
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.ses_emails.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })
}

data "aws_caller_identity" "current" {}

# ── SES Domain Identity & Verification ───────────────────────

resource "aws_ses_domain_identity" "alphagal" {
  domain = var.domain_name
}

resource "aws_route53_record" "ses_verification" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "_amazonses.${var.domain_name}"
  type    = "TXT"
  ttl     = 600
  records = [aws_ses_domain_identity.alphagal.verification_token]
}

resource "aws_ses_domain_identity_verification" "alphagal" {
  domain     = aws_ses_domain_identity.alphagal.id
  depends_on = [aws_route53_record.ses_verification]
}

# ── DKIM ─────────────────────────────────────────────────────

resource "aws_ses_domain_dkim" "alphagal" {
  domain = aws_ses_domain_identity.alphagal.domain
}

resource "aws_route53_record" "ses_dkim" {
  count   = 3
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "${aws_ses_domain_dkim.alphagal.dkim_tokens[count.index]}._domainkey.${var.domain_name}"
  type    = "CNAME"
  ttl     = 600
  records = ["${aws_ses_domain_dkim.alphagal.dkim_tokens[count.index]}.dkim.amazonses.com"]
}

# ── MX Record (route inbound email to SES) ───────────────────

resource "aws_route53_record" "mx" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "MX"
  ttl     = 600
  records = ["10 inbound-smtp.${var.aws_region}.amazonaws.com"]
}

# ── SPF + DMARC (so forwarded emails don't land in spam) ─────

# Combines SPF with existing Google site verification in a single TXT record set
resource "aws_route53_record" "apex_txt" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "TXT"
  ttl     = 600
  records = [
    "v=spf1 include:amazonses.com ~all",
    "google-site-verification=EN7MWMwMfNliT-3xObgt-Ukr61jjQGrS717quP_1m3s",
  ]
}

resource "aws_route53_record" "dmarc" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "_dmarc.${var.domain_name}"
  type    = "TXT"
  ttl     = 600
  records = ["v=DMARC1; p=none; rua=mailto:${var.email_from_prefix}@${var.domain_name}"]
}

# ── Lambda: email forwarder ──────────────────────────────────

data "archive_file" "email_forwarder" {
  type        = "zip"
  source_file = "${path.module}/lambda/email_forwarder.py"
  output_path = "${path.module}/lambda/email_forwarder.zip"
}

resource "aws_lambda_function" "email_forwarder" {
  function_name    = "alphagal-email-forwarder"
  filename         = data.archive_file.email_forwarder.output_path
  source_code_hash = data.archive_file.email_forwarder.output_base64sha256
  handler          = "email_forwarder.handler"
  runtime          = "python3.12"
  timeout          = 30
  memory_size      = 128

  role = aws_iam_role.email_forwarder_role.arn

  environment {
    variables = {
      FORWARD_TO  = var.email_forward_to
      FROM_EMAIL  = "${var.email_from_prefix}@${var.domain_name}"
      S3_BUCKET   = aws_s3_bucket.ses_emails.id
      MAIL_REGION = var.aws_region
    }
  }
}

resource "aws_lambda_permission" "allow_ses" {
  statement_id  = "AllowSESInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_forwarder.function_name
  principal     = "ses.amazonaws.com"
  source_account = data.aws_caller_identity.current.account_id
}

# ── IAM Role for Lambda ──────────────────────────────────────

resource "aws_iam_role" "email_forwarder_role" {
  name = "alphagal-email-forwarder-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "lambda.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "email_forwarder_policy" {
  name = "alphagal-email-forwarder-policy"
  role = aws_iam_role.email_forwarder_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = "${aws_s3_bucket.ses_emails.arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = ["ses:SendRawEmail"]
        Resource = "*"
      }
    ]
  })
}

# ── SES Receipt Rule ─────────────────────────────────────────

resource "aws_ses_receipt_rule_set" "main" {
  rule_set_name = "alphagal-inbound"
}

resource "aws_ses_active_receipt_rule_set" "main" {
  rule_set_name = aws_ses_receipt_rule_set.main.rule_set_name
}

resource "aws_ses_receipt_rule" "forward" {
  name          = "forward-to-personal"
  rule_set_name = aws_ses_receipt_rule_set.main.rule_set_name
  recipients    = ["${var.email_from_prefix}@${var.domain_name}"]
  enabled       = true
  scan_enabled  = true

  # First: store raw email in S3
  s3_action {
    bucket_name       = aws_s3_bucket.ses_emails.id
    object_key_prefix = "inbound/"
    position          = 1
  }

  # Then: invoke Lambda to forward
  lambda_action {
    function_arn    = aws_lambda_function.email_forwarder.arn
    invocation_type = "Event"
    position        = 2
  }

  depends_on = [
    aws_s3_bucket_policy.ses_emails_policy,
    aws_lambda_permission.allow_ses,
  ]
}

# ── Verify the forwarding target email ───────────────────────
# SES in sandbox mode requires verified sender AND recipient.
# This creates a verification request — check your Hotmail inbox
# and click the verification link.

resource "aws_ses_email_identity" "forward_target" {
  email = var.email_forward_to
}
