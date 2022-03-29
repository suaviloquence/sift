import express from "express";
import bodyParser from "body-parser";

import { Sequelize } from "sequelize";

import { config as dotenv } from "dotenv";

import { hello } from "@sift/shared";

import { Hello } from "./db";

dotenv();

const app = express();

app.use(bodyParser.json());

const PORT =
  process.env.NODE_ENV === "production"
    ? process.env.PORT ?? 3000
    : process.env.DEV_SERVER_PORT ?? 3001;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(`${__dirname}/static`));
}

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);

  await Hello.sync();

  if ((await Hello.findOne()) == null) {
    await Hello.create({ hellos: 0 });
  }
});

app.get("/api/hello", async (req, res) => {
  const model = await Hello.findOne();
  model.hellos++;
  await model.save();
  res.json({ msg: hello(), hellos: model.hellos });
});
