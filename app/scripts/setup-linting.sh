#!/bin/bash

# Script to set up linting and code formatting standards
echo "Setting up linting and code formatting standards..."

# Install dependencies if they don't exist
if ! npm list -g husky &> /dev/null; then
  echo "Installing husky and lint-staged..."
  npm install --save-dev husky lint-staged
fi

# Initialize husky
echo "Initializing husky..."
npx husky init

# Create pre-commit hook
echo "Creating pre-commit hook..."
echo "npx lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit

# Show success message
echo "Linting and code formatting setup complete!"
echo "The following tools are now configured:"
echo "- ESLint: Modern flat configuration with TypeScript and Vue support"
echo "- Prettier: Code formatting with consistent style"
echo "- Husky: Git hooks for pre-commit linting"
echo "- Lint-staged: Only lint and format staged files"
echo ""
echo "Available commands:"
echo "- npm run lint: Check for linting issues"
echo "- npm run format: Format all files"
echo ""
echo "See docs/LINTING.md for more information." 