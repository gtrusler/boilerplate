# System Architecture

## System Overview
TubeBase is a Next.js 14 application that processes and manages YouTube video content. The system is designed to be scalable, maintainable, and efficient in handling large volumes of video metadata and transcripts.

## Core Components

### Frontend Layer
- **Next.js App Router**: Handles routing and page rendering
- **React Server Components**: Default for most components
- **Client Components**: Used for interactive elements
- **shadcn/ui**: UI component library
- **Tailwind CSS**: Utility-first styling

### Backend Layer
- **Next.js API Routes**: RESTful API endpoints
- **Supabase**: Database and authentication
- **Redis**: Rate limiting and caching
- **Cloudflare R2**: File storage

### AI Integration Layer
- **OpenAI/Claude**: Text processing and analysis
- **Vector Database**: Semantic search capabilities
- **Rate Limiting**: Token usage management

## Data Flow
1. User Authentication (Supabase Auth)
2. Video Data Ingestion
3. Metadata Processing
4. Transcript Generation
5. AI Processing
6. Data Storage
7. Export Capabilities

## Database Schema

### Videos Table
Primary table for storing YouTube video metadata
```sql
CREATE TABLE videos (
    id UUID PRIMARY KEY NOT NULL,
    youtube_id TEXT NOT NULL,
    title TEXT NOT NULL,
    channel_name TEXT,
    channel_id TEXT,
    description TEXT,
    thumbnail_url TEXT,
    tags TEXT[],
    upload_date DATE,
    created_at TIMESTAMP
);
```

### Transcripts Table
Stores video transcripts and their summaries
```sql
CREATE TABLE transcripts (
    id UUID PRIMARY KEY NOT NULL,
    video_id UUID NOT NULL REFERENCES videos(id),
    content TEXT,
    summary TEXT,
    created_at TIMESTAMP
);
```

### Tags Table
Manages video categorization and organization
```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP
);
```

### Users Table
Stores user information
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP
);
```

### Alerts Table
Manages user alerts for video monitoring
```sql
CREATE TABLE alerts (
    id UUID PRIMARY KEY NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    search_query TEXT NOT NULL,
    folder_path TEXT,
    date_filter TEXT,
    last_checked TIMESTAMP,
    created_at TIMESTAMP
);
```

### Key Relationships
- `transcripts.video_id` → `videos.id`: Links transcripts to their videos
- `alerts.user_id` → `users.id`: Associates alerts with users

### Notes
- All tables use UUID as primary keys for better distribution and security
- Timestamps are stored without timezone information
- Text fields are used for flexible content storage
- Array type is used for video tags to allow multiple tags per video

## API Structure

[To be filled with API endpoint documentation]

## Security Architecture
- Supabase RLS policies
- API rate limiting
- Input sanitization
- Authentication middleware
- Secure environment variables

## Deployment Architecture

[To be filled with deployment details]
