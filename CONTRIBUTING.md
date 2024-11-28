# Contributing to SAAS Boilerplate

Thank you for your interest in contributing! This document outlines the process for contributing to our project.

## Development Process

1. **Fork the Repository**
   - Fork the repository to your GitHub account
   - Clone your fork locally

2. **Set Up Development Environment**
   ```bash
   npm install
   cp .env.example .env.local
   # Configure your environment variables
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Development Guidelines**
   - Follow TypeScript strict mode
   - Use ESLint and Prettier
   - Write tests for new features
   - Follow component structure guidelines
   - Use proper commit message format

5. **Testing**
   ```bash
   npm run verify  # Runs all tests
   ```

6. **Submit Pull Request**
   - Push changes to your fork
   - Create PR against main branch
   - Fill out PR template completely
   - Request review from maintainers

## Code Style

- Use TypeScript strict mode
- Follow Airbnb JavaScript Style Guide
- Use functional components with hooks
- Implement proper error handling
- Write comprehensive tests
- Document complex logic

## Commit Message Format 