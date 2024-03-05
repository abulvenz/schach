import redis from "redis";

import { createClient } from "redis";
import stack from "./stack.mjs";

const client = await createClient()
  .on("ready", () => console.info("Redis Client Connected"))
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

client.HGETALL("games").then((e) => console.log(e));

const persistence = {
  games: {
    loadById: async (id) => {
      const game = await client.hGet("games", id);
      console.log("loaded", game);
      if (game === undefined) {
        return undefined;
      }
      const st = stack();
      try {
        st.fromStr(game);
      } catch (e) {
        console.error(e);
        return undefined;
      }
      return st;
    },
    loadAllKeys: async () => {
      const games = await client.hKeys("games");
      console.log("loaded", games);
      return games;
    },
    save: async (game) => {
      const str = game.toStr();
      console.log("saving", str);
      await client.hSet("games", game.current().id, str);
    },
  },
  archive: {
    loadById: async (id) => {
      const game = await client.hGet("archive", id);
      console.log("loaded", game);
      if (game === undefined) {
        return undefined;
      }
      const st = stack();
      try {
        st.fromStr(game);
      } catch (e) {
        console.error(e);
        return undefined;
      }
      return st;
    },
    loadAllKeys: async () => {
      const games = await client.hKeys("archive");
      console.log("loaded", games);
      return games;
    },
    save: async (game) => {
      const str = game.toStr();
      console.log("saving", str);
      await client.hSet("archive", game.current().id, str);
    },
  },
};

export default persistence;
