import {app} from "./app.js"
import {env} from "@/env/index.js";
import { logger } from "./shared/config/logger.js";

const PORT = env.PORT;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  logger.info(`Server is running on http://${HOST}:${PORT}`);
});