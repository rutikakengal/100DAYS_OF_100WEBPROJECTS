class QuizApp {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.timer = null;
        this.timeLeft = 30;
        this.isQuizComplete = false;
        this.streak = 0;
        this.maxStreak = 0;
        this.totalTime = 0;
        this.questionTimes = [];
        this.difficulty = 'medium';
        this.category = 'general';
        this.hintsUsed = 0;
        this.lifelinesUsed = 0;
        this.skippedQuestions = [];
        this.achievements = [];
        this.experience = 0;
        this.level = 1;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.backgroundMusic = null;
        this.isTyping = false;
        
        // Quiz categories with questions
        this.quizData = {
            general: [
                {
                    question: "What is the capital of France?",
                    options: ["London", "Berlin", "Paris", "Madrid"],
                    correct: 2,
                    difficulty: "easy",
                    hint: "Think of the famous tower",
                    explanation: "Paris is the capital and largest city of France."
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Saturn"],
                    correct: 1,
                    difficulty: "easy",
                    hint: "Named after the Roman god of war",
                    explanation: "Mars appears red due to iron oxide on its surface."
                },
                {
                    question: "What is the largest ocean on Earth?",
                    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
                    correct: 3,
                    difficulty: "easy",
                    hint: "Covers about one-third of Earth's surface",
                    explanation: "The Pacific Ocean is the largest and deepest ocean."
                },
                {
                    question: "Who painted the Mona Lisa?",
                    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                    correct: 2,
                    difficulty: "medium",
                    hint: "Italian Renaissance artist",
                    explanation: "Leonardo da Vinci painted the Mona Lisa between 1503-1519."
                },
                {
                    question: "What is the chemical symbol for gold?",
                    options: ["Ag", "Au", "Fe", "Cu"],
                    correct: 1,
                    difficulty: "medium",
                    hint: "From Latin 'aurum'",
                    explanation: "Au comes from the Latin word 'aurum' meaning gold."
                },
                {
                    question: "Which year did World War II end?",
                    options: ["1943", "1944", "1945", "1946"],
                    correct: 2,
                    difficulty: "medium",
                    hint: "The year of V-E Day and V-J Day",
                    explanation: "WWII ended in 1945 with Germany's surrender in May and Japan's in September."
                },
                {
                    question: "What is the largest mammal in the world?",
                    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
                    correct: 1,
                    difficulty: "medium",
                    hint: "Lives in the ocean",
                    explanation: "The Blue Whale is the largest animal known to have ever existed."
                },
                {
                    question: "Which programming language is known as the 'language of the web'?",
                    options: ["Python", "Java", "JavaScript", "C++"],
                    correct: 2,
                    difficulty: "medium",
                    hint: "Shares its name with a coffee",
                    explanation: "JavaScript is the primary language for web development."
                },
                {
                    question: "What is the square root of 144?",
                    options: ["10", "11", "12", "13"],
                    correct: 2,
                    difficulty: "easy",
                    hint: "12 × 12 = ?",
                    explanation: "12 × 12 = 144, so the square root of 144 is 12."
                },
                {
                    question: "Which country is home to the kangaroo?",
                    options: ["New Zealand", "South Africa", "Australia", "India"],
                    correct: 2,
                    difficulty: "easy",
                    hint: "Also known as the Land Down Under",
                    explanation: "Kangaroos are native to Australia and are its national symbol."
                }
            ],
            science: [
                {
                    question: "What is the chemical symbol for water?",
                    options: ["H2O", "O2", "CO2", "NaCl"],
                    correct: 0,
                    difficulty: "easy",
                    hint: "It consists of two hydrogen atoms and one oxygen atom.",
                    explanation: "Water has the chemical formula H₂O — two hydrogen atoms bonded to one oxygen atom."
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Earth", "Mars", "Jupiter", "Venus"],
                    correct: 1,
                    difficulty: "easy",
                    hint: "Its reddish color comes from iron oxide.",
                    explanation: "Mars is called the Red Planet due to the iron oxide (rust) on its surface."
                },
                {
                    question: "What part of the cell contains the genetic material?",
                    options: ["Mitochondria", "Nucleus", "Ribosome", "Cytoplasm"],
                    correct: 1,
                    difficulty: "easy",
                    hint: "It’s like the brain of the cell.",
                    explanation: "The nucleus contains DNA and controls the cell's activities."
                },
                {
                    question: "What gas do plants absorb from the atmosphere?",
                    options: ["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"],
                    correct: 2,
                    difficulty: "easy",
                    hint: "It’s essential for photosynthesis.",
                    explanation: "Plants absorb carbon dioxide (CO₂) and use it during photosynthesis to produce oxygen."
                },
                {
                    question: "What force keeps planets in orbit around the sun?",
                    options: ["Magnetism", "Friction", "Electricity", "Gravity"],
                    correct: 3,
                    difficulty: "easy",
                    hint: "It’s the same force that keeps you on the ground.",
                    explanation: "Gravity is the force that attracts objects toward one another, including planets around the Sun."
                },
                {
                    question: "Which organ is responsible for pumping blood throughout the body?",
                    options: ["Brain", "Liver", "Heart", "Lungs"],
                    correct: 2,
                    difficulty: "easy",
                    hint: "It beats around 100,000 times a day.",
                    explanation: "The heart pumps blood throughout the body via the circulatory system."
                },
                {
                    question: "What is the powerhouse of the cell?",
                    options: ["Nucleus", "Mitochondria", "Chloroplast", "Golgi apparatus"],
                    correct: 1,
                    difficulty: "medium",
                    hint: "It generates energy in the form of ATP.",
                    explanation: "The mitochondria convert nutrients into energy and are known as the powerhouse of the cell."
                },
                {
                    question: "What is the center of an atom called?",
                    options: ["Electron", "Proton", "Nucleus", "Neutron"],
                    correct: 2,
                    difficulty: "medium",
                    hint: "It contains protons and neutrons.",
                    explanation: "The nucleus is the central part of an atom and contains protons and neutrons."
                },
                {
                    question: "Which vitamin is produced when the skin is exposed to sunlight?",
                    options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
                    correct: 3,
                    difficulty: "easy",
                    hint: "It helps in calcium absorption.",
                    explanation: "Vitamin D is produced by the skin in response to exposure to sunlight and is essential for bone health."
                },
                {
                    question: "Which scientist developed the theory of general relativity?",
                    options: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Galileo Galilei"],
                    correct: 1,
                    difficulty: "medium",
                    hint: "He’s known for E=mc².",
                    explanation: "Albert Einstein developed the theory of general relativity, revolutionizing our understanding of gravity and spacetime."
                }
            ],
            history: [
                {
                    question: "Who was the first President of the United States?",
                    options: ["John Adams", "Thomas Jefferson", "George Washington", "Benjamin Franklin"],
                    correct: 2,
                    difficulty: "easy",
                    hint: "His face is on the one-dollar bill",
                    explanation: "George Washington served as the first President from 1789–1797."
                },
                {
                    question: "In which year did World War II end?",
                    options: ["1939", "1942", "1945", "1950"],
                    correct: 2,
                    difficulty: "medium",
                    hint: "It ended shortly after the atomic bombings of Japan.",
                    explanation: "World War II ended in 1945 with the surrender of Germany in May and Japan in August."
                },
                {
                    question: "Who was the British Prime Minister during most of World War II?",
                    options: ["Neville Chamberlain", "Winston Churchill", "Tony Blair", "Margaret Thatcher"],
                    correct: 1,
                    difficulty: "easy",
                    hint: "He famously said, 'We shall never surrender.'",
                    explanation: "Winston Churchill led Britain through most of World War II and is known for his leadership and speeches."
                },
                {
                    question: "The Roman Empire fell in which year?",
                    options: ["476 AD", "1066 AD", "1492 AD", "1215 AD"],
                    correct: 0,
                    difficulty: "medium",
                    hint: "It was in the 5th century AD.",
                    explanation: "The Western Roman Empire officially fell in 476 AD when Emperor Romulus Augustulus was deposed."
                },
                {
                    question: "Who was known as the 'Maid of Orléans'?",
                    options: ["Marie Antoinette", "Catherine the Great", "Joan of Arc", "Queen Elizabeth I"],
                    correct: 2,
                    difficulty: "medium",
                    hint: "She led French troops during the Hundred Years' War.",
                    explanation: "Joan of Arc was a French heroine who led troops against the English and was later canonized as a saint."
                },
                {
                    question: "Which empire was ruled by Genghis Khan?",
                    options: ["Ottoman Empire", "Mongol Empire", "Roman Empire", "Persian Empire"],
                    correct: 1,
                    difficulty: "easy",
                    hint: "This empire became the largest contiguous land empire in history.",
                    explanation: "Genghis Khan founded the Mongol Empire, which became the largest empire in history by land area."
                },
                {
                    question: "The Great Wall of China was primarily built to protect against which group?",
                    options: ["Romans", "Mongols", "Japanese", "Tibetans"],
                    correct: 1,
                    difficulty: "medium",
                    hint: "They were fierce nomadic horsemen from the north.",
                    explanation: "The Great Wall was built to protect against invasions by northern tribes, especially the Mongols."
                },
                {
                    question: "Who was assassinated in Sarajevo in 1914, sparking World War I?",
                    options: ["Kaiser Wilhelm II", "Woodrow Wilson", "Archduke Franz Ferdinand", "Winston Churchill"],
                    correct: 2,
                    difficulty: "medium",
                    hint: "He was the heir to the Austro-Hungarian throne.",
                    explanation: "The assassination of Archduke Franz Ferdinand of Austria by a Bosnian Serb nationalist triggered World War I."
                },
                {
                    question: "Who wrote the Declaration of Independence?",
                    options: ["George Washington", "Benjamin Franklin", "Thomas Jefferson", "James Madison"],
                    correct: 2,
                    difficulty: "easy",
                    hint: "He later became the third President of the United States.",
                    explanation: "Thomas Jefferson was the principal author of the Declaration of Independence in 1776."
                },
                {
                    question: "Which ancient civilization built Machu Picchu?",
                    options: ["Aztecs", "Mayans", "Incas", "Olmecs"],
                    correct: 2,
                    difficulty: "medium",
                    hint: "They ruled much of the Andes in South America.",
                    explanation: "The Inca civilization built Machu Picchu in the 15th century high in the Andes Mountains."
                }
            ]
        };
        
        this.questions = this.quizData.general;
        this.init();
        this.loadUserData();
    }
    
    init() {
        this.bindEvents();
        this.initializeTheme();
        this.addFadeInAnimation();
        this.initializeAudio();
        this.createParticleSystem();
    }
    
    initializeAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        this.sounds = {
            correct: this.createTone(800, 0.3, 'sine'),
            incorrect: this.createTone(200, 0.3, 'sawtooth'),
            timer: this.createTone(400, 0.2, 'square'),
            victory: this.createTone(523, 0.5, 'sine'),
            click: this.createTone(600, 0.1, 'triangle')
        };
    }
    
    createTone(frequency, duration, type) {
        return () => {
            if (!this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    createParticleSystem() {
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'particle-container';
        this.particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(this.particleContainer);
    }
    
    createParticles(x, y, color = '#6366f1', count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: ${color};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                animation: particleExplosion 1s ease-out forwards;
            `;
            
            this.particleContainer.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    createConfetti() {
        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * window.innerWidth}px;
                top: -10px;
                pointer-events: none;
                animation: confetti ${Math.random() * 2 + 2}s linear forwards;
                z-index: 9999;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        }
    }
    
    bindEvents() {
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Sound toggle
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());
        
        // Category selection
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectCategory(e));
        });
        
        // Welcome screen
        document.getElementById('startQuizBtn').addEventListener('click', () => this.showInstructions());
        
        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('startNowBtn').addEventListener('click', () => this.startQuiz());
        
        // Quiz navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitQuiz());
        
        // Result screen
        document.getElementById('retryBtn').addEventListener('click', () => this.retryQuiz());
        document.getElementById('exitBtn').addEventListener('click', () => this.exitQuiz());
        
        // Option selection
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectOption(e));
        });
        
        // Close modal on outside click
        document.getElementById('instructionModal').addEventListener('click', (e) => {
            if (e.target.id === 'instructionModal') {
                this.closeModal();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch/swipe support for mobile
        this.initializeTouchSupport();
    }
    
    initializeTouchSupport() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50 && this.currentQuestion < this.questions.length - 1) {
                    this.nextQuestion();
                } else if (diffX < -50 && this.currentQuestion > 0) {
                    this.previousQuestion();
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }
    
    loadUserData() {
        const savedData = localStorage.getItem('quizAppData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.experience = data.experience || 0;
            this.level = data.level || 1;
            this.achievements = data.achievements || [];
            this.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
            this.musicEnabled = data.musicEnabled !== undefined ? data.musicEnabled : true;
            this.leaderboard = data.leaderboard || []; // Load leaderboard
        }
        this.updateLevelDisplay();
        this.displayLeaderboard();
    }
    
    displayLeaderboard() {
        const leaderboardContainer = document.getElementById('leaderboard');
        const leaderboard = this.getLeaderboard();
        
        if (leaderboard.length === 0) {
            leaderboardContainer.innerHTML = '<p class="no-scores">No scores yet. Be the first!</p>';
            return;
        }
        
        const leaderboardHTML = leaderboard.slice(0, 5).map((entry, index) => `
            <div class="leaderboard-item">
                <div class="rank">${index + 1}</div>
                <div class="score-info">
                    <div class="score">${entry.score} pts</div>
                    <div class="category">${entry.category}</div>
                </div>
                <div class="date">${new Date(entry.date).toLocaleDateString()}</div>
            </div>
        `).join('');
        
        leaderboardContainer.innerHTML = leaderboardHTML;
    }
    
    saveUserData() {
        const data = {
            experience: this.experience,
            level: this.level,
            achievements: this.achievements,
            soundEnabled: this.soundEnabled,
            musicEnabled: this.musicEnabled,
            leaderboard: this.getLeaderboard()
        };
        localStorage.setItem('quizAppData', JSON.stringify(data));
    }
    
    getLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard') || '[]');
        return leaderboard;
    }
    
    saveToLeaderboard(score, category, time) {
        const leaderboard = this.getLeaderboard();
        const entry = {
            score: score,
            category: category,
            time: time,
            date: new Date().toISOString(),
            level: this.level,
            maxStreak: this.maxStreak
        };
        
        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score);
        
        const topScores = leaderboard.slice(0, 10);
        localStorage.setItem('quizLeaderboard', JSON.stringify(topScores));
    }
    
    exportResults() {
        const correctAnswers = this.answers.filter((answer, index) => 
            answer === this.questions[index].correct
        ).length;
        const percentage = Math.round((correctAnswers / this.questions.length) * 100);
        
        const results = {
            date: new Date().toLocaleDateString(),
            category: this.category,
            score: this.score,
            percentage: percentage,
            correct: correctAnswers,
            total: this.questions.length,
            maxStreak: this.maxStreak,
            timeSpent: this.questionTimes.reduce((sum, time) => sum + time, 0),
            hintsUsed: this.hintsUsed,
            lifelinesUsed: this.lifelinesUsed,
            skipped: this.skippedQuestions.length,
            level: this.level,
            achievements: this.achievements
        };
        
        const dataStr = JSON.stringify(results, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `quiz-results-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('📄 Results exported successfully!', 'success');
    }
    
    updateLevelDisplay() {
        const levelElement = document.getElementById('userLevel');
        if (levelElement) {
            levelElement.textContent = `Level ${this.level}`;
        }
    }
    
    addExperience(points) {
        this.experience += points;
        const expNeeded = this.level * 100;
        
        if (this.experience >= expNeeded) {
            this.levelUp();
        }
        
        this.saveUserData();
        this.updateLevelDisplay();
    }
    
    levelUp() {
        this.level++;
        this.experience = 0;
        this.showNotification(`🎉 Level Up! You're now Level ${this.level}!`, 'success');
        this.createParticles(window.innerWidth / 2, window.innerHeight / 2, '#10b981', 50);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-glass);
            backdrop-filter: blur(10px);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 15px 20px;
            color: var(--text-primary);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('quizTheme');
        if (savedTheme) {
            document.body.className = savedTheme;
        }
    }
    
    toggleTheme() {
        const isDark = document.body.classList.contains('dark-mode');
        document.body.className = isDark ? 'light-mode' : 'dark-mode';
        localStorage.setItem('quizTheme', document.body.className);
        
        const icon = document.querySelector('#themeToggle i');
        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    addFadeInAnimation() {
        const elements = document.querySelectorAll('.welcome-content, .quiz-content, .result-content');
        elements.forEach(el => {
            el.classList.add('fade-in-up');
        });
    }
    
    showInstructions() {
        const modal = document.getElementById('instructionModal');
        modal.classList.add('active');
        this.sounds.click();
    }
    
    closeModal() {
        const modal = document.getElementById('instructionModal');
        modal.classList.remove('active');
    }
    
    startQuiz() {
        this.closeModal();
        this.showScreen('quizScreen');
        this.loadQuestion();
        this.startTimer();
        this.sounds.click();
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        
        if (screenId === 'quizScreen') {
            this.updateProgress();
            this.updateNavigationButtons();
        }
    }
    
    loadQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionText = document.getElementById('questionText');
        const optionsContainer = document.querySelector('.options-container');

        optionsContainer.innerHTML = '';

        questionText.textContent = question.question;

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.setAttribute('data-option', index);
            button.innerHTML = `
                <span class="option-text">${option}</span>
                <div class="option-glow"></div>
            `;
            
            button.addEventListener('click', (e) => this.selectOption(e));
            optionsContainer.appendChild(button);
        });
        
        this.addLifelineButtons();
        
        this.updateProgress();
        this.updateNavigationButtons();
    }
    
    addLifelineButtons() {
        const lifelineContainer = document.createElement('div');
        lifelineContainer.className = 'lifeline-container';
        lifelineContainer.innerHTML = `
            <button id="hintBtn" class="lifeline-btn" ${this.hintsUsed >= 3 ? 'disabled' : ''}>
                <i class="fas fa-lightbulb"></i>
                Hint (${3 - this.hintsUsed})
            </button>
            <button id="fiftyBtn" class="lifeline-btn" ${this.lifelinesUsed >= 1 ? 'disabled' : ''}>
                <i class="fas fa-cut"></i>
                50:50
            </button>
            <button id="skipBtn" class="lifeline-btn">
                <i class="fas fa-forward"></i>
                Skip
            </button>
        `;
        
        const quizContent = document.querySelector('.quiz-content');
        const existingLifeline = quizContent.querySelector('.lifeline-container');
        if (existingLifeline) {
            existingLifeline.remove();
        }
        quizContent.appendChild(lifelineContainer);
        
        // Bind lifeline events
        document.getElementById('hintBtn').addEventListener('click', () => this.useHint());
        document.getElementById('fiftyBtn').addEventListener('click', () => this.useFiftyFifty());
        document.getElementById('skipBtn').addEventListener('click', () => this.skipQuestion());
    }
    
    useHint() {
        if (this.hintsUsed >= 3) return;
        
        const question = this.questions[this.currentQuestion];
        this.hintsUsed++;
        this.showNotification(`💡 Hint: ${question.hint}`, 'info');
        this.sounds.click();
        
        // Update hint button
        const hintBtn = document.getElementById('hintBtn');
        hintBtn.textContent = `Hint (${3 - this.hintsUsed})`;
        if (this.hintsUsed >= 3) {
            hintBtn.disabled = true;
        }
    }
    
    useFiftyFifty() {
        if (this.lifelinesUsed >= 1) return;
        
        const question = this.questions[this.currentQuestion];
        const options = document.querySelectorAll('.option-btn');
        const wrongOptions = [];
        
        options.forEach((option, index) => {
            if (index !== question.correct) {
                wrongOptions.push(index);
            }
        });
        
        const toRemove = [];
        while (toRemove.length < 2 && wrongOptions.length > 0) {
            const randomIndex = Math.floor(Math.random() * wrongOptions.length);
            toRemove.push(wrongOptions.splice(randomIndex, 1)[0]);
        }
        
        toRemove.forEach(index => {
            options[index].style.opacity = '0.3';
            options[index].disabled = true;
        });
        
        this.lifelinesUsed++;
        this.showNotification('✂️ 50:50 used! Two wrong options removed.', 'info');
        this.sounds.click();
        
        const fiftyBtn = document.getElementById('fiftyBtn');
        fiftyBtn.disabled = true;
    }
    
    skipQuestion() {
        this.skippedQuestions.push(this.currentQuestion);
        this.showNotification('⏭️ Question skipped!', 'info');
        this.sounds.click();
        this.nextQuestion();
    }
    
    typeText(element, text) {
        element.textContent = ''; 
        this.isTyping = true;
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            } else {
                this.isTyping = false;
            }
        }
        
        typeWriter();
    }
    
    selectOption(event) {
        if (this.isQuizComplete) return;
        
        const selectedIndex = parseInt(event.currentTarget.getAttribute('data-option'));
        const question = this.questions[this.currentQuestion];
        
        // Store answer
        this.answers[this.currentQuestion] = selectedIndex;
        
        // Calculate time bonus
        const timeBonus = Math.max(0, Math.floor(this.timeLeft / 3));
        this.questionTimes[this.currentQuestion] = 30 - this.timeLeft;
        
        // Show feedback
        this.showAnswerFeedback(selectedIndex, timeBonus);
    }
    
    showAnswerFeedback(selectedIndex, timeBonus = 0) {
        const question = this.questions[this.currentQuestion];
        const options = document.querySelectorAll('.option-btn');
        const isCorrect = selectedIndex === question.correct;
        

        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });

        options[question.correct].classList.add('correct');
        if (selectedIndex !== question.correct) {
            options[selectedIndex].classList.add('incorrect');
        }
 
        if (isCorrect) {
            this.sounds.correct();
            this.createParticles(event.clientX, event.clientY, '#10b981');
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
            
            let points = 10;
            points += timeBonus; 
            points += Math.floor(this.streak * 2); 
            
            this.score += points;
            this.addExperience(points);
            
            this.showNotification(`✅ Correct! +${points} points (${timeBonus} time bonus, ${Math.floor(this.streak * 2)} streak bonus)`, 'success');
        } else {
            this.sounds.incorrect();
            this.createParticles(event.clientX, event.clientY, '#ef4444');
            this.streak = 0;
            this.showNotification(`❌ Incorrect! The correct answer was: ${question.options[question.correct]}`, 'error');
        }
        

        setTimeout(() => {
            this.showExplanation(question.explanation);
        }, 1500);
        
        setTimeout(() => {
            if (this.currentQuestion < this.questions.length - 1) {
                this.nextQuestion();
            } else {
                this.showSubmitButton();
            }
        }, 3500);
    }
    
    showExplanation(explanation) {
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation';
        explanationDiv.innerHTML = `
            <div class="explanation-content">
                <i class="fas fa-info-circle"></i>
                <p>${explanation}</p>
            </div>
        `;
        
        const quizContent = document.querySelector('.quiz-content');
        quizContent.appendChild(explanationDiv);
        
        setTimeout(() => {
            explanationDiv.remove();
        }, 2000);
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.loadQuestion();
            this.resetTimer();
            this.sounds.click();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.loadQuestion();
            this.resetTimer();
            this.sounds.click();
        }
    }
    
    showSubmitButton() {
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'inline-flex';
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `${this.currentQuestion + 1}/${this.questions.length}`;
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentQuestion === 0;
        nextBtn.disabled = this.currentQuestion === this.questions.length - 1;
    }
    
    startTimer() {
        this.timeLeft = 30;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            } else if (this.timeLeft <= 5) {
                this.sounds.timer();
            }
        }, 1000);
    }
    
    resetTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.startTimer();
    }
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        timerElement.textContent = this.timeLeft;
        
        if (this.timeLeft <= 5) {
            timerElement.style.color = '#ef4444';
            timerElement.style.animation = 'timerPulse 1s infinite';
        } else {
            timerElement.style.color = '';
            timerElement.style.animation = '';
        }
    }
    
    timeUp() {
        clearInterval(this.timer);
        
        if (this.answers[this.currentQuestion] === undefined) {
            const options = document.querySelectorAll('.option-btn');
            const randomIndex = Math.floor(Math.random() * options.length);
            this.answers[this.currentQuestion] = randomIndex;
            
            const event = { currentTarget: options[randomIndex] };
            this.selectOption(event);
        }
        
        this.sounds.timer();
        this.showNotification('⏰ Time\'s up!', 'warning');
    }
    
    submitQuiz() {
        this.isQuizComplete = true;
        clearInterval(this.timer);
        this.sounds.victory();
        
        const totalTime = this.questionTimes.reduce((sum, time) => sum + time, 0);
        this.saveToLeaderboard(this.score, this.category, totalTime);
        
        this.showResults();
    }
    
    showResults() {
        this.showScreen('resultScreen');
        this.calculateResults();
        this.checkAchievements();
        this.saveUserData();
        this.addExportButton();
    }
    
    addExportButton() {
        const resultActions = document.querySelector('.result-actions');
        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn btn-secondary';
        exportBtn.innerHTML = `
            <i class="fas fa-download"></i>
            Export Results
        `;
        exportBtn.addEventListener('click', () => this.exportResults());
        
 
        const exitBtn = document.getElementById('exitBtn');
        resultActions.insertBefore(exportBtn, exitBtn);
    }
    
    calculateResults() {
        const correctAnswers = this.answers.filter((answer, index) => 
            answer === this.questions[index].correct
        ).length;
        
        const percentage = Math.round((correctAnswers / this.questions.length) * 100);
        const totalTime = this.questionTimes.reduce((sum, time) => sum + time, 0);
        
  
        document.getElementById('scorePercentage').textContent = `${percentage}%`;
        document.getElementById('scoreFraction').textContent = `${correctAnswers}/${this.questions.length}`;
        document.getElementById('correctCount').textContent = correctAnswers;
        document.getElementById('incorrectCount').textContent = this.questions.length - correctAnswers;
        
 
        this.animateScoreCircle(percentage);
        
  
        this.showDetailedStats(correctAnswers, totalTime);
    }
    
    showDetailedStats(correctAnswers, totalTime) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'detailed-stats';
        statsContainer.innerHTML = `
            <div class="stat-grid">
                <div class="stat-card">
                    <i class="fas fa-fire"></i>
                    <h3>Max Streak</h3>
                    <p>${this.maxStreak}</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-clock"></i>
                    <h3>Total Time</h3>
                    <p>${Math.round(totalTime)}s</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-lightbulb"></i>
                    <h3>Hints Used</h3>
                    <p>${this.hintsUsed}/3</p>
                </div>
                <div class="stat-card">
                    <i class="fas fa-forward"></i>
                    <h3>Skipped</h3>
                    <p>${this.skippedQuestions.length}</p>
                </div>
            </div>
        `;
        
        const resultContent = document.querySelector('.result-content');
        resultContent.appendChild(statsContainer);
    }
    
    checkAchievements() {
        const newAchievements = [];
        const correctAnswers = this.answers.filter((answer, index) => 
            answer === this.questions[index].correct
        ).length;
        const percentage = Math.round((correctAnswers / this.questions.length) * 100);
        
        if (this.score >= 100) {
            newAchievements.push({ id: 'high_scorer', name: 'High Scorer', icon: '🏆' });
        }
        if (this.maxStreak >= 5) {
            newAchievements.push({ id: 'streak_master', name: 'Streak Master', icon: '🔥' });
        }
        if (this.hintsUsed === 0) {
            newAchievements.push({ id: 'no_hints', name: 'No Hints Needed', icon: '🧠' });
        }
        if (this.timeLeft > 0) {
            newAchievements.push({ id: 'speed_demon', name: 'Speed Demon', icon: '⚡' });
        }
        if (percentage === 100) {
            newAchievements.push({ id: 'perfect_score', name: 'Perfect Score', icon: '💯' });
            this.createConfetti();
        }
        if (this.skippedQuestions.length === 0) {
            newAchievements.push({ id: 'no_skips', name: 'No Skips', icon: '🎯' });
        }
        if (this.lifelinesUsed === 0) {
            newAchievements.push({ id: 'no_lifelines', name: 'Lifeline Free', icon: '🎪' });
        }
        
        newAchievements.forEach(achievement => {
            if (!this.achievements.find(a => a.id === achievement.id)) {
                this.achievements.push(achievement);
                this.showNotification(`${achievement.icon} Achievement Unlocked: ${achievement.name}!`, 'success');
            }
        });
    }
    
    animateScoreCircle(percentage) {
        const circle = document.getElementById('scoreProgress');
        const circumference = 2 * Math.PI * 54;
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;
        
        setTimeout(() => {
            const offset = circumference - (percentage / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }, 100);
    }
    
    retryQuiz() {
        this.resetQuiz();
        this.showScreen('welcomeScreen');
        this.sounds.click();
    }
    
    exitQuiz() {
        this.resetQuiz();
        this.showScreen('welcomeScreen');
        this.sounds.click();
    }
    
    resetQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
        this.streak = 0;
        this.maxStreak = 0;
        this.hintsUsed = 0;
        this.lifelinesUsed = 0;
        this.skippedQuestions = [];
        this.questionTimes = [];
        this.isQuizComplete = false;
        
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Reset buttons
        document.getElementById('nextBtn').style.display = 'inline-flex';
        document.getElementById('submitBtn').style.display = 'none';
    }
    
    handleKeyboard(event) {
        if (event.key >= '1' && event.key <= '4') {
            const optionIndex = parseInt(event.key) - 1;
            const options = document.querySelectorAll('.option-btn');
            if (options[optionIndex] && !this.isQuizComplete) {
                options[optionIndex].click();
            }
        } else if (event.key === 'ArrowLeft' && this.currentQuestion > 0) {
            this.previousQuestion();
        } else if (event.key === 'ArrowRight' && this.currentQuestion < this.questions.length - 1) {
            this.nextQuestion();
        } else if (event.key === 'Enter' && this.currentQuestion === this.questions.length - 1) {
            this.submitQuiz();
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('soundToggle');
        const icon = soundBtn.querySelector('i');
        
        if (this.soundEnabled) {
            icon.className = 'fas fa-volume-up';
            soundBtn.classList.remove('muted');
            this.showNotification('🔊 Sound enabled', 'info');
        } else {
            icon.className = 'fas fa-volume-mute';
            soundBtn.classList.add('muted');
            this.showNotification('🔇 Sound disabled', 'info');
        }
        
        this.saveUserData();
    }

    selectCategory(event) {
        const category = event.currentTarget.getAttribute('data-category');

        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.currentTarget.classList.add('active');

        this.category = category;
        this.questions = this.quizData[category] || this.quizData.general;
        
        this.showNotification(`📚 Category changed to ${category.charAt(0).toUpperCase() + category.slice(1)}`, 'info');
        this.sounds.click();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn, .option-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes particleExplosion {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(1) rotate(360deg);
            opacity: 0;
        }
    }
    
    .lifeline-container {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        justify-content: center;
    }
    
    .lifeline-btn {
        background: var(--bg-glass);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 8px 12px;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        backdrop-filter: blur(10px);
    }
    
    .lifeline-btn:hover:not(:disabled) {
        background: var(--bg-glass-hover);
        transform: translateY(-2px);
    }
    
    .lifeline-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .explanation {
        margin-top: 20px;
        padding: 15px;
        background: var(--bg-glass);
        border-radius: 10px;
        border: 1px solid var(--border-color);
        backdrop-filter: blur(10px);
        animation: fadeInUp 0.5s ease;
    }
    
    .explanation-content {
        display: flex;
        align-items: flex-start;
        gap: 10px;
    }
    
    .explanation-content i {
        color: var(--accent-color);
        margin-top: 2px;
    }
    
    .detailed-stats {
        margin-top: 30px;
    }
    
    .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
        margin-top: 20px;
    }
    
    .stat-card {
        background: var(--bg-glass);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 15px;
        text-align: center;
        backdrop-filter: blur(10px);
        transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
        transform: translateY(-5px);
    }
    
    .stat-card i {
        font-size: 24px;
        color: var(--accent-color);
        margin-bottom: 8px;
    }
    
    .stat-card h3 {
        font-size: 14px;
        color: var(--text-secondary);
        margin-bottom: 5px;
    }
    
    .stat-card p {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .notification {
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
    
    .notification.success {
        border-left: 4px solid var(--success-color);
    }
    
    .notification.error {
        border-left: 4px solid var(--error-color);
    }
    
    .notification.warning {
        border-left: 4px solid var(--warning-color);
    }
    
    .notification.info {
        border-left: 4px solid var(--accent-color);
    }
`;
document.head.appendChild(style);
