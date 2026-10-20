/* ============================================================
   UGANDA NATIONAL WASTE MANAGEMENT - SHARED JAVASCRIPT
   Author: UNWM Dev Team
   Description: Global scripts used across all pages
   ============================================================ */

'use strict';
/* ============================================================
   LOAD CHATBOT (auto-injects on every page)
   ============================================================ */
(function loadChatbot() {
  // Skip chatbot on admin/worker pages
  const path = window.location.pathname;
  if (path.includes('admin') || path.includes('worker-dashboard')) return;

  const isHtmlDir = path.includes('/html/') || path.includes('\\html\\');
  const cssPath = isHtmlDir ? '../css/chatbot.css' : 'css/chatbot.css';
  const jsPath = isHtmlDir ? '../js/chatbot.js' : 'js/chatbot.js';

  // Inject CSS
  if (!document.querySelector('link[data-chatbot-css]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    link.setAttribute('data-chatbot-css', 'true');
    document.head.appendChild(link);
  }

  // Inject JS
  if (!document.querySelector('script[data-chatbot-js]')) {
    const script = document.createElement('script');
    script.src = jsPath;
    script.setAttribute('data-chatbot-js', 'true');
    script.defer = true;
    document.head.appendChild(script);
  }
})();

/* ---------- MOBILE NAVIGATION (LUXURY SIDE DRAWER) ---------- */
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    // 1. Ensure backdrop overlay exists
    let backdrop = document.getElementById('navDrawerBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'navDrawerBackdrop';
      backdrop.className = 'nav-drawer-backdrop';
      document.body.appendChild(backdrop);
    }

    // Determine path prefix based on current location
    const isInsideHtmlDir = window.location.pathname.includes('/html/');
    const logoSrc = isInsideHtmlDir ? '../assets/logo.svg' : 'assets/logo.svg';
    const contactHref = isInsideHtmlDir ? 'contact.html' : 'html/contact.html';

    // 2. Inject drawer header if not already present in markup
    if (!navMenu.querySelector('.drawer-header-item')) {
      const headerItem = document.createElement('li');
      headerItem.className = 'drawer-header-item';
      headerItem.innerHTML = `
        <div class="drawer-logo-badge">
          <img src="${logoSrc}" alt="UNWM Logo">
        </div>
        <button type="button" class="drawer-close-btn" id="drawerCloseBtn" aria-label="Close navigation">
          <i class="fas fa-times"></i>
        </button>
      `;
      navMenu.insertBefore(headerItem, navMenu.firstChild);
    }

    // 3. Inject subtitles for key links if not present
    const linkSubtitles = {
      'districts.html': 'All 135+ Municipalities',
      'booking.html': 'Instant ETA · Quick Dispatch',
      'track.html': 'Live Truck GPS · Status'
    };

    navMenu.querySelectorAll('li > a.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      for (const [key, subtitleText] of Object.entries(linkSubtitles)) {
        if (href.includes(key)) {
          const parentLi = link.parentElement;
          if (!parentLi.querySelector('.drawer-subtext')) {
            const sub = document.createElement('span');
            sub.className = 'drawer-subtext';
            sub.textContent = subtitleText;
            parentLi.appendChild(sub);
          }
        }
      }
    });

    // 4. Inject drawer footer (Divider + White Pill Contact Button + Social Row) if not present
    if (!navMenu.querySelector('.drawer-footer-item')) {
      const footerItem = document.createElement('li');
      footerItem.className = 'drawer-footer-item';
      footerItem.innerHTML = `
        <hr class="drawer-divider">
        <a href="${contactHref}" class="drawer-contact-btn">Contact</a>
        <div class="drawer-social-row">
          <a href="https://linkedin.com/company/unwm-uganda" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="https://x.com/unwm_uganda" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://youtube.com/@unwmuganda" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
          <a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
      `;
      navMenu.appendChild(footerItem);
    }

    function openNav() {
      navMenu.classList.add('open');
      backdrop.classList.add('active');
      document.body.classList.add('nav-drawer-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeNav() {
      navMenu.classList.remove('open');
      backdrop.classList.remove('active');
      document.body.classList.remove('nav-drawer-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    // Toggle on hamburger click
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (navMenu.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close button inside side drawer (event delegation for 100% reliability)
    navMenu.addEventListener('click', function (e) {
      if (e.target.closest('#drawerCloseBtn')) {
        e.preventDefault();
        e.stopPropagation();
        closeNav();
      }
    });

    // Close on backdrop click
    backdrop.addEventListener('click', closeNav);

    // Close menu when clicking any nav link or CTA button
    navMenu.querySelectorAll('a').forEach(el => {
      el.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          closeNav();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeNav();
      }
    });

    // Reset menu state when resized back to desktop (> 1024px)
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && navMenu.classList.contains('open')) {
        closeNav();
      }
    });
  }

  // Highlight active nav link based on current page
  highlightActiveNav();

  // Animate elements on scroll
  initScrollAnimations();

  // Initialize tooltips
  initTooltips();

  // Set current year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ---------- HIGHLIGHT ACTIVE NAV ---------- */
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const targetPage = href.split('/').pop();
    if (targetPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ---------- SCROLL ANIMATIONS ---------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ---------- SIMPLE TOOLTIPS ---------- */
function initTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', function () {
      const tip = document.createElement('div');
      tip.className = 'tooltip-popup';
      tip.textContent = this.dataset.tooltip;
      tip.style.cssText = `
        position: absolute; background: #1f262b; color: #fff;
        padding: 0.5rem 0.9rem; border-radius: 6px; font-size: 0.8rem;
        z-index: 9999; pointer-events: none; white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(tip);
      const rect = this.getBoundingClientRect();
      tip.style.top = (rect.top + window.scrollY - tip.offsetHeight - 8) + 'px';
      tip.style.left = (rect.left + window.scrollX + rect.width / 2 - tip.offsetWidth / 2) + 'px';
      this._tooltip = tip;
    });

    el.addEventListener('mouseleave', function () {
      if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
      }
    });
  });
}

/* ---------- FORM VALIDATION HELPERS ---------- */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^\+?[0-9\s\-()]{9,15}$/;
  return re.test(phone);
}

function showFormAlert(formId, type, message) {
  const form = document.getElementById(formId);
  if (!form) return;
  const existing = form.querySelector('.alert');
  if (existing) existing.remove();

  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  const icons = {
    success: 'check-circle',
    danger: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  alert.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i><span>${message}</span>`;
  form.insertBefore(alert, form.firstChild);

  setTimeout(() => alert.remove(), 6000);
}

