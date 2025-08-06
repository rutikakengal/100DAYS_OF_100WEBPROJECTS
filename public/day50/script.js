async function processText(action, text, tone = '') {
    let endpoint = '';
    let payload = {text: text};

    if (action === 'grammar') {
        endpoint = '/correct'
    } else if (action === 'paraphrase') {
        endpoint = '/paraphrase'
    } else if (action === 'tone') {
        endpoint = '/tone'
        payload.tone = tone;
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if(!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();
        return data.corrected || data.paraphrased || data.toneAdjusted || 'No response'; 
    } catch(error) {
        console.error('Error: ', error);
        return "An error occured when processing text."
    }
}

// Grammar Check Button
document.getElementById('grammarCheckBtn').addEventListener('click', async () => {
    document.getElementById('toneOptions').style.display = 'none';
    const text = document.getElementById('userInput').value;
    const output = await processText('grammar', text);
    document.getElementById('output').innerText = output;
});

// Paraphrase Button
document.getElementById('paraphraseBtn').addEventListener('click', async () => {
    document.getElementById('toneOptions').style.display = 'none';
    const text = document.getElementById('userInput').value;
    const output = await processText('paraphrase', text);
    document.getElementById('output').innerText = output;
});

// Tone Adjust Button (to reveal drop down section)
document.getElementById('toneAdjustBtn').addEventListener('click', () => {
    document.getElementById('toneOptions').style.display = 'flex';
});

// Apply Tone Button
document.getElementById('applyToneBtn').addEventListener('click', async () => {
    const tone = document.getElementById('toneSelect').value;
    const text = document.getElementById('userInput').value;

    if (!tone) {
        alert("Please select a tone.");
        return;
    }

    const output = await processText('tone', text, tone);
    document.getElementById('output').innerText = output;
});
