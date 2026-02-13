# Basic Usage Examples

## Single Text Conversion

**User:** Generate audio for "Hello, welcome to our product demo"

**Expected behavior:**
```bash
cd /Users/de-shiouhuang/Dropbox/code/tezign/tts-test && \
set -a && source .env && set +a && \
source venv/bin/activate && \
python tts_cli.py "Hello, welcome to our product demo" --output="output.wav" --speed=1.2
```

## Custom Output File

**User:** Convert "Thank you for watching" to thanks.wav

**Expected behavior:**
```bash
cd /Users/de-shiouhuang/Dropbox/code/tezign/tts-test && \
set -a && source .env && set +a && \
source venv/bin/activate && \
python tts_cli.py "Thank you for watching" --output="thanks.wav" --speed=1.2
```

## Different Voice

**User:** Use Aoede voice for "This is a smooth narration"

**Expected behavior:**
```bash
cd /Users/de-shiouhuang/Dropbox/code/tezign/tts-test && \
set -a && source .env && set +a && \
source venv/bin/activate && \
python tts_cli.py "This is a smooth narration" --output="output.wav" --voice="Aoede" --speed=1.2
```

## Script File Processing

**User:** Process narration from @script.json

**Expected behavior:**
- Read script.json file
- Extract narration from each scene
- Generate individual WAV files (scene-1.wav, scene-2.wav, etc.)
- All files generated at 1.2x speed automatically
