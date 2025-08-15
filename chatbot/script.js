class GeminiChatbot {
    constructor() {
        this.apiKey = localStorage.getItem('geminiApiKey');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.apiKeyModal = document.getElementById('apiKeyModal');
        
        this.initializeEventListeners();
        this.checkApiKey();
    }

    initializeEventListeners() {
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize input
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
        });
    }

    checkApiKey() {
        if (!this.apiKey) {
            this.showApiKeyModal();
        }
    }

    showApiKeyModal() {
        this.apiKeyModal.style.display = 'block';
    }

    hideApiKeyModal() {
        this.apiKeyModal.style.display = 'none';
    }

    saveApiKey() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showError('Please enter a valid API key');
            return;
        }

        this.apiKey = apiKey;
        localStorage.setItem('geminiApiKey', apiKey);
        this.hideApiKeyModal();
        this.showSuccess('API key saved successfully!');
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message) return;
        
        if (!this.apiKey) {
            this.showApiKeyModal();
            return;
        }

        // Clear input and disable send button
        this.messageInput.value = '';
        this.sendButton.disabled = true;

        // Add user message to chat
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Call Gemini API
            const response = await this.callGeminiAPI(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response to chat
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            this.hideTypingIndicator();
            
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            
            if (error.message.includes('API key')) {
                errorMessage = 'Invalid API key. Please check your API key and try again.';
                this.showApiKeyModal();
            } else if (error.message.includes('quota')) {
                errorMessage = 'API quota exceeded. Please check your Gemini API usage limits.';
            } else if (error.message.includes('network')) {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            }
            
            this.addMessage(errorMessage, 'bot', true);
        } finally {
            // Re-enable send button
            this.sendButton.disabled = false;
            this.messageInput.focus();
        }
    }

    async callGeminiAPI(message) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: message
                }]
            }],
            generationConfig: {
                temperature: 0.9,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 400) {
                throw new Error('Invalid API key or request format');
            } else if (response.status === 429) {
                throw new Error('API quota exceeded');
            } else if (response.status >= 500) {
                throw new Error('Gemini API server error');
            } else {
                throw new Error(`API request failed: ${response.status}`);
            }
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from Gemini API');
        }

        return data.candidates[0].content.parts[0].text;
    }

    addMessage(text, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (isError) {
            contentDiv.classList.add('error-message');
        }
        
        // Set avatar icon
        if (sender === 'user') {
            avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
        } else {
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        }
        
        // Format message text (handle markdown-like formatting)
        const formattedText = this.formatMessage(text);
        contentDiv.innerHTML = `<p>${formattedText}</p>`;
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Basic markdown-like formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
            .replace(/\n/g, '<br>'); // Line breaks
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    showError(message) {
        // You can implement a toast notification here
        alert(message);
    }

    showSuccess(message) {
        // You can implement a toast notification here
        const successDiv = document.createElement('div');
        successDiv.className = 'message bot-message';
        successDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="message-content success-message">
                <p>${message}</p>
            </div>
        `;
        this.chatMessages.appendChild(successDiv);
        this.scrollToBottom();
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

// Global functions for modal
function closeModal() {
    chatbot.hideApiKeyModal();
}

function saveApiKey() {
    chatbot.saveApiKey();
}

// Initialize chatbot when DOM is loaded
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
    chatbot = new GeminiChatbot();
});

// Handle modal clicks
window.addEventListener('click', (event) => {
    const modal = document.getElementById('apiKeyModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});
