console.log("EMAIL:", process.env.ADMIN_EMAIL);
const { google } = require("googleapis");
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = "1OgZYIokxnml68m61bAuBSpWEYdJSyPmdH4f0XtlL92g";
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const XLSX = require("xlsx");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

// ====================== CONFIG ======================

// tu numero whatsapp
const ADMIN_PHONE = process.env.ADMIN_PHONE;

// api key callmebot
const CALLMEBOT_API = process.env.CALLMEBOT_API;

// ====================== BASE DE DATOS ======================

const db = new sqlite3.Database("reservas.db");

db.run(`
CREATE TABLE IF NOT EXISTS reservas(
id INTEGER PRIMARY KEY AUTOINCREMENT,
nombre TEXT,
email TEXT,
telefono TEXT,
masaje TEXT,
salud TEXT,
fecha TEXT,
hora TEXT,
estado TEXT DEFAULT 'activo'
)
`);

// ====================== EMAIL ======================

const transporter = nodemailer.createTransport({
host: "smtp.gmail.com",
port: 465,
secure: true,
auth: {
user: process.env.ADMIN_EMAIL,
pass: process.env.GMAIL_APP_PASSWORD
}
});

// ====================== HORARIOS ======================

const horarios = [
"09:00",
"10:00",
"11:00",
"12:00",
"14:00",
"15:00",
"16:00",
"17:00",
"18:00"
];

// ====================== HORARIOS DISPONIBLES ======================

app.get("/horarios/:fecha", (req, res) => {

const fecha = req.params.fecha;

db.all(
"SELECT hora FROM reservas WHERE fecha = ? AND estado = 'activo'",
[fecha],
(err, rows) => {

if (err) {
return res.status(500).json({ error: err.message });
}

const ocupados = rows.map(r => r.hora);
const disponibles = horarios.filter(h => !ocupados.includes(h));

res.json(disponibles);

});

});

// ====================== GUARDAR EN EXCEL ======================

function actualizarExcel(){

db.all("SELECT * FROM reservas", (err, rows) => {

if(err) return;

const ws = XLSX.utils.json_to_sheet(rows);
const wb = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb, ws, "Reservas");

XLSX.writeFile(wb, "reservas.xlsx");

console.log("📊 Excel actualizado");

});

}

// ====================== ENVIAR WHATSAPP ======================

async function enviarWhatsApp(nombre, masaje, fecha, hora){

try{

const mensaje = `Nueva Reserva%0A
Cliente: ${nombre}%0A
Masaje: ${masaje}%0A
Fecha: ${fecha}%0A
Hora: ${hora}`;

const url = `https://api.callmebot.com/whatsapp.php?phone=${ADMIN_PHONE}&text=${mensaje}&apikey=${CALLMEBOT_API}`;

await axios.get(url);

console.log("📲 WhatsApp enviado");

}catch(err){

console.log("Error WhatsApp:", err.message);

}

}

// ====================== RESERVAR ======================

app.post("/reservar", async (req,res)=>{

const { nombre,email,telefono,masaje,salud,fecha,hora } = req.body;

if(!nombre || !email || !fecha || !hora){

return res.status(400).json({error:"Faltan datos"});

}

db.run(

`INSERT INTO reservas
(nombre,email,telefono,masaje,salud,fecha,hora,estado)
VALUES (?,?,?,?,?,?,?,'activo')`,

[nombre,email,telefono,masaje,salud,fecha,hora],

async function(err){

if(err){

console.error(err);

return res.status(500).json({error:"Error guardando reserva"});

}

// actualizar excel
actualizarExcel();
// ================= GOOGLE SHEETS =================

try {

await sheets.spreadsheets.values.append({
  spreadsheetId: SPREADSHEET_ID,
  range: "Sheet1!A:H",
  valueInputOption: "USER_ENTERED",
  requestBody: {
    values: [[nombre,email,telefono,masaje,salud,fecha,hora,"activo"]],
  },
});

console.log("📄 Google Sheets actualizado");

} catch(err) {

console.log("Error Google Sheets:", err.message);

}

// ================= EMAIL CLIENTE =================

try{

await transporter.sendMail({

from:`"Amane Natural" <${process.env.ADMIN_EMAIL}>`,

to:email,

subject:"Confirmación de turno - Amane Natural",

text:`Hola ${nombre}!

Tu turno fue reservado con éxito.

📅 Fecha: ${fecha}
⏰ Hora: ${hora}
💆 Servicio: ${masaje}

Te esperamos en Amane Natural 🌿

Gracias por elegirnos.`

});

console.log("📧 Email enviado");

}catch(err){

console.log("Error email:",err.message);

}

// ================= WHATSAPP =================

await enviarWhatsApp(nombre,masaje,fecha,hora);

console.log(`✅ Nueva reserva: ${nombre} ${fecha} ${hora}`);

res.json({ok:true});

});

});

// ====================== ADMIN ======================

app.get("/admin/reservas",(req,res)=>{

db.all(

"SELECT * FROM reservas ORDER BY fecha DESC",

(err,rows)=>{

res.json(rows || []);

}

);

});

app.post("/admin/cancelar",(req,res)=>{

const { id } = req.body;

db.run(

"UPDATE reservas SET estado='cancelado' WHERE id=?",

[id]

);

res.json({ok:true});

});

// ====================== SERVER ======================

app.listen(PORT,()=>{

console.log(`🚀 Servidor iniciado en puerto ${PORT}`);

});