/* ---------- LOCAL STORAGE HELPERS ---------- */
const UNWMStorage = {
  set(key, value) {
    try {
      localStorage.setItem('unwm_' + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage error:', e);
      return false;
    }
  },
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem('unwm_' + key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem('unwm_' + key);
    } catch (e) { /* ignore */ }
  }
};

/* ---------- ETA CALCULATION ---------- */
function calculateETA(wasteType, volume, district, urgency) {
  let baseHours = 3;

  // Volume factor
  const volStr = String(volume).toLowerCase();
  if (volStr.includes('truck') || volStr.includes('large') || volStr.includes('bulk')) {
    baseHours += 4;
  } else if (volStr.includes('sack') || volStr.includes('bag')) {
    baseHours += 1;
  } else if (volStr.includes('small') || volStr.includes('little')) {
    baseHours -= 1;
  }

  // Waste type factor
  const hazardousTypes = ['medical', 'electronic', 'chemical', 'hazardous'];
  if (hazardousTypes.some(t => wasteType.toLowerCase().includes(t))) {
    baseHours += 3;
  }

  // District factor
  const majorCities = ['Kampala', 'Gulu', 'Mbarara', 'Jinja'];
  if (majorCities.includes(district)) {
    baseHours -= 1;
  } else {
    baseHours += 1;
  }

  // Urgency factor
  if (urgency === 'urgent') baseHours = Math.max(1, baseHours - 2);
  if (urgency === 'emergency') baseHours = 1;

  // Clamp
  baseHours = Math.max(1, Math.min(12, baseHours));

  const minHours = Math.max(1, baseHours - 1);
  const maxHours = baseHours + 2;

  return {
    min: minHours,
    max: maxHours,
    display: `${minHours}-${maxHours} hours`,
    priority: urgency === 'emergency' ? 'High' : urgency === 'urgent' ? 'Medium' : 'Normal'
  };
}

