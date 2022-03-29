const { defineConfig } = require("@vue/cli-service");

require("dotenv").config();

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: `http://localhost:${process.env.DEV_SERVER_PORT ?? 3001}`,
    port: process.env.PORT ?? 3000,
  },
});
