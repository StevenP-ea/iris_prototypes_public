# Instructions for Pushing to GitHub

It seems there's a permission issue when trying to push directly to GitHub. Here are steps to push your code using a Personal Access Token:

## Option 1: Push using HTTPS with Personal Access Token

1. Create a Personal Access Token (PAT) on GitHub:
   - Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
   - Click "Generate new token"
   - Give it a name like "Iris Project Push"
   - Set an expiration date
   - Select the repository you want to push to
   - Under "Repository permissions", give "Contents" "Read and write" access
   - Click "Generate token" and copy the token

2. Update the remote URL to include your username and token:
   ```
   git remote set-url public https://StevenP-ea:[YOUR_TOKEN]@github.com/StevenP-ea/iris_prototypes_public.git
   ```

3. Push to the repository:
   ```
   git push -u public main
   ```

## Option 2: Push using SSH

If you have SSH set up with GitHub:

1. Change the remote URL to use SSH:
   ```
   git remote set-url public git@github.com:StevenP-ea/iris_prototypes_public.git
   ```

2. Push to the repository:
   ```
   git push -u public main
   ```

## Option 3: GitHub CLI

If you have GitHub CLI installed:

1. Authenticate with GitHub CLI:
   ```
   gh auth login
   ```

2. Push the repository:
   ```
   gh repo create StevenP-ea/iris_prototypes_public --public --source=. --remote=public --push
   ```

Choose the option that works best for your setup. 