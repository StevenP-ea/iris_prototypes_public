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
git push public main

echo "Push completed! Check your repository at https://github.com/StevenP-ea/iris_prototypes_public" 