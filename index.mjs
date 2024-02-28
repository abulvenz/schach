import express from "express";
import { createServer } from "node:http";

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";

import field from "./field.mjs";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.use(express.static("dist"));

const range = (N) => {
  const r = [];
  for (let i = 0; i < N; i++) {
    r.push(i);
  }
  return r;
};

const randomInt = (N) => Math.trunc(Math.random() * N);

const use = (v, f) => f(v);

const shuffle = (arr, r = []) =>
  use(
    arr.map((e) => e),
    (a) => range(arr.length).map((i) => a.splice(randomInt(a.length), 1)[0])
  );

const users = [];
const games = [];

io.on("connection", (socket) => {
  users.push(socket);
  io.emit("hi", { id: socket.id, users: users.map((u) => u.id) });
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
    users.splice(users.indexOf(socket));
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("game", (msg) => {
    games.push({
      playerW: socket.id,
      playerB: msg.user,
      field: field.initialField,
      selected: undefined,
    });
    io.emit("field", games[games.length - 1]);
  });

  //  io.emit("field", { field: field.initialField });
  socket.on("select", (msg) => {
    const game = games[games.length - 1];
    console.log(msg.selected, game);
    if (game.selected !== undefined && game.field[game.selected] > 0) {
      console.log("selected", game.selected);
      const fig = game.field[game.selected];
      game.field[game.selected] = 0;
      game.field[msg.selected] = fig;
      game.selected = undefined;
    } else {
      game.selected = msg.selected;
    }
    io.emit("select", msg);
    io.emit("field", game);
  });

  socket.on("enter", (msg) => socket.join(msg));
});

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});
