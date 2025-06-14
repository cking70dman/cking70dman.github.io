document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")
  const submenuLinks = document.querySelectorAll(".submenu-link")
  const projectsMainLink = document.querySelector('.nav-link[data-target="projects"]')
  const projectsSubmenu = projectsMainLink ? projectsMainLink.nextElementSibling : null
  const hasSubmenuItems = document.querySelectorAll(".nav-item.has-submenu")

  // Function to check if we're on a project page
  function isOnProjectPage() {
    const currentPath = window.location.pathname
    return submenuLinks && Array.from(submenuLinks).some(link => {
      const href = link.getAttribute('href')
      return href && currentPath.endsWith(href)
    })
  }

  // Function to keep submenu visible if on project page (desktop only)
  function maintainSubmenuVisibility() {
    if (window.innerWidth > 768 && isOnProjectPage() && projectsSubmenu) {
      projectsSubmenu.style.display = "flex"
      if (projectsMainLink && projectsMainLink.parentElement) {
        projectsMainLink.parentElement.classList.add("open")
      }
    }
  }

  // Toggle mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      const isExpanded = navMenu.classList.contains("active")
      navToggle.setAttribute("aria-expanded", isExpanded)
      navToggle.classList.toggle("active") // For hamburger animation
    })
  }

  // Function to remove active class from all main links
  function clearActiveMainLinks() {
    navLinks.forEach((link) => link.classList.remove("active"))
  }

  // Function to remove active class from all submenu links and hide titles
  function clearActiveSubmenuLinks() {
    submenuLinks.forEach((link) => {
      link.classList.remove("active")
      const titleDisplay = link.parentElement.querySelector(".project-title-display")
      if (titleDisplay && window.innerWidth > 768) {
        titleDisplay.style.display = "none"
      }
    })
  }

  // Function to close all submenus (for mobile)
  function closeAllSubmenusMobile() {
    hasSubmenuItems.forEach((item) => {
      item.classList.remove("open-mobile")
      const sub = item.querySelector(".submenu")
      if (sub) sub.style.display = "none" // Ensure it's hidden
    })
  }

  // Function to initialize project titles on mobile
  function initializeMobileProjectTitles() {
    if (window.innerWidth <= 768) {
      submenuLinks.forEach((link) => {
        const projectTitle = link.dataset.projectTitle;
        const titleDisplay = link.parentElement.querySelector(".project-title-display");
        if (titleDisplay && projectTitle) {
          titleDisplay.textContent = projectTitle;
          titleDisplay.style.display = "block";
        }
      });
    }
  }

  // Handle main navigation link clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = this.dataset.target
      const parentHasSubmenu = this.parentElement.classList.contains("has-submenu")
      const href = this.getAttribute('href')
      
      // Only prevent default if this is a submenu toggle action or if href is empty/hash
      if ((parentHasSubmenu && window.innerWidth <= 768) || !href || href === '#') {
        e.preventDefault()
      }
      
      clearActiveMainLinks()
      clearActiveSubmenuLinks() // Also clear submenu active states
      this.classList.add("active")

      if (window.innerWidth <= 768) {
        // Mobile behavior
        if (parentHasSubmenu) {
          const isOpen = this.parentElement.classList.toggle("open-mobile")
          if (projectsSubmenu) {
            projectsSubmenu.style.display = isOpen ? "flex" : "none"
          }
          // Initialize mobile titles when submenu opens
          if (isOpen) {
            initializeMobileProjectTitles()
          }
        } else {
          // If it's not a submenu parent, close the mobile menu after click
          if (navMenu.classList.contains("active")) {
            navMenu.classList.remove("active")
            navToggle.setAttribute("aria-expanded", "false")
            navToggle.classList.remove("active")
          }
          closeAllSubmenusMobile() // Close any open submenus
        }
      } else {
        // Desktop behavior
        hasSubmenuItems.forEach((item) => item.classList.remove("open")) // Close other submenus
        if (parentHasSubmenu) {
          this.parentElement.classList.add("open")
        }
      }

      // If "Projects" is clicked, ensure its submenu items are visible on desktop
      if (target === "projects" && window.innerWidth > 768) {
        if (projectsSubmenu) projectsSubmenu.style.display = "flex"
      } else if (window.innerWidth > 768 && !parentHasSubmenu) {
        // Don't hide submenu if we're on a project page
        if (projectsSubmenu && !isOnProjectPage()) {
          projectsSubmenu.style.display = "none"
        }
      }

      // If not "Projects", hide its submenu on mobile if it was open
      if (target !== "projects" && window.innerWidth <= 768) {
        if (projectsSubmenu && projectsMainLink.parentElement.classList.contains("open-mobile")) {
          projectsMainLink.parentElement.classList.remove("open-mobile")
          projectsSubmenu.style.display = "none"
        }
      }
    })
  })

  // Handle submenu link clicks
  submenuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute('href')
      
      // Only prevent default if href is empty or hash
      if (!href || href === '#') {
        e.preventDefault()
      }
      
      e.stopPropagation() // Prevent event from bubbling to parent nav items

      clearActiveSubmenuLinks()
      this.classList.add("active")

      // Ensure parent "Projects" link is also active
      clearActiveMainLinks()
      if (projectsMainLink) projectsMainLink.classList.add("active")
      if (projectsMainLink && projectsMainLink.parentElement) projectsMainLink.parentElement.classList.add("open")

      const projectTitle = this.dataset.projectTitle
      const titleDisplay = this.parentElement.querySelector(".project-title-display")
      if (titleDisplay) {
        titleDisplay.textContent = projectTitle
        titleDisplay.style.display = "block"
      }

      // On mobile, after clicking a sub-item, close the main mobile menu
      if (window.innerWidth <= 768) {
        if (navMenu.classList.contains("active")) {
          navMenu.classList.remove("active")
          navToggle.setAttribute("aria-expanded", "false")
          navToggle.classList.remove("active")
        }
      }
    })

    // Handle hover for project titles on desktop only
    if (window.innerWidth > 768) {
      link.parentElement.addEventListener("mouseenter", function () {
        // Only show on hover if not already active and not on mobile
        if (!this.querySelector(".submenu-link").classList.contains("active")) {
          const projectTitle = this.querySelector(".submenu-link").dataset.projectTitle
          const titleDisplay = this.querySelector(".project-title-display")
          if (titleDisplay) {
            titleDisplay.textContent = projectTitle
            titleDisplay.style.display = "block"
          }
        }
      })

      link.parentElement.addEventListener("mouseleave", function () {
        // Only hide on mouse leave if not active and not on mobile
        if (!this.querySelector(".submenu-link").classList.contains("active")) {
          const titleDisplay = this.querySelector(".project-title-display")
          if (titleDisplay) {
            titleDisplay.style.display = "none"
          }
        }
      })
    }
  })

  // Set initial active state based on current page
  function setInitialActiveState() {
    const currentPath = window.location.pathname
    let activeLink = null
    
    // Check if current page matches any nav link
    navLinks.forEach((link) => {
      const href = link.getAttribute('href')
      if (href && currentPath.endsWith(href)) {
        activeLink = link
      }
    })
    
    // Check submenu links
    submenuLinks.forEach((link) => {
      const href = link.getAttribute('href')
      if (href && currentPath.endsWith(href)) {
        activeLink = link
        // Also activate the parent Projects link
        if (projectsMainLink) projectsMainLink.classList.add("active")
        if (projectsMainLink && projectsMainLink.parentElement) projectsMainLink.parentElement.classList.add("open")
        
        // Show project title
        const projectTitle = link.dataset.projectTitle
        const titleDisplay = link.parentElement.querySelector(".project-title-display")
        if (titleDisplay) {
          titleDisplay.textContent = projectTitle
          titleDisplay.style.display = "block"
        }
      }
    })
    
    // Default to Home if no match found
    if (!activeLink) {
      const homeLink = document.querySelector('.nav-link[data-target="home"]')
      if (homeLink) {
        homeLink.classList.add("active")
      }
    } else {
      activeLink.classList.add("active")
    }
  }

  // Set initial active state
  setInitialActiveState()
  
  if (projectsSubmenu && window.innerWidth > 768) {
    // Show projects submenu on desktop if we're on a project page or projects is active
    const isProjectsActive = projectsMainLink && projectsMainLink.classList.contains("active")
    if (isProjectsActive || isOnProjectPage()) {
      projectsSubmenu.style.display = "flex"
    } else {
      projectsSubmenu.style.display = "none"
    }
  }

  // Initialize mobile project titles on page load
  initializeMobileProjectTitles()

  // Close dropdown if clicked outside
  document.addEventListener("click", (event) => {
    if (window.innerWidth > 768) {
      // Desktop only
      const isClickInsideNav = navMenu.contains(event.target)
      const isClickInsideProjectsSubmenu = projectsSubmenu ? projectsSubmenu.contains(event.target) : false

      if (!isClickInsideNav && !isClickInsideProjectsSubmenu) {
        // Don't hide submenu if we're on a project page
        if (projectsSubmenu && !isOnProjectPage()) {
          projectsSubmenu.style.display = "none"
          if (projectsMainLink && projectsMainLink.parentElement) {
            projectsMainLink.parentElement.classList.remove("open")
          }
        }
      }
    }
  })

  // Handle window resize to reinitialize mobile titles and maintain submenu visibility
  window.addEventListener('resize', () => {
    initializeMobileProjectTitles()
    maintainSubmenuVisibility()
  })

  // Set current year in footer
  const currentYearSpan = document.getElementById("current-year")
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear().toString()
  }

  // Maintain submenu visibility on page load
  maintainSubmenuVisibility()
})

// Add this to your existing script.js file

// Function to show/hide submenu background strip
function toggleSubmenuBackground(show) {
  const submenuBack = document.querySelector('.submenu-back');
  if (submenuBack && window.innerWidth > 969) {
    submenuBack.style.display = show ? 'block' : 'none';
  }
}

// Add this to your existing submenu hover/click handlers
// For desktop hover behavior
document.addEventListener('DOMContentLoaded', () => {
  const projectsMainLink = document.querySelector('.nav-link[data-target="projects"]');
  const hasSubmenuItems = document.querySelectorAll(".nav-item.has-submenu");
  
  if (window.innerWidth > 969) {
    hasSubmenuItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        toggleSubmenuBackground(true);
      });
      
      item.addEventListener('mouseleave', () => {
        // Only hide if not on a project page
        if (!isOnProjectPage()) {
          toggleSubmenuBackground(false);
        }
      });
    });
  }
  
  // Show background when on project page
  if (isOnProjectPage() && window.innerWidth > 969) {
    toggleSubmenuBackground(true);
  }
});