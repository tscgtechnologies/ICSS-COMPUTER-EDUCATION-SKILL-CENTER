/**
 * ICSS COMPUTER EDUCATION SKILL CENTER - MODERN TECH INSTITUTE SCRIPT
 * Mobile Menu, Parallax Anti-gravity, Scroll Reveals, Active Nav, WhatsApp Form Handler
 * Written by Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAntiGravityParallax();
  initScrollReveal();
  initStatsCounter();
  initWhatsAppSystem();
  initBackToTop();
});

/* --- STICKY HEADER & MOBILE NAVIGATION --- */
function initNavbar() {
  const header = document.querySelector('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu click toggle
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu on clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Close mobile menu when clicking outside of the navbar
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navMenu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });

  // Active Link Highlighter on Scroll
  const sections = document.querySelectorAll('section[id]');
  
  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-80px 0px -40% 0px' // adjust for header offset
  });

  sections.forEach(sec => activeLinkObserver.observe(sec));
}

/* --- 3D MOUSE PARALLAX (ANTI-GRAVITY HERO SHIELD) --- */
function initAntiGravityParallax() {
  const floatItems = document.querySelectorAll('.float-item');
  const hero = document.querySelector('.hero');
  if (!hero || floatItems.length === 0) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  // Track mouse coordinates over the hero wrapper
  window.addEventListener('mousemove', (e) => {
    // Only calculate if screen is desktop and animations are not restricted
    if (window.innerWidth > 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const rect = hero.getBoundingClientRect();
      // Normalize values from -1 to 1 based on center of hero section
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    }
  });

  // Smooth lerp function for transitions
  function updateParallax() {
    if (window.innerWidth > 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Lerp mouse positions
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      floatItems.forEach(item => {
        const depth = parseFloat(item.getAttribute('data-depth')) || 15;
        // Compute translations: opposite direction to mouse movement
        const translateX = currentX * depth * -1.5;
        const translateY = currentY * depth * -1.5;
        const rotate = currentX * 3;

        item.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg)`;
      });
    } else {
      // Reset transforms on smaller viewports
      floatItems.forEach(item => {
        item.style.transform = 'none';
      });
    }
    requestAnimationFrame(updateParallax);
  }

  requestAnimationFrame(updateParallax);
}

/* --- SCROLL REVEAL TRIGGERS --- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

/* --- STATS COUNTER INCREMENT --- */
function initStatsCounter() {
  const statsElements = document.querySelectorAll('.about-stat b');
  if (statsElements.length === 0) return;
  
  const aboutSection = document.querySelector('.about');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !started) {
      started = true;
      runCounters();
    }
  }, { threshold: 0.15 });

  if (aboutSection) {
    observer.observe(aboutSection);
  } else {
    runCounters(); // Fallback if about section selector is modified
  }

  function runCounters() {
    statsElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-count'));
      const isDecimal = el.getAttribute('data-count').includes('.');
      const suffix = el.nextElementSibling ? '' : ''; // handle details
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeOutQuad
        const ease = progress * (2 - progress);
        const currentVal = ease * target;
        
        if (isDecimal) {
          el.textContent = currentVal.toFixed(1);
        } else {
          el.textContent = Math.floor(currentVal).toLocaleString();
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
        }
      }
      requestAnimationFrame(update);
    });
  }
}

/* --- WHATSAPP SYSTEM & FORM HANDLER --- */
function initWhatsAppSystem() {
  const WA_NUMBER = "919989455556";
  const DEFAULT_MESSAGE = "Hi ICSS Computer Education Skill Center, I am interested in computer courses.";
  const ENQUIRY_MESSAGE = "Hi ICSS Computer Education Skill Center, I am interested in course details.";
  const CERTIFICATE_MESSAGE = "Hi ICSS Computer Education Skill Center, I want details about certificate courses.";
  const PRACTICAL_MESSAGE = "Hi ICSS Computer Education Skill Center, I want to start practical computer training.";

  // Floating WhatsApp button handler
  const waFloating = document.getElementById('whatsapp-floating');
  if (waFloating) {
    waFloating.addEventListener('click', () => {
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`, '_blank');
    });
  }

  // 1. Direct links for triggers
  const waTriggers = document.querySelectorAll('.whatsapp-trigger');
  waTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      let msg = DEFAULT_MESSAGE;
      
      // Determine custom messages based on element attributes/classes
      if (trigger.classList.contains('nav-cta')) {
        msg = DEFAULT_MESSAGE;
      } else if (trigger.innerText.includes('Free Consultation')) {
        msg = DEFAULT_MESSAGE;
      } else if (trigger.innerText.includes('Enroll Now') || trigger.innerText.includes('Join Course')) {
        msg = "Hi ICSS Computer Education Skill Center, I want to join a computer course.";
      } else if (trigger.innerText.includes('Certificate')) {
        msg = CERTIFICATE_MESSAGE;
      } else if (trigger.innerText.includes('Practical')) {
        msg = PRACTICAL_MESSAGE;
      }
      
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });

  // 2. Course Cards Enquiries
  const courseEnquiries = document.querySelectorAll('.course-enquire-btn');
  courseEnquiries.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const courseCard = btn.closest('.course-card');
      const courseName = courseCard ? courseCard.querySelector('h3').innerText : 'computer';
      const msg = `Hi ICSS Computer Education Skill Center, I am interested in joining the *${courseName}* course. Please guide me with fees, durations, and next batch timings.`;
      
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });

  // Make course card body clickable to trigger WhatsApp as well
  const courseCards = document.querySelectorAll('.course-card');
  courseCards.forEach(card => {
    card.addEventListener('click', () => {
      const courseName = card.querySelector('h3').innerText;
      const msg = `Hi ICSS Computer Education Skill Center, I am interested in joining the *${courseName}* course. Please guide me with fees, durations, and next batch timings.`;
      
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });

  // 3. Lead Form Submission handler
  const leadForm = document.getElementById('leadForm');
  const errorMsg = document.getElementById('formError');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const course = document.getElementById('course').value;
      const userMessage = document.getElementById('message').value.trim();

      if (!name || !phone || !course) {
        if (errorMsg) errorMsg.textContent = "Please fill in all required fields.";
        return;
      }

      // Simple phone format verification (digits length check)
      const phoneCleaned = phone.replace(/\D/g, '');
      if (phoneCleaned.length < 10) {
        if (errorMsg) errorMsg.textContent = "Please enter a valid 10-digit mobile number.";
        return;
      }

      if (errorMsg) errorMsg.textContent = ""; // Clear errors

      // Format dynamic redirect string
      const fullText = `Hi ICSS Computer Education Skill Center,

*My Name:* ${name}
*Phone:* ${phone}
*Interested Course:* ${course}
*Message:* ${userMessage || 'I want to know details about fees and batch schedules.'}`;

      const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(fullText)}`;
      
      window.open(waUrl, '_blank');
      leadForm.reset();
    });
  }
}

/* --- BACK TO TOP NAVIGATION BUTTON --- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
