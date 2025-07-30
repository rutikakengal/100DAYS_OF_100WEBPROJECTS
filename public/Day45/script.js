// Wish messages for different occasions
const wishMessages = {
    'birthday': {
        title: 'Happy Birthday!',
        message: 'Wishing you a day filled with joy, laughter, and wonderful surprises! May all your dreams come true and may this year bring you endless happiness and success. 🎂🎉'
    },
    'anniversary': {
        title: 'Happy Anniversary!',
        message: 'Celebrating the beautiful journey of love and togetherness. May your bond grow stronger with each passing year, filled with love, understanding, and countless beautiful moments. 💕💑'
    },
    'mothers-day': {
        title: 'Happy Mother\'s Day!',
        message: 'To the most amazing mother in the world! Thank you for your unconditional love, endless patience, and for being our guiding light. You make every day special with your warmth and care. 🌷💖'
    },
    'fathers-day': {
        title: 'Happy Father\'s Day!',
        message: 'To the best dad ever! Thank you for your strength, wisdom, and for always being there for us. Your love and guidance shape our lives in the most beautiful ways. 👨‍👧‍👦💙'
    },
    'brothers-day': {
        title: 'Happy Brother\'s Day!',
        message: 'To my amazing brother! Thank you for being my partner in crime, my protector, and my best friend. Life is so much better with you by my side. 👨‍👦🤗'
    },
    'sisters-day': {
        title: 'Happy Sister\'s Day!',
        message: 'To my wonderful sister! Thank you for being my confidante, my cheerleader, and my forever friend. You make every day brighter with your love and laughter. 👩‍👧💕'
    }
};

// Check which page we're on and initialize accordingly
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === ''  ) {
        initializeLandingPage();
    } else if (currentPage === 'form.html') {
        initializeFormPage();
    } else if (currentPage === 'envelope.html') {
        initializeEnvelopePage();
    }
});

// Landing page functionality
function initializeLandingPage() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const occasion = this.getAttribute('data-occasion');
            // Store the occasion in localStorage
            localStorage.setItem('selectedOccasion', occasion);
            // Navigate to form page
            window.location.href = 'form.html';
        });
    });
}

// Form page functionality
function initializeFormPage() {
    const occasion = localStorage.getItem('selectedOccasion');
    const occasionTitle = document.getElementById('occasion-title');
    const form = document.getElementById('wish-form');
    
    // Set the occasion title
    if (occasion && wishMessages[occasion]) {
        occasionTitle.textContent = wishMessages[occasion].title;
    }
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fromName = document.getElementById('from-name').value.trim();
        if (fromName) {
            // Store the name in localStorage
            localStorage.setItem('fromName', fromName);
            // Navigate to envelope page
            window.location.href = 'envelope.html';
        }
    });
}

// Envelope page functionality
function initializeEnvelopePage() {
    const occasion = localStorage.getItem('selectedOccasion');
    const fromName = localStorage.getItem('fromName');
    const openBtn = document.getElementById('open-btn');
    const envelope = document.getElementById('envelope');
    const wishContent = document.getElementById('wish-content');
    const wishTitle = document.getElementById('wish-title');
    const wishText = document.getElementById('wish-text');
    const fromNameDisplay = document.getElementById('from-name-display');
    
    // Set background based on occasion
    if (occasion) {
        document.body.className = occasion;
    }
    
    // Set wish content
    if (occasion && wishMessages[occasion]) {
        wishTitle.textContent = wishMessages[occasion].title;
        wishText.textContent = wishMessages[occasion].message;
    }
    
    if (fromName) {
        fromNameDisplay.textContent = fromName;
    }
    
    // Handle envelope opening
    openBtn.addEventListener('click', function() {
        // Animate envelope opening
        const envelopeFlap = envelope.querySelector('.envelope-flap');
        envelopeFlap.style.transform = 'rotateX(180deg)';
        
        // Hide open button
        openBtn.style.display = 'none';
        
        // Show confetti
        createConfetti();
        
        // Show wish content after a delay
        setTimeout(() => {
            envelope.style.display = 'none';
            wishContent.style.display = 'block';
            wishContent.style.animation = 'fadeIn 1s ease-in';
        }, 1000);
    });
}

// Confetti effect
function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#a8edea', '#fed6e3', '#4facfe', '#00f2fe'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add fadeIn animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
`;
document.head.appendChild(style); 