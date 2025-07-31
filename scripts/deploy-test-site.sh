#!/bin/bash
set -e

echo "🧪 Testing deployed site..."

# Function to test URL with retries
test_url_with_retries() {
  local url=$1
  local description=$2
  local max_retries=3
  local retry_count=0
  
  while [ $retry_count -lt $max_retries ]; do
    local status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    echo "$description status: $status (attempt $((retry_count + 1))/$max_retries)"
    
    if [ "$status" = "200" ]; then
      echo "✅ $description accessible"
      return 0
    else
      echo "⚠️ $description returned status $status"
      retry_count=$((retry_count + 1))
      if [ $retry_count -lt $max_retries ]; then
        echo "⏳ Retrying in 10 seconds..."
        sleep 10
      fi
    fi
  done
  
  echo "❌ $description failed after $max_retries attempts"
  return 1
}

# Test game page (served from root)
test_url_with_retries "https://tjsingleton.github.io/bulletbuzz/" "Game page"

# Test documentation page
test_url_with_retries "https://tjsingleton.github.io/bulletbuzz/" "Documentation page"

# Test critical game files
test_url_with_retries "https://tjsingleton.github.io/bulletbuzz/dist/game-ui.js" "Game UI JavaScript"

# Test logo file
test_url_with_retries "https://tjsingleton.github.io/bulletbuzz/assets/logo.png" "Logo file"

echo "✅ Deployment testing complete" 