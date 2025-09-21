// Initialize AOS (Animate On Scroll) library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

// Smooth scrolling for navigation links and buttons
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Add active class to navbar link if it exists
            const navLink = document.querySelector(`.nav-menu a[href="${targetId}"]`);
            if (navLink) {
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                });
                navLink.classList.add('active');
            }
            
            // Smooth scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Add visual feedback for button clicks
            if (this.classList.contains('btn')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }
        }
    });
});

// Navbar scroll effect and active section highlighting
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 14, 39, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 212, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Highlight active section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Counter animation for impact stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Intersection Observer for counter animations
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all counter elements
document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
    counterObserver.observe(counter);
});

// Green Points System
let totalPoints = 0;
const pointsCounter = document.getElementById('pointsCounter');

function updatePointsDisplay() {
    pointsCounter.textContent = totalPoints;
    // Add celebration effect
    pointsCounter.style.transform = 'scale(1.2)';
    setTimeout(() => {
        pointsCounter.style.transform = 'scale(1)';
    }, 200);
}

// Action button click handlers
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const actionCard = this.closest('.action-card');
        const points = parseInt(actionCard.dataset.points);
        
        // Add points
        totalPoints += points;
        updatePointsDisplay();
        
        // Visual feedback
        this.textContent = 'Completed!';
        this.style.background = 'var(--success-color)';
        this.disabled = true;
        
        // Add completion animation
        actionCard.style.transform = 'scale(1.05)';
        actionCard.style.boxShadow = '0 10px 30px rgba(46, 213, 115, 0.3)';
        
        setTimeout(() => {
            actionCard.style.transform = 'scale(1)';
            actionCard.style.boxShadow = 'none';
        }, 300);
        
        // Show achievement notification
        showNotification(`+${points} Green Points!`, 'success');
    });
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        background: type === 'success' ? 'var(--success-color)' : 'var(--primary-color)',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Chart.js configurations and initialization
let temperatureChart, precipitationChart;

