#!/bin/bash
echo "Initializing LocalStack S3 buckets for Jal-Dharani..."
awslocal s3 mb s3://jal-dharani-media --region ap-south-1
awslocal s3api put-bucket-cors --bucket jal-dharani-media --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
      "AllowedOrigins": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}'
echo "LocalStack S3 bucket 'jal-dharani-media' initialized successfully."
