const events = require("events");
const mongodb = require("./mongodb");
const winston = require("./winston");
const console_logger = require("./console");

class Settings {
  // Options
  static settings = {
    log_inputs_to_console: false,
    log_inputs_to_winston: true,
    log_inputs_to_mongodb: true,
    winston_logs_directory: undefined,
    winston_default_severety_level: "info",
    mongodb_uri: "mongodb://localhost:27017",
    password: "x",
    database: "audits",
    default_collection: "audits",
  };

  constructor() {}

  show_settings() {
    console.log(Settings.settings);
  }

  set_settings(
    options = {
      log_inputs_to_console: false,
      log_inputs_to_winston: true,
      log_inputs_to_mongodb: true,
      winston_logs_directory: undefined,
      winston_default_severety_level: "info",
      mongodb_uri: "mongodb://localhost:27017",
      password: "x",
      database: "audits",
      default_collection: "audits",
    }
  ) {
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        Settings.settings[key] = options[key];
      }
    }
  }
}

const eventEmitter = new events.EventEmitter();
const time_now = () => new Date().toISOString();

eventEmitter.on("audit_to_mongodb", async (input, collection) => {
  if (Settings.settings.log_inputs_to_mongodb) {
    let data = {
      time: time_now(),
      ...input,
    };

    await mongodb(
      data,
      Settings.settings.mongodb_uri,
      Settings.settings.database,
      collection || Settings.settings.default_collection,
      Settings.settings.password
    );
  }
});

eventEmitter.on("audit_to_winston", async (input, collection) => {
  if (Settings.settings.log_inputs_to_winston) {
    const message = `${JSON.stringify(input)}`;
    await winston(
      message,
      collection || Settings.settings.winston_default_severety_level,
      Settings.settings.winston_logs_directory
    );
  }
});

const custom_audit = async (input = {}, severity_level, collection) => {
  if (typeof input === "object") {
    if (Settings.settings.log_inputs_to_mongodb) {
      eventEmitter.emit("audit_to_mongodb", input, collection);
    }
    if (Settings.settings.log_inputs_to_winston) {
      eventEmitter.emit("audit_to_winston", input, severity_level);
    }
  }
  if (typeof input === "string") {
    if (Settings.settings.log_inputs_to_winston) {
      eventEmitter.emit("audit_to_winston", input, severity_level);
    }
  }
  if (Settings.settings.log_inputs_to_console) {
    await console_logger({
      log_type:
        severity_level ||
        collection ||
        Settings.settings.winston_default_severety_level,

      message: input,

      time: time_now(),
    });
  }
};

module.exports = { custom_audit, auditor_Settings: Settings };
