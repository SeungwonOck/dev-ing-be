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

        socket.on("chat message", ({ userName, roomId, message }) => {
            // console.log(
            //     `userName:${userName} message: ${message} in room: ${roomId}`
            // );
            io.to(roomId).emit("chat message", userName, message);
        });
    });
}

module.exports = ioFunction;
