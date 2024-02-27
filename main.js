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


const figures =
{
    0: { symbol: "" },
    11: {
        color: "white",
        type: "rook",
        symbol: "♖",
    },
    12: {
        color: "white",
        type: "bishop",
        symbol: "♗",
    },
    13: {
        color: "white",
        type: "king",
        symbol: "♔",
    },
    14: {
        color: "white",
        type: "queen",
        symbol: "♕",
    },
    15: {
        color: "white",
        type: "pawn",
        symbol: "♙",
    },
    16: {
        color: "white",
        type: "knight",
        symbol: "♘",
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

let field = [
    11, 16, 12, 14, 13, 12, 16, 11,
    15, 15, 15, 15, 15, 15, 15, 15,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,

    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    25, 25, 25, 25, 25, 25, 25, 25,
    21, 26, 22, 24, 23, 22, 26, 21
];

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

const state = {
    msg: ""
};

const send = () => {
    socket.emit("chat message", { sender: socket.id, msg: state.msg });
    state.msg = "";
};

const fieldClass = idx => (idx
    + trunc(idx / 8)) % 2 === 0 ? "black" : "white";

m.mount(document.body, {
    view: vnode => [
        // ul.$messages(
        //     messages.map(msg => li(msg.sender + ": " + msg.msg)),),
        // div.$form(
        //     input.$input({ value: state.msg, oninput: e => state.msg = e.target.value, autocomplete: "off" }), button({ onclick: e => send() }, "Send")
        // ),
        div.centerScreen(
            div.board(
                range(64).map(idx => div.field[selected === idx ? "selected" : ""][fieldClass(idx)]({
                    onclick: e => console.log(selected = selected === idx ? undefined : idx),
                }, figures[field[idx]].symbol))
            ))
    ]
})