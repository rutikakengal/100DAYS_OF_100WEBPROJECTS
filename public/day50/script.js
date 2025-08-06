document.addEventListener('DOMContentLoaded', () => {
    const cardGrid = document.getElementById('cardGrid');
    const resetBtn = document.getElementById('resetBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const themeBtn = document.getElementById('themeBtn');
    const cardCount = 24; // 6x4 grid by default
    let currentTheme = 'light';
    let matchedCards = 0;
    
    // Create cards with matching pairs
    function createCards() {
        cardGrid.innerHTML = '';
        matchedCards = 0;
        
        // Create pairs of illusions
        const illusionPairs = [];
        for (let i = 0; i < cardCount/2; i++) {
            const illusion = generateAdvancedIllusion();
            illusionPairs.push(illusion, illusion);
        }
        
        // Shuffle the pairs
        shuffleArray(illusionPairs);
        
        // Create cards
        for (let i = 0; i < cardCount; i++) {
            const card = document.createElement('div');
            card.className = 'card floating';
            card.dataset.patternId = i;
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-face card-front';
            
            const cardBack = document.createElement('div');
            cardBack.className = 'card-face card-back';
            
            const illusionPattern = document.createElement('div');
            illusionPattern.className = 'illusion-pattern';
            illusionPattern.innerHTML = illusionPairs[i];
            
            cardBack.appendChild(illusionPattern);
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            card.addEventListener('click', flipCard);
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('flipped')) {
                    card.classList.add('tilt');
                }
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('tilt');
            });
            
            cardGrid.appendChild(card);
        }
    }
    
    // Generate advanced optical illusion SVG with more variations
    function generateAdvancedIllusion() {
        const illusions = [
            // Hypnotic Spiral
            `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <path id="spiral" d="M100 100 Q 150 50 100 0 Q 50 50 100 100 Q 150 150 100 200 Q 50 150 100 100" />
                    <path id="spiral2" d="M100 100 Q 130 70 100 40 Q 70 70 100 100 Q 130 130 100 160 Q 70 130 100 100" />
                </defs>
                <use href="#spiral" fill="none" stroke-width="2" stroke-dasharray="3,3">
                    <animate attributeName="stroke" values="#ff00ff;#00ffff;#ffff00;#ff00ff" dur="10s" repeatCount="indefinite"/>
                </use>
                <use href="#spiral2" fill="none" stroke-width="2" stroke-dasharray="2,2" transform="rotate(180 100 100)">
                    <animate attributeName="stroke" values="#ffff00;#ff00ff;#00ffff;#ffff00" dur="10s" repeatCount="indefinite"/>
                </use>
                <circle cx="100" cy="100" r="5" fill="#ffffff">
                    <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite"/>
                </circle>
            </svg>`,
            
            // Animated Checkerboard
            `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="animatedChecker" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="20" height="20">
                            <animate attributeName="fill" values="black;red;blue;black" dur="5s" repeatCount="indefinite"/>
                        </rect>
                        <rect x="20" y="0" width="20" height="20" fill="white"/>
                        <rect x="0" y="20" width="20" height="20" fill="white"/>
                        <rect x="20" y="20" width="20" height="20">
                            <animate attributeName="fill" values="white;black;white" dur="3s" repeatCount="indefinite"/>
                        </rect>
                    </pattern>
                </defs>
                <rect x="0" y="0" width="200" height="200" fill="url(#animatedChecker)"/>
                <circle cx="100" cy="100" r="60" fill="none" stroke="black" stroke-width="2">
                    <animate attributeName="stroke-width" values="2;5;2" dur="4s" repeatCount="indefinite"/>
                </circle>
            </svg>`,
            
            // Moving Lines
            `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="200" height="200" fill="#111111"/>
                ${Array.from({length: 20}, (_, i) => 
                    `<line x1="${i * 10}" y1="0" x2="${i * 10}" y2="200" 
                          stroke="hsl(${i * 18}, 100%, 50%)" stroke-width="2">
                        <animate attributeName="y1" values="0;200;0" dur="${3 + i * 0.2}s" repeatCount="indefinite"/>
                    </line>`).join('')}
                <circle cx="100" cy="100" r="40" fill="none" stroke="white" stroke-width="3">
                    <animate attributeName="r" values="40;60;40" dur="5s" repeatCount="indefinite"/>
                </circle>
            </svg>`,
            
            // Morphing Shapes
            `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="200" height="200" fill="#222222"/>
                <rect x="50" y="50" width="100" height="100" fill="#4a00e0">
                    <animate attributeName="x" values="50;30;50;70;50" dur="8s" repeatCount="indefinite"/>
                    <animate attributeName="y" values="50;70;50;30;50" dur="6s" repeatCount="indefinite"/>
                    <animate attributeName="width" values="100;140;100;60;100" dur="7s" repeatCount="indefinite"/>
                    <animate attributeName="height" values="100;60;100;140;100" dur="9s" repeatCount="indefinite"/>
                    <animate attributeName="fill" values="#4a00e0;#8e2de2;#f80759;#4a00e0" dur="10s" repeatCount="indefinite"/>
                </rect>
                <circle cx="100" cy="100" r="30" fill="#00b09b">
                    <animate attributeName="r" values="30;50;30;10;30" dur="6s" repeatCount="indefinite"/>
                    <animate attributeName="cx" values="100;120;100;80;100" dur="7s" repeatCount="indefinite"/>
                    <animate attributeName="cy" values="100;80;100;120;100" dur="5s" repeatCount="indefinite"/>
                </circle>
            </svg>`,
            
            // Rotating Vortex
            `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <path id="vortex" d="M100 100 L150 100 A50 50 0 0 0 100 50 Z" />
                </defs>
                ${Array.from({length: 8}, (_, i) => 
                    `<use href="#vortex" fill="hsl(${i * 45}, 100%, 50%)" opacity="0.8" transform="rotate(${i * 45} 100 100)">
                        <animateTransform attributeName="transform" type="rotate" from="${i * 45} 100 100" to="${i * 45 + 360} 100 100" dur="20s" repeatCount="indefinite"/>
                    </use>`).join('')}
                <circle cx="100" cy="100" r="20" fill="#ffffff">
                    <animate attributeName="r" values="20;30;20" dur="3s" repeatCount="indefinite"/>
                </circle>
            </svg>`,
            
            // Pulsing Grid
            `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="200" height="200" fill="#000000"/>
                ${Array.from({length: 10}, (_, i) => 
                    `<line x1="${i * 20}" y1="0" x2="${i * 20}" y2="200" 
                          stroke="rgba(255,255,255,0.5)" stroke-width="1">
                        <animate attributeName="stroke-width" values="1;3;1" dur="${2 + i * 0.3}s" repeatCount="indefinite"/>
                    </line>
                    <line x1="0" y1="${i * 20}" x2="200" y2="${i * 20}" 
                          stroke="rgba(255,255,255,0.5)" stroke-width="1">
                        <animate attributeName="stroke-width" values="1;3;1" dur="${3 - i * 0.2}s" repeatCount="indefinite"/>
                    </line>`).join('')}
                <circle cx="100" cy="100" r="40" fill="none" stroke="#ff00ff" stroke-width="2">
                    <animate attributeName="stroke-width" values="2;5;2" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="stroke" values="#ff00ff;#00ffff;#ffff00;#ff00ff" dur="8s" repeatCount="indefinite"/>
                </circle>
            </svg>`
        ];
        
        // Get random illusion
        const illusion = illusions[Math.floor(Math.random() * illusions.length)];
        
        // Apply random color theme
        const colorThemes = [
            { bg: '#111111', primary: '#ff00ff', secondary: '#00ffff' },
            { bg: '#222222', primary: '#ff9900', secondary: '#9900ff' },
            { bg: '#000033', primary: '#00ff99', secondary: '#ff0066' },
            { bg: '#330000', primary: '#00ccff', secondary: '#ffcc00' }
        ];
        
        const theme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
        return illusion.replace(/#111111/g, theme.bg)
                      .replace(/#ff00ff/g, theme.primary)
                      .replace(/#00ffff/g, theme.secondary);
    }
    
    // Flip card with animation
    function flipCard() {
        if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        this.classList.remove('tilt', 'floating');
        
        // Check for matches
        const flippedCards = document.querySelectorAll('.card.flipped:not(.matched)');
        if (flippedCards.length === 2) {
            const card1 = flippedCards[0].querySelector('.illusion-pattern').innerHTML;
            const card2 = flippedCards[1].querySelector('.illusion-pattern').innerHTML;
            
            if (card1 === card2) {
                // Match found
                flippedCards.forEach(card => {
                    card.classList.add('matched', 'glow');
                    card.classList.remove('flipped');
                    card.removeEventListener('click', flipCard);
                });
                matchedCards += 2;
                
                // Check if all cards are matched
                if (matchedCards === cardCount) {
                    setTimeout(() => {
                        alert('Congratulations! You matched all cards!');
                        createCards();
                    }, 1000);
                }
            } else {
                // No match
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                        card.classList.add('floating');
                    });
                }, 1000);
            }
        }
    }
    
    // Reset all cards
    function resetCards() {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('flipped', 'matched', 'glow');
            card.classList.add('floating');
            card.addEventListener('click', flipCard);
        });
        matchedCards = 0;
    }
    
    // Shuffle cards
    function shuffleCards() {
        const cards = Array.from(document.querySelectorAll('.card'));
        shuffleArray(cards);
        cardGrid.innerHTML = '';
        cards.forEach(card => {
            cardGrid.appendChild(card);
        });
    }
    
    // Change theme
    function changeTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
    }
    
    // Utility function to shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Event listeners
    resetBtn.addEventListener('click', resetCards);
    shuffleBtn.addEventListener('click', shuffleCards);
    themeBtn.addEventListener('click', changeTheme);
    
    // Initialize the game
    createCards();
    
    // Add floating animation to title
    const title = document.querySelector('h1');
    title.classList.add('floating');
    title.style.animationDuration = '8s';
});