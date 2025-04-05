# Linting and Code Formatting Standards

This project uses ESLint and Prettier to enforce consistent code style and catch potential issues.

## ESLint Configuration

We use a modern flat ESLint configuration with the following key features:
- TypeScript integration with type checking
- Vue 3 specific rules and parser
- Quasar Framework specific linting rules
- Prettier integration for formatting (without conflicting rules)

## Prettier Configuration

The Prettier configuration enforces:
- Single quotes
- 100 character line width
- Consistent spacing and indentation (2 spaces)

## Editor Configuration

The `.editorconfig` file ensures consistent editor behavior across different IDEs and editors, with settings for:
- UTF-8 encoding
- 2-space indentation
- LF line endings
- Trimming trailing whitespace
- Inserting final newlines

## Available Commands

To check for linting issues:
```bash
npm run lint
```

To automatically format all files:
```bash
npm run format
```

## Pre-commit Hooks

This project uses Husky and lint-staged to run linting and formatting before each commit:
- ESLint runs on all JavaScript, TypeScript, and Vue files
- Prettier formats all supported files

## VS Code Integration

For VS Code users, we recommend installing the following extensions:
- ESLint
- Prettier
- EditorConfig for VS Code

The workspace settings are configured to:
- Format on save using Prettier
- Show ESLint errors and warnings in the editor
- Use the project's ESLint and Prettier configurations 