document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Optimized HTML5 Canvas Starry Background
    const canvas = document.getElementById('stars-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, stars = [];
        let starsAnimationId = null;

        // Bug fix: fewer stars on mobile/small screens for smoother performance
        const isMobileViewport = window.innerWidth <= 768;
        const STAR_COUNT = isMobileViewport ? 80 : 150;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        function initStars() {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
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
            starsAnimationId = requestAnimationFrame(drawStars);
        }

        // Bug fix: pause the animation loop when the tab is hidden instead of
        // running it forever in the background
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(starsAnimationId);
            } else {
                drawStars();
            }
        });

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

    // 5. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${(totalScroll / windowHeight) * 100}%`;
            scrollProgress.style.width = scroll;
        });
    }

    // 6. Pro Techie Typewriter Effect
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

    // 7. Custom Mouse Hover Cursor
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

    // --- Console easter egg ---
    console.log('%c BIJOY KUMAR SARKAR ', 'background:#00f3ff; color:#050508; font-size:16px; font-weight:bold; padding:6px 12px; border-radius:4px;');
    console.log('%cData & Quality Analytics Professional — found this while poking around? Good instinct.', 'color:#bc13fe; font-size:13px;');
    console.log('%cLet\'s talk: bijoykrsarkar.bs@gmail.com', 'color:#8a8a9e; font-size:12px;');

    // --- Simple toast notification helper ---
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = 'position:fixed;bottom:90px;right:25px;background:#111118;color:#fff;padding:12px 18px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);font-size:0.85rem;z-index:10001;box-shadow:0 4px 20px rgba(0,0,0,0.4);opacity:0;transition:opacity 0.3s ease;';
        document.body.appendChild(toast);
        requestAnimationFrame(() => { toast.style.opacity = '1'; });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2200);
    }

    // --- Live IST clock in the hero status badge ---
    const clockEl = document.getElementById('live-ist-clock');
    if (clockEl) {
        function updateClock() {
            const formatter = new Intl.DateTimeFormat('en-IN', {
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata'
            });
            clockEl.textContent = formatter.format(new Date()) + ' IST';
        }
        updateClock();
        // Bug fix: was updating every 30s while only showing minutes, so the
        // displayed time could sit stale for up to 30s. Now ticks every second.
        setInterval(updateClock, 1000);
    }

    // --- vCard "Save Contact" button ---
    const vcardBtn = document.getElementById('vcard-btn');
    if (vcardBtn) {
        vcardBtn.addEventListener('click', () => {
            const vcard = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                'N:Sarkar;Bijoy Kumar;;;',
                'FN:Bijoy Kumar Sarkar',
                'ORG:Genpact India Pvt. Ltd.',
                'TITLE:Data Analyst & Quality Analytics Professional',
                'TEL;TYPE=CELL:+919123615921',
                'EMAIL;TYPE=INTERNET:bijoykrsarkar.bs@gmail.com',
                'URL:https://portfolio-bijoy-kumar-sarkar.vercel.app/',
                'URL:https://www.linkedin.com/in/bijoykumarsarkarbks',
                'ADR;TYPE=WORK:;;HITEC City;Hyderabad;Telangana;;India',
                'END:VCARD'
            ].join('\n');
            const blob = new Blob([vcard], { type: 'text/vcard' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Bijoy_Kumar_Sarkar.vcf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Contact card downloaded');
        });
    }

    // --- Skills radar chart (Chart.js) ---
    const radarCanvas = document.getElementById('skillsRadarChart');
    if (radarCanvas && window.Chart) {
        new Chart(radarCanvas, {
            type: 'radar',
            data: {
                labels: ['Python', 'SQL', 'Tableau', 'Advanced Excel', 'Google Analytics', 'R'],
                datasets: [{
                    label: 'Self-rated proficiency',
                    data: [8, 8, 8, 9, 7, 5],
                    backgroundColor: 'rgba(188, 19, 254, 0.15)',
                    borderColor: '#bc13fe',
                    pointBackgroundColor: '#00f3ff',
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        min: 0, max: 10,
                        angleLines: { color: 'rgba(255,255,255,0.08)' },
                        grid: { color: 'rgba(255,255,255,0.08)' },
                        pointLabels: { color: '#8a8a9e', font: { size: 11 } },
                        ticks: { display: false, stepSize: 2 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // --- Command palette ---
    const cmdkTrigger = document.getElementById('cmdk-trigger');
    const cmdkOverlay = document.getElementById('cmdk-overlay');
    const cmdkInput = document.getElementById('cmdk-input');
    const cmdkList = document.getElementById('cmdk-list');

    if (cmdkTrigger && cmdkOverlay && cmdkInput && cmdkList) {
        const commands = [
            { label: 'Go to About',              icon: 'fa-solid fa-user',            action: () => scrollToSection('about') },
            { label: 'Go to Experience',          icon: 'fa-solid fa-briefcase',        action: () => scrollToSection('experience') },
            { label: 'Go to Projects',            icon: 'fa-solid fa-diagram-project',  action: () => scrollToSection('projects') },
            { label: 'Go to Toolkit',             icon: 'fa-solid fa-screwdriver-wrench', action: () => scrollToSection('tools') },
            { label: 'Go to Contact',             icon: 'fa-solid fa-address-card',     action: () => scrollToSection('contact') },
            { label: 'Download Resume (PDF)',     icon: 'fa-solid fa-file-pdf',         action: () => window.location.href = 'Bijoy_Kumar_Sarkar_CV.pdf' },
            { label: 'View Credit Risk EDA case study', icon: 'fa-solid fa-chart-line', action: () => window.location.href = 'credit-risk-eda.html' },
            { label: 'View RSVP Movies case study', icon: 'fa-solid fa-chart-line',     action: () => window.location.href = 'rsvp-movies-analysis.html' },
            { label: 'Open GitHub',               icon: 'fa-brands fa-github',          action: () => window.open('https://github.com/bijoykrsarkar/', '_blank') },
            { label: 'Open LinkedIn',              icon: 'fa-brands fa-linkedin',        action: () => window.open('https://www.linkedin.com/in/bijoykumarsarkarbks', '_blank') },
            { label: 'Chat on WhatsApp',          icon: 'fa-brands fa-whatsapp',        action: () => window.open('https://wa.me/919123615921', '_blank') },
            { label: 'Copy email address',        icon: 'fa-solid fa-envelope',         action: () => {
                navigator.clipboard.writeText('bijoykrsarkar.bs@gmail.com').then(() => showToast('Email copied to clipboard'));
            }},
        ];

        function scrollToSection(id) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }

        let activeIndex = 0;
        let filtered = commands;

        function renderList() {
            cmdkList.innerHTML = '';
            if (filtered.length === 0) {
                cmdkList.innerHTML = '<div class="cmdk-empty">No matching command</div>';
                return;
            }
            filtered.forEach((cmd, i) => {
                const item = document.createElement('div');
                item.className = 'cmdk-item' + (i === activeIndex ? ' active' : '');
                item.innerHTML = `<i class="${cmd.icon}"></i><span>${cmd.label}</span>`;
                item.addEventListener('click', () => { cmd.action(); closePalette(); });
                cmdkList.appendChild(item);
            });
        }

        function openPalette() {
            cmdkOverlay.classList.add('open');
            cmdkInput.value = '';
            filtered = commands;
            activeIndex = 0;
            renderList();
            setTimeout(() => cmdkInput.focus(), 50);
        }

        function closePalette() {
            cmdkOverlay.classList.remove('open');
        }

        cmdkTrigger.addEventListener('click', openPalette);
        cmdkOverlay.addEventListener('click', (e) => { if (e.target === cmdkOverlay) closePalette(); });

        cmdkInput.addEventListener('input', () => {
            const q = cmdkInput.value.toLowerCase();
            filtered = commands.filter(c => c.label.toLowerCase().includes(q));
            activeIndex = 0;
            renderList();
        });

        cmdkInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); renderList(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); renderList(); }
            else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIndex]) { filtered[activeIndex].action(); closePalette(); } }
            else if (e.key === 'Escape') { closePalette(); }
        });

        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                cmdkOverlay.classList.contains('open') ? closePalette() : openPalette();
            }
            if (e.key === 'Escape') closePalette();
        });
    }

    // --- Cursor click-burst (extends the existing custom cursor, doesn't replace it) ---
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('click', (e) => {
            for (let i = 0; i < 6; i++) {
                const burst = document.createElement('div');
                burst.className = 'click-burst';
                burst.style.left = e.clientX + 'px';
                burst.style.top = e.clientY + 'px';
                document.body.appendChild(burst);
                const angle = (Math.PI * 2 * i) / 6;
                const distance = 20 + Math.random() * 15;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance;
                burst.animate([
                    { transform: 'translate(0, 0)', opacity: 1 },
                    { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
                ], { duration: 500, easing: 'ease-out' }).onfinish = () => burst.remove();
            }
        });
    }

    /* ---------------------------------------------------------
       NEW: Animated number counters for the "Impact by the
       Numbers" section — counts up once, the first time each
       card scrolls into view.
       --------------------------------------------------------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10);
                    const duration = 1500;
                    const startTime = performance.now();

                    function updateCounter(now) {
                        const progress = Math.min((now - startTime) / duration, 1);
                        el.textContent = Math.floor(progress * target);
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            el.textContent = target;
                        }
                    }
                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    /* ---------------------------------------------------------
       NEW: Back to Top button — appears after scrolling down,
       smooth-scrolls to the top on click.
       --------------------------------------------------------- */
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 600);
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------------------------------------------------------
       NEW: Keep the footer copyright year current automatically.
       --------------------------------------------------------- */
    const footerYearEl = document.getElementById('footer-year');
    if (footerYearEl) {
        footerYearEl.textContent = new Date().getFullYear();
    }

    /* ---------------------------------------------------------
       NEW: Subtle UI click sound — a soft synthesized "tick"
       (Web Audio API, no external audio file needed) that plays
       when the user clicks a link, button, or command-palette item.
       --------------------------------------------------------- */
    let clickAudioCtx = null;
    function playClickSound() {
        try {
            if (!clickAudioCtx) {
                clickAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (clickAudioCtx.state === 'suspended') {
                clickAudioCtx.resume();
            }
            const now = clickAudioCtx.currentTime;
            const osc = clickAudioCtx.createOscillator();
            const gain = clickAudioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(720, now);
            osc.frequency.exponentialRampToValueAtTime(380, now + 0.05);
            gain.gain.setValueAtTime(0.07, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
            osc.connect(gain);
            gain.connect(clickAudioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.07);
        } catch (err) {
            // Web Audio unavailable/blocked — fail silently, never breaks the click itself
        }
    }
    document.addEventListener('click', (e) => {
        if (e.target.closest('a, button, .cmdk-item, .cmdk-trigger')) {
            playClickSound();
        }
    }, true);
});
