const userName = document.querySelector(".userName");
const socket = io();
let nameUser = "";

Swal.fire({
  title: "Ingrese su nombre",
  input: "text",
  inputAttributes: {
    autocapitalize: "on",
  },
  showCancelButton: false,
  confirmButtonText: "Ingresar",
}).then((result) => {
  userName.innerHTML = result.value;
  nameUser = result.value;
  socket.emit("userConnection", {
    user: result.value,
  });
});

const messageInner = (data) => {
  let message = "";
  for (let i = 0; i < data.length; i++) {
    if (data[i].info === "connection") {
      message += `<p class="connection">${data[i].message}</p>`;
    }
    if (data[i].info === "message") {
      message += `
        <div class="messageUser">
            <h5>${data[i].name}</h5>
            <p>${data[i].message}</p>
        </div>
        `;
    }
  }
  return message;
};

const chatMessage = document.querySelector(".chatMessage");

socket.on("userConnection", (data) => {
  chatMessage.innerHTML = "";
  const connection = messageInner(data);
  chatMessage.innerHTML = connection;
  console.log(connection);
});

const inputMessage = document.getElementById("inputMessage");
const btnMessage = document.getElementById("btnMessage");

btnMessage.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("userMessage", {
    message: inputMessage.value,
  });
});

socket.on("userMessage", (data) => {
  chatMessage.innerHTML = "";
  const message = messageInner(data);
  chatMessage.innerHTML = message;
});

inputMessage.addEventListener("keypress", (e) => {
  socket.emit("typing", { nameUser });
});

const typing = document.querySelector(".typing");

socket.on("typing", (data) => {
  typing.textContent = `${data.nameUser} esta escribiendo...`;
});
