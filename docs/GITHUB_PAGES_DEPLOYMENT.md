# GitHub Pages Deployment

This document explains how the GitHub Pages deployment is configured for the CodeMentor AI Platform.

## Overview

The project is configured to automatically deploy a static demo version to GitHub Pages whenever changes are pushed to the `main` branch. The live demo is available at:

**https://nickscherbakov.github.io/codementor-ai-platform/**

## How It Works

### 1. Workflow Configuration

The deployment is handled by the GitHub Actions workflow located at:
```
.github/workflows/nextjs.yml
```

This workflow:
- Triggers on every push to the `main` branch
- Can also be manually triggered via the Actions tab
- Builds the Next.js application as a static site
- Deploys the built site to GitHub Pages

### 2. Build Process

During the build step, two critical environment variables are set:

```yaml
env:
  GITHUB_PAGES: 'true'
  SKIP_REWRITES: 'true'
```

**GITHUB_PAGES=true**
- Triggers the `next.config.js` to set `basePath` and `assetPrefix` to `/codementor-ai-platform`
- This ensures all routes and assets work correctly when served from a project page (not root domain)

**SKIP_REWRITES=true**
- Disables API rewrites which are not supported in static export mode
- Prevents build warnings about unsupported rewrites

### 3. Static Export Configuration

In `next.config.js`, the following settings enable static export:

```javascript
const repoName = 'codementor-ai-platform'
const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  output: 'export',  // Enable static HTML export
  trailingSlash: true,  // Add trailing slashes to URLs
  assetPrefix: isGithubPages ? `/${repoName}` : undefined,
  basePath: isGithubPages ? `/${repoName}` : undefined,
  images: {
    unoptimized: true,  // Required for static export
  }
}
```

### 4. Jekyll Bypass

The file `public/.nojekyll` is included to prevent GitHub Pages from processing the site with Jekyll. This is important because:
- Jekyll ignores files and directories starting with underscore (`_`)
- Next.js generates files like `_next/` which must be served
- The `.nojekyll` file ensures all files are served as-is

### 5. Build Output

The build process:
1. Runs `next build` with the GitHub Pages environment variables
2. Generates static HTML/CSS/JS files in the `./out` directory
3. The workflow uploads the `./out` directory as a Pages artifact
4. GitHub Pages deploys the artifact to the public URL

## Differences from Production Build

The GitHub Pages deployment is a **demo/preview version** with the following limitations:

- ❌ No backend API connectivity
- ❌ No AI engine functionality
- ❌ No real-time features (WebSockets)
- ❌ No database operations
- ❌ No authentication

These features are shown in a limited/demo mode with mock data or disabled states.

## Local Testing of GitHub Pages Build

To test the GitHub Pages build locally:

```bash
# Set environment variables and build
GITHUB_PAGES=true SKIP_REWRITES=true npm run build

# The static site will be in the ./out directory
# You can serve it with any static file server, for example:
npx serve out

# Note: You'll need to navigate to http://localhost:3000/codementor-ai-platform/
# because of the basePath setting
```

## Repository Settings

For the deployment to work, ensure the following settings are configured in the GitHub repository:

1. **GitHub Pages Source**: Set to "GitHub Actions" 
   - Go to Settings → Pages → Source → Select "GitHub Actions"

2. **Workflow Permissions**: The workflow needs the following permissions (already set in the workflow file):
   - `contents: read` - To read the repository code
   - `pages: write` - To deploy to GitHub Pages
   - `id-token: write` - For secure deployment

## Troubleshooting

### Build Fails

If the build fails, check:
- The `package-lock.json` file is present and committed
- All dependencies install correctly
- No build errors in the Next.js application

### Pages Don't Load Correctly

If pages don't load or show 404 errors:
- Verify the repository name matches the `repoName` constant in `next.config.js`
- Check that `GITHUB_PAGES` environment variable is set in the workflow
- Ensure the `.nojekyll` file exists in the `public/` directory

### Assets Don't Load

If CSS/JS files don't load:
- Verify `assetPrefix` is correctly set in `next.config.js`
- Check browser console for 404 errors
- Ensure the build completed successfully

### Deployment Succeeds but Site Shows Old Version

GitHub Pages can have caching delays:
- Wait a few minutes for the cache to clear
- Try a hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Check the deployment timestamp in the Actions tab

## Manual Deployment

To manually trigger a deployment:

1. Go to the repository on GitHub
2. Click on the "Actions" tab
3. Select "Deploy Next.js site to Pages" workflow
4. Click "Run workflow" button
5. Select the `main` branch
6. Click "Run workflow"

## Updating the Configuration

If you need to modify the deployment:

### Change the Repository Name

If the repository is renamed, update the `repoName` in `next.config.js`:

```javascript
const repoName = 'new-repository-name'
```

### Disable GitHub Pages Deployment

To disable automatic deployments, either:
- Delete the `.github/workflows/nextjs.yml` file, or
- Add the workflow to `.github/workflows/disabled/` directory, or
- Edit the workflow to remove the `push` trigger

### Customize Build Process

To customize the build, edit the "Build with Next.js" step in `.github/workflows/nextjs.yml`:

```yaml
- name: Build with Next.js
  env:
    GITHUB_PAGES: 'true'
    SKIP_REWRITES: 'true'
    # Add more environment variables here if needed
  run: ${{ steps.detect-package-manager.outputs.runner }} next build
```

## Additional Resources

- [Next.js Static Exports Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)
- [Next.js Deployment with GitHub Actions](https://nextjs.org/docs/deployment#github-pages)
