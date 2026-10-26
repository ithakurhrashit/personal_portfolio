/**
 * HARSHIT | PERSONAL PORTFOLIO SCRIPT
 * Interactive Logic: Dynamic Typing, Theme Switcher, Project Modal,
 * LeetCode Metrics Counter, 3D Tilt, Clipboard Toasts & Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTypingEffect();
  initHeaderScrollSpy();
  initMobileNav();
  initMetricsCounter();
  initProjectFilters();
  initProjectModal();
  initClipboardActions();
  initContactForm();
  initScrollToTop();
  initPortraitTilt();
  setCurrentYear();
});

/* ==========================================================================
   1. Theme Switcher (Apple-style Light by Default, Obsidian Dark Toggle)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to 'light'
  const savedTheme = localStorage.getItem('harshit_portfolio_theme') || 'light';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('harshit_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} mode`);
    });
  }
}

/* ==========================================================================
   2. Dynamic Role Typing Effect
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typingRole');
  if (!typingElement) return;

  const roles = [
    'AI & ML Engineer',
    'Data Analyst',
    'Competitive Programmer (120+ Solved)',
    'Deepfake Defense Innovator',
    'CSIT Undergrad @ GL Bajaj'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 45;
  const pauseEnd = 2000;
  const pauseStart = 400;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = pauseStart;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   3. Header Sticky & Active Scroll Spy
   ========================================================================== */
function initHeaderScrollSpy() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header styling on scroll
    if (scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy for current active section
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   4. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta');

  if (!menuBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    } else {
      drawer.classList.add('open');
      menuBtn.classList.add('active');
      menuBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }
  }

  menuBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ==========================================================================
   5. Metrics Counter with IntersectionObserver
   ========================================================================== */
function initMetricsCounter() {
  const counters = document.querySelectorAll('.metric-number');
  if (!counters.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          // Special case for year (e.g. 2029)
          if (target > 1000) {
            counter.textContent = target;
            return;
          }

          let start = 0;
          const duration = 1600;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(start);
            }
          }, stepTime);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-strip-section');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

/* ==========================================================================
   6. Project Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   7. Interactive Project Deep-Dive Modal
   ========================================================================== */
