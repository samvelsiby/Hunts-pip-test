#!/bin/bash
# Setup ngrok with authentication
# This script helps you set up ngrok and get your public URL

echo "=========================================="
echo "Setting up ngrok for Clerk Webhooks"
echo "=========================================="
echo ""
echo "Step 1: Sign up for a free ngrok account at:"
echo "   https://dashboard.ngrok.com/signup"
echo ""
echo "Step 2: Get your authtoken from:"
echo "   https://dashboard.ngrok.com/get-started/your-authtoken"
echo ""
read -p "Enter your ngrok authtoken: " AUTHTOKEN

if [ -z "$AUTHTOKEN" ]; then
  echo "❌ Authtoken is required"
  exit 1
fi

echo ""
echo "Configuring ngrok..."
npx ngrok config add-authtoken "$AUTHTOKEN"

if [ $? -eq 0 ]; then
  echo "✅ ngrok configured successfully!"
  echo ""
  echo "Starting ngrok on port 3000..."
  echo ""
  echo "Once ngrok starts, copy the HTTPS URL (e.g., https://xxxx.ngrok.io)"
  echo "and update your Clerk webhook to: https://xxxx.ngrok.io/api/custom-webhook"
  echo ""
  echo "Press Ctrl+C to stop ngrok"
  echo ""
  npx ngrok http 3000
else
  echo "❌ Failed to configure ngrok"
  exit 1
fi

