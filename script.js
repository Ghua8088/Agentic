document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initScrollAnimations();
    fetchReleases();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initTabs();
    initDocSearch();
    initCopyButtons();
    initMouseGlow();
    initColorCycle();
    initScrollParallax();
});

/* -------------------------------------------------------------------------- */
/*                             Scroll Parallax                                */
/* -------------------------------------------------------------------------- */
function initScrollParallax() {
    const showcase = document.querySelector('.image-showcase');
    if (!showcase) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.05;
        showcase.style.transform = `translate3d(0, ${-rate}px, 0) rotateX(${scrolled * 0.01}deg)`;
    });
}

/* -------------------------------------------------------------------------- */
/*                            Color Cycling Engine                            */
/* -------------------------------------------------------------------------- */
function initColorCycle() {
    let phase = 0;
    let baseSpeed = 0.0004;
    let currentSpeed = baseSpeed;
    let targetSpeed = baseSpeed;
    let lastTime = 0;
    const throttle = 30; // Update every 30ms (~33fps) for performance

    // Kinetic Mouse Energy: Speed up drift on movement
    window.addEventListener('mousemove', () => {
        targetSpeed = 0.005; // Quick burst
        setTimeout(() => targetSpeed = baseSpeed, 200); // Decay back
    });

    function updateColor(timestamp) {
        if (timestamp - lastTime < throttle) {
            requestAnimationFrame(updateColor);
            return;
        }
        lastTime = timestamp;

        // Smoothly interpolate speed for "Momentum" feel
        currentSpeed += (targetSpeed - currentSpeed) * 0.05;
        phase += currentSpeed;

        // Multi-harmonic oscillator
        const r = (Math.sin(phase) * 40 + Math.sin(phase * 0.5) * 20) + 160;
        const g = (Math.sin(phase * 0.7 + 2) * 40 + Math.sin(phase * 0.3) * 20) + 160;
        const b = (Math.sin(phase * 1.3 + 4) * 40 + Math.sin(phase * 0.8) * 20) + 160;

        // Luma Calculation (Perceived Brightness)
        // L = 0.299R + 0.587G + 0.114B
        const luma = (0.299 * r) + (0.587 * g) + (0.114 * b);
        const contrastColor = luma > 200 ? '#000000' : '#ffffff';

        const color = `rgb(${r}, ${g}, ${b})`;
        const glow = `rgba(${r}, ${g}, ${b}, 0.4)`;
        
        const rs = (Math.sin(phase + 1.5) * 50) + 150;
        const gs = (Math.sin(phase * 0.8 + 3.5) * 50) + 150;
        const bs = (Math.sin(phase * 1.2 + 5.5) * 50) + 150;
        const secondary = `rgb(${rs}, ${gs}, ${bs})`;

        document.documentElement.style.setProperty('--accent-primary', color);
        document.documentElement.style.setProperty('--accent-secondary', secondary);
        document.documentElement.style.setProperty('--accent-glow', glow);
        document.documentElement.style.setProperty('--accent-contrast', contrastColor);

        requestAnimationFrame(updateColor);
    }

    requestAnimationFrame(updateColor);
}

/* -------------------------------------------------------------------------- */
/*                             Mouse Glow                                     */
/* -------------------------------------------------------------------------- */
function initMouseGlow() {
    const glow = document.getElementById('ambient-glow');
    if (!glow) return;

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        glow.style.setProperty('--mouse-x', `${x}%`);
        glow.style.setProperty('--mouse-y', `${y}%`);
    });
}

/* -------------------------------------------------------------------------- */
/*                             Doc Search                                     */
/* -------------------------------------------------------------------------- */
function initDocSearch() {
    const input = document.getElementById('docs-search');
    const content = document.getElementById('docs-content');
    
    if (!input || !content) return;

    // Cache original content to restore later
    const blocks = content.querySelectorAll('.doc-block');

    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();

        blocks.forEach(block => {
            const text = block.innerText.toLowerCase();
            const shouldShow = text.includes(term);
            
            block.style.display = shouldShow ? 'block' : 'none';
        });
    });
}

/* -------------------------------------------------------------------------- */
/*                             Copy Code                                      */
/* -------------------------------------------------------------------------- */
function initCopyButtons() {
    const codeBlocks = document.querySelectorAll('.code-example, .markdown-body pre');
    
    codeBlocks.forEach(block => {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);

        // Create button
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.innerHTML = '<i data-lucide="copy" width="16"></i>';
        wrapper.appendChild(btn);

        btn.addEventListener('click', () => {
            const code = block.innerText;
            navigator.clipboard.writeText(code).then(() => {
                btn.innerHTML = '<i data-lucide="check" width="16"></i>';
                setTimeout(() => {
                    btn.innerHTML = '<i data-lucide="copy" width="16"></i>';
                    lucide.createIcons();
                }, 2000);
            });
        });
    });
    lucide.createIcons();
}

