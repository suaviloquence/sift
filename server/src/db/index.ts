import { Sequelize } from "sequelize";

const sequelize = new Sequelize("sqlite::memory:");

const opts = { sequelize };

export default sequelize;
