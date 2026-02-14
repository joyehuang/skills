---
name: gemini-tts-fast
description: Convert text to speech with Google Gemini TTS API at fixed 1.2x playback speed and WAV output. Use when users need fast narration generation from English or Chinese text, with optional voice and output filename.
---

# Gemini Text-to-Speech Skill (1.2x Speed)

Convert text to speech using Google Gemini's TTS API with fixed 1.2x playback speed. Automatically generates standard WAV audio files optimized for video narration.

## Features

- Converts text to natural-sounding speech using Gemini 2.5 Pro TTS
- **Fixed 1.2x speed** for more dynamic video narration
- Outputs standard WAV format (24kHz, 16-bit, mono)
- Supports multiple voice styles
- Handles both English and Chinese text
- Automatic format conversion using ffmpeg

## Requirements

- Python 3.x with `google-genai` package
- ffmpeg (for audio format conversion)
- `GOOGLE_API_KEY` environment variable (stored in `.env` file)

## Usage

When the user requests text-to-speech conversion, the skill will automatically apply 1.2x speed:

1. **Load environment**: Source the `.env` file to get the API key
2. **Parse arguments**:
   - Text to convert (required) - supports multiple languages
   - `--output=filename.wav` (optional, default: output.wav)
   - `--voice=VoiceName` (optional, default: Puck)
   - Speed is **automatically set to 1.2x** (no need to specify)
3. **Generate audio**: Run the script to create the WAV file at 1.2x speed
4. **Confirm success**: Report the output file location and size

## Available Voices

- **Puck** (default) - 中性、清晰 (Neutral, clear)
- **Charon** - 深沉、权威 (Deep, authoritative)
- **Kore** - 温暖、友好 (Warm, friendly)
- **Fenrir** - 强劲、动感 (Strong, dynamic)
- **Aoede** - 流畅、富有表现力 (Smooth, expressive)

## Command Template

The skill now includes its own `tts_cli.py` script in the skill directory, making it fully portable:

```bash
set -a && source .env && set +a && \
source venv/bin/activate && \
python .claude/skills/gemini-tts-fast/tts_cli.py "<text>" --output="<filename>" --voice="<voice>" --speed=1.2
```

**Note**: Users need to:
1. Install Python dependencies: `pip install google-genai`
2. Create a `.env` file with `GOOGLE_API_KEY=your-key`
3. Install ffmpeg: `brew install ffmpeg` (macOS) or equivalent
4. Create a Python virtual environment: `python -m venv venv`

## Error Handling

- If `GOOGLE_API_KEY` is missing from `.env`, instruct user to add it
- If ffmpeg is not installed, instruct user to install it (`brew install ffmpeg`)
- If script fails, show the error message
- If model is unavailable, suggest checking Gemini API status

## Examples

**Simple usage (English):**
```
/gemini-tts-fast "Hello world"
```
→ Generates `output.wav` at 1.2x speed

**With custom output:**
```
/gemini-tts-fast "Welcome to our app" --output=welcome.wav
```
→ Generates `welcome.wav` at 1.2x speed

**With custom voice:**
```
/gemini-tts-fast "Thank you for listening" --output=thanks.wav --voice=Aoede
```
→ Generates `thanks.wav` at 1.2x speed with Aoede voice

**Chinese text:**
```
/gemini-tts-fast "你好世界" --output=hello_cn.wav --voice=Kore
```
→ Generates `hello_cn.wav` at 1.2x speed with Kore voice

**Processing script.json:**
```
/gemini-tts-fast @script.json
```
→ Automatically processes all narration scenes from script.json at 1.2x speed

## Technical Details

- Input: Raw PCM data from Gemini API
- Processing: Converts to WAV and applies 1.2x speed using ffmpeg `atempo` filter
- Output format: RIFF WAVE, 24000 Hz, mono, 16-bit PCM
- Playback speed: Fixed at 1.2x (shortens duration by ~17%)
- Temporary files are automatically cleaned up

## Why 1.2x Speed?

1.2x speed is optimal for video narration because:
- Maintains natural speech clarity
- Keeps the content engaging and dynamic
- Reduces video length without sounding rushed
- Standard practice for professional video voiceovers
