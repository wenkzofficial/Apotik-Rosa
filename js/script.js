// Auto-Sliding Infinite Loop Slider
function initializeAutoSlider() {
    const slider = document.querySelector('.services-slider');
    const track = document.querySelector('.services-track');
    const cards = document.querySelectorAll('.service-card');
    
    if (!slider || !track || cards.length === 0) return;

    const cardStyle = window.getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight);
    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollSpeed = 1.5;
    let autoScrollInterval;
    let isAutoScrolling = true;
    
    const clonesCount = Math.ceil(slider.offsetWidth / cardWidth) + 1;
    const clones = [];
    for (let i = 0; i < clonesCount; i++) {
        const clone = cards[i % cards.length].cloneNode(true);
        track.appendChild(clone);
        clones.push(clone);
    }

    function startAutoScroll() {
        isAutoScrolling = true;
        autoScrollInterval = setInterval(() => {
            if (!isDown) {
                const currentPosition = parseFloat(track.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
                track.style.transform = `translateX(${currentPosition - autoScrollSpeed}px)`;
                track.style.transition = 'transform 0.02s linear';
                
                if (-(currentPosition - autoScrollSpeed) >= cardWidth * cards.length) {
                    setTimeout(() => {
                        track.style.transition = 'none';
                        track.style.transform = `translateX(${-cardWidth * (clonesCount - cards.length)}px)`;
                        void track.offsetWidth;
                        track.style.transition = 'transform 0.5s ease-out';
                    }, 20);
                }
            }
        }, 16);
    }

    function handleStart(e) {
        isDown = true;
        track.style.cursor = 'grabbing';
        track.style.transition = 'none';
        startX = (e.pageX || e.touches[0].pageX) - track.offsetLeft;
        scrollLeft = parseFloat(track.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
        clearInterval(autoScrollInterval);
        isAutoScrolling = false;
    }

    function handleEnd() {
        if (isDown) {
            isDown = false;
            track.style.cursor = 'grab';
            snapToNearestCard();
            if (!isAutoScrolling) startAutoScroll();
        }
    }

    function handleMove(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = (e.pageX || e.touches[0].pageX) - track.offsetLeft;
        track.style.transform = `translateX(${scrollLeft - ((x - startX) * 2)}px)`;
    }

    function snapToNearestCard() {
        const currentTranslate = parseFloat(track.style.transform.replace('translateX(', '').replace('px)', '')) || 0;
        const snappedPosition = Math.round(currentTranslate / cardWidth) * cardWidth;
        
        if (snappedPosition < -(cardWidth * cards.length)) {
            track.style.transition = 'none';
            track.style.transform = `translateX(${-cardWidth * (clonesCount - cards.length)}px)`;
            void track.offsetWidth;
            track.style.transition = 'transform 0.5s ease-out';
            return;
        }
        
        track.style.transition = 'transform 0.5s ease-out';
        track.style.transform = `translateX(${snappedPosition}px)`;
    }

    function initSlider() {
        track.style.transform = `translateX(${-cardWidth * Math.floor(clonesCount / 2)}px)`;
        track.style.transition = 'transform 0.5s ease-out';
        track.style.cursor = 'grab';
        startAutoScroll();
    }

    track.addEventListener('mousedown', handleStart);
    track.addEventListener('touchstart', handleStart);
    track.addEventListener('mouseleave', handleEnd);
    track.addEventListener('mouseup', handleEnd);
    track.addEventListener('touchend', handleEnd);
    track.addEventListener('mousemove', handleMove);
    track.addEventListener('touchmove', handleMove);
    slider.addEventListener('mouseenter', () => {
        if (isAutoScrolling) {
            clearInterval(autoScrollInterval);
            isAutoScrolling = false;
        }
    });
    slider.addEventListener('mouseleave', () => {
        if (!isAutoScrolling && !isDown) startAutoScroll();
    });

    initSlider();
}

// Rosa Calista Beauty Form and UI Functionality
function initializeRCBApp() {
// Form submission handler
const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Simple validation
        const requiredFields = ['nama', 'telepon', 'treatment', 'tanggal'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });

        if (!isValid) {
            alert('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        // Prepare form data
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            // Using FormData directly (alternative method)
            const response = await fetch('https://script.google.com/macros/s/AKfycbyBBkBZC-sx9QglXPByNErJx7AmWr9WPTKPYDsAWL0_u_wH3zkiOttdSxmHf_3crGLjUA/exec', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams(formData)
});
            if (response.ok) {
                alert('Pendaftaran berhasil dikirim!');
                this.reset();
            } else {
                throw new Error('Failed to submit form');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal mengirim pendaftaran. Silakan coba lagi.');
        }
    });

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('tanggal');
    if (dateInput) dateInput.setAttribute('min', today);

    // Improved phone number formatting
    const phoneInput = document.getElementById('telepon');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('62')) value = '+' + value;
            else if (value.startsWith('0')) value = '+62' + value.slice(1);
            else if (value && !value.startsWith('+62')) value = '+62' + value;
            e.target.value = value;
        });
    }
}

// Notification function (must be defined elsewhere in your code)
function showNotification(message, type = 'success') {
    // Your existing notification code here
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}
        // Treatment selection handler
        const treatmentSelect = document.getElementById('treatment');
        if (treatmentSelect) {
            treatmentSelect.addEventListener('change', function() {
                console.log('Treatment dipilih:', this.options[this.selectedIndex].text);
            });
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Form field animations
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Scroll reveal animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.service-card, .treatment-item, .form-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });


// Notification utility function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.5s forwards;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
    
    if (!document.getElementById('notificationAnimations')) {
        const style = document.createElement('style');
        style.id = 'notificationAnimations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoSlider();
    initializeRCBApp();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAutoSlider,
        initializeRCBApp,
        showNotification
    };
}