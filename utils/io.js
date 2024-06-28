const chatController = require("../controllers/chat.controller");

function ioFunction(io) {
    io.on("connection", async (socket) => {
        // console.log("connected : ", socket.id);

        socket.on("join room", (roomId) => {
            socket.join(roomId);
            // console.log(`User joined room: ${roomId}`);
        });

        socket.on("disconnect", () => {
            // console.log("disconnected : ", socket.id);
        });

        socket.on("chat message", async ({ userName, roomId, message }) => {
            // console.log(
            //     `userName:${userName} message: ${message} in room: ${roomId}`
            // );
            const savedMessage = await chatController.saveChatMessage({
                roomId,
                userName,
                message,
            });

            io.to(roomId).emit("chat message", savedMessage);
        });
    });
}

module.exports = ioFunction;
