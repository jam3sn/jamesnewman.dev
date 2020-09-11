document.addEventListener('DOMContentLoaded', function() {
    var navmenuToggle = document.getElementById('navbar-toggle');
    var navbarOptions = document.getElementById('navbar-options');

    navmenuToggle.addEventListener('click', function() {
        navbarOptions.classList.toggle('active');
    });
});