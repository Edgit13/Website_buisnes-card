document.addEventListener("DOMContentLoaded", function() {
    // Start the Pixar-style animation sequence
    setTimeout(() => {
        // After all animations complete, show main content
        setTimeout(() => {
            const loader = document.getElementById('pixar-loader');
            const mainContent = document.getElementById('main-content');
            
            // Fade out loader
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.8s ease';
            
            setTimeout(() => {
                loader.style.display = 'none';
                mainContent.style.display = 'block';
            }, 800);
        }, 4000); // Total animation time: 4 seconds
        
    }, 500);

    // Add download button functionality
    const downloadBtn = document.querySelector('.download-main-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Add download animation
            this.style.transform = 'scale(0.95)';
            this.style.background = 'linear-gradient(135deg, var(--success), var(--accent))';
            
            setTimeout(() => {
                this.style.transform = '';
                this.innerHTML = '<span class="btn-icon">✅</span> Download Started!';
                
                // Simulate download (in real implementation, this would trigger actual download)
                setTimeout(() => {
                    this.innerHTML = '<span class="btn-icon">⬇️</span> Download Now';
                    this.style.background = 'linear-gradient(135deg, var(--accent), var(--accent-2))';
                }, 2000);
            }, 300);
        });
    }

    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeInUp 0.6s ease forwards';
    });
});

// Add CSS animation for feature cards
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .feature-card {
        opacity: 0;
    }
`;
document.head.appendChild(style);