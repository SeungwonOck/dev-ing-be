const { createServer } = require("http");
const app = require("./app");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});

require("./utils/io")(io);
httpServer.listen(5001, () => {
    console.log("server listening on port", 5001);
});
