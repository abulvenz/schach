import express from "express";
import { createServer } from "node:http";

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import * as jsonpatch from "fast-json-patch/index.mjs";
import field from "./field.mjs";
import stack from "./stack.mjs";
import GameProxy from "./gameproxy.mjs";
import persistence from "./persistence.mjs";

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

io.on("connection", (socket) => {
  socket.on("i am", async (msg) => {
    console.log("i am", msg);
    const useridx = msg.id;
    if (users.findIndex((u) => u.idx === useridx) < 0)
      users.push({ socket, idx: useridx });
    io.emit("hi", { id: useridx, users: users.map((u) => u.idx) });
    console.log(
      "a user connected",
      users.map((u) => u.idx)
    );

    io.emit("games", await persistence.games.loadAllKeys());

    socket.on("disconnect", () => {
      console.log("user disconnected");
      users.splice(
        users.findIndex((e) => e.idx === useridx),
        1
      );
      io.emit("goodbye", { id: useridx, users: users.map((u) => u.idx) });
    });
    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
    });

    socket.on("game", async (msg) => {
      const f = field.initialField.slice();
      const gameid = `game-${useridx}-${msg.user}`;
      const game = stack({
        id: gameid,
        playerB: useridx,
        playerW: msg.user,
        field: f,
        valid: [],
        next: "W",
        result: undefined,
        selected: undefined,
      });
      console.log("creating game", gameid);
      socket.join(gameid);
      users.find((u) => u.idx === msg.user).socket.join(gameid);

      io.emit("games", await persistence.games.loadAllKeys());
      persistence.games.save(game);
      io.to(gameid).emit("field", game.pop());
    });

    socket.on("select", async (msg) => {
      const game = await persistence.games.loadById(msg.gameid);
      if (game === undefined) {
        return;
      }
      console.log(game);
      const g = game.current();

      console.log(socket.rooms);

      const proxy = GameProxy(g);

      if (!proxy.validPlayer(useridx)) {
        return;
      }

      proxy.handleSelection(msg.selected);

      game.push(proxy.newState());
      io.to(g.id).emit("field", g);
      persistence.games.save(game);
    });

    socket.on("undo", async (msg) => {
      const game = await persistence.games.loadById(msg.gameid);
      if (game === undefined) {
        return;
      }
      const g = game.pop();
      if (g.playerB !== useridx && g.playerW !== useridx) {
        return;
      }
      persistence.games.save(game);
      io.to(g.id).emit("field", g);
    });

    socket.on("enter game", async (msg) => {
      const game = await persistence.games.loadById(msg.gameid);
      if (game === undefined) {
        return;
      }
      socket.join(msg.gameid);
      const g = game.current();
      io.to(msg.gameid).emit("field", g);
    });
  });
});

server.listen(4000, () => {
  console.log("server running at http://localhost:4000");
});
