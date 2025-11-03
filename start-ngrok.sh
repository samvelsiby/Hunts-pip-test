#!/bin/bash
# Start ngrok to expose localhost:3000 for Clerk webhooks

echo "Starting ngrok to expose localhost:3000..."
echo ""
echo "This will run in the foreground. Press Ctrl+C to stop."
echo ""
echo "Once ngrok starts, copy the HTTPS URL (e.g., https://xxxx.ngrok.io)"
echo "and update your Clerk webhook endpoint to: https://xxxx.ngrok.io/api/custom-webhook"
echo ""
echo "Starting ngrok..."

npx --yes ngrok@latest http 3000

