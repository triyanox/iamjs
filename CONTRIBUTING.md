# Contributing to iamjs

👍🎉 Thank you for your interest in contributing to iamjs! We welcome contributions from developers of all skill levels and backgrounds. This guide will help you get started with the contribution process.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Contribution Process](#contribution-process)
4. [Development Guidelines](#development-guidelines)
5. [Submitting a Pull Request](#submitting-a-pull-request)
6. [Code Review Process](#code-review-process)
7. [Community and Support](#community-and-support)

## Code of Conduct

Before contributing, please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

If you're new to the project, here are some ways to get started:

1. **Explore the Issues**: Check out our [Issues](https://github.com/triyanox/iamjs/issues) page to find tasks that interest you. Issues labeled "good first issue" are great for newcomers.
2. **Set Up Your Development Environment**: Follow our [Development Setup Guide](DEVELOPMENT_SETUP.md) to get your local environment ready.
3. **Read the Documentation**: Familiarize yourself with our [project documentation](https://github.com/triyanox/iamjs/docs) to understand the project structure and guidelines.

## Contribution Process

Here's a step-by-step guide to contributing to iamjs:

1. **Fork the Repository**: 
   - Click the "Fork" button in the top right corner of the [iamjs repository](https://github.com/triyanox/iamjs) to create a copy in your GitHub account.

2. **Clone Your Fork**:
   ```
   git clone https://github.com/YOUR_USERNAME/iamjs.git
   cd iamjs
   ```

3. **Set Up Remote**:
   ```
   git remote add upstream https://github.com/triyanox/iamjs.git
   ```

4. **Create a New Branch**:
   ```
   git checkout -b your-feature-branch
   ```
   Use a descriptive name for your branch, e.g., `fix-login-bug` or `add-dark-mode`.

5. **Make Your Changes**: 
   - Implement your feature or fix the bug.
   - Ensure your code adheres to our [coding standards](#development-guidelines).
   - Add or update tests as necessary.

6. **Commit Your Changes**:
   ```
   git add .
   git commit -m "Your descriptive commit message"
   ```
   Write clear, concise commit messages. See our [commit message guidelines](#commit-message-guidelines) for more details.

7. **Stay Updated**:
   ```
   git fetch upstream
   git rebase upstream/main
   ```

8. **Push Your Changes**:
   ```
   git push origin your-feature-branch
   ```

## Development Guidelines

- Follow the coding style and conventions used throughout the project.
- Write clear, self-documenting code with meaningful variable and function names.
- Include comments for complex logic or non-obvious code sections.
- Ensure all tests pass before submitting your changes.
- Add new tests for new functionality or bug fixes.

### Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Submitting a Pull Request

1. Go to the [iamjs repository](https://github.com/triyanox/iamjs) on GitHub.
2. Click the "New pull request" button.
3. Select your fork and the branch containing your changes.
4. Fill out the pull request template with all relevant information.
5. Click "Create pull request".

## Code Review Process

- A maintainer will review your pull request as soon as possible.
- Address any feedback or requested changes promptly.
- Once approved, a maintainer will merge your pull request.

## Community and Support

- Join our [community chat](https://discord.gg/iamjs) for real-time discussions.
- Check out our [FAQ](FAQ.md) for answers to common questions.
- For additional help, email us at hi@achaq.dev.

Thank you for contributing to iamjs! Your efforts help make this project better for everyone. 🚀