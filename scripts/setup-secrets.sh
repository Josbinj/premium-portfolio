#!/bin/bash
# setup-secrets.sh - Store secrets in AWS SSM Parameter Store securely
# This allows the application to pull secrets securely at runtime/build without committing them.

if [ "$#" -ne 2 ]; then
    echo "Usage: ./setup-secrets.sh <JWT_SECRET> <ADMIN_PASSWORD>"
    exit 1
fi

JWT_SECRET=$1
ADMIN_PASSWORD=$2
REGION=${AWS_REGION:-"us-east-1"}

echo "Setting JWT_SECRET in SSM Parameter Store..."
aws ssm put-parameter \
    --name "/portfolio/production/JWT_SECRET" \
    --value "$JWT_SECRET" \
    --type "SecureString" \
    --region "$REGION" \
    --overwrite

echo "Setting ADMIN_PASSWORD in SSM Parameter Store..."
aws ssm put-parameter \
    --name "/portfolio/production/ADMIN_PASSWORD" \
    --value "$ADMIN_PASSWORD" \
    --type "SecureString" \
    --region "$REGION" \
    --overwrite

echo "Secrets stored successfully."
