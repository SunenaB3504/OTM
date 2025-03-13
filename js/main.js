/**
 * Math Fun - Main JavaScript File
 * Contains functionality for navigation, settings, and basic interactivity
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle functionality
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const expanded = navMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', expanded);
        });
    }
    
    // Settings functionality
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        // Load saved settings
        loadSettings();
        
        // Save settings on form submit
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSettings();
            alert('Settings saved successfully!');
        });
    }
    
    // Apply any saved accessibility settings immediately
    applyAccessibilitySettings();
    
    // Set up image fallbacks
    setupImageFallbacks();
    
    // Ensure consistent image sizes
    normalizeImageSizes();
});

/**
 * Save user settings to localStorage
 */
function saveSettings() {
    const fontSize = document.getElementById('font-size')?.value || 'normal';
    const theme = document.getElementById('theme')?.value || 'default';
    const difficulty = document.getElementById('difficulty')?.value || 'beginner';
    const audioEnabled = document.getElementById('audio')?.checked || false;
    const animationsEnabled = document.getElementById('animations')?.checked || false;
    
    const settings = {
        fontSize,
        theme,
        difficulty,
        audioEnabled,
        animationsEnabled,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('mathFunSettings', JSON.stringify(settings));
    applyAccessibilitySettings();
}

/**
 * Load user settings from localStorage
 */
function loadSettings() {
    const savedSettings = localStorage.getItem('mathFunSettings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply saved values to form fields
        if (document.getElementById('font-size')) {
            document.getElementById('font-size').value = settings.fontSize || 'normal';
        }
        if (document.getElementById('theme')) {
            document.getElementById('theme').value = settings.theme || 'default';
        }
        if (document.getElementById('difficulty')) {
            document.getElementById('difficulty').value = settings.difficulty || 'beginner';
        }
        if (document.getElementById('audio')) {
            document.getElementById('audio').checked = settings.audioEnabled || false;
        }
        if (document.getElementById('animations')) {
            document.getElementById('animations').checked = settings.animationsEnabled || false;
        }
    }
}

/**
 * Apply accessibility settings to the page
 */
function applyAccessibilitySettings() {
    const savedSettings = localStorage.getItem('mathFunSettings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply font size
        document.body.classList.remove('large-font', 'x-large-font');
        if (settings.fontSize === 'large') {
            document.body.classList.add('large-font');
        } else if (settings.fontSize === 'x-large') {
            document.body.classList.add('x-large-font');
        }
        
        // Apply theme
        document.body.classList.remove('high-contrast', 'reduced-colors');
        if (settings.theme === 'high-contrast') {
            document.body.classList.add('high-contrast');
        } else if (settings.theme === 'reduced-colors') {
            document.body.classList.add('reduced-colors');
        }
        
        // Apply animation settings if needed
        if (!settings.animationsEnabled) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
    }
}

/**
 * Handle fallbacks for images that fail to load from online resources
 * by using local assets directory instead
 */
function setupImageFallbacks() {
    const images = document.querySelectorAll('img[data-fallback]');
    
    images.forEach(img => {
        // Set error handler before setting src to ensure it catches errors
        img.onerror = function() {
            console.log(`Image failed to load: ${this.src}, trying fallback: ${this.getAttribute('data-fallback')}`);
            this.src = this.getAttribute('data-fallback');
            this.onerror = null; // Prevent potential infinite loop
        };
        
        // If image is already loaded or cached, the onerror won't fire
        // So check if complete and naturalWidth is 0 (failed)
        if (img.complete && img.naturalWidth === 0) {
            img.src = img.getAttribute('data-fallback');
        }
    });
}

/**
 * Normalize image sizes to ensure consistency
 * Particularly important for PNG images from different sources
 */
function normalizeImageSizes() {
    // Apply size constraints to various image types
    const lessonImages = document.querySelectorAll('.lesson-image');
    const gameImages = document.querySelectorAll('.game-image');
    
    // Set fixed dimensions for better layout stability
    lessonImages.forEach(img => {
        img.addEventListener('load', function() {
            // Keep aspect ratio but limit dimensions
            if (this.naturalWidth > this.naturalHeight) {
                // Landscape orientation
                this.style.width = '100%';
                this.style.height = 'auto';
            } else {
                // Portrait or square orientation
                this.style.maxHeight = '200px';
                this.style.width = 'auto';
            }
        });
    });
    
    gameImages.forEach(img => {
        img.addEventListener('load', function() {
            // Same treatment for game images
            if (this.naturalWidth > this.naturalHeight) {
                this.style.width = '100%';
                this.style.height = 'auto';
            } else {
                this.style.maxHeight = '200px';
                this.style.width = 'auto';
            }
        });
    });
    
    // You can add more specific handling for other image types here
}

/**
 * Add interactive elements for lesson and game content
 * Future expansion: Replace with actual game implementations
 */
function initInteractiveContent() {
    // Example of how to add dynamic content
    const gameButtons = document.querySelectorAll('.game-card .btn');
    
    gameButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const gameName = this.closest('.game-card').querySelector('h3').textContent;
            alert(`${gameName} will launch here. Coming soon!`);
        });
    });
}

// Call this function after DOM is loaded
document.addEventListener('DOMContentLoaded', initInteractiveContent);
