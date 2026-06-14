# Lambda: Portfolio Data
resource "aws_lambda_function" "portfolio" {
  filename         = "../backend/portfolio.zip"
  function_name    = "${var.project_name}-portfolio-handler"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "bootstrap"
  runtime          = "provided.al2"
  source_code_hash = filebase64sha256("../backend/portfolio.zip")

  environment {
    variables = {
      PORTFOLIO_TABLE_NAME = aws_dynamodb_table.portfolio_data.name
      CONTACT_TABLE_NAME   = aws_dynamodb_table.contact_messages.name
    }
  }
}

# API Gateway Integration: Portfolio GET
resource "aws_api_gateway_method" "portfolio_get" {
  rest_api_id   = aws_api_gateway_rest_api.portfolio_api.id
  resource_id   = aws_api_gateway_resource.portfolio_section.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "portfolio_get" {
  rest_api_id             = aws_api_gateway_rest_api.portfolio_api.id
  resource_id             = aws_api_gateway_resource.portfolio_section.id
  http_method             = aws_api_gateway_method.portfolio_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.portfolio.invoke_arn
}

# API Gateway Integration: Portfolio PUT (Protected internally, but for now open or API key)
resource "aws_api_gateway_method" "portfolio_put" {
  rest_api_id   = aws_api_gateway_rest_api.portfolio_api.id
  resource_id   = aws_api_gateway_resource.portfolio_section.id
  http_method   = "PUT"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "portfolio_put" {
  rest_api_id             = aws_api_gateway_rest_api.portfolio_api.id
  resource_id             = aws_api_gateway_resource.portfolio_section.id
  http_method             = aws_api_gateway_method.portfolio_put.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.portfolio.invoke_arn
}

# Lambda: Contact Messages
resource "aws_lambda_function" "contact" {
  filename         = "../backend/contact.zip"
  function_name    = "${var.project_name}-contact-handler"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "bootstrap"
  runtime          = "provided.al2"
  source_code_hash = filebase64sha256("../backend/contact.zip")

  environment {
    variables = {
      CONTACT_TABLE_NAME = aws_dynamodb_table.contact_messages.name
    }
  }
}

# API Gateway Integration: Contact POST
resource "aws_api_gateway_method" "contact_post" {
  rest_api_id   = aws_api_gateway_rest_api.portfolio_api.id
  resource_id   = aws_api_gateway_resource.contact.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "contact_post" {
  rest_api_id             = aws_api_gateway_rest_api.portfolio_api.id
  resource_id             = aws_api_gateway_resource.contact.id
  http_method             = aws_api_gateway_method.contact_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.contact.invoke_arn
}

# API Gateway Integration: Contact GET
resource "aws_api_gateway_method" "contact_get" {
  rest_api_id   = aws_api_gateway_rest_api.portfolio_api.id
  resource_id   = aws_api_gateway_resource.contact.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "contact_get" {
  rest_api_id             = aws_api_gateway_rest_api.portfolio_api.id
  resource_id             = aws_api_gateway_resource.contact.id
  http_method             = aws_api_gateway_method.contact_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.contact.invoke_arn
}


# Lambda Permissions
resource "aws_lambda_permission" "apigw_portfolio" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.portfolio.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.portfolio_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_contact" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.portfolio_api.execution_arn}/*/*"
}
