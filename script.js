document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Generate Starry Universe Background Elements dynamically
    const starContainer = document.getElementById("stars-container");
    const starCount = 100; // Amount of stars
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        
        // Randomize position, size, and animation timing
        const size = Math.random() * 3 + 1; // 1px to 4px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        
        // Stagger the animation so they don't blink in unison
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starContainer.appendChild(star);
    }

    // 2. Header Fade Effect on Scroll
    const header = document.getElementById("main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
    
    // 3. Smooth Fade-In and Scroll Animations
    const revealElements = document.querySelectorAll(".scroll-reveal");
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Unobserve once animation handles initial reveal transition
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

    // Immediate activation for the Hero fold section
    const heroSection = document.getElementById("about");
    if (heroSection) {
        heroSection.classList.add("active");
    }
});