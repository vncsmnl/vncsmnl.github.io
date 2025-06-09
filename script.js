/**
 * LittleLink - Interactive Page Management
 * Manages page title changes and theme-based image updates
 */

/**
 * Constants and Configuration
 */
const CONFIG = {
    MESSAGES: {
        BLUR_TITLE: 'Ooops, ainda estou aqui!'
    },
    IMAGES: {
        signature: {
            dark: './images/signature.gif',
            light: './images/signature_alt.gif'
        },
        rateIcon: {
            dark: './images/rate1_w.png',
            light: './images/rate1.png'
        }
    },
    SELECTORS: {
        SIGNATURE: 'signature',
        RATE_ICON: 'rate-icon'
    },
    THEMES: {
        DARK: 'theme-dark',
        AUTO: 'theme-auto'
    }
};

/**
 * Utility Functions
 */
const Utils = {
    /**
     * Checks if the current theme is dark mode
     * @returns {boolean} True if dark mode is active
     */
    isDarkMode() {
        const html = document.documentElement;
        const themeClass = html.className;

        return themeClass.includes(CONFIG.THEMES.DARK) ||
            (themeClass.includes(CONFIG.THEMES.AUTO) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);
    },

    /**
     * Updates image source based on theme
     * @param {HTMLImageElement} element - Image element to update
     * @param {Object} imagePaths - Object containing dark and light image paths
     */
    updateImageSrc(element, imagePaths) {
        if (!element) return;

        const isDark = this.isDarkMode();
        element.src = isDark ? imagePaths.dark : imagePaths.light;
    }
};

/**
 * Page Title Manager
 * Handles dynamic title changes when user switches tabs
 */
const PageTitleManager = {
    originalTitle: document.title,

    /**
     * Initialize page title management
     */
    init() {
        this.bindEvents();
    },

    /**
     * Bind window blur/focus events
     */
    bindEvents() {
        window.addEventListener('blur', () => this.handleBlur());
        window.addEventListener('focus', () => this.handleFocus());
    },

    /**
     * Handle window blur event
     */
    handleBlur() {
        document.title = CONFIG.MESSAGES.BLUR_TITLE;
    },

    /**
     * Handle window focus event
     */
    handleFocus() {
        document.title = this.originalTitle;
    }
};

/**
 * Theme Manager
 * Manages theme-based image updates and theme change detection
 */
const ThemeManager = {
    observer: null,

    /**
     * Initialize theme management
     */
    init() {
        this.updateImagesForTheme();
        this.bindEvents();
        this.setupThemeObserver();
    },

    /**
     * Update all theme-dependent images
     */
    updateImagesForTheme() {
        const signature = document.getElementById(CONFIG.SELECTORS.SIGNATURE);
        const rateIcon = document.getElementById(CONFIG.SELECTORS.RATE_ICON);

        Utils.updateImageSrc(signature, CONFIG.IMAGES.signature);
        Utils.updateImageSrc(rateIcon, CONFIG.IMAGES.rateIcon);
    },

    /**
     * Bind theme-related events
     */
    bindEvents() {
        // Listen for system color scheme changes (for theme-auto)
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => this.updateImagesForTheme());
        }
    },

    /**
     * Setup mutation observer for theme class changes
     */
    setupThemeObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this.updateImagesForTheme();
                }
            });
        });

        this.observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    },

    /**
     * Cleanup observer (useful for SPA or dynamic content)
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
};

/**
 * Application Main Controller
 */
const App = {
    /**
     * Initialize the application
     */
    init() {
        PageTitleManager.init();
        ThemeManager.init();
    }
};

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});