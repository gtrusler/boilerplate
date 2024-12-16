# System Architecture

## System Overview
TubeBase is a Next.js 14 application that processes and manages YouTube video content. The system is designed to be scalable, maintainable, and efficient in handling large volumes of video metadata and transcripts.

## System Design
### Frontend Architecture
- Next.js 14 App Router for routing and rendering
- Server Components for improved performance
- Client Components for interactive features
- React Server Actions for form handling
- Middleware for auth and request handling
- Toast notifications for user feedback

### Backend Architecture
- Supabase for database and authentication
- Python services for video processing
- Redis for caching and rate limiting
- Cloudflare R2 for asset storage

## Data Flow
### Video Processing Flow
1. User submits YouTube URL via VideoForm component
2. Client-side validation of URL format
3. Form submission to `/api/videos` endpoint
4. API route extracts video ID and spawns Python process
5. Python script (`process_video.py`):
   - Fetches video metadata using pytube
   - Extracts transcript using youtube_transcript_api
   - Returns combined JSON data
6. Results stored in database (pending implementation)
7. User notified of success/failure via toast

### Search and Retrieval Flow
1. User submits search query
2. Query converted to vector embedding
3. Vector similarity search in database
4. Results filtered by permissions
5. Data returned with pagination

## Components
### Frontend Components
- Layout components (header, footer, etc.)
- VideoForm: YouTube URL submission form
- Toast: User notifications
- Button: Reusable button component
- Input: Form input component
- Authentication components
- Video submission and display
- Search interface
- Results visualization
- Admin dashboard

### Backend Services
- Authentication service
- Video Processing Service:
  - URL validation
  - Metadata extraction
  - Transcript generation
  - Data storage (pending)
- Transcript generation service
- AI analysis service
- Search service
- Export service

## Schema

### Database Tables

#### videos
- `id`: UUID (Primary Key)
- `youtube_id`: text (NOT NULL)
- `title`: text (NOT NULL)
- `channel_name`: text
- `channel_id`: text
- `description`: text
- `thumbnail_url`: text
- `tags`: text[]
- `upload_date`: date
- `created_at`: timestamp without time zone

#### transcripts
- `id`: UUID (Primary Key)
- `video_id`: UUID (Foreign Key to videos.id)
- `content`: text
- `summary`: text
- `created_at`: timestamp without time zone

#### tags
- `id`: UUID (Primary Key)
- `name`: text (NOT NULL)
- `created_at`: timestamp without time zone

#### alerts
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to users.id)
- `search_query`: text (NOT NULL)
- `folder_path`: text
- `date_filter`: text
- `last_checked`: timestamp without time zone
- `created_at`: timestamp without time zone

#### users
- `id`: UUID (Primary Key)
- `email`: text (NOT NULL)
- `created_at`: timestamp without time zone

### Relationships
- `transcripts.video_id` -> `videos.id`: One-to-one relationship between videos and transcripts
- `alerts.user_id` -> `users.id`: Many-to-one relationship between alerts and users
- `videos.tags`: Array relationship with tag names

### Indexes
- Primary key indexes on all `id` columns
- Index on `videos.youtube_id` for efficient video lookups
- Index on `alerts.user_id` for efficient user alert queries

### Security Policies
- Row Level Security (RLS) enabled on all tables
- Users can only access their own alerts
- Public read access to videos and transcripts
- Write access restricted to authenticated users

## Deployment
### Infrastructure
- Vercel for Next.js application
- Supabase for database and auth
- Cloudflare R2 for storage
- Redis Cloud for caching
- Python services on [TBD]

### CI/CD
- GitHub Actions for automation
- Automated testing
- Deployment previews
- Production deployments

## API Structure

### API Routes

#### Videos
- `POST /api/videos`
  - Submit new YouTube video for processing
  - Body: `{ youtubeUrl: string }`
  - Returns: Processed video data

- `GET /api/videos?id={videoId}`
  - Fetch video with transcript
  - Returns: Video and transcript data

- `GET /api/videos/search`
  - Search videos with filters
  - Query params:
    - `keyword`: Search term
    - `tags`: Comma-separated tags
    - `dateFrom`: Start date (ISO)
    - `dateTo`: End date (ISO)
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 10)
  - Returns: Paginated video results

#### Tags
- `GET /api/tags`
  - List all tags
  - Returns: Array of tags

- `POST /api/tags`
  - Create new tag
  - Body: `{ name: string }`
  - Returns: Created tag

- `GET /api/videos/{id}/tags`
  - Get tags for specific video
  - Returns: Array of video tags

- `POST /api/videos/{id}/tags`
  - Add tags to video
  - Body: `{ tags: string[] }`
  - Returns: Updated tags array

- `DELETE /api/videos/{id}/tags`
  - Remove tags from video
  - Body: `{ tags: string[] }`
  - Returns: Updated tags array

#### Transcripts
- `GET /api/transcripts/{id}`
  - Fetch transcript with video data
  - Returns: Transcript and related video

- `PUT /api/transcripts/{id}`
  - Update transcript (admin only)
  - Body: `{ content: string, summary?: string }`
  - Returns: Updated transcript

- `DELETE /api/transcripts/{id}`
  - Delete transcript (admin only)
  - Returns: Success message

#### Alerts
- `GET /api/alerts`
  - List user's alerts
  - Requires authentication
  - Returns: Array of user alerts

- `POST /api/alerts`
  - Create new alert
  - Requires authentication
  - Body: `{ search_query: string, folder_path?: string, date_filter?: string }`
  - Returns: Created alert

- `GET /api/alerts/{id}`
  - Fetch single alert
  - Requires authentication and ownership
  - Returns: Alert data

- `PUT /api/alerts/{id}`
  - Update alert
  - Requires authentication and ownership
  - Body: `{ search_query?: string, folder_path?: string, date_filter?: string }`
  - Returns: Updated alert

- `DELETE /api/alerts/{id}`
  - Delete alert
  - Requires authentication and ownership
  - Returns: Success message

#### Error Responses
All API routes follow a consistent error response format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common status codes:
- 400: Invalid input
- 401: Authentication required
- 403: Access denied
- 404: Resource not found
- 409: Resource conflict
- 500: Server error

## External APIs

### YouTube Data API
The application uses the YouTube Data API v3 for fetching video metadata. To set up:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API key)
5. Add the API key to your environment variables:
   ```
   YOUTUBE_API_KEY=your_api_key
   ```

API Usage:
- Used for fetching video metadata (title, description, channel info)
- Rate limits: 10,000 units per day (free tier)
- Cost: Free for normal usage
- Quota usage:
  - List video details: 1 unit per request
  - Search: 100 units per request

For transcript fetching, we use the `youtube-transcript` package which doesn't require API credentials.

## Security Architecture
- Supabase RLS policies
- API rate limiting
- Input sanitization
- Authentication middleware
- Secure environment variables
