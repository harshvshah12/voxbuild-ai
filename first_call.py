import os
import sys
import base64
from dotenv import load_dotenv
from sarvamai import SarvamAI

# Ensure Windows terminal handles UTF-8 characters gracefully
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def main():
    load_dotenv()
    api_key = os.getenv("SARVAM_API_KEY")
    if not api_key:
        raise ValueError("SARVAM_API_KEY environment variable is not set. Please check your .env file.")

    client = SarvamAI(api_subscription_key=api_key)

    text_to_synthesize = "नमस्ते! मैं सर्वम एआई का वॉइस एजेंट हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?"
    print(f"Synthesizing text: '{text_to_synthesize}'")

    response = client.text_to_speech.convert(
        text=text_to_synthesize,
        language_code="hi-IN",
        speaker="aditya",
        model="bulbul:v3",
        output_audio_codec="wav"
    )

    if response.audios and len(response.audios) > 0:
        audio_data = base64.b64decode(response.audios[0])
        output_file = "output.wav"
        with open(output_file, "wb") as f:
            f.write(audio_data)
        
        print(f"Success! Audio saved to: {output_file}")
        print(f"Audio size: {len(audio_data)} bytes")
        print(f"Request ID: {response.request_id}")
    else:
        print("Response received, but no audio data was returned.")

if __name__ == "__main__":
    main()
