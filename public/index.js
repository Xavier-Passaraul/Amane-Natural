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

// Función para forzar el video del Hero
const setupHeroVideo = () => {
    const video = document.querySelector('video'); // O usa .tu-clase-video
    
    if (video) {
        // 1. Aseguramos el silencio (regla de oro de los navegadores)
        video.muted = true;
        video.setAttribute('muted', ''); 
        video.playsInline = true;

        // 2. Intentamos reproducir con una promesa
        const attemptPlay = () => {
            video.play().catch(error => {
                console.log("Autoplay bloqueado. Reintentando al interactuar.");
                
                // 3. Plan de rescate: reproducir al primer scroll o click del usuario
                const forcePlay = () => {
                    video.play();
                    window.removeEventListener('scroll', forcePlay);
                    window.removeEventListener('click', forcePlay);
                };
                window.addEventListener('scroll', forcePlay, { once: true });
                window.addEventListener('click', forcePlay, { once: true });
            });
        };

        attemptPlay();
    }
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHeroVideo);
} else {
    setupHeroVideo();
}
