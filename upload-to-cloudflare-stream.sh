#!/bin/bash

# Cloudflare Stream Upload Script
# Usage: ./upload-to-cloudflare-stream.sh YOUR_API_TOKEN

if [ -z "$1" ]; then
    echo "Error: API Token required"
    echo "Usage: ./upload-to-cloudflare-stream.sh YOUR_API_TOKEN"
    exit 1
fi

API_TOKEN="$1"
ACCOUNT_ID="489f932edab80dec3ec3ed8dccd8bf17"
VIDEO_FILE="public/204_trade_charts_loop_2k.mov"

echo "Uploading video to Cloudflare Stream..."
echo "Account ID: $ACCOUNT_ID"
echo "Video file: $VIDEO_FILE"
echo ""

# Upload using tus protocol (recommended for large files)
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/stream" \
  -H "Authorization: Bearer $API_TOKEN" \
  -F "file=@$VIDEO_FILE" \
  -F 'meta={"name":"Trading Charts Loop Background"}' \
  -F 'requireSignedURLs=false' \
  -F 'allowedOrigins=["huntspip.com","www.huntspip.com","localhost:3001","localhost:3000"]'

echo ""
echo "Upload complete! Check the response above for the video ID."
echo "You can also view your videos at: https://dash.cloudflare.com/$ACCOUNT_ID/stream"
