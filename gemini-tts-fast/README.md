# Gemini TTS Skill - Setup Requirements

This skill requires some setup before it can be used. Follow these steps:

## 1. Get a Google API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create or select a project
3. Generate an API key with access to Gemini models

## 2. Install Python Dependencies

```bash
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required package
pip install google-genai
```

## 3. Install ffmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use `winget install ffmpeg`

## 4. Configure Environment

Create a `.env` file in your project root:

```bash
GOOGLE_API_KEY=your-api-key-here
```

## 5. Test the Skill

Try generating a simple audio file:

```bash
/gemini-tts-fast "Hello world"
```

## Sharing This Skill

When sharing this skill with others:
1. Share the entire `.claude/skills/gemini-tts-fast` directory
2. Include this README.md for setup instructions
3. Recipients will need to follow steps 1-4 above to use the skill
4. The `.env` file should NOT be shared (it contains your API key)

## Troubleshooting

**Error: "未设置 GOOGLE_API_KEY 环境变量"**
- Make sure your `.env` file exists and contains `GOOGLE_API_KEY=...`
- Verify the environment is being sourced correctly

**Error: "未找到 ffmpeg"**
- Install ffmpeg using your system's package manager
- Verify with: `ffmpeg -version`

**Error: "No module named 'google.genai'"**
- Activate your virtual environment
- Run: `pip install google-genai`
