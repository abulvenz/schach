import redis from "redis";

import { createClient } from "redis";
import stack from "./stack.mjs";
const { keys } = Object;

const use_redis = false;

const dict = {};

const client = use_redis
  ? await createClient({
      host: "localhost",
      port: 6379,
      password: "dddeYVX7EwVmmxKPCDmwMdddaaatyKVge8oLd2t81",
    })
      .on("ready", () => console.info("Redis Client Connected"))
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect()
  : {
      hKeys: (id) => keys(dict[id] || {}),
      hGet: (key, id) => (dict[key] || {})[id],
      hSet: (key, id, value) => ((dict[key] = dict[key] || {})[id] = value),
    };

// client.HGETALL("games").then((e) => console.log(e));

const persistence = {
  games: {
    loadById: async (id) => {
      const game = await client.hGet("games", id);
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
      return games;
    },
    save: async (game) => {
      const str = game.toStr();
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
