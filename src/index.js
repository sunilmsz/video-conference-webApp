const dotenv = require("dotenv")
const express = require("express")
const cookiParser = require("cookie-parser")
const { ExpressPeerServer } = require("peer")
const app = express()

const http = require("http").Server(app)

const peerServer = ExpressPeerServer(http);

app.use("/peerjs", peerServer)
const mongoose = require("mongoose")
const io = require("socket.io")(http)

const cors = require("cors")

const router = require("./routes/route")

dotenv.config({ path: "./config.env" })
const DBKey = process.env.DB

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cookiParser())


app.use("/", router)

mongoose.connect(DBKey, { useNewurlParser: true })
    .then(() => { console.log("MoongoDB is connected") })
    .catch(err => console.log(err));

io.on("connection", (socket) => {


    socket.on("nuser-joined", (roomId, peerId) => {
        socket.join(roomId)
        socket.to(roomId).emit("user-connected", peerId, socket.id)

    })
    socket.on("user-video-stopped", () => {
        socket.broadcast.emit("user-video-stopped", socket.id)
    })

    socket.on("screenShared", (roomId) => {
        socket.broadcast.to(roomId).emit("screenShared", socket.id)
    })

    socket.on("screenSharedStopped", (roomId) => {
        socket.broadcast.to(roomId).emit("screenSharedStopped", socket.id)
    })

    socket.on("user-restarted-video", () => {
        socket.broadcast.emit("user-restarted-video", socket.id)
    })

    socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", socket.id)
    })

})

const path = require('path');
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static('client/build'));
    // Handle React routing, return all requests to React app
    app.get('/*', function (req, res) {
        res.sendFile(path.resolve('client', 'build', 'index.html'));
    });
}



http.listen(process.env.PORT, function () {
    console.log('Express app running on port ' + (process.env.PORT))
});