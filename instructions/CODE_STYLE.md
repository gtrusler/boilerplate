# Code Style Guide

## Function Guidelines
- Keep functions under 15 lines when possible
- Use descriptive function names that indicate purpose
- Follow single responsibility principle
- Use TypeScript type annotations consistently
- Document complex functions with JSDoc comments

## Programming Patterns
### JavaScript/TypeScript
- Use functional programming patterns
- Prefer immutable data structures
- Use async/await for asynchronous operations
- Implement proper error handling
- Use TypeScript generics when appropriate

### React/Next.js
- Use Server Components by default
- Create Client Components only when necessary
- Implement proper error boundaries
- Follow the App Router conventions
- Use proper loading and error states

## Project Structure
```
src/
├── app/             # Next.js app router pages
├── components/      # React components
│   ├── ui/         # Reusable UI components
│   └── features/   # Feature-specific components
├── lib/            # Utility functions and configurations
├── types/          # TypeScript type definitions
└── styles/         # Global styles and Tailwind config
```

## Component Guidelines
- Follow atomic design principles
- Keep components focused and minimal
- Use composition over inheritance
- Implement proper prop typing
- Separate business logic from presentation
- Use custom hooks for reusable logic

## Naming Conventions
- Directories: kebab-case (user-authentication)
- Variables/functions: camelCase (getUserData)
- React Components: PascalCase (UserProfile.tsx)
- Python files: snake_case (data_processing.py)
- Type definitions: PascalCase (UserData)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)
