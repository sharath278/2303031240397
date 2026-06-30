const Log = require("./logger");

async function main() {

    await Log(
        "backend",
        "info",
        "handler",
        "Server Started"
    );

    await Log(
        "backend",
        "error",
        "db",
        "Database Connection Failed"
    );

}

main();