// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Supabase Configuration
const SUPABASE_URL = 'https://yeluzuphrbptxhlgpugx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllbHV6dXBocmJwdHhobGdwdWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzkyMjQsImV4cCI6MjA4NzQxNTIyNH0.QByaeSt41Z-xiiQOkQ327O5Mh36vJVtun0IO9T9WkHo';
const INVITATION_ID = 'romeo-juliet';
let _supabase;

try {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error("Supabase failed to initialize:", e);
}

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Optimization: Show Splash Screen immediately
window.addEventListener('DOMContentLoaded', () => {
    initSplashAnimations();
});

function initSplashAnimations() {
    // Stop scrolling while splash is active
    lenis.stop();

    // Check for "to" parameter in URL - SET IMMEDIATELY
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const nameSplash = document.getElementById('guest-name-splash');

    if (guestName && nameSplash) {
        nameSplash.textContent = guestName;
        document.title = `Undangan Pernikahan - ${guestName}`;

        // Fast subtle reveal for name
        gsap.fromTo(nameSplash,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
        );
    }

    const openBtn = document.getElementById('open-invitation');
    const splashScreen = document.getElementById('splash-screen');
    const musicBtn = document.getElementById('music-btn');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            // Start the music
            const audio = document.getElementById('bg-music');
            if (audio) {
                audio.play().catch(() => {
                    console.log("Audio play deferred");
                });
                musicBtn.classList.add('playing');
                const icon = musicBtn.querySelector('i');
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            }

            // Animate splash out
            gsap.to(splashScreen, {
                y: "-100%", duration: 1, ease: "expo.inOut",
                onComplete: () => {
                    splashScreen.style.display = 'none';
                    lenis.start();
                    initAnimations();
                }
            });
        });
    }

    // Faster entrance animation for splash content
    gsap.from(".splash-content", {
        y: 20, opacity: 0, duration: 1, ease: "power3.out"
    });
}