/* ---------- TOAST NOTIFICATIONS ---------- */
function showToast(message, type = 'success', duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
      position: fixed; top: 1.5rem; right: 1.5rem; z-index: 9999;
      display: flex; flex-direction: column; gap: 0.75rem; max-width: 360px;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const colors = {
    success: { bg: '#27ae60', icon: 'check-circle' },
    error: { bg: '#c0392b', icon: 'exclamation-circle' },
    warning: { bg: '#f5a623', icon: 'exclamation-triangle' },
    info: { bg: '#2980b9', icon: 'info-circle' }
  };
  const c = colors[type] || colors.info;

  toast.style.cssText = `
    background: ${c.bg}; color: white; padding: 1rem 1.25rem;
    border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem;
    font-weight: 500; transform: translateX(120%); transition: transform 0.3s ease;
    opacity: 0.98;
  `;
  toast.innerHTML = `<i class="fas fa-${c.icon}" style="font-size:1.15rem;"></i><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

/* ---------- SMOOTH SCROLL TO ANCHOR ---------- */
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const targetId = link.getAttribute('href');
  if (targetId === '#' || targetId === '') return;
  const target = document.querySelector(targetId);
  if (target) {
    e.preventDefault();
    const headerOffset = 90;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
});

/* ---------- NUMBER COUNTER ANIMATION ---------- */
function animateCounter(el, target, duration = 1800) {
  const start = 0;
  const startTime = performance.now();
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutQuart
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * eased);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ---------- INIT COUNTERS ON VIEW ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        if (!isNaN(target)) animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

document.addEventListener('DOMContentLoaded', initCounters);

/* ---------- EXPORT FOR USE ---------- */
window.UNWM = {
  validateEmail,
  validatePhone,
  showFormAlert,
  showToast,
  calculateETA,
  storage: UNWMStorage,
  animateCounter
};
/* ---------- HERO SLIDESHOW ---------- */
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return; // Exit if no slides on this page

  let currentSlide = 0;
  const slideInterval = 5000; // Change image every 5 seconds

  function nextSlide() {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    
    // Move to next slide (loop back to 0 if at end)
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
  }

  // Start the slideshow
  setInterval(nextSlide, slideInterval);
}

// Initialize the slideshow when the page loads
document.addEventListener('DOMContentLoaded', function() {
  initHeroSlideshow();
});
/* ---------- DYNAMIC NAV AUTH BUTTON ---------- */
function updateNavAuthButton() {
  const btn = document.getElementById('navAuthBtn');
  if (!btn) return;

  const path = window.location.pathname;
  const isHtmlDir = path.includes('/html/') || path.includes('\\html\\');
  const prefix = isHtmlDir ? '' : 'html/';

  const user = localStorage.getItem('unwm_user');
  const logged = localStorage.getItem('unwm_user_logged') === 'true' || 
                 sessionStorage.getItem('unwm_user_logged') === 'true';

  if (user && logged) {
    try {
      const u = JSON.parse(user);
      const firstName = u.firstName || 'Profile';
      btn.innerHTML = `<a href="${prefix}profile.html" class="btn btn-sm"><i class="fas fa-user-circle"></i> ${firstName}</a>`;
    } catch (e) {
      btn.innerHTML = `<a href="${prefix}profile.html" class="btn btn-sm"><i class="fas fa-user-circle"></i> Profile</a>`;
    }
  } else {
    btn.innerHTML = `<a href="${prefix}login.html" class="btn btn-sm"><i class="fas fa-user"></i> Login</a>`;
  }
}

/* ============================================================
   DARK MODE THEME TOGGLE (AccommodateMe Floating Sun/Moon Switch)
   ============================================================ */
(function initTheme() {
  const savedTheme = localStorage.getItem('unwm_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Inject floating theme button on all pages
    if (!document.getElementById('themeToggleBtn')) {
      const btn = document.createElement('button');
      btn.id = 'themeToggleBtn';
      btn.className = 'theme-toggle-btn';
      btn.setAttribute('aria-label', 'Toggle Dark Mode');
      btn.innerHTML = `
        <svg class="sun-icon" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"/></svg>
        <svg class="moon-icon" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4C12.92 3.04 12.46 3 12 3zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7c.18 0 .36.01.53.03-1.63 1.1-2.78 2.87-3.23 4.97h2.11c.36-1.12 1.04-2.09 1.93-2.82C12.87 8.01 13 8.98 13 10c0 2.21 1.79 4 4 4 1.02 0 1.99-.13 2.88-.34-.73.89-1.7 1.57-2.82 1.93v2.11c2.1-.45 3.87-1.6 4.97-3.23.02.17.03.35.03.53 0 3.86-3.14 7-7 7z" fill="none"/><path d="M9.37 5.51c-.18.61-.27 1.25-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.74 0 1.38-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49z"/></svg>
      `;
      document.body.appendChild(btn);

      btn.addEventListener('click', function () {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('unwm_theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('unwm_theme', 'dark');
        }
      });
    }
  });
})();

// Run on every page load
document.addEventListener('DOMContentLoaded', updateNavAuthButton);