#!/bin/bash

# Script to fix the non-fast-forward push issue
echo "Fixing push issue (non-fast-forward error)..."

# Method 1: Force push (use with caution - this will overwrite remote changes)
echo "Option 1: Force push your changes (will overwrite any remote changes)"
echo "Command: git push public main --force"
echo ""

# Method 2: Create a new branch and push that
echo "Option 2: Create a new branch and push that"
echo "Commands:"
echo "git checkout -b main-new"
echo "git push public main-new:main --force"
echo ""

# Method 3: Merge approach
echo "Option 3: Merge remote changes (recommended if you want to keep remote changes)"
echo "Commands:"
echo "git fetch public"
echo "git merge public/main --allow-unrelated-histories"
echo "git push public main"
echo ""

echo "Choose the option that best fits your situation."
echo "If you're unsure, Option 3 is usually the safest."
echo ""
echo "To execute an option, copy and paste the commands into your terminal." 