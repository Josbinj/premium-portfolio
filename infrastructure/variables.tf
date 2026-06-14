variable "aws_region" {
  description = "The AWS region to deploy infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "The name of the project to use as a prefix for resources"
  type        = string
  default     = "portfolio"
}
