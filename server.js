// ================================================
// server.js - Versión para Render con email de marca
// ================================================

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const XLSX = require("xlsx");
const nodemailer = require("nodemailer");
require("dotenv").config();               // para leer .env y variables de Render

const app = express();
const PORT = process.env.PORT || 3000;    // Render asigna su propio puerto

app.use(express.static("public"));
app.use(express.json());

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

// ====================== EMAIL - Usando cuenta de la marca ======================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL || "amanenatural0@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// ====================== HORARIOS FIJOS ======================
const horarios = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"];

// ====================== OBTENER HORARIOS DISPONIBLES ======================
app.get("/horarios/:fecha", (req, res) => {
  const fecha = req.params.fecha;

  db.all(
    "SELECT hora FROM reservas WHERE fecha = ? AND estado = 'activo'",
    [fecha],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const ocupados = rows.map(r => r.hora);
      const disponibles = horarios.filter(h => !ocupados.includes(h));

      res.json(disponibles);
    }
  );
});

// ====================== RESERVAR TURNO ======================
app.post("/reservar", (req, res) => {
  const { nombre, email, telefono, masaje, salud, fecha, hora } = req.body;

  if (!nombre || !email || !fecha || !hora) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  // Guardar en base de datos
  db.run(
    `INSERT INTO reservas (nombre, email, telefono, masaje, salud, fecha, hora, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'activo')`,
    [nombre, email, telefono, masaje, salud, fecha, hora],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al guardar reserva" });
      }

      // ====================== GENERAR EXCEL ======================
      db.all("SELECT * FROM reservas", (err2, rows) => {
        if (!err2) {
          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Reservas");
          XLSX.writeFile(wb, "reservas.xlsx");
          console.log("✅ Excel actualizado");
        }
      });

      // ====================== EMAIL AL CLIENTE (desde la marca) ======================
      transporter.sendMail({
        from: `"Amane Natural" <${process.env.ADMIN_EMAIL || "amanenatural0@gmail.com"}>`,
        to: email,
        subject: "Confirmación de turno - Amane Spa",
        text: `Hola ${nombre}!

Tu turno fue reservado exitosamente.

📅 Fecha: ${fecha}
⏰ Hora: ${hora}
💆 Masaje: ${masaje}

Te esperamos en Amane Natural 🌿

¡Que lo disfrutes mucho!
Amane Natural`
      }).catch(err => console.error("Error enviando email:", err));

      console.log(`✅ Nueva reserva: ${nombre} - ${fecha} ${hora}`);

      res.json({ ok: true, mensaje: "Reserva confirmada" });
    }
  );
});

// ====================== ENDPOINTS ADMIN (opcional) ======================
app.get("/admin/reservas", (req, res) => {
  db.all("SELECT * FROM reservas ORDER BY fecha DESC", (err, rows) => {
    res.json(rows || []);
  });
});

app.post("/admin/cancelar", (req, res) => {
  const { id } = req.body;
  db.run("UPDATE reservas SET estado = 'cancelado' WHERE id = ?", [id]);
  res.json({ ok: true });
});

// ====================== INICIO DEL SERVIDOR ======================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log("Email remitente configurado como: Amane Natural <amanenatural0@gmail.com>");
});