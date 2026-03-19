let lastScrollTop = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Si bajamos más de 50px, escondemos el header
    if (scrollTop > lastScrollTop && scrollTop > 50) {
        header.style.top = "-150px"; // Lo saca de pantalla hacia arriba
    } else {
        // Al subir, lo volvemos a mostrar
        header.style.top = "0";
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);
