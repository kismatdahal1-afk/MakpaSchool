import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { env } from "./src/config/env.js";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend running on port ${env.PORT} (${env.NODE_ENV})`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
