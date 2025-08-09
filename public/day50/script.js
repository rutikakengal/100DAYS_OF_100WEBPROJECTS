async function processText(action, text, tone = '') {
    let endpoint = '';
    let payload = { text: text };

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

        if (!response.ok) {
            throw new Error("API request failed (${response.status})");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error: ', error);
        return "An error occured when processing text."
    }
}


// Helper function to format API responses
function displayFormattedOutput(data, mainTitle = "Result") {
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch {
            document.getElementById('output').innerHTML = `<p>${data}</p>`;
            return;
        }
    }

    if (data.error) {
        document.getElementById('output').innerHTML = `<p style="color:red;">${data.error}</p>`;
        return;
    }

    let html = `
    <div class=output-card>
        <h3 style="margin-top:0;">${mainTitle}</h3>
    `;

    for (const key in data) {
        if (key !== "error") {
            html += `<p><strong>${capitalizeFirstLetter(key)}:</strong> ${data[key]}</p>`;
        }
    }

    html += `</div>`;
    document.getElementById('output').innerHTML = html;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showThinking(message = "Thinking...") {
    document.getElementById('output').innerHTML = `<p class="loader">${message}</p>`;
}


// Grammar Check Button
document.getElementById('grammarCheckBtn').addEventListener('click', async () => {
    // Hide the tone options
    document.getElementById('toneOptions').style.display = 'none';

    const text = document.getElementById('userInput').value;
    showThinking();
    const output = await processText('grammar', text);
    displayFormattedOutput(output, "Grammar Correction");
});

// Paraphrase Button
document.getElementById('paraphraseBtn').addEventListener('click', async () => {
    document.getElementById('toneOptions').style.display = 'none';
    const text = document.getElementById('userInput').value;
    showThinking();
    const result = await processText('paraphrase', text);
    displayFormattedOutput(result, "Paraphrased Text");
});

// Show tone options
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
    showThinking();
    result = await processText('tone', text, tone);
    displayFormattedOutput(result, `${tone} Tone adjustment`)
});

