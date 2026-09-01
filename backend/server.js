const app = require("./app");

var cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const { connecttoDb } = require("./Services/Mongodb.js");

require("dotenv").config();

const mongoose = require("mongoose");

app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://i-wproject.vercel.app",
    credentials: true,
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("CONNECTED:", socket.id);

  socket.on("join-session", (sessionid) => {
    socket.join(sessionid);

    const room = io.sockets.adapter.rooms.get(sessionid);

    console.log(`Room ${sessionid}: ${room ? room.size : 0} participants`);

    if (room && room.size === 2) {
      io.to(sessionid).emit("both-connected");
    }
  });

  socket.on("offer", (data) => {
    socket.to(data.sessionid).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.sessionid).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.sessionid).emit("ice-candidate", data);
  });
});

const PORT = 3000;

const aimoderoutes = require("./Routes/Aimoderoutes/aimoderoutes.js");
const usermoderoutes = require("./Routes/Userroutes/userroutes.js");

const authroutes = require("./Auth/Authroutes/authroutes.js");

// simpleroutes
app.use("/api/ai/", aimoderoutes);
app.use("/api/", usermoderoutes);

// auth routes
app.use("/auth", authroutes);

server.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});

connecttoDb();
