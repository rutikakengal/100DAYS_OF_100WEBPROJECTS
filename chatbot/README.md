# Gemini AI Chatbot

A beautiful and responsive chatbot web application powered by Google's Gemini AI API.

## Features

- 🤖 **AI-Powered Conversations**: Uses Google's Gemini Pro model for intelligent responses
- 💬 **Real-time Chat Interface**: Modern chat UI with typing indicators
- 🔐 **Secure API Key Storage**: Local storage of API keys for convenience
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- ⚡ **Fast Performance**: Optimized for quick responses and smooth interactions

## Getting Started

### Prerequisites

1. A Google account
2. Access to Google AI Studio
3. A web browser

### Setup Instructions

1. **Get Your Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Run the Chatbot**:
   - Open `index.html` in your web browser
   - When prompted, enter your Gemini API key
   - Start chatting!

### File Structure

```
chatbot/
├── index.html      # Main HTML file with chat interface
├── style.css       # CSS styles for the chatbot
├── script.js       # JavaScript for Gemini API integration
└── README.md       # This file
```

## How to Use

1. **First Time Setup**:
   - Open the chatbot in your browser
   - A modal will appear asking for your API key
   - Enter your Gemini API key and click "Save API Key"

2. **Chatting**:
   - Type your message in the input field
   - Press Enter or click the send button
   - Wait for the AI response (typing indicator will appear)
   - Continue the conversation naturally

3. **Features**:
   - The chatbot supports basic markdown formatting in responses
   - Your API key is stored locally for convenience
   - The interface is fully responsive for mobile and desktop

## API Key Security

- Your API key is stored locally in your browser's localStorage
- The key is never sent to any server except Google's official Gemini API
- You can clear your API key by clearing your browser's localStorage

## Customization

### Styling
- Modify `style.css` to change colors, fonts, and layout
- The design uses CSS gradients and modern styling techniques

### Functionality
- Edit `script.js` to add new features or modify API parameters
- The code is well-commented and modular for easy customization

### API Configuration
The chatbot uses these Gemini API settings:
- **Model**: gemini-pro
- **Temperature**: 0.9 (for creative responses)
- **Max Output Tokens**: 2048
- **Safety Settings**: Medium and above blocking for harmful content

## Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**:
   - Verify your API key is correct
   - Ensure you have API access enabled in Google AI Studio
   - Check if you have remaining quota

2. **"API Quota Exceeded" Error**:
   - Check your usage limits in Google AI Studio
   - Wait for quota reset or upgrade your plan

3. **Network Errors**:
   - Check your internet connection
   - Ensure your browser allows API requests
   - Try refreshing the page

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript must be enabled
- Local storage must be available

## Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Google's Gemini AI for powering the conversations
- Font Awesome for the beautiful icons
- Modern CSS techniques for the responsive design

---

**Note**: This chatbot requires a valid Gemini API key to function. The API key is free to obtain from Google AI Studio, but usage may be subject to Google's rate limits and terms of service.
