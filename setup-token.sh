#!/bin/bash

# Script to set up GitHub Personal Access Token
echo "GitHub Personal Access Token Setup"
echo "=================================="
echo ""
echo "This script will help you set up your GitHub Personal Access Token for pushing to your repository."
echo ""

# Prompt for token
echo "Please paste your GitHub Personal Access Token (from https://github.com/settings/tokens):"
read -s token
echo ""

if [ -z "$token" ]; then
    echo "Error: Token cannot be empty."
    exit 1
fi

# Update the remote URL with the token
git remote set-url public https://StevenP-ea:${token}@github.com/StevenP-ea/iris_prototypes_public.git

echo "Remote URL updated successfully with your token."
echo ""
echo "You can now run ./push-to-github.sh to push your changes to GitHub."
echo ""
echo "Note: Your token is stored in the git remote URL. It is not saved anywhere else by this script." 