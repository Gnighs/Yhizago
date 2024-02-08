var navLinks = document.getElementById("nav-links");
function showMenu(){
    navLinks.style.right = "0";
}
function hideMenu(){
    navLinks.style.right = "-60vw";
}
function toggleSublist(elementId) {
    var elementToToggle = document.getElementById(elementId);

    if (window.innerWidth < 700) {
        if (elementToToggle.style.display === 'none' || getComputedStyle(elementToToggle).display === 'none') {
            elementToToggle.style.display = 'block';
        } else {
            elementToToggle.style.display = 'none';
        }
    }
}
window.addEventListener('resize', function() {
    if (window.innerWidth >= 700) {
        var sublist1 = document.getElementById('sublist1');
        sublist1.style.display = 'none';
    }
});