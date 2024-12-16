# Contributing to TubeBase

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm
- Git
- Redis
- Supabase CLI (optional)

### Environment Setup
1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Install dependencies: `pnpm install`
4. Start development server: `pnpm dev`

## Development Standards

### Code Style
- Use TypeScript strictly
- Follow ESLint configuration
- Use Prettier for formatting
- Follow the project's naming conventions

### Git Workflow
1. Create feature branch from main
2. Make atomic commits
3. Write clear commit messages
4. Submit PR for review
5. Address review comments
6. Squash and merge

### Testing Requirements
- Write unit tests for utilities
- Add integration tests for critical flows
- Test error scenarios
- Include accessibility tests
- Test responsive layouts

### Documentation
- Update relevant documentation
- Add JSDoc comments for complex functions
- Document new environment variables
- Update changelog

### Performance Guidelines
- Use React Server Components by default
- Implement proper loading states
- Optimize images
- Monitor bundle size
- Use proper caching strategies

### Security Guidelines
- Never commit secrets
- Sanitize user inputs
- Use proper authentication
- Implement rate limiting
- Follow security best practices

## Review Process
1. Self-review checklist
2. Code review by team
3. Testing verification
4. Documentation review
5. Performance check
6. Security assessment

## Tools & Resources
- ESLint
- Prettier
- Husky
- TypeScript
- shadcn/ui
- Tailwind CSS
