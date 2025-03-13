/**
 * Settings Page Script
 * Handles settings page interactions and previews
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the theme preview
    setupThemePreview();
    
    // Handle the reset to defaults button
    setupResetDefaults();
    
    // Initialize additional accessibility options
    setupAccessibilityOptions();
    
    // Set up auto-save for form changes
    setupAutoSave();
});

/**
 * Set up theme preview functionality
 */
function setupThemePreview() {
    const themeSelector = document.getElementById('theme');
    
    if (themeSelector) {
        // Update preview when theme changes
        themeSelector.addEventListener('change', function() {
            updateThemePreview(this.value);
        });
        
        // Initialize with current selection
        updateThemePreview(themeSelector.value);
    }
}

/**
 * Update theme preview based on selected theme
 * @param {string} theme - The selected theme
 */
function updateThemePreview(theme) {
    // Remove all preview classes
    document.body.classList.remove(
        'dark-mode-preview', 
        'high-contrast-preview', 
        'reduced-colors-preview'
    );
    
    // Add the selected preview class
    if (theme === 'dark-mode') {
        document.body.classList.add('dark-mode-preview');
    } else if (theme === 'high-contrast') {
        document.body.classList.add('high-contrast-preview');
    } else if (theme === 'reduced-colors') {
        document.body.classList.add('reduced-colors-preview');
    }
}

/**
 * Set up reset to defaults functionality
 */
function setupResetDefaults() {
    const resetButton = document.getElementById('reset-default');
    
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to reset all settings to default values?')) {
                // Default settings
                const defaultSettings = {
                    fontSize: 'normal',
                    theme: 'default',
                    difficulty: 'beginner',
                    audioEnabled: true,
                    animationsEnabled: true,
                    autoProgress: true,
                    textToSpeech: false,
                    keyboardShortcuts: false,
                    readingSpeed: 'normal'
                };
                
                // Save default settings to localStorage
                localStorage.setItem('mathFunSettings', JSON.stringify(defaultSettings));
                
                // Update the form
                const form = document.getElementById('settings-form');
                if (form) {
                    form.querySelector('#font-size').value = defaultSettings.fontSize;
                    form.querySelector('#theme').value = defaultSettings.theme;
                    form.querySelector('#difficulty').value = defaultSettings.difficulty;
                    form.querySelector('#audio').checked = defaultSettings.audioEnabled;
                    form.querySelector('#animations').checked = defaultSettings.animationsEnabled;
                    form.querySelector('#auto-progress').checked = defaultSettings.autoProgress;
                    form.querySelector('#text-to-speech').checked = defaultSettings.textToSpeech;
                    form.querySelector('#keyboard-shortcuts').checked = defaultSettings.keyboardShortcuts;
                    form.querySelector('#reading-speed').value = defaultSettings.readingSpeed;
                    
                    // Update preview
                    updateThemePreview(defaultSettings.theme);
                }
                
                alert('Settings have been reset to defaults.');
            }
        });
    }
}

/**
 * Set up accessibility options
 */
function setupAccessibilityOptions() {
    const textToSpeechCheckbox = document.getElementById('text-to-speech');
    const readingSpeedSelect = document.getElementById('reading-speed');
    
    if (textToSpeechCheckbox && readingSpeedSelect) {
        // Toggle reading speed based on text-to-speech option
        textToSpeechCheckbox.addEventListener('change', function() {
            readingSpeedSelect.disabled = !this.checked;
            readingSpeedSelect.parentNode.classList.toggle('disabled', !this.checked);
        });
        
        // Initialize state
        const settings = getSettings();
        textToSpeechCheckbox.checked = settings.textToSpeech || false;
        readingSpeedSelect.value = settings.readingSpeed || 'normal';
        readingSpeedSelect.disabled = !textToSpeechCheckbox.checked;
    }
}

/**
 * Set up auto-save for incremental changes
 */
function setupAutoSave() {
    const form = document.getElementById('settings-form');
    
    if (form) {
        // Save settings when form is submitted
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAllSettings();
            alert('Settings saved successfully!');
        });
    }
}

/**
 * Save all settings from the form
 */
function saveAllSettings() {
    const form = document.getElementById('settings-form');
    
    if (!form) return;
    
    const settings = {
        fontSize: form.querySelector('#font-size').value,
        theme: form.querySelector('#theme').value,
        difficulty: form.querySelector('#difficulty').value,
        audioEnabled: form.querySelector('#audio').checked,
        animationsEnabled: form.querySelector('#animations').checked,
        autoProgress: form.querySelector('#auto-progress').checked,
        textToSpeech: form.querySelector('#text-to-speech').checked,
        keyboardShortcuts: form.querySelector('#keyboard-shortcuts').checked,
        readingSpeed: form.querySelector('#reading-speed').value,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('mathFunSettings', JSON.stringify(settings));
    
    // Apply settings immediately
    applySettings(settings);
}

/**
 * Apply settings to the page
 * @param {Object} settings - Settings to apply
 */
function applySettings(settings) {
    // Apply font size
    document.body.classList.remove('large-font', 'x-large-font');
    if (settings.fontSize === 'large') {
        document.body.classList.add('large-font');
    } else if (settings.fontSize === 'x-large') {
        document.body.classList.add('x-large-font');
    }
    
    // Apply theme
    document.body.classList.remove('high-contrast', 'reduced-colors', 'dark-mode');
    if (settings.theme === 'high-contrast') {
        document.body.classList.add('high-contrast');
    } else if (settings.theme === 'reduced-colors') {
        document.body.classList.add('reduced-colors');
    } else if (settings.theme === 'dark-mode') {
        document.body.classList.add('dark-mode');
    }
    
    // Apply animations setting
    if (!settings.animationsEnabled) {
        document.body.classList.add('no-animations');
    } else {
        document.body.classList.remove('no-animations');
    }
}

/**
 * Get settings from localStorage
 * @returns {Object} Current settings
 */
function getSettings() {
    const defaultSettings = {
        fontSize: 'normal',
        theme: 'default',
        difficulty: 'beginner',
        audioEnabled: true,
        animationsEnabled: true,
        autoProgress: true,
        textToSpeech: false,
        keyboardShortcuts: false,
        readingSpeed: 'normal'
    };
    
    const savedSettings = localStorage.getItem('mathFunSettings');
    if (savedSettings) {
        return {...defaultSettings, ...JSON.parse(savedSettings)};
    }
    
    return defaultSettings;
}
