function abrirModal(nombre, imagen, descripcion, precio, beneficios) {
    var modal = document.getElementById("modal-producto");
    var header = document.querySelector("header");

    document.getElementById("modal-titulo").innerText = nombre;
    document.getElementById("modal-img").src = imagen;
    document.getElementById("modal-desc").innerText = descripcion;
    document.getElementById("modal-precio").innerText = precio;
    document.getElementById("modal-beneficios").innerHTML = beneficios || "";

    if (modal) modal.style.display = "flex";
    if (header) header.style.display = "none";
    document.body.style.overflow = "hidden";
}

function cerrarModal() {
    var modal = document.getElementById("modal-producto");
    var header = document.querySelector("header");
    if (modal) modal.style.display = "none";
    if (header) header.style.display = "block";
    document.body.style.overflow = "auto";
}

function comprar() {
    var n = document.getElementById("modal-titulo").innerText;
    var p = document.getElementById("modal-precio").innerText;

    var msj = "Hola Amane! Quiero comprar:\n\nProducto: " + n + "\nPrecio: " + p;

    var numero = "549XXXXXXXXXX";

    var urlFinal = "https://api.whatsapp.com/send?phone=" + numero + "&text=" + encodeURIComponent(msj);

    window.open(urlFinal, "_blank");
}

window.onclick = function(event) {
    var modal = document.getElementById("modal-producto");
    if (event.target == modal) {
        cerrarModal();
    }
}

// --- LÓGICA DE HEADER DINÁMICO Y MENÚ HAMBURGUESA ---

document.addEventListener('DOMContentLoaded', () => {
    let lastScrollTop = 0;
    const header = document.querySelector("header");
    const btnHamburguesa = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".menu");

    // 1. Esconder/Mostrar Header al scrollear
    window.addEventListener('scroll', () => {
        // Si el modal está abierto, no hacemos nada con el header
        if (document.getElementById("modal-producto").style.display === "flex") return;

        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Bajando: Escondemos
            header.classList.add('header-hidden');
        } else {
            // Subiendo: Mostramos
            header.classList.remove('header-hidden');
        }
        lastScrollTop = scrollTop;
    });

    // 2. Abrir/Cerrar Menú Hamburguesa
    if (btnHamburguesa && navMenu) {
        btnHamburguesa.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
        });

        // Cerrar el menú si se hace click en un enlace
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Cerrar menú al tocar cualquier parte de la pantalla
    document.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
    });
});

// --- AJUSTE EN TUS FUNCIONES EXISTENTES ---
// Modificá tu función cerrarModal para que el header vuelva a ser visible correctamente:

function cerrarModal() {
    var modal = document.getElementById("modal-producto");
    var header = document.querySelector("header");
    if (modal) modal.style.display = "none";
    if (header) {
        // En lugar de block, usamos flex o quitamos el display:none
        header.style.display = "flex"; 
    }
    document.body.style.overflow = "auto";
}
