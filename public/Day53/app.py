# Import required libraries
from google import genai
from google.genai import types

from flask import Flask, request, jsonify
from flask_cors import CORS
import json, sys, re


# Initialize Flask app and enable Cross-Origin Resource Sharing (CORS)
app = Flask(__name__)
CORS(app)


# Your Gemini API Key & Model Configuration
API = "YOUR-KEY-HERE"
MODEL = "gemini-2.5-flash"


if not API.strip():
    sys.exit("ERROR: API Key is missing. Please provide Please provide a valid API key in the app.py.")

try:
    client = genai.Client(api_key=API)
    print(f"Connected to Gemini")
except Exception as e:
    sys.exit(f"ERROR: Failed to connect to Gemini API.\nDetails: {e}")



# Utility: clean and parse JSON from LLM output
def parse_llm_json(raw_text):
    cleaned = re.sub(r"```(?:json)?\s*|\s*```", "", raw_text, flags=re.IGNORECASE).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {
            "corrected": cleaned,
            "explanation": "Could not parse explanation."
        }
    

# Function to correct grammatical errors in a sentence
def correct_sentence(text):
    prompt_correction = f"""Correct the grammar of the following sentence and then explain what changes you made.
    Original: {text}
    
    Respond in JSON format:
    {{
        "corrected": "<corrected sentence>",
        "explanation": "<short explanation of what was fixed>"
    }}
    """

    instr = '''
    You are an AI grammar and spelling checker.
    First, correct any mistakes in the input text.
    Then, in a concise way, describe the changes — e.g., fixed spelling, improved verb tense, removed redundancy, etc.
    Return only valid JSON with 'corrected' and 'explanation' keys.
    '''
    
    # Making an API call to Gemini to generate corrected text
    response_correction = client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(
        system_instruction=instr,
        temperature=0.2),
        contents=[prompt_correction],
    )
    
    return parse_llm_json(response_correction.text)


# Function to paraphrase a given sentence
def paraphrase_text(text):
    new_text = correct_sentence(text)["corrected"]
    
    prompt_paraphrase = f"""Paraphrase the following sentence and then explain the changes you made.
    
    Originial: {new_text}
    Respond in JSON format:
    {{
        "corrected": "<corrected sentence>",
        "explanation": "<short explanation of what was fixed>"
    }}    
    """
    
    instr = '''
        You are an AI paraphraser.
        Your task:
        1. Paraphrase the input text while keeping its meaning intact.
        2. Avoid changing facts, numbers, or core ideas.
        3. Remove redundancy, improve flow, and adjust style for clarity.
        4. Return ONLY valid JSON with "corrected" and "explanation" keys — nothing else.
    '''
    
    response_paraphrase = client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(
        system_instruction=instr,
        temperature=0.5),
        contents=[prompt_paraphrase],
    )
    
    return parse_llm_json(response_paraphrase.text)


# Function to adjust the tone of a given sentence
def adjust_tone(text, tone):
    new_text = correct_sentence(text)
    
    prompt_adjust = f"""Adjust the tone of the following sentence and then explain what changes you made.
    
    Original: {new_text}
    Respond in JSON format:
    {{
        "corrected": "<corrected sentence>",
        "explanation": "<short explanation of what was fixed>"
    }}
    """
    
    instr = '''
        You are an AI Writing Assistant.
        Your task:
        1. Rewrite the given sentence in the requested tone (formal, informal, professional, neutral, enthusiastic, or witty).
        2. Follow the tone guidelines provided to maintain style consistency.
        3. Return ONLY valid JSON with "corrected" and "explanation" keys — nothing else.
        '''
    response_adjusted_tone = client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(
        temperature=0.2,
        system_instruction=instr),
        contents=[prompt_adjust],
    )
    return parse_llm_json(response_adjusted_tone.text)
    
# API Endpoint to correct grammar   
@app.route("/correct", methods=['POST'])
def correct():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing "text" in request'}), 400
    user_text = data['text']
    corrected_data = correct_sentence(user_text)
        
    return jsonify({
        'original': user_text,
        'corrected': corrected_data["corrected"],
        'explanation': corrected_data["explanation"],
    })

# API Endpoint to paraphrase text
@app.route('/paraphrase', methods=['POST'])
def paraphrase():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing "text" in request'}), 400
    input = data['text']
    paraphrased = paraphrase_text(input)
    
    return jsonify({
        'original': input,
        'paraphrased': paraphrased["corrected"],
        'explanation': paraphrased["explanation"]
    })
    
# API Endpoint to adjust tone of text
@app.route('/tone', methods=['POST'])
def tone():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing "text" in request'}), 400
    if 'tone' not in data:
        return jsonify({'error': 'Missing "tone" in request'}), 400
    
    input = data['text']
    tone = data['tone']
    tone_adjusted = adjust_tone(input, tone)
    
    return jsonify({
        'original': input,
        'toneAdjusted': tone_adjusted["corrected"],
        'explanation': tone_adjusted["explanation"]
    })
    
if __name__ == '__main__':
    app.run(port=5000, debug=True)