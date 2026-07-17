document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Optimized HTML5 Canvas Starry Background
    const canvas = document.getElementById('stars-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, stars = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        function initStars() {
            stars = [];
            for (let i = 0; i < 150; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5 + 0.5,
                    alpha: Math.random(),
                    speedAlpha: (Math.random() * 0.02) + 0.005
                });
            }
        }

        function drawStars() {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();

                star.alpha += star.speedAlpha;
                if (star.alpha <= 0.1 || star.alpha >= 1) {
                    star.speedAlpha = -star.speedAlpha;
                }
            });
            requestAnimationFrame(drawStars);
        }

        window.addEventListener('resize', resize);
        resize();
        initStars();
        drawStars();
    }

    // 2. Mobile Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 3. Header Fade Effect on Scroll
    const header = document.getElementById("main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
    
    // 4. Smooth Fade-In and Scroll Animations
    const revealElements = document.querySelectorAll(".scroll-reveal");
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    };
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.1, 
        rootMargin: "0px 0px -40px 0px"
    });
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    const heroSection = document.getElementById("about");
    if (heroSection) {
        heroSection.classList.add("active");
    }

    // 5. Scroll Progress Bar (NEW)
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${(totalScroll / windowHeight) * 100}%`;
            scrollProgress.style.width = scroll;
        });
    }

    // 6. Pro Techie Typewriter Effect (NEW)
    const typewriterElement = document.getElementById('typewriter-name');
    if (typewriterElement) {
        const textToType = "Bijoy Kumar Sarkar";
        let charIndex = 0;
        
        function typeWriter() {
            if (charIndex < textToType.length) {
                typewriterElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 120); // Typing speed
            }
        }
        // Start typing after a short delay
        setTimeout(typeWriter, 600);
    }

    // 7. Custom Mouse Hover Cursor (NEW)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Check if the device has a fine pointer (excludes touchscreens/mobiles)
    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Move dot instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Move outline smoothly with animation API
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 300, fill: "forwards" });
        });
        
        // Add expansion hover effect to interactable elements
        const interactables = document.querySelectorAll('a, button, .nav-item, .social-icon');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
        });
    }
});