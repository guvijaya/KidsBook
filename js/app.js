/**
 * Kids Essays Website - Main Application
 * Handles navigation, content loading, and user interactions with pagination
 */

class KidsEssaysApp {
    constructor() {
        this.contentService = new GitHubContentService();
        this.currentLanguage = 'ta';
        this.currentEssays = [];
        this.currentEssayIndex = 0;
        this.currentPages = [];
        this.currentPageIndex = 0;
        this.wordsPerPage = 200; // Default words per page
        
        // Initialize the application
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.bindEvents();
        this.showPage('book-cover');
        
        // Show configuration notice if needed
        console.log('Kids Essays Website initialized! Using GitHub Pages content hosting.');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Language selection
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectLanguage(e.target.closest('.language-btn').dataset.lang);
            });
        });

        // Navigation buttons
        document.getElementById('open-book').addEventListener('click', () => {
            this.openBook();
        });

        document.getElementById('back-to-cover').addEventListener('click', () => {
            this.showPage('book-cover');
        });

        document.getElementById('back-to-contents').addEventListener('click', () => {
            this.showPage('table-of-contents');
        });

        // Essay navigation
        document.getElementById('prev-essay').addEventListener('click', () => {
            this.navigateEssay(-1);
        });

        document.getElementById('next-essay').addEventListener('click', () => {
            this.navigateEssay(1);
        });

        // Page navigation (will be added dynamically)
        this.bindPageNavigationEvents();

        // Error retry
        document.getElementById('retry-btn').addEventListener('click', () => {
            this.hideError();
            this.loadEssaysForLanguage(this.currentLanguage);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Window resize handler for responsive pagination
        window.addEventListener('resize', () => {
            if (this.currentPages.length > 0) {
                this.debounce(() => {
                    this.repaginate();
                }, 300)();
            }
        });
    }

    /**
     * Bind page navigation events
     */
    bindPageNavigationEvents() {
        // These will be bound to dynamically created elements
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('page-nav-btn')) {
                const direction = e.target.dataset.direction;
                if (direction === 'prev') {
                    this.navigatePage(-1);
                } else if (direction === 'next') {
                    this.navigatePage(1);
                }
            }
        });
    }

    /**
     * Debounce function for resize events
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardNavigation(e) {
        const currentPage = document.querySelector('.book-page.active').id;
        
        switch(e.key) {
            case 'ArrowLeft':
                if (currentPage === 'essay-reader') {
                    this.navigatePage(-1);
                }
                break;
            case 'ArrowRight':
                if (currentPage === 'essay-reader') {
                    this.navigatePage(1);
                }
                break;
            case 'ArrowUp':
                if (currentPage === 'essay-reader') {
                    this.navigateEssay(-1);
                }
                break;
            case 'ArrowDown':
                if (currentPage === 'essay-reader') {
                    this.navigateEssay(1);
                }
                break;
            case 'Escape':
                if (currentPage === 'essay-reader') {
                    this.showPage('table-of-contents');
                } else if (currentPage === 'table-of-contents') {
                    this.showPage('book-cover');
                }
                break;
        }
    }

    /**
     * Select a language
     * @param {string} language - Language code
     */
    selectLanguage(language) {
        this.currentLanguage = language;
        
        // Update UI
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-lang="${language}"]`).classList.add('selected');
        
        // Update language display
        const languageConfig = this.contentService.getEssaysForLanguage(language);
        document.getElementById('current-language').textContent = languageConfig.name;
        
        console.log(`Selected language: ${languageConfig.name}`);
    }

    /**
     * Open the book and load essays
     */
    async openBook() {
        if (!this.currentLanguage) {
            this.showError('Please select a language first!');
            return;
        }

        this.showLoading();
        
        try {
            await this.loadEssaysForLanguage(this.currentLanguage);
            this.hideLoading();
            this.showPage('table-of-contents');
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to load essays. Please try again.');
            console.error('Error loading essays:', error);
        }
    }

    /**
     * Load essays for the selected language
     * @param {string} language - Language code
     */
    async loadEssaysForLanguage(language) {
        const languageConfig = this.contentService.getEssaysForLanguage(language);
        this.currentEssays = languageConfig.essays;
        
        // Update essay count
        document.getElementById('essay-count').textContent = `${this.currentEssays.length} stories`;
        
        // Clear existing essays
        const essaysList = document.getElementById('essays-list');
        essaysList.innerHTML = '';
        
        // Add essays to the grid
        this.currentEssays.forEach((essay, index) => {
            const essayCard = this.createEssayCard(essay, index);
            essaysList.appendChild(essayCard);
        });
    }

    /**
     * Create an essay card element
     * @param {Object} essay - Essay configuration
     * @param {number} index - Essay index
     * @returns {HTMLElement} Essay card element
     */
    createEssayCard(essay, index) {
        const card = document.createElement('div');
        card.className = 'essay-card';
        card.innerHTML = `
            <div class="essay-icon">${essay.icon}</div>
            <h3>${essay.title}</h3>
            <p class="essay-description">${essay.description}</p>
        `;
        
        card.addEventListener('click', () => {
            this.openEssay(index);
        });
        
        return card;
    }

    /**
     * Open an essay
     * @param {number} index - Essay index
     */
    async openEssay(index) {
        this.currentEssayIndex = index;
        this.currentPageIndex = 0;
        this.showLoading();
        
        try {
            const essay = this.currentEssays[index];
            const content = await this.contentService.fetchMarkdownContent(essay.file);
            
            // Convert markdown to HTML
            const htmlContent = marked.parse(content);
            
            // Update essay title
            document.getElementById('essay-title').textContent = essay.title;
            
            // Split content into pages
            this.currentPages = this.splitContentIntoPages(htmlContent);
            
            // Update navigation buttons
            this.updateNavigationButtons();
            
            // Display first page
            this.displayPage(0);
            
            this.hideLoading();
            this.showPage('essay-reader');
            
        } catch (error) {
            this.hideLoading();
            this.showError('Failed to load the essay. Please try again.');
            console.error('Error loading essay:', error);
        }
    }

    /**
     * Split content into pages based on available viewport height
     * @param {string} htmlContent - HTML content to split
     * @returns {Array} Array of page contents
     */
    splitContentIntoPages(htmlContent) {
        // Get current screen size to determine fixed width
        const screenWidth = window.innerWidth;
        let fixedWidth;
        
        if (screenWidth >= 1400) {
            fixedWidth = '1230px'; // 1300px container - 70px padding
        } else if (screenWidth >= 1200) {
            fixedWidth = '1130px'; // 1200px container - 70px padding
        } else if (screenWidth >= 1024) {
            fixedWidth = '1030px'; // 1100px container - 70px padding
        } else if (screenWidth >= 768) {
            fixedWidth = '780px';  // 850px container - 70px padding
        } else {
            fixedWidth = '90%';    // Mobile responsive
        }
        
        // Create a temporary container to measure content
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.width = fixedWidth;
        tempContainer.style.top = '-9999px';
        tempContainer.className = 'essay-text';
        tempContainer.innerHTML = htmlContent;
        document.body.appendChild(tempContainer);
        
        // Get the available height for content
        const readerContent = document.querySelector('.reader-content');
        const navHeight = 80; // Approximate height of navigation
        const padding = 50; // Padding for essay page
        const availableHeight = readerContent.clientHeight - navHeight - padding;
        
        // Reserve some space for better content flow
        const effectiveHeight = availableHeight * 0.85; // Use 85% to ensure content fits well
        
        const pages = [];
        const elements = Array.from(tempContainer.children);
        let currentPage = document.createElement('div');
        let currentHeight = 0;
        
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            
            // Clone the element to measure its height
            const clone = element.cloneNode(true);
            const testContainer = document.createElement('div');
            testContainer.style.position = 'absolute';
            testContainer.style.visibility = 'hidden';
            testContainer.style.width = fixedWidth;
            testContainer.style.top = '-9999px';
            testContainer.className = 'essay-text';
            testContainer.appendChild(clone);
            document.body.appendChild(testContainer);
            
            const elementHeight = testContainer.offsetHeight;
            document.body.removeChild(testContainer);
            
            // Check if this is a heading
            const isHeading = /^h[1-6]$/i.test(element.tagName);
            
            // Check if this element contains an image
            const hasImage = element.querySelector && element.querySelector('img');
            
            // If this is a heading, be more aggressive about keeping it with following content
            if (isHeading && i < elements.length - 1) {
                // Look ahead to find related content - try to keep heading with ALL following content until next heading
                let lookAheadHeight = elementHeight;
                let lookAheadElements = [element];
                let remainingHeight = effectiveHeight - currentHeight;
                
                // Try to include content until we hit another heading or run out of space
                for (let j = i + 1; j < elements.length; j++) {
                    const nextElement = elements[j];
                    
                    // Stop if we hit another heading
                    if (/^h[1-6]$/i.test(nextElement.tagName)) {
                        break;
                    }
                    
                    // Measure the next element
                    const nextClone = nextElement.cloneNode(true);
                    const nextTestContainer = document.createElement('div');
                    nextTestContainer.style.position = 'absolute';
                    nextTestContainer.style.visibility = 'hidden';
                    nextTestContainer.style.width = fixedWidth;
                    nextTestContainer.style.top = '-9999px';
                    nextTestContainer.className = 'essay-text';
                    nextTestContainer.appendChild(nextClone);
                    document.body.appendChild(nextTestContainer);
                    
                    const nextElementHeight = nextTestContainer.offsetHeight;
                    document.body.removeChild(nextTestContainer);
                    
                    // Include this element with the heading group
                    lookAheadHeight += nextElementHeight;
                    lookAheadElements.push(nextElement);
                    
                    // If adding this element makes the group too big for any page, 
                    // we need to break it up, but keep at least one element with the heading
                    if (lookAheadHeight > effectiveHeight * 0.9 && lookAheadElements.length > 2) {
                        // Remove the last element to fit
                        lookAheadElements.pop();
                        lookAheadHeight -= nextElementHeight;
                        break;
                    }
                }
                
                // Ensure we have at least the heading + one following element if possible
                if (lookAheadElements.length === 1 && i < elements.length - 1) {
                    const nextElement = elements[i + 1];
                    if (!/^h[1-6]$/i.test(nextElement.tagName)) {
                        // Force include at least one element after heading
                        const nextClone = nextElement.cloneNode(true);
                        const nextTestContainer = document.createElement('div');
                        nextTestContainer.style.position = 'absolute';
                        nextTestContainer.style.visibility = 'hidden';
                        nextTestContainer.style.width = fixedWidth;
                        nextTestContainer.style.top = '-9999px';
                        nextTestContainer.className = 'essay-text';
                        nextTestContainer.appendChild(nextClone);
                        document.body.appendChild(nextTestContainer);
                        
                        const nextElementHeight = nextTestContainer.offsetHeight;
                        document.body.removeChild(nextTestContainer);
                        
                        lookAheadHeight += nextElementHeight;
                        lookAheadElements.push(nextElement);
                    }
                }
                
                // Check if the heading group fits in current page
                if (currentHeight + lookAheadHeight > effectiveHeight && currentPage.children.length > 0) {
                    // Start new page for the heading group
                    pages.push(currentPage.innerHTML);
                    currentPage = document.createElement('div');
                    currentHeight = 0;
                }
                
                // Add all elements in the group
                for (const groupElement of lookAheadElements) {
                    currentPage.appendChild(groupElement.cloneNode(true));
                }
                currentHeight += lookAheadHeight;
                
                // Skip the elements we've already processed
                i += lookAheadElements.length - 1;
                
            } else {
                // Regular element processing
                // Special handling for elements with images - try to keep them as complete units
                if (hasImage && currentHeight + elementHeight > effectiveHeight && currentPage.children.length > 0) {
                    // Start new page for image content to keep it together
                    pages.push(currentPage.innerHTML);
                    currentPage = document.createElement('div');
                    currentHeight = 0;
                } else if (!hasImage && currentHeight + elementHeight > effectiveHeight && currentPage.children.length > 0) {
                    // Normal page break for non-image content
                    pages.push(currentPage.innerHTML);
                    currentPage = document.createElement('div');
                    currentHeight = 0;
                }
                
                // Add element to current page
                currentPage.appendChild(element.cloneNode(true));
                currentHeight += elementHeight;
            }
        }
        
        // Add the last page if it has content
        if (currentPage.children.length > 0) {
            pages.push(currentPage.innerHTML);
        }
        
        // Clean up
        document.body.removeChild(tempContainer);
        
        // Ensure at least one page
        if (pages.length === 0) {
            pages.push('<p>Content could not be loaded properly.</p>');
        }
        
        return pages;
    }

    /**
     * Display a specific page
     * @param {number} pageIndex - Page index to display
     */
    displayPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.currentPages.length) return;
        
        this.currentPageIndex = pageIndex;
        const pageContent = this.currentPages[pageIndex];
        
        // Update content container
        const readerContent = document.querySelector('.reader-content');
        
        // Create new page structure if it doesn't exist
        if (!readerContent.querySelector('.page-container')) {
            readerContent.innerHTML = `
                <div class="page-container">
                    <div class="essay-page active">
                        <div class="essay-text">${pageContent}</div>
                    </div>
                </div>
                <div class="page-nav-container">
                    <div class="page-nav-controls">
                        <button class="page-nav-btn" data-direction="prev" ${pageIndex === 0 ? 'disabled' : ''}>
                            ←
                        </button>
                        <button class="page-nav-btn" data-direction="next" ${pageIndex === this.currentPages.length - 1 ? 'disabled' : ''}>
                            →
                        </button>
                    </div>
                    <div class="page-indicator">
                        <span class="page-number">${pageIndex + 1}</span>
                        <span>/</span>
                        <span>${this.currentPages.length}</span>
                        <div class="page-dots">
                            ${this.createPageDots()}
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Update existing page with smooth transition
            const essayPage = readerContent.querySelector('.essay-page');
            const pageNavContainer = readerContent.querySelector('.page-nav-container');
            
            // Add transition effect
            essayPage.style.opacity = '0.5';
            essayPage.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                essayPage.querySelector('.essay-text').innerHTML = pageContent;
                
                // Update navigation buttons
                const prevBtn = pageNavContainer.querySelector('[data-direction="prev"]');
                const nextBtn = pageNavContainer.querySelector('[data-direction="next"]');
                prevBtn.disabled = pageIndex === 0;
                nextBtn.disabled = pageIndex === this.currentPages.length - 1;
                
                // Update page indicator
                pageNavContainer.querySelector('.page-number').textContent = pageIndex + 1;
                pageNavContainer.querySelector('.page-dots').innerHTML = this.createPageDots();
                
                // Restore appearance
                essayPage.style.opacity = '1';
                essayPage.style.transform = 'translateX(0)';
            }, 200);
        }
        
        // Update essay info
        document.getElementById('current-essay-info').textContent = 
            `Story ${this.currentEssayIndex + 1} of ${this.currentEssays.length} • Page ${pageIndex + 1} of ${this.currentPages.length}`;
    }

    /**
     * Create page dots indicator
     * @returns {string} HTML for page dots
     */
    createPageDots() {
        const maxDots = 8; // Maximum number of dots to show
        const totalPages = this.currentPages.length;
        const currentPage = this.currentPageIndex;
        
        if (totalPages <= maxDots) {
            // Show all dots
            return Array.from({length: totalPages}, (_, i) => 
                `<div class="page-dot ${i === currentPage ? 'active' : ''}"></div>`
            ).join('');
        } else {
            // Show abbreviated dots
            let dots = [];
            
            if (currentPage < 4) {
                // Show first few pages
                for (let i = 0; i < 5; i++) {
                    dots.push(`<div class="page-dot ${i === currentPage ? 'active' : ''}"></div>`);
                }
                dots.push('...');
                dots.push(`<div class="page-dot"></div>`);
            } else if (currentPage > totalPages - 5) {
                // Show last few pages
                dots.push(`<div class="page-dot"></div>`);
                dots.push('...');
                for (let i = totalPages - 5; i < totalPages; i++) {
                    dots.push(`<div class="page-dot ${i === currentPage ? 'active' : ''}"></div>`);
                }
            } else {
                // Show middle pages
                dots.push(`<div class="page-dot"></div>`);
                dots.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    dots.push(`<div class="page-dot ${i === currentPage ? 'active' : ''}"></div>`);
                }
                dots.push('...');
                dots.push(`<div class="page-dot"></div>`);
            }
            
            return dots.join('');
        }
    }

    /**
     * Navigate between pages
     * @param {number} direction - Direction (-1 for previous, 1 for next)
     */
    navigatePage(direction) {
        const newPageIndex = this.currentPageIndex + direction;
        
        if (newPageIndex >= 0 && newPageIndex < this.currentPages.length) {
            this.displayPage(newPageIndex);
        }
    }

    /**
     * Re-paginate content when window is resized
     */
    repaginate() {
        if (this.currentPages.length > 0) {
            // Get the original content by combining all pages
            const originalContent = this.currentPages.join('');
            
            // Re-split content with new screen dimensions
            this.currentPages = this.splitContentIntoPages(originalContent);
            
            // Adjust current page index if necessary
            if (this.currentPageIndex >= this.currentPages.length) {
                this.currentPageIndex = this.currentPages.length - 1;
            }
            
            // Display the adjusted page
            this.displayPage(this.currentPageIndex);
        }
    }

    /**
     * Navigate between essays
     * @param {number} direction - Direction (-1 for previous, 1 for next)
     */
    navigateEssay(direction) {
        const newIndex = this.currentEssayIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.currentEssays.length) {
            this.openEssay(newIndex);
        }
    }

    /**
     * Update navigation button states
     */
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-essay');
        const nextBtn = document.getElementById('next-essay');
        
        prevBtn.disabled = this.currentEssayIndex === 0;
        nextBtn.disabled = this.currentEssayIndex === this.currentEssays.length - 1;
    }

    /**
     * Show a specific page
     * @param {string} pageId - Page ID to show
     */
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.book-page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show the target page
        document.getElementById(pageId).classList.add('active');
        
        // Add page transition animation
        setTimeout(() => {
            document.getElementById(pageId).style.opacity = '1';
        }, 50);
    }

    /**
     * Show loading overlay
     */
    showLoading() {
        document.getElementById('loading').classList.add('active');
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        document.getElementById('loading').classList.remove('active');
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        document.getElementById('error-text').textContent = message;
        document.getElementById('error-message').classList.add('active');
    }

    /**
     * Hide error message
     */
    hideError() {
        document.getElementById('error-message').classList.remove('active');
    }

    /**
     * Add smooth scrolling to essay content
     */
    addSmoothScrolling() {
        const content = document.getElementById('essay-content');
        if (content) {
            content.scrollTop = 0;
        }
    }

    /**
     * Handle touch gestures for mobile devices
     */
    initTouchGestures() {
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
            
            // Only handle horizontal swipes that are longer than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const currentPage = document.querySelector('.book-page.active').id;
                
                if (currentPage === 'essay-reader') {
                    if (diffX > 0) {
                        // Swipe left - next page
                        this.navigatePage(1);
                    } else {
                        // Swipe right - previous page
                        this.navigatePage(-1);
                    }
                }
            } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 50) {
                // Vertical swipes for essay navigation
                const currentPage = document.querySelector('.book-page.active').id;
                
                if (currentPage === 'essay-reader') {
                    if (diffY > 0) {
                        // Swipe up - next essay
                        this.navigateEssay(1);
                    } else {
                        // Swipe down - previous essay
                        this.navigateEssay(-1);
                    }
                }
            }
            
            startX = 0;
            startY = 0;
        });
    }

    /**
     * Initialize accessibility features
     */
    initAccessibility() {
        // Add ARIA labels
        document.querySelectorAll('.language-btn').forEach(btn => {
            const lang = btn.dataset.lang;
            btn.setAttribute('aria-label', `Select ${btn.querySelector('.lang-text').textContent} language`);
        });
        
        // Add focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Ensure proper tab order within active page
                const activePage = document.querySelector('.book-page.active');
                const focusableElements = activePage.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                // Add visual focus indicators
                focusableElements.forEach(el => {
                    el.addEventListener('focus', () => {
                        el.style.outline = '3px solid #fbbf24';
                        el.style.outlineOffset = '2px';
                    });
                    
                    el.addEventListener('blur', () => {
                        el.style.outline = '';
                        el.style.outlineOffset = '';
                    });
                });
            }
        });
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new KidsEssaysApp();
    
    // Initialize additional features
    app.initTouchGestures();
    app.initAccessibility();
    
    console.log('Kids Essays Website initialized! 📚✨');
    console.log('Content will be loaded from the ./essays folder in this repository.');
});