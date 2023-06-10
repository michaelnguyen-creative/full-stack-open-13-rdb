const { Sequelize } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const path = require("path");

const config = require("./config");

const sequelize = new Sequelize(config.DATABASE_URL);

const runMigrations = async () => {
  const umzug = new Umzug({
    migrations: {
      glob: path.join(__dirname, "../postgres/migrations", "*.js"),
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
    logger: console,
  });
  // run umzug migrations automatically
  const migrations = await umzug.up();
  // log migrations
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const connectToPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log("Established connection to Postgres at", config.DATABASE_URL);
    if (process.env.NODE_ENV === "production") {
      await runMigrations();
      console.log("Postgres migrations ran successfully");
    } else {
      await sequelize.sync({ alter: true, force: true });
      console.log("Postgres models synced");
    }
  } catch (error) {
    console.log("Postgres connection error:", error.message);
    return process.exit(1);
  }
};

module.exports = { sequelize, connectToPostgres };
