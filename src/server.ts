import { Server } from "http";
import config from "./config";
import app from "./app";

let server: Server;

const main = async () => {
  try {
    const port = config.port || 1011;
    server = app.listen(port, () => {
      console.log(`Kenny Rappose Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
