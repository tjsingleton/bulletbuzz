# Workflow Patterns

## External Scripts vs Inline Scripts

### Decision: Use External Scripts

We've adopted the principle of **using external scripts in the repository** rather than lengthy inline scripts in GitHub Actions workflows.

### Why External Scripts?

#### ✅ **Benefits:**
- **Reusability**: Scripts can be used across multiple workflows
- **Testability**: Scripts can be tested locally before deployment
- **Version Control**: Full history and diff tracking for script changes
- **Maintainability**: Easier to debug and modify complex logic
- **Readability**: Workflows become much cleaner and more focused
- **Consistency**: Same scripts used in CI/CD and local development

#### ❌ **Inline Script Problems:**
- **Hard to test**: Can't run workflow steps locally
- **Poor debugging**: Limited error reporting in workflow logs
- **Version control**: Changes buried in workflow files
- **Reusability**: Logic duplicated across workflows
- **Maintainability**: Complex logic makes workflows hard to read

### Implementation Pattern

#### **Script Location:**
```
scripts/
├── deploy-organize-site.sh    # Site structure organization
├── deploy-test-site.sh        # Deployment testing with retries
├── build-with-version.js      # Version injection
├── deploy-monitor.js          # Deployment monitoring
└── advanced-screenshots.js    # Screenshot testing
```

#### **Workflow Usage:**
```yaml
- name: Organize site structure
  run: ./scripts/deploy-organize-site.sh

- name: Test deployment
  run: ./scripts/deploy-test-site.sh
```

### Script Guidelines

#### **1. Executable Permissions:**
```bash
chmod +x scripts/*.sh
```

#### **2. Error Handling:**
```bash
#!/bin/bash
set -e  # Exit on any error
```

#### **3. Clear Output:**
```bash
echo "🏗️ Organizing site structure..."
echo "✅ All critical files verified"
```

#### **4. Local Testing:**
Scripts should be testable locally:
```bash
# Test the organize script locally
./scripts/deploy-organize-site.sh

# Test the deployment test script
./scripts/deploy-test-site.sh
```

### Examples

#### **Before (Inline):**
```yaml
- name: Organize site structure
  run: |
    set -e
    echo "Contents of project root after build:"
    ls -l
    # ... 50+ lines of complex logic ...
    echo "✅ All critical files verified"
```

#### **After (External):**
```yaml
- name: Organize site structure
  run: ./scripts/deploy-organize-site.sh
```

### Migration Strategy

When refactoring existing workflows:

1. **Extract** complex inline scripts to dedicated files
2. **Test** scripts locally to ensure they work
3. **Update** workflows to call external scripts
4. **Document** script purpose and usage
5. **Version** scripts appropriately

### Future Considerations

- **Script Libraries**: Consider creating reusable script libraries
- **Configuration**: Use environment variables for script configuration
- **Logging**: Implement consistent logging across all scripts
- **Error Reporting**: Standardize error reporting and exit codes 