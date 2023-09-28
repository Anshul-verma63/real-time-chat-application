const http = require("http");
const express = require("express");
const cors = require("cors");
// const socketIO = require("socket.io");
const { Server } = require("socket.io");

const users = [{}];

const app = express();
const port = 4500 || process.env.PORT;
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello it is working");
});
const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  //    console.log("new connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    //   console.log(`${user} has joined`);
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat ${users[socket.id]}`,
    });
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined the chat`,
    });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has left the chat`,
    });
  });
});

server.listen(port, () => {
  console.log(`server run at ${port}`);
});
