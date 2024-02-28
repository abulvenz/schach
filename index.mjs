import express from "express";
import { createServer } from "node:http";

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import * as jsonpatch from "fast-json-patch/index.mjs";
import field from "./field.mjs";
import stack from "./stack.mjs";

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
let next = 0;
io.on("connection", (socket) => {
  const useridx = ++next;
  users.push({ socket, idx: useridx }) - 1;
  io.emit("hi", { id: useridx, users: users.map((u) => u.idx) });
  console.log(
    "a user connected",
    users.map((u) => u.idx)
  );
  socket.on("disconnect", () => {
    console.log("user disconnected");
    users.splice(
      users.findIndex((e) => e.idx === useridx),
      1
    );
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("game", (msg) => {
    const f = field.initialField.slice();
    games.push(
      stack({
        playerB: useridx,
        playerW: msg.user,
        field: f,
        next: "W",
        selected: undefined,
      })
    );

    console.log(games[games.length - 1].peek());

    io.emit("field", games[games.length - 1].pop());
  });

  socket.on("select", (msg) => {
    const game = games[games.length - 1].current();
    if (game.next === "W" && game.playerW !== useridx) return;
    if (game.next === "B" && game.playerB !== useridx) return;
    if (
      game.selected !== undefined &&
      game.field[game.selected] > 0 &&
      ((game.next === "W" &&
        game.playerW === useridx &&
        game.field[game.selected] > 0 &&
        game.field[game.selected] < 20) ||
        (game.next === "B" &&
          game.playerB === useridx &&
          game.field[game.selected] >= 20))
    ) {
      const fig = game.field[game.selected];
      game.field[game.selected] = 0;
      game.field[msg.selected] = fig;
      game.selected = undefined;
      game.next = game.next === "W" ? "B" : "W";
    } else {
      game.selected = msg.selected;
    }
    games[games.length - 1].push(game);
    io.emit("field", game);
  });

  socket.on("undo", () => {
    const game = games[games.length - 1].pop();
    console.log(game);
    io.emit("field", game);
  });

  socket.on("enter", (msg) => socket.join(msg));
});

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});
