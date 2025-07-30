# BulletBuzz Scripts

This directory contains scripts to make BulletBuzz deployment and maintenance tasks consistent and easy.

## 🚀 Deployment Scripts

### `deploy.sh` / `npm run deploy`
**Complete deployment process**
- Builds documentation with MkDocs
- Recreates site/game directory
- Copies all game files and assets
- Commits and pushes to GitHub
- Deploys to GitHub Pages

```bash
./scripts/deploy.sh
# or
npm run deploy
```

### `quick-deploy.sh` / `npm run deploy:quick`
**Quick rebuild and commit (no push)**
- Same as deploy but stops at commit
- Useful for testing changes locally
- Manual `git push` required

```bash
./scripts/quick-deploy.sh
# or
npm run deploy:quick
```

## 🧪 Testing Scripts

### `test-deployment.sh` / `npm run test:all`
**Run all deployment tests**
- Tests GitHub Pages deployment
- Tests documentation
- Tests game content
- Tests README documentation links

```bash
./scripts/test-deployment.sh
# or
npm run test:all
```

## 🎨 Logo Management Scripts

### `update-logo.sh` / `npm run logo:update`
**Interactive logo update tool**
- Update logo size in documentation
- Update logo size in game
- Toggle game title (show/hide)
- Quick presets (natural size, 150px everywhere)

```bash
./scripts/update-logo.sh
# or
npm run logo:update
```

## 📋 Usage Examples

### Typical Workflow
```bash
# 1. Make changes to files
# 2. Deploy everything
npm run deploy

# 3. Test deployment
npm run test:all
```

### Logo Updates
```bash
# Interactive logo management
npm run logo:update

# Then deploy changes
npm run deploy
```

### Quick Iteration
```bash
# Quick rebuild and commit
npm run deploy:quick

# Test locally, then push when ready
git push
```

## 🔧 Script Features

- **Error Handling**: Scripts exit on errors
- **Colored Output**: Easy to read status messages
- **Directory Validation**: Ensures you're in the right directory
- **Git Integration**: Automatic staging and committing
- **Consistent Structure**: Same deployment process every time

## 🚨 Important Notes

- All scripts must be run from the bulletbuzz root directory
- Scripts will automatically handle the site/game directory recreation
- The `mkdocs build` command removes site/game, so scripts recreate it
- Always test after deployment with `npm run test:all` 