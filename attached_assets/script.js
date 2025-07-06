// Enhanced Chat functionality with modern features
class ModernChatBot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.suggestedButtons = document.querySelectorAll('.suggested-btn');
        this.characterCount = document.querySelector('.character-count');
        
        this.isTyping = false;
        this.messageHistory = [];
        
        this.initializeEventListeners();
        this.initializeFeatures();
    }
    
    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key press (Shift+Enter for new line)
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Character counter
        this.chatInput.addEventListener('input', () => {
            this.updateCharacterCount();
            this.toggleSendButton();
        });
        
        // Suggested questions
        this.suggestedButtons.forEach(button => {
            button.addEventListener('click', () => {
                const question = button.textContent.trim().replace(/^.*?\s/, ''); // Remove icon
                this.chatInput.value = question;
                this.sendMessage();
            });
        });
        
        // Auto-resize textarea
        this.chatInput.addEventListener('input', () => {
            this.autoResizeInput();
        });
    }
    
    initializeFeatures() {
        this.updateCharacterCount();
        this.toggleSendButton();
        this.addWelcomeMessage();
    }
    
    addWelcomeMessage() {
        // Welcome message is already in HTML, so we just need to set the timestamp
        const welcomeMessage = this.chatMessages.querySelector('.message');
        if (welcomeMessage) {
            const timeElement = welcomeMessage.querySelector('.message-time');
            if (timeElement) {
                timeElement.textContent = this.formatTime(new Date());
            }
        }
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        
        if (!message || this.isTyping) {
            return;
        }
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.updateCharacterCount();
        this.toggleSendButton();
        this.autoResizeInput();
        
        // Show typing indicator
        const typingIndicator = this.addTypingIndicator();
        this.isTyping = true;
        
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Remove typing indicator
            this.removeTypingIndicator(typingIndicator);
            
            // Add bot response with typing animation
            if (data.error) {
                this.addMessage(data.error, 'bot', true);
            } else {
                await this.addMessageWithTypingEffect(data.response, 'bot');
            }
            
        } catch (error) {
            console.error('Chat error:', error);
            this.removeTypingIndicator(typingIndicator);
            this.addMessage(
                'Sorry, I encountered an error. Please try again or contact Nenad directly.',
                'bot', 
                true
            );
        } finally {
            this.isTyping = false;
        }
    }
    
    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = content;
        
        if (isError) {
            textDiv.style.color = 'hsl(var(--error))';
            textDiv.style.borderColor = 'hsl(var(--error))';
        }
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.formatTime(new Date());
        
        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(timeDiv);
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Store in history
        this.messageHistory.push({
            content,
            sender,
            timestamp: new Date(),
            isError
        });
        
        return messageDiv;
    }
    
    async addMessageWithTypingEffect(content, sender) {
        const messageDiv = this.addMessage('', sender);
        const textDiv = messageDiv.querySelector('.message-text');
        
        // Split content into words for more natural typing
        const words = content.split(' ');
        let currentText = '';
        
        for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            textDiv.textContent = currentText;
            this.scrollToBottom();
            
            // Variable delay based on word length
            const delay = Math.max(50, Math.min(150, words[i].length * 20));
            await this.sleep(delay);
        }
    }
    
    addTypingIndicator() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message typing-indicator';
        messageDiv.id = 'typing-' + Date.now();
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.innerHTML = `
            <div class="typing-animation">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        // Add typing animation CSS
        const style = document.createElement('style');
        style.textContent = `
            .typing-animation {
                display: flex;
                gap: 4px;
                align-items: center;
            }
            .typing-animation span {
                width: 8px;
                height: 8px;
                background: hsl(var(--primary-orange));
                border-radius: 50%;
                animation: typing-bounce 1.4s infinite ease-in-out;
            }
            .typing-animation span:nth-child(1) { animation-delay: -0.32s; }
            .typing-animation span:nth-child(2) { animation-delay: -0.16s; }
            @keyframes typing-bounce {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        contentDiv.appendChild(textDiv);
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        return messageDiv.id;
    }
    
    removeTypingIndicator(indicatorId) {
        const indicator = document.getElementById(indicatorId);
        if (indicator) {
            indicator.remove();
        }
    }
    
    updateCharacterCount() {
        const currentLength = this.chatInput.value.length;
        const maxLength = parseInt(this.chatInput.getAttribute('maxlength')) || 500;
        
        if (this.characterCount) {
            this.characterCount.textContent = `${currentLength}/${maxLength}`;
            
            // Color coding for character count
            if (currentLength > maxLength * 0.9) {
                this.characterCount.style.color = 'hsl(var(--error))';
            } else if (currentLength > maxLength * 0.7) {
                this.characterCount.style.color = 'hsl(var(--warning))';
            } else {
                this.characterCount.style.color = 'hsl(var(--text-muted))';
            }
        }
    }
    
    toggleSendButton() {
        const hasContent = this.chatInput.value.trim().length > 0;
        this.sendButton.disabled = !hasContent || this.isTyping;
        
        if (hasContent && !this.isTyping) {
            this.sendButton.style.opacity = '1';
            this.sendButton.style.transform = 'scale(1)';
        } else {
            this.sendButton.style.opacity = '0.5';
            this.sendButton.style.transform = 'scale(0.95)';
        }
    }
    
    autoResizeInput() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    clearChat() {
        // Keep only the welcome message
        const messages = this.chatMessages.querySelectorAll('.message:not(:first-child)');
        messages.forEach(message => message.remove());
        this.messageHistory = [];
    }
}

