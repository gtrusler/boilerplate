#!/usr/bin/env python3
"""
Process YouTube videos to extract metadata and transcripts.
"""

import sys
import json
from typing import Dict, Any
from pytube import YouTube
from youtube_transcript_api import YouTubeTranscriptApi

def get_video_metadata(video_id: str) -> Dict[str, Any]:
    """
    Fetch video metadata using pytube.
    """
    try:
        yt = YouTube(f'https://www.youtube.com/watch?v={video_id}')
        return {
            'id': video_id,
            'title': yt.title,
            'description': yt.description,
            'author': yt.author,
            'length': yt.length,
            'publish_date': str(yt.publish_date),
            'views': yt.views,
            'thumbnail_url': yt.thumbnail_url,
        }
    except Exception as e:
        print(f'Error fetching metadata: {str(e)}', file=sys.stderr)
        return None

def get_video_transcript(video_id: str) -> Dict[str, Any]:
    """
    Fetch video transcript using youtube_transcript_api.
    """
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        return {
            'id': video_id,
            'transcript': transcript_list,
            'full_text': ' '.join(item['text'] for item in transcript_list)
        }
    except Exception as e:
        print(f'Error fetching transcript: {str(e)}', file=sys.stderr)
        return None

def main():
    """
    Main function to process video metadata and transcript.
    """
    if len(sys.argv) != 2:
        print('Usage: process_video.py <video_id>', file=sys.stderr)
        sys.exit(1)

    video_id = sys.argv[1]
    
    # Get metadata
    metadata = get_video_metadata(video_id)
    if not metadata:
        sys.exit(1)
    
    # Get transcript
    transcript = get_video_transcript(video_id)
    if not transcript:
        sys.exit(1)
    
    # Combine results
    result = {
        'metadata': metadata,
        'transcript': transcript
    }
    
    # Output JSON result
    print(json.dumps(result))

if __name__ == '__main__':
    main()
