// Water Surface Drops with Perspective Animation using Anime.js
document.addEventListener('DOMContentLoaded', function() {
    // Only run on index page and ensure we have the main element
    const mainElement = document.querySelector('.site-main');
    const isIndexPage = document.querySelector('.hero-section');
    
    if (!mainElement || !isIndexPage) return;
  
    // Create container for water surface animation
    const waterContainer = document.createElement('div');
    waterContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: -1;
      perspective: 1000px;
      perspective-origin: center 60%;
    `;
    
    // Create water surface plane
    const waterSurface = document.createElement('div');
    waterSurface.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transform: rotateX(75deg) translateZ(-50px);
    `;
    
    // Make main element relative for positioning
    mainElement.style.position = 'relative';
    mainElement.appendChild(waterContainer);
    waterContainer.appendChild(waterSurface);
  
    // Get CSS variable for font color
    const fontColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-color').trim();
  
    // Create ripple effect on perspective surface
    function createSurfaceRipple(x, y) {
      const ripple = document.createElement('div');
      const size = Math.random() * 40 + 30; // 30-70px initial size
      
      ripple.style.cssText = `
        position: absolute;
        left: ${x - size/2}px;
        top: ${y - size/2}px;
        width: ${size}px;
        height: ${size}px;
        border: 0.5px solid ${fontColor};
        border-radius: 50%;
        opacity: 0.5;
        pointer-events: none;
        transform-origin: center;
      `;
      
      waterSurface.appendChild(ripple);
      
      // Animate ripple expansion and fade
      anime({
        targets: ripple,
        scale: [1, 4],
        opacity: [0.5, 0],
        duration: 4000,
        easing: 'easeOutCubic',
        complete: function() {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }
      });
  
      // Create secondary ripple
      setTimeout(() => {
        const secondRipple = document.createElement('div');
        const secondSize = size * 0.7;
        
        secondRipple.style.cssText = `
          position: absolute;
          left: ${x - secondSize/2}px;
          top: ${y - secondSize/2}px;
          width: ${secondSize}px;
          height: ${secondSize}px;
          border: 0.25px solid ${fontColor};
          border-radius: 50%;
          opacity: 0.3;
          pointer-events: none;
          transform-origin: center;
        `;
        
        waterSurface.appendChild(secondRipple);
        
        anime({
          targets: secondRipple,
          scale: [1, 3.5],
          opacity: [0.3, 0],
          duration: 3500,
          easing: 'easeOutCubic',
          complete: function() {
            if (secondRipple.parentNode) {
              secondRipple.parentNode.removeChild(secondRipple);
            }
          }
        });
      }, 400);
  
      // Create third, outermost ripple
      setTimeout(() => {
        const thirdRipple = document.createElement('div');
        const thirdSize = size * 0.5;
        
        thirdRipple.style.cssText = `
          position: absolute;
          left: ${x - thirdSize/2}px;
          top: ${y - thirdSize/2}px;
          width: ${thirdSize}px;
          height: ${thirdSize}px;
          border: 0.25px solid ${fontColor};
          border-radius: 50%;
          opacity: 0.25;
          pointer-events: none;
          transform-origin: center;
        `;
        
        waterSurface.appendChild(thirdRipple);
        
        anime({
          targets: thirdRipple,
          scale: [1, 3],
          opacity: [0.25, 0],
          duration: 3000,
          easing: 'easeOutCubic',
          complete: function() {
            if (thirdRipple.parentNode) {
              thirdRipple.parentNode.removeChild(thirdRipple);
            }
          }
        });
      }, 800);
    }
  
    // Create splash effect on perspective surface
    function createSurfaceSplash(x, y) {
      const numParticles = Math.floor(Math.random() * 8) + 6; // 6-13 particles
      
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2; // 2-6px
        const angle = (Math.PI * 2 * i) / numParticles + (Math.random() - 0.5) * 0.8;
        const velocity = Math.random() * 50 + 20; // 20-70px distance
        
        particle.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          background: ${fontColor};
          border-radius: 50%;
          opacity: 0.8;
          pointer-events: none;
        `;
        
        waterSurface.appendChild(particle);
        
        // Animate splash particles with perspective-aware motion
        anime({
          targets: particle,
          translateX: Math.cos(angle) * velocity,
          translateY: Math.sin(angle) * velocity * 0.6, // Compressed Y movement for perspective
          opacity: [0.8, 0],
          scale: [1, 0.2],
          duration: 1200,
          easing: 'easeOutCubic',
          complete: function() {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          }
        });
      }
    }
  
    // Create surface impact point
    function createSurfaceImpact() {
      const surfaceWidth = window.innerWidth;
      const surfaceHeight = window.innerHeight;
      
      // Random position across the entire main element area
      const x = Math.random() * surfaceWidth;
      const y = Math.random() * surfaceHeight;
      
      // Create impact point indicator (brief flash)
      const impact = document.createElement('div');
      impact.style.cssText = `
        position: absolute;
        left: ${x - 3}px;
        top: ${y - 3}px;
        width: 6px;
        height: 6px;
        background: ${fontColor};
        border-radius: 50%;
        opacity: 1;
        pointer-events: none;
      `;
      
      waterSurface.appendChild(impact);
      
      // Quick flash and disappear
      anime({
        targets: impact,
        scale: [1, 0],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeOutQuad',
        complete: function() {
          if (impact.parentNode) {
            impact.parentNode.removeChild(impact);
          }
        }
      });
      
      // Create ripple and splash effects
      setTimeout(() => {
        createSurfaceRipple(x, y);
        createSurfaceSplash(x, y);
      }, 50);
    }
  
    // Create wave of surface impacts
    function createImpactWave() {
      const numberOfImpacts = Math.floor(Math.random() * 4) + 2; // 2-5 impacts per wave
      
      for (let i = 0; i < numberOfImpacts; i++) {
        setTimeout(() => {
          createSurfaceImpact();
        }, i * 400); // Stagger impacts by 400ms
      }
    }
  
    // Start the surface animation
    function startSurfaceAnimation() {
      createImpactWave();
      
      // Schedule next wave
      const nextWaveDelay = Math.random() * 5000 + 3000; // 3-8 seconds between waves
      setTimeout(startSurfaceAnimation, nextWaveDelay);
    }
  
    // Handle window resize
    function handleResize() {
      // Clear existing elements on resize
      waterSurface.innerHTML = '';
    }
  
    window.addEventListener('resize', handleResize);
  
    // Start the animation with initial delay
    setTimeout(startSurfaceAnimation, 1500);
  
    // Create some initial impacts for immediate visual interest
    setTimeout(() => {
      for (let i = 0; i < 2; i++) {
        setTimeout(() => {
          createSurfaceImpact();
        }, i * 800);
      }
    }, 500);
  });