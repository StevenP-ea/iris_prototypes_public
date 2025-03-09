#!/bin/bash

# Script to push changes to the public GitHub repository
echo "Preparing to push changes to GitHub public repository..."

# Add all changes
git add .

# Prompt for commit message
echo "Enter commit message:"
read commit_message

# Commit changes
git commit -m "$commit_message"

# Push to public repository
echo "Attempting to push to GitHub..."
if git push public main; then
    echo "Push completed successfully! Check your repository at https://github.com/StevenP-ea/iris_prototypes_public"
else
    echo ""
    echo "Authentication error detected. Please follow these steps:"
    echo ""
    echo "1. Create a Personal Access Token (PAT) on GitHub:"
    echo "   - Go to https://github.com/settings/tokens"
    echo "   - Click 'Generate new token' (classic)"
    echo "   - Give it a description like 'Iris Project'"
    echo "   - Select at least the 'repo' scope"
    echo "   - Generate and copy the token"
    echo ""
    echo "2. Update your remote URL (replace YOUR_TOKEN with your actual token):"
    echo "   git remote set-url public https://StevenP-ea:YOUR_TOKEN@github.com/StevenP-ea/iris_prototypes_public.git"
    echo ""
    echo "3. Run this script again"
    echo ""
    echo "For more detailed instructions, see github-guide.md"
fi 