function initializeCharts() {
    // Temperature Chart
    const tempCtx = document.getElementById('temperatureChart');
    if (tempCtx) {
        temperatureChart = new Chart(tempCtx, {
            type: 'line',
            data: {
                labels: generateDateLabels(30),
                datasets: [{
                    label: 'Temperature (°C)',
                    data: generateTemperatureData(30),
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00d4ff',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#b8c5d6'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#7c8db0'
                        },
                        grid: {
                            color: 'rgba(184, 197, 214, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#7c8db0'
                        },
                        grid: {
                            color: 'rgba(184, 197, 214, 0.1)'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
    
    // Precipitation Chart
    const precipCtx = document.getElementById('precipitationChart');
    if (precipCtx) {
        precipitationChart = new Chart(precipCtx, {
            type: 'bar',
            data: {
                labels: generateDateLabels(7),
                datasets: [{
                    label: 'Precipitation (mm)',
                    data: generatePrecipitationData(7),
                    backgroundColor: 'rgba(0, 255, 136, 0.6)',
                    borderColor: '#00ff88',
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#b8c5d6'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#7c8db0'
                        },
                        grid: {
                            color: 'rgba(184, 197, 214, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#7c8db0'
                        },
                        grid: {
                            color: 'rgba(184, 197, 214, 0.1)'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
}

// Generate fake data for charts
function generateDateLabels(days) {
    const labels = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
}

function generateTemperatureData(days) {
    const data = [];
    let baseTemp = 22;
    for (let i = 0; i < days; i++) {
        baseTemp += (Math.random() - 0.5) * 4;
        data.push(Math.round(baseTemp * 10) / 10);
    }
    return data;
}

function generatePrecipitationData(days) {
    const data = [];
    for (let i = 0; i < days; i++) {
        data.push(Math.round(Math.random() * 20 * 10) / 10);
    }
    return data;
}

// Update charts with new data periodically
function updateCharts() {
    if (temperatureChart) {
        const newTempData = generateTemperatureData(30);
        temperatureChart.data.datasets[0].data = newTempData;
        temperatureChart.update('active');
    }
    
    if (precipitationChart) {
        const newPrecipData = generatePrecipitationData(7);
        precipitationChart.data.datasets[0].data = newPrecipData;
        precipitationChart.update('active');
    }
}

// Simulate real-time data updates
setInterval(updateCharts, 30000); // Update every 30 seconds

// Cloud parallax and interaction effects
let mouseX = 0, mouseY = 0;

// Mouse movement tracking for cloud parallax
document.addEventListener('mousemove', function(e) {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
});

// Parallax effect for hero section with clouds
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const clouds = document.querySelectorAll('.cloud');
    
    clouds.forEach((cloud, index) => {
        const speed = 0.3 + (index * 0.1);
        const parallaxY = scrolled * speed;
        const parallaxX = mouseX * (10 + index * 2);
        cloud.style.transform = `translateY(${parallaxY}px) translateX(${parallaxX}px)`;
    });
});

// Cloud floating animation enhancement
function enhanceCloudAnimation() {
    const clouds = document.querySelectorAll('.cloud');
    
    clouds.forEach((cloud, index) => {
        // Add subtle floating motion
        const time = Date.now() * 0.001;
        const floatX = Math.sin(time + index) * 5;
        const floatY = Math.cos(time * 0.7 + index) * 3;
        
        const currentTransform = cloud.style.transform || '';
        cloud.style.transform = `${currentTransform} translate(${floatX}px, ${floatY}px)`;
    });
    
    requestAnimationFrame(enhanceCloudAnimation);
}

// Start cloud animation
enhanceCloudAnimation();

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
});

// Problem cards hover effects
document.querySelectorAll('.problem-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Solution flow animation
function animateSolutionFlow() {
    const steps = document.querySelectorAll('.solution-step');
    const arrows = document.querySelectorAll('.solution-arrow');
    
    steps.forEach((step, index) => {
        setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    arrows.forEach((arrow, index) => {
        setTimeout(() => {
            arrow.style.opacity = '1';
            arrow.style.transform = 'scale(1)';
        }, (index + 1) * 200);
    });
}

// Initialize solution flow animation when section comes into view
const solutionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSolutionFlow();
            solutionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const solutionSection = document.querySelector('.solution');
if (solutionSection) {
    solutionObserver.observe(solutionSection);
}

// Alert system simulation
function simulateAlerts() {
    const alerts = [
        {
            type: 'warning',
            icon: 'fas fa-exclamation-triangle',
            title: 'Flood Warning',
            message: 'High risk of flooding in Southeast region within 48 hours',
            time: '2 hours ago'
        },
        {
            type: 'info',
            icon: 'fas fa-info-circle',
            title: 'Drought Alert',
            message: 'Prolonged dry conditions expected in Southwest region',
            time: '5 hours ago'
        },
        {
            type: 'success',
            icon: 'fas fa-check-circle',
            title: 'System Update',
            message: 'AI models successfully updated with latest satellite data',
            time: '1 hour ago'
        }
    ];
    
    let currentAlertIndex = 0;
    
    function showNextAlert() {
        const alert = alerts[currentAlertIndex];
        const alertPanel = document.querySelector('.alerts-panel');
        
        if (alertPanel) {
            const alertHTML = `
                <div class="alert-item">
                    <div class="alert-icon ${alert.type}">
                        <i class="${alert.icon}"></i>
                    </div>
                    <div class="alert-content">
                        <h4>${alert.title}</h4>
                        <p>${alert.message}</p>
                        <span class="alert-time">${alert.time}</span>
                    </div>
                </div>
            `;
            
            // Remove existing alerts and add new one
            const existingAlerts = alertPanel.querySelectorAll('.alert-item');
            existingAlerts.forEach(existingAlert => {
                existingAlert.remove();
            });
            
            alertPanel.insertAdjacentHTML('beforeend', alertHTML);
            
            // Animate in
            const newAlert = alertPanel.querySelector('.alert-item:last-child');
            newAlert.style.opacity = '0';
            newAlert.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                newAlert.style.transition = 'all 0.3s ease';
                newAlert.style.opacity = '1';
                newAlert.style.transform = 'translateX(0)';
            }, 100);
        }
        
        currentAlertIndex = (currentAlertIndex + 1) % alerts.length;
    }
    
    // Show initial alert
    showNextAlert();
    
    // Rotate alerts every 10 seconds
    setInterval(showNextAlert, 10000);
}

// Initialize alert simulation
setTimeout(simulateAlerts, 2000);

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Add mobile menu button if screen is small
function addMobileMenuButton() {
    if (window.innerWidth <= 768) {
        const navContainer = document.querySelector('.nav-container');
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        if (!document.querySelector('.mobile-menu-btn')) {
            navContainer.appendChild(mobileMenuBtn);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    setTimeout(initializeCharts, 1000);
    
    // Add mobile menu button
    addMobileMenuButton();
    
    // Handle window resize
    window.addEventListener('resize', addMobileMenuButton);
    
    // Initialize scroll effects
    window.addEventListener('scroll', function() {
        // Add scroll-based animations here if needed
    });
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll events
const throttledScrollHandler = throttle(function() {
    // Scroll-based animations and effects
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Error handling for charts
window.addEventListener('error', function(e) {
    console.error('Chart error:', e.error);
    // Fallback: show static data or hide charts
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        if (!container.querySelector('canvas').getContext) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">Chart data loading...</p>';
        }
    });
});

// Export functions for potential external use
window.ClimateAI = {
    updatePoints: function(points) {
        totalPoints += points;
        updatePointsDisplay();
    },
    showNotification: showNotification,
    updateCharts: updateCharts
};
