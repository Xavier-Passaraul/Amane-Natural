const fechaInput = document.getElementById("fecha");
const horariosDiv = document.getElementById("horarios");
const horaInput = document.getElementById("hora");

fechaInput.addEventListener("change", cargarHorarios);

async function cargarHorarios(){

const fecha = fechaInput.value;

const res = await fetch("/horarios/" + fecha);

const disponibles = await res.json();

horariosDiv.innerHTML = "";

const todos = ["10:00","11:00","12:00","16:00","17:00","18:00"];

todos.forEach(h => {

const btn = document.createElement("div");

btn.classList.add("hora");
btn.innerText = h;

if(!disponibles.includes(h)){

btn.classList.add("ocupado");

}else{

btn.addEventListener("click",()=>{

document.querySelectorAll(".hora")
.forEach(el=>el.classList.remove("seleccionado"));

btn.classList.add("seleccionado");

horaInput.value = h;

});

}

horariosDiv.appendChild(btn);

});

}

document.getElementById("formReserva")
.addEventListener("submit", async function(e){

e.preventDefault();

const data = {

nombre: document.getElementById("nombre").value,
email: document.getElementById("email").value,
telefono: document.getElementById("telefono").value,
masaje: document.getElementById("masaje").value,
salud: document.getElementById("salud").value,
fecha: fechaInput.value,
hora: horaInput.value

};

await fetch("/reservar",{

method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify(data)

});

alert("Tu turno fue reservado");

location.reload();

});

data.push({
Nombre:nombre,
Email:email,
Telefono:telefono,
Masaje:masaje,
Salud:salud,
Fecha:fecha,
Hora:hora
});