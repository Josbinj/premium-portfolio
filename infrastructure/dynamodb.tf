resource "aws_dynamodb_table" "portfolio_data" {
  name           = "${var.project_name}-data"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "OwnerEmail"
  range_key      = "SectionID"

  attribute {
    name = "OwnerEmail"
    type = "S"
  }
  
  attribute {
    name = "SectionID"
    type = "S"
  }

  tags = {
    Environment = "production"
    Project     = var.project_name
  }
}

resource "aws_dynamodb_table" "contact_messages" {
  name           = "${var.project_name}-contact-messages"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "MessageID"

  attribute {
    name = "MessageID"
    type = "S"
  }
  
  attribute {
    name = "OwnerEmail"
    type = "S"
  }

  global_secondary_index {
    name               = "OwnerEmailIndex"
    hash_key           = "OwnerEmail"
    projection_type    = "ALL"
  }

  tags = {
    Environment = "production"
    Project     = var.project_name
  }
}

resource "aws_dynamodb_table" "users" {
  name           = "${var.project_name}-users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "Email"

  attribute {
    name = "Email"
    type = "S"
  }

  tags = {
    Environment = "production"
    Project     = var.project_name
  }
}

resource "aws_dynamodb_table" "rate_limits" {
  name           = "${var.project_name}-rate-limits"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "Key"

  attribute {
    name = "Key"
    type = "S"
  }

  ttl {
    attribute_name = "ExpiresAt"
    enabled        = true
  }

  tags = {
    Environment = "production"
    Project     = var.project_name
  }
}
