document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const btnMenu = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".menu");
    let lastScrollTop = 0;

    // 1. Esconder Header al bajar
    window.addEventListener("scroll", () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 80) {
            header.classList.add("header-hidden");
        } else {
            header.classList.remove("header-hidden");
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // 2. Menú Hamburguesa (Abrir/Cerrar)
    if (btnMenu) {
        btnMenu.addEventListener("click", (e) => {
            e.stopPropagation();
            navMenu.classList.toggle("active");
        });
    }

    // Cerrar menú al tocar afuera
    document.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });
});
