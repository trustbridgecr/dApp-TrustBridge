# Contributing to TrustBridge

Thank you for your interest in contributing to TrustBridge! This document provides guidelines and instructions for contributing to our project.

## 🚀 Getting Started

### Prerequisites

- Node.js (Jod LTS version recommended)
- npm or yarn
- A Stellar wallet (Freighter, Albedo, xBull, or LOBSTR)
- Firebase account (for development)

For detailed setup instructions, please refer to the [README.md](README.md).

## 📝 Code Standards

### Code Formatting

We use Prettier for code formatting. Before committing changes:

```bash
npx prettier --write .
```

### Linting

We use ESLint for code quality. Run the linter:

```bash
npm run lint
```

### Git Hooks

We use Husky to enforce code quality on commit and push:

- Code formatting is checked on commit
- Linting is checked on push
- Failed checks will prevent the commit/push

## 🔄 Contribution Workflow

1. Fork the repository to your GitHub account
2. Clone your forked repository:

```bash
git clone https://github.com/your-username/dApp-TrustBridge.git
cd dApp-TrustBridge
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/trustbridge/dApp-TrustBridge.git
```

4. Create a new branch from the `develop` branch:

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

5. Make your changes and commit them:

```bash
git add .
git commit -m "feat: your descriptive commit message"
```

6. Push your branch to your fork:

```bash
git push origin feature/your-feature-name
```

7. Create a Pull Request (PR) from your fork's branch to the upstream `develop` branch
   - Use the provided PR template
   - Link any related issues
   - Request reviews from relevant team members

### Issue and Pull Request Templates

We provide templates for both issues and pull requests:

- Use the issue template when reporting bugs or requesting features
- Use the PR template when submitting changes
- Templates can be found in the `.github` directory

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for test-related changes
- `chore:` for maintenance tasks

## 🧪 Testing

Before submitting a PR:

1. Run the test suite:

```bash
npm test
```

2. Ensure all tests pass
3. Add new tests for your changes if applicable

## 🔍 Code Review Process

1. PRs will be reviewed by maintainers
2. Address any feedback or requested changes
3. Once approved, your PR will be merged into `develop`

## 📚 Documentation

- Update documentation for any new features or changes
- Ensure README.md and CONTRIBUTING.md are up to date
- Add comments for complex code sections

## 🐛 Reporting Issues

When reporting issues:

1. Use the provided issue template
2. Provide detailed steps to reproduce
3. Include expected vs actual behavior
4. Add relevant logs or screenshots

## 🤝 Community Guidelines

- Be respectful and inclusive
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)
- Help others when possible
- Keep discussions constructive

## 📞 Getting Help

- Check the [documentation](README.md)
- Join our community chat
- Open an issue for technical questions

Thank you for contributing to TrustBridge! 🚀
