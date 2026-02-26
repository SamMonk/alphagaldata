output "cloudfront_domain" {
  value = aws_cloudfront_distribution.site.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.site.id
}

output "certificate_arn" {
  value = aws_acm_certificate_validation.cf_cert_validation.certificate_arn
}

output "route53_zone_id" {
  value = data.aws_route53_zone.primary.zone_id
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.users.id
}

output "cognito_user_pool_arn" {
  value = aws_cognito_user_pool.users.arn
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.web.id
}

output "cognito_domain" {
  value = aws_cognito_user_pool_domain.users.domain
}

