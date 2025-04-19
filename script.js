document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    function toggleMenu() {
        
        mobileMenu.classList.toggle('-translate-x-full');
        mobileMenu.classList.toggle('opacity-0');
        mobileMenu.classList.toggle('translate-x-0');
        mobileMenu.classList.toggle('opacity-100');

    }

    menuToggle.addEventListener('click', toggleMenu);

    document.addEventListener('click', function(e) {
        if (isMenuOpen && !mobileMenu.contains(e.target) && e.target !== menuToggle) {
            toggleMenu();
        }
    });
});