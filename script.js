// DOM Elements
const hamburger = document.getElementById('hamburger');
const sidePanel = document.getElementById('sidePanel');
const sidePanelOverlay = document.getElementById('sidePanelOverlay');
const closeBtn = document.getElementById('closeBtn');
const sidePanelLinks = document.querySelectorAll('.side-panel-link');
const header = document.getElementById('header');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const feedbackForm = document.getElementById('feedbackForm');
const formMessage = document.getElementById('formMessage');

// Side Panel Toggle
hamburger.addEventListener('click', () => {
    sidePanel.classList.add('active');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
});

// Close side panel
function closeSidePanel() {
    sidePanel.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

closeBtn.addEventListener('click', closeSidePanel);
sidePanelOverlay.addEventListener('click', closeSidePanel);

// Close panel when clicking on nav links
sidePanelLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeSidePanel();
    });
});

// Handle escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSidePanel();
        if (imageModal) {
            closeModal();
        }
    }
});

// Header background change on scroll
function updateHeaderBackground() {
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Throttled scroll handler for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
        updateHeaderBackground();
    }, 10);
});

// Gallery Modal Functions (only if modal exists)
function openModal(imageSrc) {
    if (modalImage) {
        modalImage.src = imageSrc;
        imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (imageModal) {
        imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside the image
if (imageModal) {
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeModal();
        }
    });
}

// Feedback Form Handling (only if form exists)
function handleFormSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(feedbackForm);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
    
    if (missingFields.length > 0) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = feedbackForm.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Sending...
    `;
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        showFormMessage(`Thank you, ${data.name}! Your message has been sent successfully. I'll get back to you soon.`, 'success');
        feedbackForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Log the form data (in a real app, this would be sent to a server)
        console.log('Form submitted:', data);
    }, 2000);
}

function showFormMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// Add form submission event listener
if (feedbackForm) {
    feedbackForm.addEventListener('submit', handleFormSubmission);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Elements to animate
    const animatedElements = document.querySelectorAll(`
        .skill-category,
        .activity-item,
        .gallery-item,
        .showcase-item,
        .about-card,
        .contact-item,
        .reflection-card,
        .appreciation-card,
        .blog-post,
        .sidebar-widget,
        .table-container,
        .feedback-form,
        .no-projects,
        .resume-download
    `);
    
    // Set initial state and observe elements
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });

    // Initialize header background
    updateHeaderBackground();
});

// Table row hover effects (if table exists)
document.addEventListener('DOMContentLoaded', () => {
    const tableRows = document.querySelectorAll('.performance-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'translateX(4px)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.transform = 'translateX(0)';
        });
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // If image is already loaded (cached)
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
});

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
        // Handle any resize-specific logic here
        updateHeaderBackground();
    }, 250);
});

// Add touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartY - touchEndY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        // Add any swipe-specific functionality here if needed
        // For example, you could implement swipe to navigate between sections
    }
}

// Add error handling for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => {
            // You could add a placeholder or retry logic here
            console.warn(`Failed to load image: ${img.src}`);
        });
    });
});

// Form field enhancements (if form exists)
document.addEventListener('DOMContentLoaded', () => {
    const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});

// Blog section enhancements (if blog exists)
document.addEventListener('DOMContentLoaded', () => {
    const blogLinks = document.querySelectorAll('.topic-list a, .category-list a');
    
    blogLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // In a real blog, this would navigate to the specific post or category
            if (formMessage) {
                showFormMessage('Blog navigation coming soon!', 'success');
            }
        });
    });
});
