/* ============================================
   RUMAH KERIPIK - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  Navbar.init();
  SmoothScroll.init();
  ScrollAnimations.init();
  CounterAnimation.init();
  TestimonialSlider.init();
  GalleryLightbox.init();
  FaqAccordion.init();
  BackToTop.init();
  LazyLoad.init();
  ParallaxEffect.init();
  ContactForm.init();
});

/* ---- Navbar Module ---- */
const Navbar = {
  init() {
    this.navbar = document.getElementById('navbar');
    this.hamburger = document.getElementById('hamburger');
    this.navMenu = document.getElementById('nav-menu');
    this.overlay = document.getElementById('mobile-overlay');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.menuLinks = this.navMenu?.querySelectorAll('a') || [];

    if (!this.navbar) return;

    // Scroll behavior
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    this.handleScroll();

    // Mobile menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeMenu());
    }

    // Close menu on nav link click
    this.menuLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeMenu();
    });

    // Active link on scroll
    window.addEventListener('scroll', () => this.updateActiveLink(), { passive: true });
  },

  handleScroll() {
    if (window.scrollY > 80) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  },

  toggleMenu() {
    this.hamburger.classList.toggle('active');
    this.navMenu.classList.toggle('active');
    if (this.overlay) this.overlay.classList.toggle('active');
    const isOpen = this.navMenu.classList.contains('active');
    this.hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    this.navbar.classList.toggle('menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  },

  closeMenu() {
    this.hamburger.classList.remove('active');
    this.navMenu.classList.remove('active');
    if (this.overlay) this.overlay.classList.remove('active');
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
  },

  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
};

/* ---- Smooth Scroll Module ---- */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
          const targetPos = target.offsetTop - navHeight - 10;

          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });
        }
      });
    });
  }
};

/* ---- Scroll Animations (AOS-like) ---- */
const ScrollAnimations = {
  init() {
    this.elements = document.querySelectorAll('[data-aos]');
    if (!this.elements.length) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-aos-delay') || 0;

          setTimeout(() => {
            el.classList.add('aos-animate');
          }, parseInt(delay));

          this.observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(el => {
      el.classList.add('aos-init');
      this.observer.observe(el);
    });

    // Add CSS for animations
    this.injectStyles();
  },

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .aos-init {
        opacity: 0;
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      .aos-init[data-aos="fade-up"] {
        transform: translateY(40px);
      }
      .aos-init[data-aos="fade-down"] {
        transform: translateY(-40px);
      }
      .aos-init[data-aos="fade-left"] {
        transform: translateX(40px);
      }
      .aos-init[data-aos="fade-right"] {
        transform: translateX(-40px);
      }
      .aos-init[data-aos="zoom-in"] {
        transform: scale(0.9);
      }
      .aos-init[data-aos="flip-up"] {
        transform: perspective(2500px) rotateX(50deg);
      }
      .aos-animate {
        opacity: 1 !important;
        transform: translateY(0) translateX(0) scale(1) rotateX(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
};

/* ---- Counter Animation Module ---- */
const CounterAnimation = {
  init() {
    this.counters = document.querySelectorAll('[data-count]');
    if (!this.counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      el.textContent = prefix + current.toLocaleString('id-ID') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
};

/* ---- Testimonial Slider Module ---- */
const TestimonialSlider = {
  init() {
    this.track = document.getElementById('testimonials-track');
    this.dots = document.querySelectorAll('.dot');
    if (!this.track) return;

    this.cards = this.track.querySelectorAll('.testimonial-card');
    this.currentIndex = 0;
    this.totalSlides = this.cards.length;
    this.autoplayInterval = null;

    // Dot click handlers
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goTo(index));
    });

    // Start autoplay
    this.startAutoplay();

    // Pause on hover
    this.track.closest('.testimonials-slider')?.addEventListener('mouseenter', () => {
      this.stopAutoplay();
    });

    this.track.closest('.testimonials-slider')?.addEventListener('mouseleave', () => {
      this.startAutoplay();
    });

    // Touch support
    this.setupTouch();
  },

  goTo(index) {
    this.currentIndex = index;
    this.track.style.transform = `translateX(-${index * 100}%)`;

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  },

  next() {
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;
    this.goTo(nextIndex);
  },

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), 4000);
  },

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  },

  setupTouch() {
    let startX = 0;
    let isDragging = false;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.stopAutoplay();
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
          this.goTo(prevIndex);
        }
      }

      isDragging = false;
      this.startAutoplay();
    }, { passive: true });
  }
};

/* ---- Gallery Lightbox Module ---- */
const GalleryLightbox = {
  init() {
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.closeBtn = document.getElementById('lightbox-close');
    this.galleryItems = document.querySelectorAll('.gallery-item');

    if (!this.lightbox) return;

    this.galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          this.open(img.src, img.alt);
        }
      });
    });

    this.closeBtn?.addEventListener('click', () => this.close());
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  open(src, alt) {
    this.lightboxImg.src = src;
    this.lightboxImg.alt = alt || '';
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/* ---- FAQ Accordion Module ---- */
const FaqAccordion = {
  init() {
    this.items = document.querySelectorAll('.faq-item');

    this.items.forEach(item => {
      const question = item.querySelector('.faq-question');
      question?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        this.items.forEach(i => i.classList.remove('active'));

        // Open clicked if it wasn't active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }
};

/* ---- Back to Top Module ---- */
const BackToTop = {
  init() {
    this.btn = document.getElementById('back-to-top');
    if (!this.btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        this.btn.classList.add('visible');
      } else {
        this.btn.classList.remove('visible');
      }
    }, { passive: true });

    this.btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

/* ---- Lazy Load Module ---- */
const LazyLoad = {
  init() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px 0px'
      });

      lazyImages.forEach(img => observer.observe(img));
    } else {
      // Fallback: load all images
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }
};

/* ---- Parallax Effect Module ---- */
const ParallaxEffect = {
  init() {
    this.heroBg = document.querySelector('.hero-bg img');
    if (!this.heroBg) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        this.heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
      }
    }, { passive: true });

    // Initial scale
    this.heroBg.style.transform = 'scale(1.1)';
  }
};

/* ---- Contact Form Module ---- */
const ContactForm = {
  init() {
    this.form = document.getElementById('contact-form');
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  handleSubmit() {
    const formData = new FormData(this.form);
    const nama = formData.get('nama');
    const pesan = formData.get('pesan');

    const waNumber = '6288210573869';
    const sourceNote = 'pesan ini dikirim dari website rumah keripik melalui program dekatlokal';
    const waText = encodeURIComponent(
      `Halo Rumah Keripik!\n\nNama: ${nama}\nEmail: ${formData.get('email')}\nSubjek: ${formData.get('subjek')}\n\nPesan:\n${pesan}\n\n${sourceNote}`
    );
    const waUrl = `https://wa.me/${waNumber}?text=${waText}`;

    window.open(waUrl, '_blank');

    // Show success feedback
    const btn = this.form.querySelector('.btn-submit');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
      btn.style.background = 'var(--gradient-secondary)';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 3000);
    }

    this.form.reset();
  }
};
