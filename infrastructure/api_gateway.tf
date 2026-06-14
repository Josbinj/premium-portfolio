# API Gateway REST API
resource "aws_api_gateway_rest_api" "portfolio_api" {
  name        = "${var.project_name}-api"
  description = "API for Portfolio Backend"
}

# Resource: /api
resource "aws_api_gateway_resource" "api" {
  rest_api_id = aws_api_gateway_rest_api.portfolio_api.id
  parent_id   = aws_api_gateway_rest_api.portfolio_api.root_resource_id
  path_part   = "api"
}

# Resource: /api/portfolio
resource "aws_api_gateway_resource" "portfolio" {
  rest_api_id = aws_api_gateway_rest_api.portfolio_api.id
  parent_id   = aws_api_gateway_resource.api.id
  path_part   = "portfolio"
}

# Resource: /api/portfolio/{section}
resource "aws_api_gateway_resource" "portfolio_section" {
  rest_api_id = aws_api_gateway_rest_api.portfolio_api.id
  parent_id   = aws_api_gateway_resource.portfolio.id
  path_part   = "{section}"
}

# Resource: /api/contact
resource "aws_api_gateway_resource" "contact" {
  rest_api_id = aws_api_gateway_rest_api.portfolio_api.id
  parent_id   = aws_api_gateway_resource.api.id
  path_part   = "contact"
}

# Deployment
resource "aws_api_gateway_deployment" "api_deploy" {
  rest_api_id = aws_api_gateway_rest_api.portfolio_api.id

  # This trigger forces a new deployment when API configuration changes
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.api.id,
      aws_api_gateway_resource.portfolio.id,
      aws_api_gateway_resource.portfolio_section.id,
      aws_api_gateway_resource.contact.id,
      # Methods and Integrations will be linked in lambda.tf
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_integration.portfolio_get,
    aws_api_gateway_integration.portfolio_put,
    aws_api_gateway_integration.contact_post,
    aws_api_gateway_integration.contact_get,
    aws_api_gateway_integration.portfolio_options,
    aws_api_gateway_integration.contact_options,
  ]
}

# Stage
resource "aws_api_gateway_stage" "prod" {
  deployment_id = aws_api_gateway_deployment.api_deploy.id
  rest_api_id   = aws_api_gateway_rest_api.portfolio_api.id
  stage_name    = "prod"
}

# Output the API URL
output "api_url" {
  value = aws_api_gateway_stage.prod.invoke_url
}
