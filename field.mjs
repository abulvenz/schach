let initialField = [
    11, 16, 12, 14, 13, 12, 16, 11,
    15, 15, 15, 15, 15, 15, 15, 15,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,

    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    25, 25, 25, 25, 25, 25, 25, 25,
    21, 26, 22, 24, 23, 22, 26, 21
];


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


export default {
    initialField,
    figures,
}