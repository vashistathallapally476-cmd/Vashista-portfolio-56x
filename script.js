/* ============================
   script.js — Vashista Portfolio
   ============================ */

// ─── Loader ───────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      // Trigger hero animations after loader
      document.querySelectorAll('.reveal-up, .reveal-right').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    }
  }, 2000);
});

// ─── Custom Cursor ────────────────────────────────────
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  outlineX += (mouseX - outlineX) * 0.12;
  outlineY += (mouseY - outlineY) * 0.12;
  cursorOutline.style.left = outlineX + 'px';
  cursorOutline.style.top = outlineY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ─── Navbar Scroll ────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── Hamburger / Mobile Menu ──────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ─── Typed Text ───────────────────────────────────────
const typedEl = document.getElementById('typedText');
const roles = [
  'Software Engineer',
  'Full-Stack Developer',
  'Java & Spring Boot Dev',
  'React.js Builder',
  'DSA Enthusiast',
  'Problem Solver',
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 90;

function typeEffect() {
  const currentRole = roles[roleIndex];
  if (!isDeleting) {
    typedEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // pause before deleting
    } else {
      typingSpeed = 90;
    }
  } else {
    typedEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 300;
    } else {
      typingSpeed = 50;
    }
  }
  setTimeout(typeEffect, typingSpeed);
}
setTimeout(typeEffect, 2400);

// ─── Counter Animation ────────────────────────────────
function animateCounter(el) {
  const isDecimal = el.dataset.decimal === 'true';
  const target = parseFloat(el.dataset.target);
  const duration = 1600;
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = isDecimal ? (eased * target).toFixed(2) : Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(2) : target + '+';
  };
  requestAnimationFrame(update);
}

// ─── Scroll-based Reveals & Skill Bars ───────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    // Reveal animations for sections
    if (el.classList.contains('reveal-scroll')) {
      el.classList.add('visible');
    }

    // Achievement cards stagger
    if (el.classList.contains('ach-card')) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }

    // Counter elements
    if (el.classList.contains('counter')) {
      animateCounter(el);
    }

    observer.unobserve(el);
  });
}, { threshold: 0.15 });

// Observe skill cards
document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));

// Observe achievement cards
document.querySelectorAll('.ach-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
  observer.observe(card);
});

// Observe counter elements (only in hero after load)
document.querySelectorAll('.counter').forEach(el => observer.observe(el));

// Observe generic scroll-reveal elements (About storytelling chapters, stats, timeline)
document.querySelectorAll('.reveal-scroll').forEach(el => observer.observe(el));

// Section scroll reveals
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.project-card, .profile-card, .timeline-item').forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, i * 120);
    });
  });
}, { threshold: 0.05 });

// Set initial state and observe
document.querySelectorAll('.project-card, .profile-card, .timeline-item').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

document.querySelectorAll('.projects, .profiles, .about').forEach(section => {
  sectionObserver.observe(section);
});

// ─── Contact Form ─────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<span>Sending...</span><i class="fas fa-circle-notch fa-spin"></i>';
    btn.disabled = true;
    if (formError) formError.style.display = 'none';

    try {
      const res = await fetch('https://formsubmit.co/ajax/vashistathallapally476@gmail.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });
      if (!res.ok) throw new Error('Request failed');

      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    } catch (err) {
      if (formError) formError.style.display = 'block';
    } finally {
      btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      btn.disabled = false;
    }
  });
}

// ─── Smooth Active Nav Link ───────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + section.id) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
});

// ─── Hero: split headline into animated letters ───────
document.querySelectorAll('.hero-name [data-split]').forEach((line) => {
  const text = line.textContent;
  line.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.animationDelay = `${1.9 + i * 0.045}s`;
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    line.appendChild(span);
  });
});

// ─── AI Roadmap: animate progress line into view ──────
const roadmapProgress = document.getElementById('roadmapProgress');
if (roadmapProgress) {
  const roadmapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        roadmapProgress.style.width = '24%';
        roadmapObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  roadmapObserver.observe(document.getElementById('roadmap'));
}

// ─── Magnetic buttons (sitewide) ───────────────────────
document.querySelectorAll('.magnetic').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

console.log('%c 👋 Hey there! Built by Thallapally Vashista', 'color: #c9a24b; font-size: 16px; font-family: monospace;');


// ─── Hero: photo tilt on mouse move ────────────────────
const heroSection = document.getElementById('home');
const photoFrame = document.getElementById('photoFrame');
const heroSpotlight = document.getElementById('heroSpotlight');
if (heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    if (heroSpotlight) {
      heroSpotlight.style.setProperty('--sx', px + '%');
      heroSpotlight.style.setProperty('--sy', py + '%');
    }

    if (photoFrame) {
      const cx = px - 50;
      const cy = py - 50;
      photoFrame.style.transform = `rotateY(${cx * 0.18}deg) rotateX(${-cy * 0.18}deg)`;
    }
  });
  heroSection.addEventListener('mouseleave', () => {
    if (photoFrame) photoFrame.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

// ─── Parallax orbs on mouse move ──────────────────────
document.addEventListener('mousemove', (e) => {
  const xRatio = (e.clientX / window.innerWidth - 0.5) * 20;
  const yRatio = (e.clientY / window.innerHeight - 0.5) * 20;
  const orb1 = document.querySelector('.orb1');
  const orb2 = document.querySelector('.orb2');
  if (orb1) orb1.style.transform = `translate(${xRatio}px, ${yRatio}px)`;
  if (orb2) orb2.style.transform = `translate(${-xRatio * 0.7}px, ${-yRatio * 0.7}px)`;
});
