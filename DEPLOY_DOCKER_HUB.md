# FloodWatch Pro Deployment via Docker Hub

This guide explains how to deploy FloodWatch Pro to Google Cloud Run using Docker Hub as an intermediate registry. This approach is useful when you don't have the Google Cloud SDK installed locally.

## Prerequisites

1. A Google Cloud account with billing enabled
2. A Docker Hub account
3. Docker installed locally (verified working)

## Step 1: Create a Docker Hub Repository

1. Log in to [Docker Hub](https://hub.docker.com/)
2. Click "Create Repository"
3. Name it `floodwatch-pro` (or your preferred name)
4. Set visibility to "Private" if you want to keep it secure
5. Click "Create"

## Step 2: Tag and Push Your Docker Image

```bash
# Log in to Docker Hub
docker login

# Tag your local image with your Docker Hub username
docker tag floodwatch-pro:local YOUR_DOCKERHUB_USERNAME/floodwatch-pro:latest

# Push the image to Docker Hub
docker push YOUR_DOCKERHUB_USERNAME/floodwatch-pro:latest
```

## Step 3: Deploy to Google Cloud Run via Web Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Cloud Run API if not already enabled
4. Navigate to Cloud Run in the left sidebar
5. Click "CREATE SERVICE"
6. Select "Deploy one revision from an existing container image"
7. Click "SELECT" under Container image URL
8. Choose "Docker Hub" as the image source
9. Enter `YOUR_DOCKERHUB_USERNAME/floodwatch-pro:latest`
10. Configure the service:
    - Service name: `floodwatch-pro`
    - Region: Choose a region close to your users (e.g., `us-central1`)
    - CPU allocation and pricing: Select "CPU is only allocated during request processing"
    - Minimum instances: 0
    - Maximum instances: 10 (adjust as needed)
    - Memory: 256 MiB (increase if needed)
    - CPU: 1 (default)
    - Request timeout: 300 seconds
    - Ingress: Allow all traffic
    - Authentication: Allow unauthenticated invocations
11. Click "CREATE"

## Step 4: Configure Custom Domain (Optional)

1. In Cloud Run, select your `floodwatch-pro` service
2. Go to the "Domain Mappings" tab
3. Click "ADD MAPPING"
4. Follow the steps to map your domain to the service

## Step 5: Setting Up Continuous Deployment (Optional)

For continuous deployment, you can use GitHub Actions to automate the build and deployment process:

1. Create a `.github/workflows/deploy.yml` file in your repository with the following content:

```yaml
name: Build and Deploy to Cloud Run

on:
  push:
    branches: [main]

env:
  DOCKER_HUB_USERNAME: ${{ secrets.DOCKER_HUB_USERNAME }}
  DOCKER_HUB_PASSWORD: ${{ secrets.DOCKER_HUB_PASSWORD }}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ env.DOCKER_HUB_USERNAME }}/floodwatch-pro:latest

      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: floodwatch-pro
          image: docker.io/${{ env.DOCKER_HUB_USERNAME }}/floodwatch-pro:latest
          region: us-central1
          credentials: ${{ secrets.GCP_SA_KEY }}
```

2. Add the following secrets to your GitHub repository:
   - `DOCKER_HUB_USERNAME`: Your Docker Hub username
   - `DOCKER_HUB_PASSWORD`: Your Docker Hub password
   - `GCP_SA_KEY`: Your Google Cloud service account key JSON (create a service account with Cloud Run Admin role)

## Troubleshooting

- **Image Pull Issues**: Make sure your Docker Hub repository is public or your Google Cloud project has access to private Docker Hub images
- **API Connectivity**: Check the Cloud Run logs to ensure your backend API is accessible
- **CORS Issues**: Verify the CORS settings in your nginx configuration
- **Memory/CPU Limits**: If your application crashes, try increasing the memory allocation

## Monitoring

1. Go to Cloud Run in the Google Cloud Console
2. Select your `floodwatch-pro` service
3. Click on the "METRICS" tab to view performance data
4. Click on the "LOGS" tab to view application logs

Your FloodWatch Pro application should now be running on Google Cloud Run with its own URL, and users can access it from anywhere.
