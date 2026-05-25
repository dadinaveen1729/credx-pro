/* ============================================================
   VIC SALON — Main JavaScript
   ============================================================ */

// ---- Page Loader ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 800);
});

// ---- Navigation ----
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav && nav.classList.add('scrolled');
    document.querySelector('.float-top') && document.querySelector('.float-top').classList.add('visible');
  } else {
    nav && nav.classList.remove('scrolled');
    document.querySelector('.float-top') && document.querySelector('.float-top').classList.remove('visible');
  }
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu && mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu && mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger && hamburger.classList.remove('open');
    mobileMenu && mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- Active Nav Link ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
    link.classList.add('active');
  }
});

// ---- Hero Slideshow ----
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.hero-indicator');
let currentSlide = 0;
let slideTimer;

function goToSlide(n) {
  slides[currentSlide] && slides[currentSlide].classList.remove('active');
  indicators[currentSlide] && indicators[currentSlide].classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide] && slides[currentSlide].classList.add('active');
  indicators[currentSlide] && indicators[currentSlide].classList.add('active');
}

function startSlideshow() {
  if (slides.length < 2) return;
  slideTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
}

indicators.forEach((ind, i) => {
  ind.addEventListener('click', () => {
    clearInterval(slideTimer);
    goToSlide(i);
    startSlideshow();
  });
});

if (slides.length) {
  slides[0].classList.add('active');
  indicators[0] && indicators[0].classList.add('active');
  startSlideshow();
}

// ---- Scroll Reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ---- Stats Counter ----
const counters = document.querySelectorAll('.stat-number[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const update = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
        if (current < target) requestAnimationFrame(update);
      };
      update();
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ---- Gender Tabs ----
document.querySelectorAll('.gender-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const group = tab.closest('.gender-tab-group') || tab.parentElement;
    group.querySelectorAll('.gender-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    const section = tab.closest('.service-section') || document;
    section.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const tc = section.querySelector(`#${target}`);
    if (tc) tc.classList.add('active');
  });
});

// ---- Gallery Lightbox ----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const galleryItems = document.querySelectorAll('.gallery-item[data-src]');
let currentGalleryIdx = 0;
const gallerySrcs = [];

galleryItems.forEach((item, i) => {
  gallerySrcs.push(item.dataset.src);
  item.addEventListener('click', () => {
    currentGalleryIdx = i;
    openLightbox(i);
  });
});

function openLightbox(i) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = gallerySrcs[i];
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lightbox-close') && document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox-prev') && document.getElementById('lightbox-prev').addEventListener('click', () => {
  currentGalleryIdx = (currentGalleryIdx - 1 + gallerySrcs.length) % gallerySrcs.length;
  openLightbox(currentGalleryIdx);
});
document.getElementById('lightbox-next') && document.getElementById('lightbox-next').addEventListener('click', () => {
  currentGalleryIdx = (currentGalleryIdx + 1) % gallerySrcs.length;
  openLightbox(currentGalleryIdx);
});
lightbox && lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev') && document.getElementById('lightbox-prev').click();
  if (e.key === 'ArrowRight') document.getElementById('lightbox-next') && document.getElementById('lightbox-next').click();
});

// ---- Scroll To Top ----
document.querySelector('.float-top') && document.querySelector('.float-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Contact Form ----
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<span>Message Sent — We\'ll be in touch</span>';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    setTimeout(() => { btn.innerHTML = original; btn.disabled = false; btn.style.opacity = '1'; }, 4000);
  });
}

// ---- Smooth anchor scrolling ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Timeline Reveal (About page) ----
const timelineItems = document.querySelectorAll('.timeline-item');
if (timelineItems.length) {
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, 100 * i);
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  timelineItems.forEach(item => timelineObserver.observe(item));
}

// ---- Global 3D Tilt on .tilt-card ----
(function() {
  const TILT_MAX = 12;
  function applyTilt(el, e) {
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    el.style.transform = `perspective(900px) rotateX(${-dy * TILT_MAX}deg) rotateY(${dx * TILT_MAX}deg) scale(1.03)`;
  }
  function resetTilt(el) {
    el.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
  }
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      card.style.transition = 'transform 0.1s linear';
      applyTilt(card, e);
    });
    card.addEventListener('mouseleave', () => resetTilt(card));
  });
})();

// ---- Parallax (subtle) ----
const parallaxEls = document.querySelectorAll('[data-parallax]');
if (parallaxEls.length) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

// ---- Day / Night Theme Toggle ----
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('vic-theme');

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    document.body.classList.remove('light-mode');
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
}

// Default dark; apply saved if exists
applyTheme(savedTheme === 'light' ? 'light' : 'dark');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    const newTheme = isLight ? 'dark' : 'light';
    localStorage.setItem('vic-theme', newTheme);
    applyTheme(newTheme);
  });
}

// ---- Reviews Carousel ----
(function() {
  const track = document.querySelector('.reviews-track');
  const cards = document.querySelectorAll('.review-card-v2');
  const prevBtn = document.getElementById('rev-prev');
  const nextBtn = document.getElementById('rev-next');
  const dots = document.querySelectorAll('.rev-dot');
  if (!track || !cards.length) return;

  let current = 0;
  const perView = () => window.innerWidth < 900 ? 1 : 3;

  function updateCarousel() {
    const pw = perView();
    const cardW = track.parentElement.offsetWidth / pw;
    track.style.transform = `translateX(-${current * cardW}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() {
    const max = cards.length - perView();
    current = current >= max ? 0 : current + 1;
    updateCarousel();
  }
  function prev() {
    const max = cards.length - perView();
    current = current <= 0 ? max : current - 1;
    updateCarousel();
  }

  prevBtn && prevBtn.addEventListener('click', prev);
  nextBtn && nextBtn.addEventListener('click', next);
  dots.forEach((d, i) => d.addEventListener('click', () => { current = i; updateCarousel(); }));
  window.addEventListener('resize', updateCarousel);

  // Auto-advance reviews
  setInterval(next, 5000);
  updateCarousel();
})();

