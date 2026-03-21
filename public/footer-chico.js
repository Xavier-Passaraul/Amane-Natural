document.addEventListener("DOMContentLoaded", () => {
  const footerContainer = document.getElementById("footer-placeholder");

  if(!footerContainer) return;

  // IMPORTANTE: Aquí llamamos al archivo pequeño
  fetch("./footer-chico.html") 
    .then(res => {
      if(!res.ok) throw new Error("No se encontró footer-chico.html");
      return res.text();
    })
    .then(data => {
      footerContainer.innerHTML = data;

      // Año automático para el footer chico
      const year = document.getElementById("year");
      if(year){
        year.textContent = new Date().getFullYear();
      }
    })
    .catch(err => console.error("Error footer chico:", err));
});
