/* =============================================
   AR INFORMÁTICA - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---------- Preloader ----------
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Remove preloader from DOM after transition
      setTimeout(() => preloader.remove(), 600);
    }, 800);
  });

  // ---------- Initialize AOS ----------
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: 'mobile'
  });

  // ---------- Navbar Scroll Effect ----------
  const navbar = document.getElementById('mainNavbar');
  const backToTop = document.getElementById('backToTop');
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    // Navbar background
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
    
    // Active nav link
    updateActiveNavLink();
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // ---------- Back to Top ----------
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Fallback for Safari and older browsers
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });

  // ---------- Active Navigation Link ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ---------- Smooth Scroll for Nav Links & Close Mobile Menu ----------
  const navbarCollapse = document.getElementById('navbarNav');
  const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Close mobile menu
      if (navbarCollapse.classList.contains('show')) {
        bsCollapse.hide();
      }
    });
  });

  // ---------- Hero Particles ----------
  const particlesContainer = document.getElementById('heroParticles');
  
  function createParticles() {
    const particleCount = window.innerWidth < 768 ? 12 : 25;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 6 + 4}s`;
      particle.style.animationDelay = `${Math.random() * 6}s`;
      
      // Random color between blue and orange
      const colors = [
        'rgba(13, 71, 161, 0.6)',
        'rgba(21, 101, 192, 0.5)',
        'rgba(245, 124, 0, 0.6)',
        'rgba(255, 152, 0, 0.5)',
        'rgba(255, 255, 255, 0.3)'
      ];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.background}`;
      
      particlesContainer.appendChild(particle);
    }
  }
  
  createParticles();

  // ---------- Contact Form ----------
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Basic validation
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const service = document.getElementById('contactService').value;
    const message = document.getElementById('contactMessage').value.trim();
    
    if (!name || !email || !service || !message) {
      showFormMessage('Por favor, rellena todos los campos obligatorios.', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showFormMessage('Por favor, introduce un email válido.', 'error');
      return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';
    
    const phone = document.getElementById('contactPhone').value.trim();
    
    fetch('https://formsubmit.co/ajax/tecnofix.zh@gmail.com', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone || 'No proporcionado',
            service: service,
            message: message,
            _subject: `Nueva consulta web: ${service} - ${name}`,
            _template: 'box' // Uses a cleaner email template
        })
    })
    .then(response => response.json())
    .then(data => {
        showFormMessage(
            '¡Gracias por tu mensaje! Me pondré en contacto contigo lo antes posible.',
            'success'
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send-fill"></i> Enviar Mensaje';
        contactForm.reset();
    })
    .catch(error => {
        showFormMessage(
            'Hubo un error al enviar el mensaje. Por favor, inténtalo más tarde o escríbeme directamente a tecnofix.zh@gmail.com',
            'error'
        );
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send-fill"></i> Enviar Mensaje';
    });
  });

  function showFormMessage(msg, type) {
    formMessage.className = `form-message ${type}`;
    formMessage.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}"></i> ${msg}`;
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
      formMessage.className = 'form-message';
    }, 8000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ---------- Stat Reveal Animation ----------
  function revealStats() {
    const stats = document.querySelectorAll('.hero-stat');
    stats.forEach((stat, index) => {
      setTimeout(() => {
        stat.style.opacity = '1';
        stat.style.transform = 'translateY(0)';
      }, index * 250);
    });
  }

  // Set initial state for stats
  document.querySelectorAll('.hero-stat').forEach(stat => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(20px)';
    stat.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
  });

  // Trigger reveal when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealStats();
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroObserver.observe(heroSection);
  }

  // ---------- Tilt Effect on Service Cards ----------
  const serviceCards = document.querySelectorAll('.service-card, .advantage-card');
  
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ---------- Typing Effect (optional) ----------
  // Already handled by CSS animations, but adding subtle effect
  
  console.log('%c AR Informática %c Servicio Técnico de PC y Móviles ',
    'background: #0d47a1; color: white; padding: 6px 12px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #f57c00; color: white; padding: 6px 12px; border-radius: 0 4px 4px 0;'
  );
});
