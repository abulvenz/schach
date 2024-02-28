import jp from "fast-json-patch";

const stack = (obj) => {
  let clone = (o) => JSON.parse(JSON.stringify(o));
  let state = clone(obj);
  let original = clone(obj);
  let history = [];
  const dirty = () => history.length > 0;
  const pop = () => {
    if (dirty()) {
      state = jp.applyPatch(state, history.pop()).newDocument;
    }
    return clone(state);
  };
  return {
    push: (newObj) => {
      history.push(jp.compare(newObj, state));
      state = clone(newObj);
    },
    pop,
    clear: () => {
      history = [];
      return clone(original);
    },
    peek: () => (dirty() ? clone(history[history.length - 1]) : []),
    current: () => clone(state),
    dirty,
    history: () => clone(history),
  };
};

export default stack;
