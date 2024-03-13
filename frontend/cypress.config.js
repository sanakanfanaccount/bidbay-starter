const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalRunAllSpecs: true,
  },
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'results/output.xml',
    toConsole: true,
  },
});
