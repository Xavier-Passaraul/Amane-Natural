let lastScrollTop = 0;
const header = document.querySelector("header");
const menu = document.querySelector(".menu");
const toggle = document.querySelector(".menu-toggle");

// CONTROL DE SCROLL (OCULTAR/MOSTRAR HEADER)
window.addEventListener("scroll", function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Si bajamos más de 80px, aplicamos la clase para ocultar
    if (scrollTop > lastScrollTop && scrollTop > 80) {
        // En lugar de style.top usamos la clase CSS que mueve el 100%
        header.classList.add("header-hidden");
        
        // IMPORTANTE: Si el menú mobile estaba abierto, lo cerramos al bajar
        menu.classList.remove("active");
    } else {
        // Al subir, quitamos la clase y el header reaparece
        header.classList.remove("header-hidden");
    }

    // Guardamos la posición actual para la próxima comparación
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// MENU HAMBURGUESA (ABRIR/CERRAR)
toggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita conflictos con otros clicks
    menu.classList.toggle("active");
});

// CERRAR MENU AL HACER CLICK EN UN ENLACE
document.querySelectorAll(".menu a").forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("active");
    });
});

// CERRAR MENU SI HACEN CLICK FUERA DEL NAV
document.addEventListener("click", (e) => {
    if (!header.contains(e.target) && menu.classList.contains("active")) {
        menu.classList.remove("active");
    }
});
