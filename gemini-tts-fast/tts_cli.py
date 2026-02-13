#!/usr/bin/env python3
"""
Gemini TTS Command Line Interface
Usage: python tts_cli.py "text to convert" --output=file.wav --voice=Puck
"""

import os
import sys
import argparse
import subprocess
import tempfile
from pathlib import Path
from google import genai
from google.genai import types

def text_to_speech(api_key, text, output_file="output.wav", voice_name="Puck", speed=1.0):
    """
    使用 Gemini API 将文本转换为语音

    Args:
        api_key: Google API Key
        text: 要转换的文本
        output_file: 输出音频文件路径
        voice_name: 语音名称
        speed: 播放速度倍数 (0.5-2.0)
    """
    try:
        # 创建客户端
        client = genai.Client(api_key=api_key)

        print(f"[Gemini TTS]")
        print(f"  文本: {text[:50]}{'...' if len(text) > 50 else ''}")
        print(f"  语音: {voice_name}")
        print(f"  速度: {speed}x" if speed != 1.0 else "  速度: 正常")
        print(f"  输出: {output_file}")
        print(f"  正在生成...")

        # 生成音频
        response = client.models.generate_content(
            model='gemini-2.5-pro-preview-tts',
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=voice_name
                        )
                    )
                )
            )
        )

        # 保存音频文件
        if response and response.candidates:
            for candidate in response.candidates:
                for part in candidate.content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data:
                        audio_data = part.inline_data.data

                        # 创建临时文件保存原始 PCM 数据
                        with tempfile.NamedTemporaryFile(suffix='.pcm', delete=False) as temp_file:
                            temp_path = temp_file.name
                            temp_file.write(audio_data)

                        try:
                            # 使用 ffmpeg 将 PCM 转换为 WAV
                            # Gemini TTS 输出格式: 24kHz, 单声道, 16-bit PCM
                            output_path = Path(output_file)

                            # 构建 ffmpeg 命令
                            ffmpeg_cmd = [
                                'ffmpeg',
                                '-f', 's16le',  # 输入格式: 16-bit little-endian PCM
                                '-ar', '24000',  # 采样率: 24kHz
                                '-ac', '1',      # 通道数: 单声道
                                '-i', temp_path, # 输入文件
                            ]

                            # 如果需要加速，添加音频滤镜
                            if speed != 1.0:
                                ffmpeg_cmd.extend(['-filter:a', f'atempo={speed}'])

                            ffmpeg_cmd.extend([
                                '-y',            # 覆盖输出文件
                                str(output_path) # 输出文件
                            ])

                            subprocess.run(ffmpeg_cmd, check=True, capture_output=True)

                            # 获取输出文件大小
                            file_size_kb = output_path.stat().st_size / 1024
                            print(f"  ✓ 成功!")
                            print(f"  文件大小: {file_size_kb:.2f} KB")
                            return True

                        except subprocess.CalledProcessError as e:
                            print(f"  × 转换错误: {e.stderr.decode()}", file=sys.stderr)
                            return False
                        except FileNotFoundError:
                            print("  × 错误: 未找到 ffmpeg，请先安装 ffmpeg", file=sys.stderr)
                            return False
                        finally:
                            # 删除临时文件
                            if os.path.exists(temp_path):
                                os.unlink(temp_path)

        print("  × 未能从响应中获取音频数据")
        return False

    except Exception as e:
        print(f"  × 错误: {e}", file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(
        description='将文本转换为语音（使用 Google Gemini TTS）',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
可用语音选项:
  Puck    - 中性、清晰（默认）
  Charon  - 深沉、权威
  Kore    - 温暖、友好
  Fenrir  - 强劲、动感
  Aoede   - 流畅、富有表现力

示例:
  %(prog)s "Hello world"
  %(prog)s "你好世界" --output=hello.wav --voice=Aoede
        """
    )

    parser.add_argument(
        'text',
        help='要转换为语音的文本'
    )
    parser.add_argument(
        '--output', '-o',
        default='output.wav',
        help='输出文件名（默认: output.wav）'
    )
    parser.add_argument(
        '--voice', '-v',
        default='Puck',
        choices=['Puck', 'Charon', 'Kore', 'Fenrir', 'Aoede'],
        help='语音选项（默认: Puck）'
    )
    parser.add_argument(
        '--speed', '-s',
        type=float,
        default=1.0,
        help='播放速度倍数，范围 0.5-2.0（默认: 1.0）'
    )

    args = parser.parse_args()

    # 验证速度参数
    if args.speed < 0.5 or args.speed > 2.0:
        print("错误: 速度必须在 0.5 到 2.0 之间", file=sys.stderr)
        sys.exit(1)

    # 检查 API Key
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        print("错误: 未设置 GOOGLE_API_KEY 环境变量", file=sys.stderr)
        print("\n请运行: export GOOGLE_API_KEY='your-api-key'", file=sys.stderr)
        sys.exit(1)

    # 生成语音
    success = text_to_speech(
        api_key=api_key,
        text=args.text,
        output_file=args.output,
        voice_name=args.voice,
        speed=args.speed
    )

    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