/* -------------------------------------------------------------------------- */
/*                                Tab Logic                                   */
/* -------------------------------------------------------------------------- */
function initTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanels = document.querySelectorAll('.tab-panel');

    function switchTab(tabId) {
        window.location.hash = tabId;

        tabLinks.forEach(link => {
            if (link.dataset.tab === tabId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        tabPanels.forEach(panel => {
            if (panel.id === tabId) {
                panel.classList.add('active');
                const animatedElements = panel.querySelectorAll('.animate-on-scroll');
                animatedElements.forEach(el => el.classList.add('visible'));
            } else {
                panel.classList.remove('active');
            }
        });

        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const tabId = link.dataset.tab;
            if (tabId) {
                e.preventDefault();
                switchTab(tabId);
            }
        });
    });

    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        switchTab(initialHash);
    }

    document.querySelectorAll('.inner-doc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/*                                Back To Top                                 */
/* -------------------------------------------------------------------------- */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* -------------------------------------------------------------------------- */
/*                               Scroll Animations                            */
/* -------------------------------------------------------------------------- */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not(.tab-link):not(.inner-doc-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                const navLinks = document.querySelector('.nav-links');
                const hamburger = document.querySelector('.hamburger');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

async function fetchReleases() {
    const container = document.getElementById('release-container');
    const status = document.getElementById('release-status');
    const navBtn = document.getElementById('nav-download-btn');
    const heroBtn = document.getElementById('hero-download-btn');
    const os = getOS();

    if (!container) return;
    updateDownloadButtons(os, navBtn, heroBtn, null);

    try {
        const response = await fetch('https://api.github.com/repos/Ghua8088/Agentic_release/releases', {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        
        if (response.status === 403) throw new Error('API Rate Limited');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const releases = await response.json();

        if (releases && Array.isArray(releases) && releases.length > 0) {
            const latest = releases[0];
            if(status) status.textContent = `Latest Version: ${latest.tag_name}`;
            updateDownloadButtons(os, navBtn, heroBtn, latest);
            renderReleases(releases.slice(0, 3), container);
        } else {
            renderBetaState(container, status, navBtn, heroBtn);
        }
    } catch (error) {
        console.error('Error fetching releases:', error);
        if(status) status.textContent = "Unable to load latest version info.";
        container.innerHTML = `
            <div class="release-card" style="text-align: center; border-style: dashed; opacity: 0.7;">
                <i data-lucide="alert-circle" style="margin-bottom: 1rem; color: #ff4d4d; width: 48px; height: 48px;"></i>
                <p>GitHub API limit reached or connection failed.</p>
                <a href="https://github.com/Ghua8088/Agentic_release/releases" target="_blank" class="btn btn-outline" style="margin-top: 1rem;">View on GitHub</a>
            </div>
        `;
        lucide.createIcons();
    }
}

function getOS() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

    if (macosPlatforms.indexOf(platform) !== -1) return 'macOS';
    if (iosPlatforms.indexOf(platform) !== -1) return 'iOS';
    if (windowsPlatforms.indexOf(platform) !== -1) return 'Windows';
    if (/Android/.test(userAgent)) return 'Android';
    if (/Linux/.test(platform)) return 'Linux';

    return 'Unknown';
}

function updateDownloadButtons(os, navBtn, heroBtn, latestRelease) {
    if (!navBtn || !heroBtn) return;

    let downloadUrl = "https://github.com/Ghua8088/Agentic_release/releases";
    let btnText = latestRelease ? `Download ${latestRelease.tag_name}` : "Download";

    if (os === 'Android' || os === 'iOS') {
        btnText = "Desktop Only";
        navBtn.classList.add('disabled');
        heroBtn.classList.add('disabled');
    } else {
        navBtn.classList.remove('disabled');
        heroBtn.classList.remove('disabled');

        if (latestRelease) {
            const assets = latestRelease.assets || [];
            let matchedAsset = null;

            if (os === 'Windows') matchedAsset = assets.find(a => a.name.endsWith('.exe') || a.name.endsWith('.msi'));
            else if (os === 'macOS') matchedAsset = assets.find(a => a.name.endsWith('.dmg') || a.name.endsWith('.pkg'));
            else if (os === 'Linux') matchedAsset = assets.find(a => a.name.endsWith('.AppImage') || a.name.endsWith('.deb') || a.name.endsWith('.rpm'));

            if (matchedAsset) {
                downloadUrl = matchedAsset.browser_download_url;
                btnText = `Download for ${os}`;
            }
        }
    }

    navBtn.textContent = btnText;
    navBtn.href = downloadUrl;
    heroBtn.textContent = btnText;
    heroBtn.href = downloadUrl;
}

function renderReleases(releases, container) {
    if (!container) return;
    const parser = (typeof marked !== 'undefined' && marked.parse) ? marked.parse : (txt) => txt;
    
    container.innerHTML = releases.map((release, index) => {
        let bodyContent = "No release notes provided.";
        try { bodyContent = parser(release.body || bodyContent); } catch (e) { bodyContent = release.body || bodyContent; }

        return `
            <div class="release-card animate-on-scroll visible" style="transition-delay: ${index * 100}ms">
                <div class="release-header">
                    <div class="version-badge">${release.tag_name}</div>
                    <div class="release-meta">
                        <span class="release-date">${new Date(release.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <a href="${release.html_url}" target="_blank" class="github-link" aria-label="View on GitHub"><i data-lucide="github"></i></a>
                    </div>
                </div>
                <div class="release-body markdown-body">${bodyContent}</div>
            </div>
        `;
    }).join('');
    lucide.createIcons();
}

function renderBetaState(container, status, navBtn, heroBtn) {

    if(status) status.textContent = "Status: Private Beta";

    if(container) {

        container.innerHTML = `<div class="beta-card animate-on-scroll"><i data-lucide="sparkles"></i><h3>Coming Soon</h3><p>Agentic is currently in private beta. Join our community for early access!</p></div>`;

    }

    if (navBtn) navBtn.textContent = "Beta Access";

    if (heroBtn) heroBtn.textContent = "Beta Access";

    lucide.createIcons();

}
