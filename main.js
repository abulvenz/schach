import m from "mithril";
import tagl from "tagl-mithril";
import figures from "./figures";
import io from "socket.io/client-dist/socket.io";

const { trunc } = Math;
const { div, ul, li, h1, form, input, button, table, tr, td } = tagl(m);
const messages = [];

// TODO: Can't we import io from socket.io-client?
const socket = io();

const range = (N) => {
  const r = [];
  for (let i = 0; i < N; i++) {
    r.push(i);
  }
  return r;
};

let field = [];

const mirror = (f) => f.reverse();

let selected = undefined;
let users = [];
let games = [];

const connectEvent = (eventName, callback) =>
  socket.on(eventName, (p) => {
    callback(p);
    m.redraw();
  });

connectEvent("hi", (msg) => {
  messages.push({ sender: "OPERATOR", msg: "Welcome " + msg.id });
  users = msg.users;
  games = msg.games;
});

connectEvent("chat message", (msg) => {
  messages.push(msg);
  window.scrollTo(0, document.body.scrollHeight);
});

connectEvent("field", (msg) => {
  field = msg.field;
  // mirror(field);
});

connectEvent("select", (msg) => {
  selected = msg.selected;
});

const state = {
  msg: "",
};

const send = () => {
  socket.emit("chat message", { sender: socket.id, msg: state.msg });
  state.msg = "";
};

const fcol = (v) => `f${figures[v].color}`;

const fieldClass = (idx) =>
  (idx + trunc(idx / 8)) % 2 === 0 ? "black" : "white";

const isSelected = (idx) => idx === selected;

const select = (idx) => {
  socket.emit("select", { selected: idx });
};

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

m.mount(document.body, {
  view: (vnode) => [
    field.length === 0
      ? [
          ul(
            users.map((u) =>
              li(
                u,
                button(
                  { onclick: () => socket.emit("game", { user: u }) },
                  "Play"
                )
              )
            )
          ),
          ul.$messages(messages.map((msg) => li(msg.sender + ": " + msg.msg))),
          div.$form(
            input.$input({
              value: state.msg,
              oninput: (e) => (state.msg = e.target.value),
              onkeydown: (e) => {
                if (e.key === "Enter") {
                  send();
                }
              },
              autocomplete: "off",
            }),
            button({ onclick: (e) => send() }, "Send")
          ),
        ]
      : div.centerScreen(
          div.board(
            field.map((fie, idx) =>
              div.field[isSelected(idx) ? "selected" : ""][fieldClass(idx)][
                fcol(fie)
              ](
                {
                  onclick: (e) => select(idx),
                },
                figures[fie].symbol
              )
            )
          )
        ),
    button({ onclick: toggleFullScreen }, io.id),
  ],
});
