function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    document.body.appendChild(ripple);
  
    const size = Math.random() * 30 + 20;
  
    ripple.style.width = ripple.style.height = '0px';
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;
  
    anime({
      targets: ripple,
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      opacity: 0,
      duration: 1500,
      easing: 'easeOutQuad',
      complete: () => {
        ripple.remove();
      }
    });
  }
  
  // Randomly create ripples
  setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    createRipple(x, y);
  }, 200);