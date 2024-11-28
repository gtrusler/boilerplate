<!-- markdownlint-disable -->

# Project Overview

## Description

[Describe project here]  

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucid Icons

## Core Features

[List your core features here]  

# Doc
Review any documentation present in the instructions/doc directory.

## 1. OpenAI Documentation
Make sure you use the gpt-4o model and zod for defining data structures.

```
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const ResearchPaperExtraction = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  abstract: z.string(),
  keywords: z.array(z.string()),
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure." },
    { role: "user", content: "..." },
  ],
  response_format: zodResponseFormat(ResearchPaperExtraction, "research_paper_extraction"),
});

const research_paper = completion.choices[0].message.parsed;
```



# Development Guidelines

## 1. Component Development

Components must be placed in `/components` at root level. Use kebab-case for naming: `example-component.tsx`

### Client Components

```typescript
'use client'
import { useState } from 'react'

export default function ExampleClientComponent() {
  const [state, setState] = useState()
  // Component logic
}
```

### Server Components

```typescript
export default async function ExampleServerComponent() {
  const data = await fetchData()
  return <div>{/* Component JSX */}</div>
}
```

## 2. Data Fetching

All data fetching should be done in server components:

```typescript
async function getData() {
  const res = await fetch('https://api.example.com/data')
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}
```

## 3. State Management

- Use React hooks for local state
- Server components for data fetching
- Pass data down as props

# API Integration

## OpenAI Integration

```typescript
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const DataSchema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "System prompt" },
    { role: "user", content: "User input" },
  ],
  response_format: zodResponseFormat(DataSchema, "schema_name"),
});
```

# Important Implementation Notes

## Logging

Always add server-side logs for debugging:

```typescript
console.error('[Context]:', error);
```

## Error Handling

```typescript
try {
  // Operation
} catch (error) {
  // Standard error logging
  console.error('[Context]:', error);
}
```

## Environment Variables

- Store sensitive information in environment variables
- Use .env.local for local development
- Never commit .env files
- Access environment variables only in server-side code

## Type Safety

```typescript
// Use TypeScript interfaces for all data structures
interface DataStructure {
  field1: string;
  field2: number;
  field3: boolean;
}

// Avoid using 'any' type
```

## Tools & Commands

### shadcn/ui Components

```bash
# Correct way to add components
npx shadcn@latest add [component-name]
```

### Common Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run test    # Run tests
```

# Common Gotchas

1. Client vs Server Components
   - Add 'use client' directive for client components
   - Server components can fetch data directly

2. API Routes
   - Create in app/api directory
   - Handle errors appropriately
   - Implement proper request validation

3. Performance
   - Use proper loading states
   - Implement error boundaries
   - Optimize images and assets

# Security Best Practices

1. Never expose API keys in client code
2. Implement proper authentication
3. Validate all inputs
4. Use HTTPS for all external requests
