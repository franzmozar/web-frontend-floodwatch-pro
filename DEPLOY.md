# NAC FloodWatch Pro Deployment Guide

This guide explains how to deploy the NAC FloodWatch Pro application to Google Cloud Run.

## Prerequisites

1. A Google Cloud account with billing enabled
2. Google Cloud SDK installed locally
3. Docker installed locally (for testing)

## Local Testing

Before deploying to Google Cloud, you can test the production build locally:

```bash
# Build the Docker image
docker build -t floodwatch-pro:local .

# Run the container locally
docker run -p 8080:8080 floodwatch-pro:local
```

Visit `http://localhost:8080` to verify the application works correctly.

## Deploying to Google Cloud Run

### Manual Deployment

1. Set up Google Cloud SDK:

   ```bash
   # Login to Google Cloud
   gcloud auth login

   # Set your project ID
   gcloud config set project YOUR_PROJECT_ID
   ```

2. Build and push the Docker image:

   ```bash
   # Build and tag the Docker image
   docker build -t gcr.io/YOUR_PROJECT_ID/floodwatch-pro .

   # Configure Docker to use Google Cloud credentials
   gcloud auth configure-docker

   # Push the image to Google Container Registry
   docker push gcr.io/YOUR_PROJECT_ID/floodwatch-pro
   ```

3. Deploy to Cloud Run:

   ```bash
   gcloud run deploy floodwatch-pro \
     --image gcr.io/YOUR_PROJECT_ID/floodwatch-pro \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

4. After deployment completes, Google Cloud will provide a URL where your application is accessible.

### Automated Deployment with Cloud Build

For automated deployments, we've provided a `cloudbuild.yaml` configuration file:

1. Enable the Cloud Build API in your Google Cloud project.

2. Connect your GitHub repository to Cloud Build:

   - Go to Cloud Build in the Google Cloud Console
   - Navigate to "Triggers"
   - Click "Connect Repository"
   - Follow the prompts to connect your GitHub repository

3. Create a new trigger:

   - Name: `floodwatch-pro-deploy`
   - Event: `Push to a branch`
   - Source: Select your repository and branch (e.g., `main`)
   - Configuration: `Cloud Build configuration file (yaml or json)`
   - Location: `Repository`
   - File: `cloudbuild.yaml`
   - Click "Create"

4. When you push changes to your repository, Cloud Build will automatically build and deploy your application.

## Environment Variables

To set environment variables for your Cloud Run service:

```bash
gcloud run services update floodwatch-pro \
  --set-env-vars="API_KEY=your_value,ANOTHER_VAR=another_value"
```

## Custom Domain (Optional)

To configure a custom domain for your Cloud Run service:

1. Go to Cloud Run in the Google Cloud Console
2. Select your `floodwatch-pro` service
3. Go to the "Domain Mappings" tab
4. Click "Add Mapping"
5. Follow the verification steps to map your domain

## Monitoring and Logging

After deployment:

1. View logs: Go to Cloud Run > floodwatch-pro > Logs
2. Monitor performance: Go to Cloud Run > floodwatch-pro > Metrics

## Troubleshooting

- If the build fails, check the build logs in Cloud Build
- If the deployment fails, check the Cloud Run deployment logs
- If the application doesn't work, check the Cloud Run service logs
