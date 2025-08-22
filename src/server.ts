import http from "http";
import { router } from "./routes";

const PORT = 3000;

const server = http.createServer(router);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
