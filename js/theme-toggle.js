/**
 * Theme Toggle Modal Manager
 * Handles the theme selector modal functionality
 */

const ThemeToggleModal = {
    // DOM elements
    modal: null,
    toggleBtn: null,
    optionsPanel: null,
    themeOptions: null,

    // Icons
    sunIcon: null,
    moonIcon: null,
    autoIcon: null,

    // State
    isOpen: false,
    currentTheme: 'theme-auto',

    /**
     * Initialize the theme toggle modal
     */
    init() {
        this.bindElements();
        this.bindEvents();
        this.detectCurrentTheme();
        this.updateUI();
        this.loadSavedTheme();
    },

    /**
     * Bind DOM elements
     */
    bindElements() {
        this.modal = document.getElementById('theme-toggle-modal');
        this.toggleBtn = document.getElementById('theme-toggle-btn');
        this.optionsPanel = document.getElementById('theme-options-panel');
        this.themeOptions = document.querySelectorAll('.theme-option');

        // Icons
        this.sunIcon = this.toggleBtn.querySelector('.sun-icon');
        this.moonIcon = this.toggleBtn.querySelector('.moon-icon');
        this.autoIcon = this.toggleBtn.querySelector('.auto-icon');
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Toggle button click
        this.toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePanel();
        });

        // Theme option clicks
        this.themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
                this.closePanel();
            });
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.modal.contains(e.target)) {
                this.closePanel();
            }
        });

        // Close panel on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closePanel();
            }
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (this.currentTheme === 'theme-auto') {
                    this.updateUI();
                }
            });
        }
    },

    /**
     * Detect current theme from HTML element
     */
    detectCurrentTheme() {
        const html = document.documentElement;
        const classList = html.classList;

        if (classList.contains('theme-dark')) {
            this.currentTheme = 'theme-dark';
        } else if (classList.contains('theme-light')) {
            this.currentTheme = 'theme-light';
        } else {
            this.currentTheme = 'theme-auto';
        }
    },

    /**
     * Load saved theme from localStorage
     */
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('littlelink-theme');
        if (savedTheme && ['theme-light', 'theme-dark', 'theme-auto'].includes(savedTheme)) {
            this.setTheme(savedTheme);
        }
    },

    /**
     * Set theme
     * @param {string} theme - Theme class name
     */
    setTheme(theme) {
        const html = document.documentElement;

        // Remove all theme classes
        html.classList.remove('theme-light', 'theme-dark', 'theme-auto');

        // Add new theme class
        html.classList.add(theme);

        // Update current theme
        this.currentTheme = theme;

        // Save to localStorage
        localStorage.setItem('littlelink-theme', theme);

        // Update UI
        this.updateUI();
    },

    /**
     * Toggle the options panel
     */
    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    },

    /**
     * Open the options panel
     */
    openPanel() {
        this.optionsPanel.classList.add('active');
        this.isOpen = true;

        // Focus first option for accessibility
        const firstOption = this.optionsPanel.querySelector('.theme-option');
        if (firstOption) {
            firstOption.focus();
        }
    },

    /**
     * Close the options panel
     */
    closePanel() {
        this.optionsPanel.classList.remove('active');
        this.isOpen = false;
    },

    /**
     * Update UI based on current theme
     */
    updateUI() {
        // Update button icon
        this.updateButtonIcon();

        // Update active theme option
        this.updateActiveOption();
    },

    /**
     * Update the button icon based on current theme
     */
    updateButtonIcon() {
        // Remove active class from all icons
        this.sunIcon.classList.remove('active');
        this.moonIcon.classList.remove('active');
        this.autoIcon.classList.remove('active');

        // Determine which icon to show
        let activeIcon;

        if (this.currentTheme === 'theme-light') {
            activeIcon = this.sunIcon;
        } else if (this.currentTheme === 'theme-dark') {
            activeIcon = this.moonIcon;
        } else if (this.currentTheme === 'theme-auto') {
            // For auto theme, show icon based on system preference
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            activeIcon = prefersDark ? this.moonIcon : this.sunIcon;
        }

        // Show active icon
        if (activeIcon) {
            activeIcon.classList.add('active');
        }
    },

    /**
     * Update the active theme option in the panel
     */
    updateActiveOption() {
        this.themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === this.currentTheme) {
                option.classList.add('active');
            }
        });
    },

    /**
     * Get current effective theme (resolves auto theme to actual theme)
     */
    getEffectiveTheme() {
        if (this.currentTheme === 'theme-auto') {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'theme-dark' : 'theme-light';
        }
        return this.currentTheme;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ThemeToggleModal.init();
});

// Export for potential external use
window.ThemeToggleModal = ThemeToggleModal;
