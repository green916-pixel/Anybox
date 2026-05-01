# AnyBox Deployment Guide

Complete step-by-step instructions for deploying AnyBox to various platforms.

## Table of Contents

1. [Vercel](#vercel)
2. [Netlify](#netlify)
3. [GitHub Pages](#github-pages)
4. [Traditional Hosting](#traditional-hosting)
5. [Docker](#docker)
6. [AWS S3 + CloudFront](#aws-s3--cloudfront)

---

## Vercel

**Recommended for fastest deployment**

### Method 1: GitHub Integration (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Import Project"
   - Select your repository
   - Framework: Select "Other" (static site)
   - Build Command: Leave empty
   - Output Directory: `.`
   - Click "Deploy"

3. **Done!** Your site is now live at `yourdomain.vercel.app`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and your site will be live!
```

### Method 3: Drag and Drop

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag the entire `anybox` folder into the designated area
3. Wait for deployment to complete

---

## Netlify

**User-friendly drag & drop deployment**

### Method 1: Netlify Drop (Fastest)

1. Go to [drop.netlify.com](https://drop.netlify.com)
2. Drag the entire `anybox` folder into the drop zone
3. Wait for deployment
4. Your live URL appears immediately (e.g., `hopeful-lamarr-abc123.netlify.app`)

### Method 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "New site from Git"
   - Select your repository
   - Deploy settings:
     - Build command: (leave empty)
     - Publish directory: `.`
   - Click "Deploy site"

3. **Configure Domain** (Optional)
   - Click "Domain settings"
   - Add your custom domain

### Method 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=.
```

---

## GitHub Pages

**Free hosting with GitHub**

### Step-by-Step

1. **Create GitHub repository**
   - Go to [github.com/new](https://github.com/new)
   - Name: `anybox` (or `yourusername.github.io`)
   - Make it Public
   - Click "Create repository"

2. **Push code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/anybox.git
   git push -u origin main
   ```

3. **Enable Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Branch: `main`, Folder: `/ (root)`
   - Click "Save"

4. **Access your site**
   - URL: `https://yourusername.github.io/anybox`
   - Takes 1-2 minutes to go live

### Custom Domain (Optional)

1. Settings → Pages
2. Under "Custom domain", enter your domain
3. Update DNS records as instructed
4. Enable "Enforce HTTPS"

---

## Traditional Hosting

**For cPanel, Plesk, or similar shared hosting**

### Via FTP

1. **Connect via FTP**
   - Use FileZilla or similar FTP client
   - Host: `ftp.yoursite.com`
   - Username: Your FTP username
   - Password: Your FTP password

2. **Upload files**
   - Navigate to `public_html` directory
   - Upload all files from `anybox` folder
   - Keep the directory structure intact

3. **Set index.html as default**
   - In cPanel, go to "Index Manager"
   - Set `index.html` as the first index file

4. **Access your site**
   - Go to `https://yoursite.com`

### Via cPanel File Manager

1. Login to cPanel
2. Go to "File Manager"
3. Navigate to `public_html`
4. Click "Upload" and select all files
5. Right-click and "Extract" if uploading as ZIP

---

## Docker

**Containerized deployment**

### Build Image

1. **Create Dockerfile**
   ```dockerfile
   FROM nginx:alpine
   COPY . /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build image**
   ```bash
   docker build -t anybox:latest .
   ```

3. **Run container**
   ```bash
   docker run -d -p 8000:80 --name anybox anybox:latest
   ```

4. **Access at** `http://localhost:8000`

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  anybox:
    image: nginx:alpine
    ports:
      - "8000:80"
    volumes:
      - ./:/usr/share/nginx/html
    environment:
      - TZ=UTC
```

Run:
```bash
docker-compose up -d
```

### Deploy to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag anybox:latest yourusername/anybox:latest

# Push
docker push yourusername/anybox:latest
```

---

## AWS S3 + CloudFront

**For high-performance global delivery**

### Setup S3 Bucket

1. **Create S3 bucket**
   - AWS Console → S3
   - Create bucket named `anybox-website`
   - Uncheck "Block all public access"
   - Create bucket

2. **Upload files**
   - Enter bucket
   - Click Upload
   - Select all files from `anybox` folder
   - Upload

3. **Configure for website hosting**
   - Properties → Static website hosting
   - Enable static website hosting
   - Index document: `index.html`
   - Error document: `index.html`
   - Save

4. **Set bucket policy**
   - Permissions → Bucket policy
   - Add this policy:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::anybox-website/*"
           }
       ]
   }
   ```

### Setup CloudFront CDN

1. **Create distribution**
   - CloudFront → Create distribution
   - Origin: Your S3 bucket URL
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Create distribution

2. **Configure caching**
   - Behaviors → Create behavior
   - Path pattern: `/*`
   - Viewer protocol: HTTPS only
   - TTL: 86400 seconds

3. **Access via CloudFront**
   - Use the CloudFront domain URL
   - Takes ~5 minutes to deploy globally

---

## Environment Variables

Some deployments may use environment variables. Create `.env.example`:

```
REACT_APP_SITE_NAME=AnyBox
REACT_APP_MAX_HISTORY=5
REACT_APP_ENABLE_ANALYTICS=false
```

---

## SSL/HTTPS Certificate

**Most platforms provide free SSL:**

- ✅ Vercel: Automatic
- ✅ Netlify: Automatic  
- ✅ GitHub Pages: Automatic
- ✅ AWS S3 + CloudFront: Free with ACM
- ⚠️ Traditional hosting: May need Let's Encrypt or purchase

### Using Let's Encrypt (Free)

```bash
# Using certbot
sudo apt-get install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

---

## Monitoring & Analytics

### Vercel Analytics

```javascript
// Add to index.html
<script>
import { Analytics } from '@vercel/analytics/react';

export default function MyApp() {
  return <Analytics />;
}
</script>
```

### Netlify Analytics

1. Netlify Dashboard
2. Analytics → Enable Analytics
3. View stats in real-time

### Google Analytics

1. Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## Troubleshooting

### Blank page after deployment

**Solution:**
- Check browser console (F12) for errors
- Ensure all files are uploaded
- Clear browser cache
- Check that index.html is in root directory

### Styles not loading

**Solution:**
- Check CSS file path
- Verify Tailwind CDN is accessible
- Check browser network tab

### Videos not playing

**Solution:**
- Check CORS settings
- Verify video URL is accessible
- Try different video source
- Check player console errors

### High latency/slow loading

**Solution:**
- Enable CDN (CloudFront, Cloudflare)
- Optimize image sizes
- Use compression
- Check server location

---

## Performance Optimization

### Enable Compression
```nginx
gzip on;
gzip_types text/html text/css text/javascript application/javascript;
```

### Set Cache Headers
```nginx
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Minify Code
```bash
npm install -g minify
minify js/*.js > js/app.min.js
minify css/*.css > css/styles.min.css
```

---

## Maintenance

### Updating code

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update message"
   git push origin main
   ```
3. Deployment happens automatically (for GitHub/Netlify/Vercel)

### Backup

```bash
# Create backup
zip -r anybox-backup.zip .

# Push to GitHub releases
gh release create v1.0.0 anybox-backup.zip
```

---

**Ready to deploy? Pick your platform and follow the steps above!**

For additional help:
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- GitHub Pages: https://pages.github.com
- AWS S3: https://docs.aws.amazon.com/s3/