function initAnimations() {
    // 1. Pre-set all elements to be invisible but ready for GSAP
    gsap.set(".reveal, .reveal-left, .reveal-right, .fade-in", {
        visibility: "visible",
        opacity: 0
    });

    // 2. Refresh ScrollTrigger once everything is ready
    ScrollTrigger.refresh();

    // Hero Animations (Always play first)
    const heroTl = gsap.timeline();
    heroTl.to(".anime-item", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
        clearProps: "all"
    });

    // Parallax Background Hero
    gsap.to(".parallax-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // 3. Generic Entrance Animation Function
    const createScrollTrigger = (selector, vars) => {
        document.querySelectorAll(selector).forEach((el) => {
            gsap.to(el, {
                ...vars,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%", // Consistent trigger point
                    toggleActions: "play none none none",
                    once: true // Trigger only once
                }
            });
        });
    };

    // Reveal Up (Standard)
    document.querySelectorAll('.reveal').forEach((el) => {
        // Skip elements that are inside grids we want to animate collectively
        if (el.closest('.event-grid') || el.closest('.gallery-grid')) return;

        gsap.fromTo(el, { y: 60, opacity: 0 }, {
            y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true }
        });
    });

    // Special: Synchronized Event Cards
    gsap.fromTo(".event-card", { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out",
        scrollTrigger: {
            trigger: ".event-grid",
            start: "top 85%",
            once: true
        }
    });

    // Manual fromTo for better control on directions
    document.querySelectorAll('.reveal-left').forEach(el => {
        gsap.fromTo(el, { x: -60, opacity: 0 }, {
            x: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true }
        });
    });

    document.querySelectorAll('.reveal-right').forEach(el => {
        gsap.fromTo(el, { x: 60, opacity: 0 }, {
            x: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true }
        });
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        gsap.fromTo(el, { opacity: 0 }, {
            opacity: 1, duration: 1.5, ease: "linear",
            scrollTrigger: { trigger: el, start: "top 90%", once: true }
        });
    });

    // Integrated Parallax for images
    document.querySelectorAll('.parallax-img').forEach((img) => {
        gsap.fromTo(img, { yPercent: -15 }, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Story Background Parallax
    gsap.to("#story-bg", {
        backgroundPositionY: "60%",
        ease: "none",
        scrollTrigger: {
            trigger: ".story-parallax",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Gallery staggered reveal (More reliable than batch for small grids)
    gsap.fromTo(".gallery-item", { scale: 0.9, opacity: 0, y: 30 }, {
        scale: 1, opacity: 1, y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".gallery-grid",
            start: "top 85%",
            once: true
        }
    });

    // Final Refresh after a short delay to account for lazy-loaded images
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

    initLightbox();
    initMusic();
    initCountdown();
    initGuestbook();
    loadWishes();
}

async function loadWishes() {
    if (!_supabase) return;
    try {
        const { data, error } = await _supabase
            .from('guest_wishes')
            .select('*')
            .eq('invitation_id', INVITATION_ID)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const wishList = document.getElementById('wish-list');
        wishList.innerHTML = '';
        if (data) {
            data.forEach(wish => {
                appendWishUI(wish.name, wish.message);
            });
        }
    } catch (e) {
        console.error("Error loading wishes:", e);
    }
}

function appendWishUI(name, message, animate = false) {
    const wishList = document.getElementById('wish-list');
    const item = document.createElement('div');
    item.className = 'wish-item-simple';
    item.style.padding = '15px';
    item.style.background = 'rgba(255,255,255,0.05)';
    item.style.borderRadius = '10px';
    item.style.marginBottom = '10px';
    item.style.border = '1px solid rgba(255,255,255,0.1)';
    item.innerHTML = `<h4 style="margin:0 0 5px 0; color: #f9e0ab;">${name}</h4><p style="margin:0; font-size: 0.9rem;">${message}</p>`;

    if (animate) {
        wishList.prepend(item);
        gsap.from(item, { opacity: 0, scale: 0.9, duration: 0.5 });
    } else {
        wishList.appendChild(item);
    }
}

function initCountdown() {
    const weddingDate = new Date("Oct 22, 2026 09:00:00").getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = d < 10 ? "0" + d : d;
        document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
        document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
        document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;

        if (distance < 0) {
            clearInterval(timer);
            document.querySelector(".countdown-container").innerHTML = "HARI BAHAGIA TELAH TIBA";
        }
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
}

function copyValue(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
        btn.classList.add('btn-success');

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.remove('btn-success');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function initGuestbook() {
    const form = document.getElementById('whatsapp-form');
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('guest-name').value;
        const rsvp = document.getElementById('rsvp-status').value;
        const message = document.getElementById('guest-message').value;

        if (!rsvp) {
            alert("Silakan pilih status kehadiran.");
            return;
        }

        const fullMessage = `[${rsvp}] ${message}`;

        if (_supabase) {
            submitBtn.innerText = "Mengirim...";
            submitBtn.disabled = true;

            const { error } = await _supabase
                .from('guest_wishes')
                .insert([{
                    name: name,
                    message: fullMessage,
                    invitation_id: INVITATION_ID
                }]);

            if (error) {
                alert("Gagal mengirim ucapan: " + error.message);
                submitBtn.innerText = "Kirim Ucapan";
                submitBtn.disabled = false;
            } else {
                appendWishUI(name, fullMessage, true);
                form.reset();
                submitBtn.innerText = "Terkirim!";
                setTimeout(() => {
                    submitBtn.innerText = "Kirim Ucapan Lagi";
                    submitBtn.disabled = false;
                }, 3000);
            }
        }
    });
}

function initMusic() {
    const musicBtn = document.getElementById('music-btn');
    const audio = document.getElementById('bg-music');
    const icon = musicBtn.querySelector('i');
    let isPlaying = false;

    const toggleMusic = () => {
        if (isPlaying) {
            audio.pause();
            musicBtn.classList.remove('playing');
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        } else {
            audio.play().catch(e => console.log("Auto-play blocked by browser. User interaction needed."));
            musicBtn.classList.add('playing');
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        }
        isPlaying = !isPlaying;
    };

    musicBtn.addEventListener('click', toggleMusic);

    // Initial state: ensure disc icon is shown
    icon.classList.remove('fa-play');
    icon.classList.add('fa-compact-disc', 'disc-animation');

    // Auto-play hint: first interaction triggers music
    document.body.addEventListener('click', () => {
        if (!isPlaying) {
            toggleMusic();
        }
    }, { once: true });
}

function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            lenis.stop(); // Stop background scrolling
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lenis.start(); // Resume background scrolling
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) closeLightbox();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeLightbox();
    });
}

// Initialize Everything
window.addEventListener('load', () => {
    // Initial setup if needed, but splash is already handled by DOMContentLoaded
    ScrollTrigger.refresh();
});
