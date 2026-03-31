/* =========================
   ANIMACIONES SCROLL
========================= */
if(document.querySelector('.section')){
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));
}


/* =========================
   MODAL TIPOS DE PIEL
========================= */
if(document.querySelector(".skin-btn")){

  const modal = document.getElementById("modal");
  const modalText = document.getElementById("modal-text");
  const closeBtn = document.querySelector(".close");

  const content = {
    seca: `
      <h2>🌸 Rutina para piel seca</h2>
      <p>La piel seca necesita nutrición profunda y constancia.</p>
      <ul>
        <li>🧼 Limpieza suave</li>
        <li>💧 <a href="catalogo.html#hidratante" class="product-link">Crema hidratante</a></li>
        <li>☀️ <a href="catalogo.html#reparadora" class="product-link">Crema reparadora</a></li>
        <li>💆‍♀️ Masajes</li>
      </ul>
      <div class="tip">✨ Aplicá la crema con piel húmeda</div>
    `,

    grasa: `
      <h2>💧 Rutina para piel grasa</h2>
      <p>Equilibrar sin resecar.</p>
      <ul>
        <li>🧼 Limpieza diaria</li>
        <li>💧 <a href="catalogo.html#hidratante" class="product-link">Hidratante ligera</a></li>
        <li>🌙 <a href="catalogo.html#granos" class="product-link">Crema para granos</a></li>
      </ul>
      <div class="tip">✨ No saltees hidratación</div>
    `,

    mixta: `
      <h2>⚖️ Rutina para piel mixta</h2>
      <p>Equilibrio por zonas.</p>
      <ul>
        <li>🧼 Limpieza equilibrada</li>
        <li>💧 <a href="catalogo.html#hidratante" class="product-link">Hidratante</a></li>
        <li>🌙 <a href="catalogo.html#granos" class="product-link">Zona T</a></li>
        <li>☀️ <a href="catalogo.html#reparadora" class="product-link">Reparadora</a></li>
      </ul>
      <div class="tip">✨ Tratá cada zona distinto</div>
    `
  };

  document.querySelectorAll(".skin-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.skin;
      modalText.innerHTML = content[type];
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
    });
  });

  closeBtn.onclick = () => {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  };

  window.onclick = (e) => {
    if(e.target === modal){
      modal.style.display = "none";
    }
  };
}


/* =========================
   WHATSAPP RESERVAS
========================= */
function reservar(servicio){
  const numero = "5493536561455"; // CAMBIAR
  const mensaje = `Hola Amane! Quiero reservar:\n\nServicio: ${servicio}`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}



