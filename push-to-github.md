# Push Iris to GitHub

We've prepared all the files for your Iris project in the `iris_prototypes_public` directory. To push this to GitHub, you need to authenticate. Here are the simplest options:

## Option 1: Push via HTTPS with Personal Access Token

1. Create a Personal Access Token on GitHub:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" (classic)
   - Give it a description like "Iris Project"
   - Select at least the "repo" scope
   - Generate and copy the token

2. Run these commands (replace YOUR_TOKEN with the token you copied):
   ```
   cd ~/Desktop/iris_prototypes_public
   git remote set-url origin https://StevenP-ea:YOUR_TOKEN@github.com/StevenP-ea/iris_prototypes_public.git
   git push -u origin main
   ```

## Option 2: Push via SSH (if you have SSH keys set up)

1. Run these commands:
   ```
   cd ~/Desktop/iris_prototypes_public
   git remote set-url origin git@github.com:StevenP-ea/iris_prototypes_public.git
   git push -u origin main
   ```

## Option 3: GitHub Desktop

1. Install GitHub Desktop from https://desktop.github.com/
2. Open GitHub Desktop and sign in
3. Add the local repository (File > Add Local Repository)
4. Select the ~/Desktop/iris_prototypes_public folder
5. Push to GitHub using the UI

All files are already committed, you just need to push them. 