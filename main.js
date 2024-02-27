import m from 'mithril';
import tagl from 'tagl-mithril';
const { trunc } = Math;
const { div, ul, li, h1, form, input, button, table, tr, td } = tagl(m);
const messages = []
const socket = io();

const symbols =
{
    rook: { white: '♖', black: '♜' },
    bishop: { white: '♗', black: '♝' },
    king: { white: '♔', black: '♚' },
    queen: { white: '♕', black: '♛' },
    pawn: { white: '♙', black: '♟' },
    knight: { white: '♘', black: '♞' },
};

// ♖♗♔♕♙♘

const figures =
{
    0: {
        symbol: "",
        type: "empty",
        color: "",
    },
    11: {
        color: "white",
        type: "rook",
        symbol: "♜",
    },
    12: {
        color: "white",
        type: "bishop",
        symbol: "♝",
    },
    13: {
        color: "white",
        type: "king",
        symbol: "♚",
    },
    14: {
        color: "white",
        type: "queen",
        symbol: "♛",
    },
    15: {
        color: "white",
        type: "pawn",
        symbol: "♟",
    },
    16: {
        color: "white",
        type: "knight",
        symbol: "♞",
    },
    21: {
        color: "black",
        type: "rook",
        symbol: "♜",
    },
    22: {
        color: "black",
        type: "bishop",
        symbol: "♝",
    },
    23: {
        color: "black",
        type: "king",
        symbol: "♚",
    },
    24: {
        color: "black",
        type: "queen",
        symbol: "♛",
    },
    25: {
        color: "black",
        type: "pawn",
        symbol: "♟",
    },
    26: {
        color: "black",
        type: "knight",
        symbol: "♞",
    },
}


const range = N => {
    const r = [];
    for (let i = 0; i < N; i++) {
        r.push(i);
    }
    return r;
};

let field = [];

const mirror = f => f.reverse();

//mirror(field)

let selected = undefined;

socket.on('chat message', (msg) => {
    messages.push(msg);
    m.redraw();
    window.scrollTo(0, document.body.scrollHeight);
    m.redraw();
});

socket.on("hi", msg => {
    messages.push({ sender: "OPERATOR", msg: "Welcome " + msg });
    m.redraw();
})

socket.on("field", msg => {
    field = msg.field;
    m.redraw();
})

const state = {
    msg: ""
};

const send = () => {
    socket.emit("chat message", { sender: socket.id, msg: state.msg });
    state.msg = "";
};

const fcol = v => `f${figures[v].color}`

const fieldClass = idx => (idx
    + trunc(idx / 8)) % 2 === 0 ? "black" : "white";

const isSelected = idx => idx === selected;

const select = idx => (selected = isSelected(idx) ? undefined : idx)

m.mount(document.body, {
    view: vnode => [
        ul.$messages(
            messages.map(msg => li(msg.sender + ": " + msg.msg)),),
        div.$form(
            input.$input({ value: state.msg, oninput: e => state.msg = e.target.value, autocomplete: "off" }), button({ onclick: e => send() }, "Send")
        ),
        div.centerScreen(
            div.board(
                field.map((fie, idx) => div.field
                [isSelected(idx) ? "selected" : ""]
                [fieldClass(idx)]
                [fcol(fie)]
                    ({
                        onclick: e => select(idx),
                    }, figures[fie].symbol))
            ))
    ]
})