import { createServer } from "./server.js";
import { Kernel } from "@modelicahub/kernel";

(async () => {
  const kernel = new Kernel({
    type: "sqljs",
    synchronize: true,
  });
  await kernel.initialize();
  const port = process.env.PORT || 3001;
  const server = createServer(kernel);
  server.listen(port, () => {
    console.log(`api running on ${port}`);
  });
})();
