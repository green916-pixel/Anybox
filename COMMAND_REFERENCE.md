# Quick Commands Reference

## 🚀 Running the Site Locally

### Windows (PowerShell/CMD)

**Using Python (Recommended)**
```bash
cd d:\ANYBOX
python -m http.server 8000
```

**Or use this batch file (run-server.bat)**
Save as `run-server.bat` in d:\ANYBOX:
```batch
@echo off
cd d:\ANYBOX
python -m http.server 8000
```

Then just double-click it!

**Or use Node.js**
```bash
cd d:\ANYBOX
npx http-server
```

### After running, open in browser:
```
http://localhost:8000
```

### Stop the server:
```
Ctrl + C
```

---

## 📦 Deploy to Your GitHub Account

### Step 1: Create New GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `anybox` (or your preferred name)
3. **Description:** "Universal Video Link Player - Play videos from multiple sources"
4. **Visibility:** Select "Public" (so it's accessible)
5. Click **"Create repository"**

---

### Step 2: Push Code to GitHub

Open PowerShell in d:\ANYBOX and run these commands:

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - AnyBox video player"

# Add remote GitHub repository (REPLACE "username" with your GitHub username)
git remote add origin https://github.com/username/anybox.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example with actual username:**
```powershell
git remote add origin https://github.com/johndoe/anybox.git
```

---

### Step 3: Verify on GitHub

1. Go to https://github.com/username/anybox
2. You should see all your files uploaded
3. All done! ✅

---

## 🌐 Deploy to Vercel (Recommended)

### Method 1: From Your GitHub

1. Go to https://vercel.com/
2. Sign in with GitHub (click "Continue with GitHub")
3. Click "New Project"
4. Select your `anybox` repository
5. Framework: Select "Other" (static site)
6. Click "Deploy"
7. **Done!** Your site is live at `anybox.vercel.app`

### Method 2: Using Vercel CLI

```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and your site will be live!
```

---

## 🎯 Deploy to Netlify

### Method 1: Connect GitHub

1. Go to https://netlify.com/
2. Sign in with GitHub
3. Click "New site from Git"
4. Select your `anybox` repository
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.`
6. Click "Deploy site"
7. **Done!** Your site is live

### Method 2: Drag & Drop (Fastest)

1. Go to https://drop.netlify.com
2. Drag the entire `d:\ANYBOX` folder
3. Wait 30 seconds
4. **Done!** Get instant live URL

---

## 🔄 Update Your Site After Changes

```powershell
# Make your changes locally...

# Then run these commands:
git add .
git commit -m "Your description of changes"
git push origin main

# Vercel/Netlify will auto-deploy within seconds!
```

---

## 📝 Complete Step-by-Step Workflow

### 1. Run locally to test
```powershell
cd d:\ANYBOX
python -m http.server 8000
# Open http://localhost:8000
```

### 2. Make sure git is installed
```powershell
git --version
```

### 3. Create GitHub repo (https://github.com/new)

### 4. Push code to GitHub
```powershell
cd d:\ANYBOX
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/anybox.git
git branch -M main
git push -u origin main
```

### 5. Deploy to Vercel or Netlify
- Vercel: https://vercel.com → New Project → Select anybox repo
- Netlify: https://netlify.com → New site from Git → Select anybox repo

### 6. Access your live site
- Vercel: https://anybox.vercel.app
- Netlify: https://anybox.netlify.app

### 7. Update anytime
```powershell
# Make changes locally
git add .
git commit -m "Description"
git push origin main
# Auto-deploys!
```

---

## ⌨️ Most Important Commands

```powershell
# Run locally
python -m http.server 8000

# First time setup git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/anybox.git
git push -u origin main

# Every update after
git add .
git commit -m "Description"
git push origin main

# Check git status
git status

# View commit history
git log
```

---

## 🆘 Troubleshooting

**Git command not found:**
- Download from https://git-scm.com/
- Install and restart PowerShell

**Port 8000 already in use:**
```powershell
python -m http.server 8001
# Use 8001 instead
```

**Authentication error pushing to GitHub:**
- Use Personal Access Token instead of password
- Or set up SSH key: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

**Save this file and bookmark the links above!**
