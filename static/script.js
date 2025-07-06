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
        const currentPosition = window.scrollY + window.innerHeight / 3;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (currentPosition >= sectionTop && currentPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Skills Animation Handler
class SkillsAnimator {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.hasAnimated = false;
        
        this.initializeIntersectionObserver();
    }
    
    initializeIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateSkillBars();
                    this.hasAnimated = true;
                }
            });
        }, {
            threshold: 0.3
        });
        
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }
    
    animateSkillBars() {
        this.skillBars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress');
            
            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, index * 100);
        });
    }
}

// Email Copy Functionality
class EmailCopyHandler {
    constructor() {
        this.initializeCopyButtons();
    }
    
    initializeCopyButtons() {
        const emailButtons = document.querySelectorAll('a[href^="mailto:"]');
        
        emailButtons.forEach(button => {
            // Check if it's the copy email button
            if (button.textContent.includes('Copy Email')) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.copyEmailToClipboard();
                });
            }
        });
    }
    
    async copyEmailToClipboard() {
        const email = 'nenadgowda@gmail.com';
        
        try {
            await navigator.clipboard.writeText(email);
            this.showCopyFeedback('Email copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyTextToClipboard(email);
        }
    }
    
    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopyFeedback('Email copied to clipboard!');
        } catch (err) {
            this.showCopyFeedback('Failed to copy email');
        }
        
        document.body.removeChild(textArea);
    }
    
    showCopyFeedback(message) {
        // Create feedback toast
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: hsl(var(--success));
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: var(--shadow-lg);
            animation: slideInRight 0.3s ease;
        `;
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                document.body.removeChild(toast);
                document.head.removeChild(style);
            }, 300);
        }, 2000);
    }
}

// Performance and Accessibility Enhancements
class PerformanceEnhancer {
    constructor() {
        this.initializeLazyLoading();
        this.initializePerformanceOptimizations();
        this.initializeAccessibilityFeatures();
    }
    
    initializeLazyLoading() {
        // Lazy load images and heavy content
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    initializePerformanceOptimizations() {
        // Throttle scroll events
        let scrollTimer = null;
        const originalScrollHandler = window.onscroll;
        
        window.onscroll = () => {
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(() => {
                if (originalScrollHandler) originalScrollHandler();
            }, 16); // ~60fps
        };
    }
    
    initializeAccessibilityFeatures() {
        // Enhance keyboard navigation
        this.enhanceKeyboardNavigation();
    }
    
    enhanceKeyboardNavigation() {
        // Add visual focus indicators
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid hsl(var(--primary-orange))';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality
    window.chatBot = new ModernChatBot();
    window.navigationEnhancer = new NavigationEnhancer();
    window.skillsAnimator = new SkillsAnimator();
    window.emailCopyHandler = new EmailCopyHandler();
    window.performanceEnhancer = new PerformanceEnhancer();
    
    // Add loading completion class for animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    console.log('Portfolio application initialized successfully');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Error handling for uncaught errors
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    
    // Show user-friendly error message for critical failures
    if (e.error && e.error.message && e.error.message.includes('fetch')) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Connection error. Please check your internet connection.';
        errorMessage.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: hsl(var(--error));
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
        `;
        
        document.body.appendChild(errorMessage);
        
        setTimeout(() => {
            document.body.removeChild(errorMessage);
        }, 5000);
    }
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
