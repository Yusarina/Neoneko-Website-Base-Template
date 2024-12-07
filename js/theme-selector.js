document.addEventListener('DOMContentLoaded', () => {
    const themeSelects = document.querySelectorAll('#theme-select, .mobile-theme-selector select');
    const themeStylesheet = document.createElement('link');
    themeStylesheet.rel = 'stylesheet';
    document.head.appendChild(themeStylesheet);

    const THEME_VERSION = '2.0';
    const savedThemeVersion = localStorage.getItem('themeVersion');
    
    if (!savedThemeVersion || savedThemeVersion !== THEME_VERSION) {
        localStorage.setItem('selectedTheme', 'main-site');
        localStorage.setItem('themeVersion', THEME_VERSION);
    }

    const themeHint = document.querySelector('.theme-hint');
    if (!localStorage.getItem('themeHintSeen')) {
        themeHint.classList.add('flash-animation');
        
        setTimeout(() => {
            themeHint.classList.remove('flash-animation');
        }, 10000);
        
        setTimeout(() => {
            themeHint.style.setProperty('--hint-opacity', '0');
        }, 30000);
        
        localStorage.setItem('themeHintSeen', 'true');
    } else {
        themeHint.style.setProperty('--hint-opacity', '0');
    }
    
    function addRandomPumpkins() {
        const pumpkinContainer = document.createElement('div');
        pumpkinContainer.id = 'halloween-pumpkins';
        pumpkinContainer.style.position = 'absolute';
        pumpkinContainer.style.width = '100%';
        pumpkinContainer.style.height = '100%';
        pumpkinContainer.style.pointerEvents = 'none';
        pumpkinContainer.style.zIndex = '-1';
        document.body.appendChild(pumpkinContainer);

        const numPumpkins = 25;
        const pumpkinSize = 40;
        const minDistance = 70;
        const positions = [];
        
        function getDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }
        
        function isValidPosition(x, y) {
            for (const pos of positions) {
                if (getDistance(x, y, pos.x, pos.y) < minDistance) {
                    return false;
                }
            }
            return true;
        }
        
        for (let i = 0; i < numPumpkins; i++) {
            let x, y;
            let attempts = 0;
            const maxAttempts = 50;
            
            do {
                x = Math.random() * (window.innerWidth - pumpkinSize);
                y = Math.random() * (window.innerHeight - pumpkinSize);
                attempts++;
            } while (!isValidPosition(x, y) && attempts < maxAttempts);
            
            positions.push({ x, y });
            
            const pumpkin = document.createElement('img');
            pumpkin.src = './images/pumpkin.png';
            pumpkin.className = 'random-pumpkin';
            pumpkin.style.position = 'absolute';
            pumpkin.style.left = `${x}px`;
            pumpkin.style.top = `${y}px`;
            pumpkin.style.width = `${pumpkinSize}px`;
            pumpkin.style.opacity = '0.5';
            
            const duration = 3 + Math.random() * 2;
            const delay = Math.random() * 2;
            pumpkin.style.animation = `floatPumpkin ${duration}s ease-in-out ${delay}s infinite`;
            
            pumpkinContainer.appendChild(pumpkin);
        }
    }

    function addChristmasDecorations() {
        const decorContainer = document.createElement('div');
        decorContainer.id = 'christmas-decorations';
        decorContainer.style.position = 'absolute';
        decorContainer.style.width = '100%';
        decorContainer.style.height = '100%';
        decorContainer.style.pointerEvents = 'none';
        decorContainer.style.zIndex = '-1';
        document.body.appendChild(decorContainer);
    
        // Create more snowflakes with varied sizes and speeds
        for (let i = 0; i < 100; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            
            // Randomize starting positions across entire width
            snowflake.style.left = `${Math.random() * 100}vw`;
            
            // Vary the sizes
            const size = Math.random() * 0.5 + 0.5; // 0.5 to 1em
            snowflake.style.fontSize = `${size}em`;
            
            // Vary the speeds and delays
            const duration = Math.random() * 8 + 4; // 4-12 seconds
            const delay = Math.random() * -20; // Negative delay for continuous effect
            
            snowflake.style.animationDuration = `${duration}s`;
            snowflake.style.animationDelay = `${delay}s`;
            
            // Vary opacity
            snowflake.style.opacity = Math.random() * 0.7 + 0.3;
            
            // Add animation loop
            snowflake.addEventListener('animationend', () => {
                snowflake.style.left = `${Math.random() * 100}vw`;
                snowflake.style.animationDelay = '0s';
            });
            
            decorContainer.appendChild(snowflake);
        }
    }

    function removeRandomPumpkins() {
        const pumpkinContainer = document.getElementById('halloween-pumpkins');
        if (pumpkinContainer) {
            pumpkinContainer.remove();
        }
    }

    function removeChristmasDecorations() {
        const decorContainer = document.getElementById('christmas-decorations');
        if (decorContainer) {
            decorContainer.remove();
        }
    }

    window.setTheme = function(theme) {
        if (theme === 'default') {
            themeStylesheet.href = '';
        } else {
            themeStylesheet.href = `./css/themes/${theme}-theme.css`;
        }
        localStorage.setItem('selectedTheme', theme);
        
        // Remove all theme decorations first
        removeRandomPumpkins();
        removeChristmasDecorations();
        
        // Add specific theme decorations
        if (theme === 'halloween') {
            addRandomPumpkins();
        } else if (theme === 'christmas') {
            addChristmasDecorations();
        }
        
        themeSelects.forEach(select => {
            const selectedOption = select.querySelector(`[data-theme="${theme}"]`);
            if (selectedOption) {
                selectedOption.selected = true;
            }
        });
    }

    themeSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            setTheme(e.target.selectedOptions[0].getAttribute('data-theme'));
        });
    });

    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('main-site');
    }
});
