# GitHub Push Guide for Iris Project

## Quick Push (Using the Script)

I've created a script to make pushing changes easy. Just run:

```bash
./push-to-github.sh
```

This will:
1. Add all your changes
2. Ask for a commit message
3. Push to your public repository

## Manual Push (If You Prefer)

If you want to push manually, use these commands:

```bash
# Add all changes
git add .

# Commit with a message
git commit -m "Your descriptive message here"

# Push to the public repository
git push public main
```

## Authentication Issues

If you encounter authentication issues when pushing:

1. Create a Personal Access Token (PAT) on GitHub:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" (classic)
   - Give it a description like "Iris Project"
   - Select at least the "repo" scope
   - Generate and copy the token

2. Update your remote URL:
   ```bash
   git remote set-url public https://StevenP-ea:YOUR_TOKEN@github.com/StevenP-ea/iris_prototypes_public.git
   ```

3. Try pushing again:
   ```bash
   git push public main
   ```

## Repository URLs

- Public Repository: https://github.com/StevenP-ea/iris_prototypes_public 