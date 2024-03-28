// const symbols = {
//   rook: { white: "♖", black: "♜" },
//   bishop: { white: "♗", black: "♝" },
//   king: { white: "♔", black: "♚" },
//   queen: { white: "♕", black: "♛" },
//   pawn: { white: "♙", black: "♟" },
//   knight: { white: "♘", black: "♞" },
// };

// ♖♗♔♕♙♘

const figures = {
  0: {
    symbol: "",
    type: "empty",
    color: "",
  },
  11: {
    color: "white",
    type: "rook",
    symbol: "♜",
    notation: {de: "T", en: "R"}
  },
  12: {
    color: "white",
    type: "bishop",
    symbol: "♝",
    notation: {de: "L", en: "B"}
  },
  13: {
    color: "white",
    type: "king",
    symbol: "♚",
    notation: {de: "K", en: "K"}
  },
  14: {
    color: "white",
    type: "queen",
    symbol: "♛",
    notation: {de: "D", en: "Q"}
  },
  15: {
    color: "white",
    type: "pawn",
    symbol: "♟",
    notation: {de: "", en: ""}
  },
  16: {
    color: "white",
    type: "knight",
    symbol: "♞",
    notation: {de: "S", en: "N"}
  },
  21: {
    color: "black",
    type: "rook",
    symbol: "♜",
    notation: {de: "T", en: "R"}
  },
  22: {
    color: "black",
    type: "bishop",
    symbol: "♝",
    notation: {de: "L", en: "B"}
  },
  23: {
    color: "black",
    type: "king",
    symbol: "♚",
    notation: {de: "K", en: "K"}
  },
  24: {
    color: "black",
    type: "queen",
    symbol: "♛",
    notation: {de: "D", en: "Q"}
  },
  25: {
    color: "black",
    type: "pawn",
    symbol: "♟",
    notation: {de: "", en: ""}
  },
  26: {
    color: "black",
    type: "knight",
    symbol: "♞",
    notation: {de: "S", en: "N"}
  },
};

export default figures;
