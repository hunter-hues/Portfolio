// Image carousel functionality
let carouselIntervals = {};

function changeImage(projectId, direction) {
    const images = document.querySelectorAll(`#${projectId}1, #${projectId}2`);
    const activeImage = document.querySelector(`#${projectId}1.active, #${projectId}2.active`);
    const currentIndex = Array.from(images).indexOf(activeImage);
    const nextIndex = (currentIndex + direction + images.length) % images.length;
    
    // Remove active class from current image
    activeImage.classList.remove('active');
    // Add active class to next image
    images[nextIndex].classList.add('active');
}

function startCarousel(projectId) {
    // Clear any existing interval for this project
    if (carouselIntervals[projectId]) {
        clearInterval(carouselIntervals[projectId]);
    }
    
    // Set new interval to change image every 5 seconds
    carouselIntervals[projectId] = setInterval(() => {
        changeImage(projectId, 1);
    }, 5000);
}

// Start carousel when the page loads
document.addEventListener('DOMContentLoaded', () => {
    startCarousel('rafflebot');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        try {
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Send data to backend
            const response = await fetch(window.location.origin + '/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message })
            });
            
            const data = await response.json();
            console.log('Server response:', data);
            
            if (data.success) {
                alert('Thank you for your message! I will get back to you soon.');
                contactForm.reset();
            } else {
                console.error('Server error:', data.message);
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Sorry, there was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        navbar.style.backgroundColor = '#fff';
        navbar.style.boxShadow = 'none';
    }
});

// Add animation to project cards on scroll
const projectCards = document.querySelectorAll('.project-card');
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
}); 