const projectDatabase = {
  agnes: {
    title: 'Agnes.ai — Financial Fraud & Deepfake Detection Platform',
    badge: '🏆 Top 50 Worldwide @ Sangyan Hackathon (IIT BHU)',
    image: 'assets/images/agnes-ai.jpg',
    tags: ['Computer Vision', 'Deepfake Detection', 'PyTorch', 'FastAPI', 'Cybersecurity', 'Financial Risk Scoring'],
    description: `Agnes.ai is a cutting-edge forensic and cybersecurity intelligence system engineered to protect everyday investors against deceptive financial fraud, counterfeit broker apps, and AI-generated deepfakes. Developed and pitched at IIT BHU's prestigious Sangyan Hackathon, Agnes.ai stood out among hundreds of international projects to earn a spot in the Top 50 Worldwide.`,
    highlights: [
      'Multi-modal facial authenticity scanner verifying eye gaze consistency, micro-expressions, and voice synthesis anomalies.',
      'Rogue APK analysis engine that flags fraudulent trading clones and malicious background permissions.',
      'Real-time risk dashboard alerting users with clear confidence scores and anomaly breakdown.',
      'Built with Python, PyTorch, OpenCV, FastAPI, and modular data visualization pipelines.'
    ],
    github: 'https://github.com/ithakurhrashit',
    status: 'Flagship Hackathon Finalist'
  },
  interview: {
    title: 'AI Interview Simulator & Candidate Evaluation Engine',
    badge: '⚡ First-Year Technical Mini-Project',
    image: 'assets/images/interview-simulator.jpg',
    tags: ['NLP / LLM Integration', 'Python APIs', 'Speech-to-Text', 'Dynamic Scoring', 'FastAPI', 'Radar Analytics'],
    description: `Engineered during freshman year at GL Bajaj, this project tackles interview anxiety and technical preparation through an automated conversational agent. The platform conducts adaptive technical mock interviews, transcribes responses in real time, and scores candidates across critical dimensions.`,
    highlights: [
      'Engineered clean backend architecture supporting low-latency question sequencing and response evaluation.',
      'Real-time transcription and NLP analysis assessing semantic clarity, solution completeness, and technical vocabulary.',
      'Comprehensive candidate scorecard featuring radar charts for problem solving, clarity, confidence, and structure.',
      'Strengthened foundational proficiencies in API development, asynchronous pipelines, and AI prompt orchestration.'
    ],
    github: 'https://github.com/ithakurhrashit',
    status: 'Collegiate Mini-Project'
  },
  datapulse: {
    title: 'DataPulse — Algorithmic Performance & Predictive Analytics',
    badge: '📊 Data Analytics & LeetCode (120+ Solved)',
    image: 'assets/images/datapulse-analytics.jpg',
    tags: ['Data Analytics', 'Python', 'C++ STL', 'Pandas & NumPy', 'Exploratory Data Analysis', 'DSA Optimization'],
    description: `DataPulse represents the fusion of Harshit\'s passion for rigorous Data Analytics and competitive algorithmic problem solving. The suite combines exploratory statistical pipelines with execution-time memory/time profiling for 120+ algorithmic structures.`,
    highlights: [
      'Automated exploratory data analysis (EDA) scripts computing distributions, correlation matrices, and anomaly outliers.',
      'Systematic performance benchmark harness testing C++ and Python data structures under extreme loads.',
      'Integrated tracking of 120+ conquered LeetCode challenges with documented time/space complexity trade-offs.',
      'Utilizes Pandas, NumPy, Matplotlib, Seaborn, and modern interactive dashboard components.'
    ],
    github: 'https://github.com/ithakurhrashit',
    status: 'Analytics & DSA Benchmark Suite'
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const closeBtn = document.getElementById('modalCloseBtn');
  const backdrop = document.getElementById('modalBackdrop');
  const detailButtons = document.querySelectorAll('.view-details-btn');

  if (!modal || !modalContent) return;

  function openModal(projectKey) {
    const data = projectDatabase[projectKey];
    if (!data) return;

    modalContent.innerHTML = `
      <div class="modal-media-banner">
        <img src="${data.image}" alt="${data.title}">
      </div>

      <div class="modal-header-meta">
        <span class="tech-tag tag-primary">${data.badge}</span>
      </div>

      <h2 class="modal-title" id="modalTitle">${data.title}</h2>

      <div class="modal-tags-row" style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.2rem;">
        ${data.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>

      <h3 class="modal-section-title">Overview & Impact</h3>
      <p class="modal-desc">${data.description}</p>

      <h3 class="modal-section-title">Key Architectural Features</h3>
      <div class="modal-features-list">
        ${data.highlights.map(h => `
          <div class="modal-feature-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>${h}</span>
          </div>
        `).join('')}
      </div>

      <div class="modal-footer-actions">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <i class="fa-brands fa-github"></i>
          <span>View Source on GitHub</span>
        </a>
        <a href="mailto:harshitsinghrajput1647@gmail.com?subject=Inquiry regarding ${encodeURIComponent(data.title)}" class="btn btn-secondary btn-sm">
          <i class="fa-solid fa-envelope"></i>
          <span>Discuss with Harshit</span>
        </a>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-project');
      openModal(projectKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. Clipboard Copy & Apple-Style Toast
   ========================================================================== */
function initClipboardActions() {
  const copyHeroBtn = document.getElementById('copyHeroEmailBtn');
  const copyContactBtn = document.getElementById('copyContactEmailBtn');

  function handleCopy(btn) {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email') || 'harshitsinghrajput1647@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copied: ${email}`);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  }

  handleCopy(copyHeroBtn);
  handleCopy(copyContactBtn);
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* ==========================================================================
   9. Interactive Contact Form with Validation & Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitFormBtn');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setFieldError(input, errorId, hasError) {
    const parent = input.closest('.form-group');
    if (parent) {
      if (hasError) {
        parent.classList.add('has-error');
      } else {
        parent.classList.remove('has-error');
      }
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Name check
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, 'nameError', true);
      isValid = false;
    } else {
      setFieldError(nameInput, 'nameError', false);
    }

    // Email check
    if (!validateEmail(emailInput.value.trim())) {
      setFieldError(emailInput, 'emailError', true);
      isValid = false;
    } else {
      setFieldError(emailInput, 'emailError', false);
    }

    // Subject check
    if (!subjectInput.value.trim()) {
      setFieldError(subjectInput, 'subjectError', true);
      isValid = false;
    } else {
      setFieldError(subjectInput, 'subjectError', false);
    }

    // Message check
    if (!messageInput.value.trim()) {
      setFieldError(messageInput, 'messageError', true);
      isValid = false;
    } else {
      setFieldError(messageInput, 'messageError', false);
    }

    if (!isValid) return;

    // Simulate sending with button feedback
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Note...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      showToast(`Thank you, ${nameInput.value.trim()}! Harshit will get back to you shortly.`);
      form.reset();

      // Clear any remaining errors
      document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
    }, 1100);
  });
}

/* ==========================================================================
   10. Scroll to Top Button
   ========================================================================== */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollToTopBtn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 350) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   11. Interactive 3D Tilt on Harshit's Portrait Card
   ========================================================================== */
function initPortraitTilt() {
  const card = document.getElementById('heroPhotoCard');
  if (!card || window.innerWidth < 1024) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

/* ==========================================================================
   12. Current Year in Footer
   ========================================================================== */
function setCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
