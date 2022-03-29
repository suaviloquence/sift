import { Sequelize } from "sequelize";

import Hello from "./hello";

const sequelize = new Sequelize("sqlite:../database.sqlite3");

Hello.init(Hello.data(), { sequelize });

export { Hello };
