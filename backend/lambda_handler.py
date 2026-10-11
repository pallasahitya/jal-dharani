"""
AWS Lambda / SAM entry point using Mangum ASGI adapter.
Enables FastAPI to execute inside AWS Lambda and 'sam local start-api'.
"""
try:
    from mangum import Mangum
    from main import app
    handler = Mangum(app, lifespan="off")
except ImportError:
    # Mangum is optional for direct uvicorn development
    def handler(event, context):
        return {
            "statusCode": 500,
            "body": "Mangum is not installed. Install with 'pip install mangum' for AWS Lambda / SAM execution."
        }
