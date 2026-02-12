const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      
      config.env = process.env
    },
    defaultCommandTimeout: 20000,
    video: false,
  },
});
