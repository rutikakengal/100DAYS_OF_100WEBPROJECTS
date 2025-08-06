# Import required libraries
from google import genai
from google.genai import types

from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app and enable Cross-Origin Resource Sharing (CORS)
app = Flask(__name__)
CORS(app)

# Your Gemini API Key & Model Configuration
API = "YOUR-API-KEY"
MODEL = "gemini-2.5-flash"

client = genai.Client(api_key=API)

# Function to correct grammatical errors in a sentence
def correct_sentence(text):
    # Constructing a prompt for grammar correction
    prompt_correction = f"Correct the grammar of the following sentence:\nOriginal: {text}\nFixed Grammar:"

    # Instruction to guide the AI model on how to perform the correction
    instr = '''
    You are an AI grammar and spelling checker. 
    You check for any mistakes in the prompt given to you and you correct the sentence.
    Example: I ply footbll = I play football.
    '''
    
    # Making an API call to Gemini to generate corrected text
    response_correction = client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(
        system_instruction=instr,
        temperature=0.2),
        contents=[prompt_correction],
    )
    corrected_text = response_correction.text.strip()  # Extract the corrected sentence from the response
    return corrected_text


# Function to paraphrase a given sentence
def paraphrase_text(text):
    
    # First, correct any grammatical errors in the input
    new_text = correct_sentence(text)
    
    prompt_paraphrase = f"Paraphrase the following sentence: \nOriginial: {new_text}\nParaphrased Sentence:"
    
    instr = '''
    You are an AI paraphraser.
    Paraphrase the input text ensuring the intent and information in the original sentence remain unchanged.
    Avoid altering factual details, numerical data, or core ideas
    
    Example: "He completed the project quickly." = "He wrapped up the project in no time."
    
    Change the structure/order of words while preserving meaning.
    Example:"The book was read by her." = "She read the book."
    
    Avoid slang in formal tone, and simplify phrases for casual tone.
    Remove repetitive or unnecessary words
    '''
    
    response_paraphrase = client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(
        system_instruction=instr,
        temperature=0.5),
        contents=[prompt_paraphrase],
    )
    paraphrase = response_paraphrase.text.strip()
    return paraphrase


# Function to adjust the tone of a given sentence
def adjust_tone(text, tone):
    
    # First, correct any grammatical errors in the input
    new_text = correct_sentence(text)
    
    # Constructing a tone adjustment prompt dynamically using user-selected tone
    prompt_adjust = f"Adjust the tone of the following sentence:\nOriginal{tone}: {new_text}\nAfter Adjusting Tone:"
    
    instr = '''
    You are an AI Writing Assistant.
    Your task is to adjust the tone of the given input sentence based on the specified tone.

    Here are the tone guidelines:

    1. **Formal Tone**:
    - Use precise, sophisticated vocabulary and polite phrases.
    - Avoid contractions (e.g., "cannot" instead of "can't").
    - Passive voice is acceptable.
    Example:
    "Hey, can you send me the file?" → "Could you please provide me with the document at your earliest convenience?"

    2. **Informal Tone**:
    - Use casual, conversational words and contractions.
    - Incorporate slang and friendly openings ("Hey!", "What's up?").
    Example:
    "I am interested in collaborating with your team." → "I'd love to team up with you guys!"

    3. **Professional Tone**:
    - Use clear, concise, and respectful language.
    - Be polite and approachable without slang.
    Example:
    "I want to work with you." → "I am looking forward to the opportunity to collaborate with you."

    4. **Neutral Tone**:
    - Avoid emotional or persuasive phrases.
    - Use objective, factual, and to-the-point sentences.
    Example:
    "This amazing tool boosts your productivity!" → "This tool increases productivity."

    5. **Enthusiastic Tone**:
    - Use high-energy words and exclamation marks (but sparingly).
    - Keep responses short, dynamic, and upbeat.
    Example:
    "The product is available now." → "Guess what? The product is finally here, and you’re going to love it!"

    6. **Witty Tone**:
    - Incorporate humor, puns, and playful language.
    - Use light sarcasm or cheeky remarks, while keeping the message clear.
    Example:
    "Our servers are down for maintenance." → "Our servers are taking a coffee break. Be right back!"

    Adjust the input sentence accordingly and provide only the rewritten sentence as output.
    '''
    response_adjusted_tone = client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(
        temperature=0.2,
        system_instruction=instr),
        contents=[prompt_adjust],
    )
    tone_adjusted = response_adjusted_tone.text.strip()
    return tone_adjusted
    
# API Endpoint to correct grammar   
@app.route("/correct", methods=['POST'])
def correct():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing "text" in request'}), 400
    user_text = data['text']
    corrected = correct_sentence(user_text)

    return jsonify({
        'original': user_text,
        'corrected': corrected
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
        'paraphrased': paraphrased
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
        'toneAdjusted': tone_adjusted
    })
    
if __name__ == '__main__':
    app.run(port=5000, debug=True)
