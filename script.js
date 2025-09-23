// Warden of Systems - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.wardrobe-nav-toggle');
    const navMenu = document.querySelector('.wardrobe-nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('wardrobe-nav-active');
            navToggle.classList.toggle('wardrobe-nav-active');
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll effect to navigation
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.wardrobe-nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            nav.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.wardrobe-feature-card, .wardrobe-chapter-preview');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add magic sparkle effect on hover for runes
    const runes = document.querySelectorAll('.wardrobe-rune');
    runes.forEach(rune => {
        rune.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 20px #f39c12, 0 0 40px #f39c12';
            this.style.transform = 'scale(1.2)';
        });
        
        rune.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Check if image is already loaded
        if (img.complete && img.naturalHeight !== 0) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            // Set initial opacity for smooth loading
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    });
});

// Chapter navigation functions
function navigateToChapter(chapterNumber) {
    window.location.href = `chapter${chapterNumber}.html`;
}

function navigateToNextChapter() {
    const currentChapter = getCurrentChapterNumber();
    if (currentChapter) {
        navigateToChapter(currentChapter + 1);
    }
}

function navigateToPreviousChapter() {
    const currentChapter = getCurrentChapterNumber();
    if (currentChapter && currentChapter > 1) {
        navigateToChapter(currentChapter - 1);
    }
}

function getCurrentChapterNumber() {
    const path = window.location.pathname;
    const match = path.match(/chapter(\d+)\.html/);
    return match ? parseInt(match[1]) : null;
}

// Character modal functions
function openCharacterModal(characterId) {
    const modal = document.getElementById(`wardrobe-character-modal-${characterId}`);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeCharacterModal(characterId) {
    const modal = document.getElementById(`wardrobe-character-modal-${characterId}`);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('[id^="wardrobe-character-modal-"]');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // Arrow keys for chapter navigation
    if (event.key === 'ArrowLeft') {
        navigateToPreviousChapter();
    } else if (event.key === 'ArrowRight') {
        navigateToNextChapter();
    }
    
    // Escape key to close modals
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('[id^="wardrobe-character-modal-"]');
        modals.forEach(modal => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});
