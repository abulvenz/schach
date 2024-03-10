import { figure } from "tagl-mithril";
import field from "./field.mjs";

export default function GameProxy(g) {
  const selectedField = () => g.field[g.selected];
  const selectedIndex = () => g.selected;
  const selectionEmpty = () => selectedIndex() === undefined;
  const select = (idx) => (g.selected = idx);
  const deselect = () => select(undefined);
  const set = (idx, val) => (g.field[idx] = val);
  const get = (idx) => g.field[idx];
  const figureAt = idx => field.figures[get(idx)];
  const coords = (idx) => ({ r: Math.trunc(idx / 8), c: 7 - (idx % 8) });
  const next = () => (g.next = g.next === "white" ? "black" : "white");
  const c2idx = ({ r, c }) => r * 8 + 7 - c;
  const histogram = (arr) =>
    arr.reduce((hist, v) => (hist[v] = (hist[v] || 0) + 1) && hist, {});

  console.log(coords(0));
  console.log(c2idx(coords(0)));

  const directions = {
    up: ({ r, c }) => ({ r: r + 1, c }),
    down: ({ r, c }) => ({ r: r - 1, c }),
    left: ({ r, c }) => ({ r, c: c - 1 }),
    right: ({ r, c }) => ({ r, c: c + 1 }),
    up_left: ({ r, c }) => directions.up(directions.left({ r, c })),
    up_right: ({ r, c }) => directions.up(directions.right({ r, c })),
    down_left: ({ r, c }) => directions.down(directions.left({ r, c })),
    down_right: ({ r, c }) => directions.down(directions.right({ r, c })),
  };

  const onBoard = ({ r, c }) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const isOccupied = ({ r, c }) => get(c2idx({ r, c })) !== 0;
  const not = (f) => (e) => !f(e);
  const isOpponent = mycol => ({ r, c }) => isOccupied({ r, c }) && field.color(get(c2idx({ r, c }))) !== mycol;
  const isFriend = mycol => ({ r, c }) => field.color(get(c2idx({ r, c }))) === mycol;

  const flatMap = (arr) => arr.reduce((acc, v) => acc.concat(v), []);

  const use = (v, f) => f(v);

  const walk = (mycol, c, dir, res = []) =>
    use(dir(c), (n) =>
      !onBoard(n)
        ? res
        : isFriend(mycol)(n)
          ? res
          : isOpponent(mycol)(n)
            ? [...res, n]
            : walk(mycol, n, dir, [...res, n])
    );

  const calcValidFields = (idx) => {
    if (!isOccupied(idx)) return [];
    const fig = figureAt(idx);
    const c = coords(idx);
    if (fig.type === "king") {
      return Object.values(directions)
        .map((d) => d(c))
        .filter(onBoard)
        .filter(not(isFriend(fig.color)))
        .map(c2idx);
    } else if (fig.type === "queen") {
      return flatMap(Object.values(directions).map((d) => walk(fig.color, c, d))).map(
        c2idx
      );
    } else if (fig.type === "bishop") {
      return flatMap(
        [
          directions.up_left,
          directions.up_right,
          directions.down_left,
          directions.down_right,
        ].map((d) => walk(fig.color, c, d))
      ).map(c2idx);
    } else if (fig.type === "knight") {
      return [
        directions.up(directions.up(directions.left(c))),
        directions.up(directions.up(directions.right(c))),
        directions.down(directions.down(directions.left(c))),
        directions.down(directions.down(directions.right(c))),
        directions.left(directions.left(directions.up(c))),
        directions.left(directions.left(directions.down(c))),
        directions.right(directions.right(directions.up(c))),
        directions.right(directions.right(directions.down(c))),
      ]
        .filter(onBoard)
        .filter(not(isFriend(fig.color)))
        .map(c2idx);
    } else if (fig.type === "rook") {
      return flatMap(
        [directions.up, directions.down, directions.left, directions.right].map(
          (d) => walk(fig.color, c, d)
        )
      ).map(c2idx);
    } else if (fig.type === "pawn") {
      const pos =
        fig.color === "white" ? [directions.up(c)] : [directions.down(c)];
      if (fig.color === "white" && c.r === 1) {
        pos.push(directions.up(directions.up(c)));
      } else if (fig.color === "black" && c.r === 6) {
        pos.push(directions.down(directions.down(c)));
      }
      const pos2 =
        fig.color === "white"
          ? [directions.up_left(c), directions.up_right(c)]
          : [directions.down_left(c), directions.down_right(c)];
      return flatMap([
        pos.filter(not(isOccupied)).map(c2idx),
        pos2.filter(isOpponent(fig.color)).map(c2idx),
      ]);
    }
    return [];
  };
  const checkCheck = col => {
    const possibleFields = Object.keys(histogram(flatMap(
      g.field.map((i, sidx) => figureAt(sidx).color === col ? sidx : undefined)
        .filter(e => !!e).map(calcValidFields)
    ))).map(e => +e);
    const othercol = col === "white" ? "black" : "white";
    // Could be determined by a search in figures definition.
    const otherKingType = othercol === "black" ? 23 : 13;
    const otherKingIdx = g.field.findIndex(e => e === otherKingType);

    const check = possibleFields.indexOf(otherKingIdx) >= 0;
    console.log("CHECK ", check, col, possibleFields, otherKingIdx);
    return check ? otherKingIdx : undefined;
  };

  return {
    finished: () => g.result !== undefined,
    validPlayer: (useridx) =>
      (g.next === "white" && g.playerW === useridx) ||
      (g.next === "black" && g.playerB === useridx),
    newState: () => g,
    handleSelection: (idx) => {
      if (selectedIndex() === idx) {
        /**
         * Remove selection if the field was already selected.
         */
        console.log("DESEL");
        g.valid = [];
        deselect();
      } else if (
        selectedField() !== undefined &&
        field.color(selectedField()) === g.next
      ) {
        /** Moving */
        if (g.valid.indexOf(idx) < 0) {
          deselect();
          return;
        }
        const fig = selectedField();
        set(g.selected, 0);
        set(idx, fig);
        g.selected = undefined;
        next();
        g.valid = [];
        g.check = checkCheck(figureAt(idx).color);
      } else {
        /** Plain selection */
        g.selected = idx;
        console.log("SEL", field.name(selectedField()));
        g.valid = calcValidFields(idx);
      }
    },
  };
}
