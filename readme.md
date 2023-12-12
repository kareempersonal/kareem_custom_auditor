# Custom Audit Logger

This Node.js module provides a flexible audit logging mechanism that allows you to log events to both MongoDB and Winston based on your application's needs. The module utilizes the EventEmitter module to emit events, and it comes with a configurable settings class to customize its behavior.

## Installation

First, install the required dependencies:

```bash
npm install events mongodb winston
```

Then, you can install the custom audit logger:

```bash
npm install path/to/custom_audit_logger
```

## Usage

### Import the Module

```javascript
const {
  custom_audit,
  auditor_Settings: Settings,
} = require("path/to/custom_audit_logger");
```

### Initialize Settings

Create an instance of the `Settings` class to configure the behavior of the custom audit logger:

```javascript
const settings = new Settings();
settings.set_settings({
  log_errors_to_winston: true,
  log_errors_to_mongodb: true,
  winston_logs_directory: "path/to/logs", // Change this to the desired directory
  winston_default_severity_level: "info", // Change this to the desired default severity level for Winston
  mongodb_uri: "mongodb://localhost:27017",
  password: "x",
  database: "audits",
  default_collection: "audits",
});
```

### Show Current Settings (Optional)

If needed, you can check the current settings:

```javascript
settings.show_settings();
```

### Emit Audit Events

Use the `custom_audit` function to emit audit events. It takes the following parameters:

- `input` (Object or String): The data to be logged.
- `severity_level` (String, optional): The severity level for Winston logs. Ignored if `input` is a String.
- `collection` (String, optional): The MongoDB collection to log to. Ignored if `input` is a String.

Example:

```javascript
const auditData = { user: "john_doe", action: "login" };
custom_audit(auditData, "info", "user_activity_logs");
```

This example logs the `auditData` to both MongoDB and Winston with the specified severity level and collection.

## Note

- If `input` is an Object, the audit event will be logged to both MongoDB and Winston (if configured).
- If `input` is a String, only a Winston log will be generated (if configured).
- The default severity level for Winston is used if no severity level is provided.

Feel free to customize the settings and usage according to your application's requirements.