// Clear chat function for global access
function clearChat() {
    if (window.chatBot) {
        window.chatBot.clearChat();
    }
}

// Enhanced smooth scrolling and navigation
class NavigationEnhancer {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.initializeNavigation();
        this.initializeScrollEffects();
    }
    
    initializeNavigation() {
        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navbarHeight = this.navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initializeScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Navbar background opacity
            if (currentScrollY > 50) {
                this.navbar.style.background = 'hsla(var(--bg-primary), 0.98)';
                this.navbar.style.backdropFilter = 'blur(20px)';
            } else {
                this.navbar.style.background = 'hsla(var(--bg-primary), 0.95)';
                this.navbar.style.backdropFilter = 'blur(10px)';
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
            
            // Update active navigation
            this.updateActiveNavigation();
        });
    }
    
    updateActiveNavigation() {
        let current = '';
        const scrollPosition = window.scrollY + 150;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
}

// Enhanced animations and interactions
class AnimationController {
    constructor() {
        this.initializeIntersectionObserver();
        this.initializeParallaxEffects();
        this.initializeHoverEffects();
    }
    
    initializeIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    
                    // Stagger animations for child elements
                    const children = entry.target.querySelectorAll('.stat-card, .timeline-item, .contact-method');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-fade-in');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        // Observe sections and cards
        const elementsToObserve = document.querySelectorAll(
            '.stats-grid, .experience-container, .contact-grid, .chat-interface'
        );
        elementsToObserve.forEach(el => observer.observe(el));
    }
    
    initializeParallaxEffects() {
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                const parallax = scrolled * 0.5;
                heroBackground.style.transform = `translateY(${parallax}px)`;
            });
        }
    }
    
    initializeHoverEffects() {
        // Enhanced contact card hover effects
        const contactMethods = document.querySelectorAll('.contact-method');
        contactMethods.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-12px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-8px) scale(1)';
            });
        });
        
        // Stat card animations
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const number = this.querySelector('.stat-number');
                if (number) {
                    number.style.transform = 'scale(1.1)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const number = this.querySelector('.stat-number');
                if (number) {
                    number.style.transform = 'scale(1)';
                }
            });
        });
    }
}

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.initializeLazyLoading();
        this.debounceScrollEvents();
    }
    
    initializeLazyLoading() {
        // Lazy load heavy content
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        element.classList.add('loaded');
                        lazyObserver.unobserve(element);
                    }
                });
            });
            
            lazyElements.forEach(el => lazyObserver.observe(el));
        }
    }
    
    debounceScrollEvents() {
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                // Perform scroll-based calculations here
                this.updateScrollProgress();
            }, 16); // ~60fps
        });
    }
    
    updateScrollProgress() {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;
        
        // Update any progress indicators
        document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
    }
}

// Accessibility enhancements
class AccessibilityEnhancer {
    constructor() {
        this.initializeKeyboardNavigation();
        this.initializeFocusManagement();
        this.initializeARIA();
    }
    
    initializeKeyboardNavigation() {
        // Tab navigation improvements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }
    
    initializeFocusManagement() {
        // Focus trap for chat when active
        const chatInput = document.getElementById('chatInput');
        const chatContainer = document.querySelector('.chat-container');
        
        if (chatInput && chatContainer) {
            chatInput.addEventListener('focus', () => {
                chatContainer.classList.add('focused');
            });
            
            chatInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (!chatContainer.contains(document.activeElement)) {
                        chatContainer.classList.remove('focused');
                    }
                }, 100);
            });
        }
    }
    
    initializeARIA() {
        // Dynamic ARIA updates
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const observer = new MutationObserver(() => {
                const messageCount = chatMessages.querySelectorAll('.message').length;
                chatMessages.setAttribute('aria-label', `Chat conversation with ${messageCount} messages`);
            });
            
            observer.observe(chatMessages, { childList: true });
        }
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    window.chatBot = new ModernChatBot();
    new NavigationEnhancer();
    new AnimationController();
    new PerformanceOptimizer();
    new AccessibilityEnhancer();
    
    // Add CSS for keyboard navigation
    const keyboardNavCSS = `
        .keyboard-nav *:focus {
            outline: 2px solid hsl(var(--primary-orange)) !important;
            outline-offset: 2px !important;
        }
        
        .keyboard-nav .nav-link:focus,
        .keyboard-nav .btn:focus {
            box-shadow: 0 0 0 3px hsla(var(--primary-orange), 0.3) !important;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = keyboardNavCSS;
    document.head.appendChild(style);
    
    console.log('🚀 Portfolio website initialized with enhanced features');
});

// Add global utility functions
window.portfolioUtils = {
    scrollToSection: (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = section.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    toggleTheme: () => {
        // Future implementation for theme switching
        console.log('Theme switching will be implemented in future updates');
    },
    
    downloadResume: () => {
        // Future implementation for resume download
        console.log('Resume download will be implemented with actual resume file');
    }
};
