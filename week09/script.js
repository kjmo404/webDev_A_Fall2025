const phone = document.getElementById('phone');
const leftAnimation = document.querySelector('.left-animation');
const rightAnimation = document.querySelector('.right-animation');

// Add vibrating class initially
phone.classList.add('vibrating');

// Click event to stop vibration and show content
phone.addEventListener('click', function() {
    // Remove vibration
    phone.classList.remove('vibrating');
    phone.classList.add('active');
    
    // Hide wifi animations
    leftAnimation.classList.add('hidden');
    rightAnimation.classList.add('hidden');
});