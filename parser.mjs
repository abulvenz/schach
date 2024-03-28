const parse = (part) => {
  const partition = (arr, idxes) =>
    idxes.map((idx, i) => arr.slice(idx, idxes[i + 1]));

  const tokens = part.split(/\s+/);

  const moveIdxes = tokens
    .map((t, i) => (/[0-9]+\./.test(t) ? i : undefined))
    .filter((e) => e !== undefined);

  const parseMove = (move) => {
    const moveRegex =
      /([T|L|K|D|S|B|O]?)([a-h]?[1-8]?)(x?)([a-h][1-8])([\+\#])?/;
    const [_, fig, from, takes, to, check] = move.match(moveRegex) || [];
    return { fig: fig, from, takes, to, check: check ? true : false };
  };

  const moves = partition(tokens, moveIdxes).map((move) => ({
    num: +move[0].replace(/\./g, ""),
    white: parseMove(move[1]),
    black: parseMove(move[2]), //.indexOf(":") >= 0? move[2]:undefined,
  }));

  return moves;
};
// console.log(tokens.join("\n"))

const part = `1. d4 d5 2. c4 dxc4 3. Sf3 Sf6 4. e3 e6 5. Lxc4 c5 6. 0–0 a6 7. dxc5 Dxd1 8. Txd1 Lxc5 9. b3 Sbd7 10. Lb2 b6 11. Sc3 Lb7 12. Tac1 Le7 13. Sd4 Tc8 14. f3 b5 15. Le2 Lc5 16. Kf1 Ke7 17. e4 g5 18. Sb1 g4 19. Ba3 b4 20. Txc5 Sxc5 21. Lxb4 Thd8 22. Sa3 gxf3 23. gxf3 Sfd7 24. Sc4 La8 25. Kf2 Tg8 26. h4 Tc7 27. Sc2 Tb8 28. La3 h5 29. Tg1 Kf6 30. Ke3 a5 31. Tg5 a4 32. b4 Sb7 33. b5 Sbc5 34. Sd4 e5 35. Sxe5 Sxe5 36. Tf5+ Kg7 37. Txe5 Sxe4 38. Ld3 Tc3 39. Lb4 Txd3+ 40. Kxd3 Sf6 41. Ld6 Tc8 42. Tg5+ Kh7 43. Le5 Se8 44. Txh5+ Kg6 45. Tg5+ Kh7 46. Lf4 f6 47. Tf5 Kg6 48. b6 Td8 49. Ta5 Lxf3 50. h5+ 1:0`;
const part2 = `1. e4 e5 2. Sf3 Sc6 3. Lb5 a6 4. La4 Sf6 5. 0–0 Le7 6. Te1 b5 7. Lb3 0–0 8. c3 d6 9. h3 Sb8 10. d4 Sbd7 11. Sbd2 Lb7 12. Lc2 Te8 13. Sf1 Lf8 14. Sg3 g6 15. Lg5 h6 16. Ld2 exd4 17. cxd4 c5 18. d5 Sb6 19. La5 Sfd7 20. b3 Lg7 21. Tc1 Df6 22. Tb1 b4 23. Se2 De7 24. a3 bxa3 25. Lc3 f5 26. Lxg7 Dxg7 27. Sf4 fxe4 28. Sh4 g5 29. Se6 Df6 30. Dg4 Sxd5 31. Sxg5 hxg5 32. Dxd7 Sb4 33. Dxb7 Sxc2 34. Txe4 a2 35. Tf1 Sb4 36. Tg4 a1=D 37. Txa1 Dxa1+ 38. Kh2 Dg7 39. Df3 De5+ 40. g3 Tf8 41. Dg2 Df6 42. f4 Ta7 43. Txg5+ Tg7 44. Th5 De6 45. g4 Txf4 0:1`
console.log(parse(part2));

export default parse;
