# Environment Setup

## Conda Environment
- Environment Name: `tubebase-env`
- Python Version: 3.11
- Created with: `conda create --name tubebase-env python=3.11`

## Package List
### Core Dependencies
- youtube-dl>=2021.12.17
- pytube>=12.1.0
- openai>=1.0.0
- python-dotenv>=0.19.0
- fastapi>=0.68.0
- uvicorn>=0.15.0

### AI/ML Dependencies
- torch>=2.0.0
- transformers>=4.30.0
- numpy>=1.21.0
- pandas>=1.3.0
- scikit-learn>=0.24.2

### Utility Dependencies
- python-multipart>=0.0.5
- aiohttp>=3.8.0
- backoff>=2.2.0
- tenacity>=8.0.0

## Installation Steps
1. Create conda environment:
   ```bash
   conda create --name tubebase-env python=3.11
   ```
2. Activate environment:
   ```bash
   conda activate tubebase-env
   ```
3. Install dependencies:
   ```bash
   conda env update -f environment.yml
   ```

## Migration Notes
- Project uses both Node.js and Python environments
- Node.js for web application (Next.js)
- Python/Conda for AI and video processing features
- Keep both package managers (npm and conda) up to date
