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
