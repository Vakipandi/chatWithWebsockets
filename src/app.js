import express from "express";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import * as path from "path";
import { Server } from "socket.io";

const app = express();
const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

const message = [];

io.on("connection", (socket) => {
  // Nombre de usuario
  let userName = "";

  //   Mensaje de conexión
  socket.on("userConnection", (data) => {
    userName = data.user;
    message.push({
      id: socket.id,
      name: data.user,
      info: "connection",
      message: `${data.user} se ha conectado`,
      date: new Date().toTimeString(),
    });
    io.sockets.emit("userConnection", message);
  });

  // Mensaje de Enviado
  socket.on("userMessage", (data) => {
    message.push({
      id: socket.id,
      name: userName,
      info: "message",
      message: data.message,
      date: new Date().toTimeString(),
    });
    io.sockets.emit("userMessage", message);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  
  })
});
