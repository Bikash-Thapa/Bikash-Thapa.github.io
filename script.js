document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('nav a[data-section]');
  const sections = document.querySelectorAll('section[id]');
  const backToTopButton = document.querySelector('.back-to-top');
  const topbar = document.querySelector('.topbar');
  let isUserScrolling = true;
  let scrollTimeout;

  // Function to update URL without triggering scroll
  function updateURL(hash) {
    if (hash === '') {
      // Remove hash from URL
      history.pushState('', document.title, window.location.pathname + window.location.search);
    } else {
      history.pushState(null, null, hash);
    }
  }

  // Function to remove active class from all nav links
  function removeActiveClasses() {
    navLinks.forEach(link => link.classList.remove('active'));
  }

  // Function to add active class to specific nav link
  function addActiveClass(sectionId) {
    const activeLink = document.querySelector(`nav a[data-section="${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // Function to scroll to top without highlighting nav
  function scrollToTop() {
    isUserScrolling = false;
    removeActiveClasses();
    updateURL('');
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Re-enable user scrolling detection after animation
    setTimeout(() => {
      isUserScrolling = true;
    }, 1000);
  }

  // Handle nav link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('data-section');
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        isUserScrolling = false;
        
        // Update active state immediately
        removeActiveClasses();
        this.classList.add('active');
        updateURL(`#${targetId}`);
        
        // Scroll to section
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Re-enable user scrolling detection after animation
        setTimeout(() => {
          isUserScrolling = true;
        }, 1000);
      }
    });
  });

  // Handle back to top button click
  backToTopButton.addEventListener('click', function(e) {
    e.preventDefault();
    scrollToTop();
  });

  // Intersection Observer for scroll detection
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    if (!isUserScrolling) return;

    let activeSection = null;
    
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection = entry.target.id;
      }
    });

    if (activeSection) {
      removeActiveClasses();
      addActiveClass(activeSection);
      updateURL(`#${activeSection}`);
    }
  }, observerOptions);

  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });

  // Handle scroll for back-to-top button and navbar styling
  let lastScrollTop = 0;
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show/hide back to top button
    if (scrollTop > 300) {
      backToTopButton.style.display = 'flex';
    } else {
      backToTopButton.style.display = 'none';
    }

    // Add scrolled class to topbar
    if (scrollTop > 100) {
      topbar.classList.add('scrolled');
    } else {
      topbar.classList.remove('scrolled');
    }

    // Clear the scroll timeout and set a new one
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Check if we're at the very top of the page
      if (scrollTop === 0 && isUserScrolling) {
        removeActiveClasses();
        updateURL('');
      }
    }, 100);

    lastScrollTop = scrollTop;
  });

  // Handle page load - always go to root and top
  window.addEventListener('load', function() {
    // Always clear hash and go to root URL on reload
    removeActiveClasses();
    updateURL('');
    
    // Scroll to top without smooth animation on reload
    window.scrollTo(0, 0);
    
    // Disable user scrolling detection briefly to prevent conflicts
    isUserScrolling = false;
    setTimeout(() => {
      isUserScrolling = true;
    }, 500);
  });

  // Handle DOMContentLoaded to immediately clear any hash from URL
  document.addEventListener('DOMContentLoaded', function() {
    // Immediately clear any hash from URL on page load
    if (window.location.hash) {
      updateURL('');
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(e) {
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        removeActiveClasses();
        addActiveClass(targetId);
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      scrollToTop();
    }
  });
});