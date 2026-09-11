document.addEventListener('DOMContentLoaded', () => {

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    /* ========================================================
       PRELOADER
       ======================================================== */
    const preloader = document.getElementById('preloader');
    const preloaderPercent = document.getElementById('preloader-percent');
    const batteryFill = document.getElementById('battery-fill');
    const batteryBolt = document.getElementById('battery-bolt');
    const preloaderWelcome = document.getElementById('preloader-welcome');

    if (preloader && preloaderPercent) {
        if (reducedMotion) {
            if (batteryFill) batteryFill.style.width = '100%';
            preloaderPercent.textContent = '100';
            preloader.classList.add('done');
        } else {
            // Uneven, realistic-looking jumps rather than a smooth linear count.
            const steps = [
                { pct: 12, delay: 160 },
                { pct: 25, delay: 260 },
                { pct: 41, delay: 190 },
                { pct: 58, delay: 320 },
                { pct: 67, delay: 150 },
                { pct: 79, delay: 240 },
                { pct: 89, delay: 260 },
                { pct: 96, delay: 190 },
                { pct: 100, delay: 240 }
            ];
            let elapsed = 0;
            steps.forEach((s) => {
                elapsed += s.delay;
                setTimeout(() => {
                    preloaderPercent.textContent = s.pct;
                    if (batteryFill) batteryFill.style.width = s.pct + '%';
                    if (batteryBolt) {
                        batteryBolt.classList.add('flash');
                        setTimeout(() => batteryBolt.classList.remove('flash'), 180);
                    }
                    if (s.pct === 100) {
                        if (preloaderWelcome) preloaderWelcome.classList.add('show');
                        setTimeout(() => preloader.classList.add('done'), 800);
                    }
                }, elapsed);
            });
        }
    }

    /* ========================================================
       STARFIELD CANVAS BACKGROUND
       ======================================================== */
    const starsCanvas = document.getElementById('stars-canvas');
    if (starsCanvas) {
        const ctx = starsCanvas.getContext('2d');
        let stars = [];
        let w, h;

        function resizeCanvas() {
            w = starsCanvas.width = window.innerWidth;
            h = starsCanvas.height = window.innerHeight;
        }
        function initStars() {
            const count = Math.min(180, Math.floor((w * h) / 9000));
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 1.2 + 0.3,
                speed: Math.random() * 0.15 + 0.02,
                alpha: Math.random() * 0.6 + 0.2
            }));
        }
        function paintStatic() {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#ffffff';
            stars.forEach(s => {
                ctx.globalAlpha = s.alpha;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        }
        function drawLoop() {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#ffffff';
            stars.forEach(s => {
                ctx.globalAlpha = s.alpha;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
                s.y += s.speed;
                if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
            });
            ctx.globalAlpha = 1;
            requestAnimationFrame(drawLoop);
        }

        resizeCanvas();
        initStars();
        reducedMotion ? paintStatic() : drawLoop();
        window.addEventListener('resize', () => {
            resizeCanvas();
            initStars();
            if (reducedMotion) paintStatic();
        });
    }

    /* ========================================================
       CUSTOM CURSOR
       ======================================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if (cursorDot && cursorOutline && finePointer) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            if (reducedMotion) {
                cursorOutline.style.left = e.clientX + 'px';
                cursorOutline.style.top = e.clientY + 'px';
            } else {
                cursorOutline.animate(
                    { left: e.clientX + 'px', top: e.clientY + 'px' },
                    { duration: 400, fill: 'forwards' }
                );
            }
        });
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
        });
    }

    /* ========================================================
       HEADER SCROLL STATE + SCROLL PROGRESS
       ======================================================== */
    const header = document.getElementById('main-header');
    const progressBar = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');

    function onScroll() {
        const scrollTop = window.scrollY;
        if (header) header.classList.toggle('scrolled', scrollTop > 40);
        if (progressBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
        }
        if (backToTop) backToTop.classList.toggle('visible', scrollTop > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

    /* ========================================================
       HAMBURGER MENU
       ======================================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        const toggleIcon = () => {
            const icon = hamburger.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        };
        hamburger.addEventListener('click', () => { navLinks.classList.toggle('active'); toggleIcon(); });
        navLinks.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) { navLinks.classList.remove('active'); toggleIcon(); }
            });
        });
    }

    /* ========================================================
       SCROLL REVEAL
       ======================================================== */
    const revealEls = document.querySelectorAll('.scroll-reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => io.observe(el));
        // Safety net: content should never stay permanently invisible if
        // something (an unusual scroll setup, an automated renderer) never
        // fires the intersection the way a normal scroll does.
        setTimeout(() => revealEls.forEach(el => el.classList.add('active')), 4000);
    } else {
        revealEls.forEach(el => el.classList.add('active'));
    }

    /* ========================================================
       ROLE ROTATOR (hero headline)
       ======================================================== */
    const roleEl = document.getElementById('role-rotator');
    if (roleEl) {
        const roles = ['Data Analyst', 'Quality Analyst', 'Operations & Business Support'];
        let idx = 0;
        setInterval(() => {
            roleEl.style.opacity = '0';
            roleEl.style.transform = 'translateY(8px)';
            setTimeout(() => {
                idx = (idx + 1) % roles.length;
                roleEl.textContent = roles[idx];
                roleEl.style.opacity = '1';
                roleEl.style.transform = 'translateY(0)';
            }, reducedMotion ? 0 : 350);
        }, 2800);
    }

    /* ========================================================
       LIVE IST CLOCK
       ======================================================== */
    const clockEl = document.getElementById('live-ist-clock');
    if (clockEl) {
        const updateClock = () => {
            clockEl.textContent = new Date().toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true
            }) + ' IST';
        };
        updateClock();
        setInterval(updateClock, 30000);
    }

    /* ========================================================
       STAT COUNTERS
       ======================================================== */
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length) {
        const animateCount = (el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            if (reducedMotion) { el.textContent = target; return; }
            const duration = 1200;
            const start = performance.now();
            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                el.textContent = Math.floor(progress * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target;
            };
            requestAnimationFrame(step);
        };
        if ('IntersectionObserver' in window) {
            const countObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) { animateCount(entry.target); countObserver.unobserve(entry.target); }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
            statNumbers.forEach(el => countObserver.observe(el));
        } else {
            statNumbers.forEach(animateCount);
        }
        // Safety net: if a counter never triggered (fast/unusual scroll), snap it to target.
        setTimeout(() => {
            statNumbers.forEach(el => { if (el.textContent === '0') el.textContent = el.getAttribute('data-target'); });
        }, 5000);
    }

    /* ========================================================
       SKILLS RADAR CHART
       ======================================================== */
    const radarCanvas = document.getElementById('skillsRadarChart');
    if (radarCanvas && window.Chart) {
        new Chart(radarCanvas, {
            type: 'radar',
            data: {
                labels: ['Python', 'SQL', 'Tableau', 'Adv. Excel', 'Google Analytics', 'R'],
                datasets: [{
                    label: 'Self-rated (out of 10)',
                    data: [8, 8, 8, 9, 7, 5],
                    backgroundColor: 'rgba(78, 242, 210, 0.15)',
                    borderColor: '#4ef2d2',
                    pointBackgroundColor: '#bc7eff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                animation: reducedMotion ? false : undefined,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.08)' },
                        grid: { color: 'rgba(255,255,255,0.08)' },
                        pointLabels: { color: '#9ca3af', font: { size: 11 } },
                        ticks: { display: false },
                        suggestedMin: 0, suggestedMax: 10
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    /* ========================================================
       GITHUB STATS FALLBACK
       The public github-readme-stats demo is known to be rate-limited /
       unreliable, so this makes sure a failed load never shows as a
       broken image — it swaps to a clean fallback card instead.
       ======================================================== */
    const githubImg = document.getElementById('github-stats-img');
    const githubFallback = document.getElementById('github-stats-fallback');
    if (githubImg && githubFallback) {
        // If it hasn't loaded within 6s (slow/stalled), or errors out, show the fallback.
        const showFallback = () => {
            githubImg.classList.add('hidden');
            githubFallback.classList.add('show');
        };
        const stallTimer = setTimeout(showFallback, 6000);
        githubImg.addEventListener('error', () => { clearTimeout(stallTimer); showFallback(); }, { once: true });
        githubImg.addEventListener('load', () => clearTimeout(stallTimer), { once: true });
        if (githubImg.complete && githubImg.naturalWidth === 0) showFallback();
    }

    /* ========================================================
       VCARD DOWNLOAD
       ======================================================== */
    const vcardBtn = document.getElementById('vcard-btn');
    if (vcardBtn) {
        vcardBtn.addEventListener('click', () => {
            const vcard = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                'N:Sarkar;Bijoy;Kumar;;',
                'FN:Bijoy Kumar Sarkar',
                'TITLE:Data Analyst and Quality Analytics Professional',
                'EMAIL:bijoykrsarkar.bs@gmail.com',
                'TEL;TYPE=CELL:+919123615921',
                'URL:https://portfolio-bijoy-kumar-sarkar.vercel.app',
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
            showToast('Contact card saved');
        });
    }

    /* ========================================================
       CLICK BURST + CLICK SOUND
       ======================================================== */
    let audioCtx;
    function playClickSound() {
        try {
            audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.12);
        } catch (e) { /* Web Audio unavailable — fail silently */ }
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) playClickSound();
        if (reducedMotion) return;
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-burst';
            particle.style.left = e.clientX + 'px';
            particle.style.top = e.clientY + 'px';
            document.body.appendChild(particle);
            const angle = (Math.PI * 2 * i) / 5;
            const distance = 20 + Math.random() * 20;
            particle.animate([
                { transform: 'translate(0, 0)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`, opacity: 0 }
            ], { duration: 500, easing: 'ease-out' }).onfinish = () => particle.remove();
        }
    });

    /* ========================================================
       TOAST HELPER
       ======================================================== */
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#111118;color:#fff;padding:12px 22px;border-radius:8px;font-size:0.85rem;z-index:10003;border:1px solid rgba(78,242,210,0.3);box-shadow:0 10px 30px rgba(0,0,0,0.5);opacity:0;transition:opacity 0.3s ease;';
        document.body.appendChild(toast);
        requestAnimationFrame(() => { toast.style.opacity = '1'; });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2200);
    }

    /* ========================================================
       COMMAND PALETTE
       ======================================================== */
    const cmdkTrigger = document.getElementById('cmdk-trigger');
    const cmdkOverlay = document.getElementById('cmdk-overlay');
    const cmdkInput = document.getElementById('cmdk-input');
    const cmdkList = document.getElementById('cmdk-list');

    function scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        closePalette();
    }

    const commands = [
        { icon: 'fa-solid fa-user', label: 'Go to About', action: () => scrollToSection('about') },
        { icon: 'fa-solid fa-briefcase', label: 'Go to Experience', action: () => scrollToSection('experience') },
        { icon: 'fa-solid fa-toolbox', label: 'Go to Toolkit', action: () => scrollToSection('tools') },
        { icon: 'fa-solid fa-diagram-project', label: 'Go to Approach', action: () => scrollToSection('approach') },
        { icon: 'fa-solid fa-code', label: 'Go to Projects', action: () => scrollToSection('projects') },
        { icon: 'fa-solid fa-envelope', label: 'Go to Contact', action: () => scrollToSection('contact') },
        { icon: 'fa-solid fa-download', label: 'Download CV (PDF)', action: () => { window.open('Bijoy_Kumar_Sarkar_CV.pdf', '_blank'); closePalette(); } },
        { icon: 'fa-brands fa-github', label: 'Open GitHub', action: () => { window.open('https://github.com/bijoykrsarkar/', '_blank'); closePalette(); } },
        { icon: 'fa-brands fa-linkedin', label: 'Open LinkedIn', action: () => { window.open('https://www.linkedin.com/in/bijoykumarsarkarbks', '_blank'); closePalette(); } },
        { icon: 'fa-brands fa-whatsapp', label: 'Message on WhatsApp', action: () => { window.open('https://wa.me/919123615921', '_blank'); closePalette(); } },
        { icon: 'fa-solid fa-copy', label: 'Copy Email Address', action: () => {
            navigator.clipboard.writeText('bijoykrsarkar.bs@gmail.com').then(() => showToast('Email copied to clipboard'));
            closePalette();
        } }
    ];

    let activeIndex = -1;
    let currentFiltered = [];

    function setActive(i) {
        activeIndex = i;
        [...cmdkList.children].forEach((el, idx) => el.classList.toggle('active', idx === i));
    }

    function renderList(filter = '') {
        currentFiltered = commands.filter(c => c.label.toLowerCase().includes(filter.toLowerCase()));
        cmdkList.innerHTML = '';
        if (!currentFiltered.length) {
            cmdkList.innerHTML = '<div class="cmdk-empty">No matching commands</div>';
            activeIndex = -1;
            return;
        }
        currentFiltered.forEach((cmd, i) => {
            const item = document.createElement('div');
            item.className = 'cmdk-item' + (i === 0 ? ' active' : '');
            item.innerHTML = `<i class="${cmd.icon}"></i><span>${cmd.label}</span>`;
            item.addEventListener('click', () => cmd.action());
            item.addEventListener('mouseenter', () => setActive(i));
            cmdkList.appendChild(item);
        });
        activeIndex = 0;
    }

    function openPalette() {
        cmdkOverlay.classList.add('open');
        cmdkInput.value = '';
        renderList();
        setTimeout(() => cmdkInput.focus(), 50);
    }
    function closePalette() {
        cmdkOverlay.classList.remove('open');
    }

    if (cmdkTrigger && cmdkOverlay) {
        cmdkTrigger.addEventListener('click', openPalette);
        cmdkOverlay.addEventListener('click', (e) => { if (e.target === cmdkOverlay) closePalette(); });
        cmdkInput.addEventListener('input', () => renderList(cmdkInput.value));
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                cmdkOverlay.classList.contains('open') ? closePalette() : openPalette();
                return;
            }
            if (!cmdkOverlay.classList.contains('open')) return;
            if (e.key === 'Escape') { closePalette(); return; }
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(activeIndex + 1, currentFiltered.length - 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(activeIndex - 1, 0)); }
            else if (e.key === 'Enter' && currentFiltered[activeIndex]) { currentFiltered[activeIndex].action(); }
        });
    }

    /* ========================================================
       FOOTER YEAR
       ======================================================== */
    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    /* ========================================================
       CONSOLE EASTER EGG
       ======================================================== */
    console.log('%cLooking for something?', 'color:#4ef2d2; font-size:18px; font-weight:bold;');
    console.log('%cThis site got the same treatment as my day job — audited carefully. Found a bug anyway? I\'d genuinely like to know: bijoykrsarkar.bs@gmail.com', 'color:#9ca3af; font-size:12px;');

});
