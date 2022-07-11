const dotenv = require("dotenv")
const express = require("express")
const cookiParser = require("cookie-parser")
const {v4} = require("uuid")
const {ExpressPeerServer} = require("peer")
const app = express()

const http = require("http").Server(app)

const peerServer = ExpressPeerServer(http,{
    debug:true
});

app.use("/peerjs",peerServer)
const mongoose = require("mongoose")
const io = require("socket.io")(http
//     ,{
//     // cors:{
//     //     origin:"http://localhost:3000"
//     // }
// }
)
const multer = require("multer")
const cors = require("cors")
const bodyParser = require("body-parser")
const router = require("./routes/route")

// app.use(
//     cors({
//       origin: `http://localhost:3000`,
//       credentials:true
//     }))

dotenv.config({path:"./config.env"})
const DBKey = process.env.DB

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any())
app.use(cookiParser())






app.use("/",router)
mongoose.connect(DBKey,{
    useNewurlParser:true
}).then(()=>{
    console.log("MoongoDB is connected")
}).catch(err=>console.log(err));

io.on("connection",(socket)=> {

    console.log(`user connected : ${socket.id}`)
    socket.on("nuser-joined",(roomId,peerId)=> {
        socket.join(roomId)
        console.log(roomId)
        socket.to(roomId).emit("user-connected",peerId,socket.id)
        console.log(peerId,"peerid")
    })
    socket.on("user-video-stopped",()=> {
        socket.broadcast.emit("user-video-stopped",socket.id)
    })

    socket.on("user-restarted-video",()=> {
        socket.broadcast.emit("user-restarted-video",socket.id)
    })

    socket.on("disconnect",()=> {
        console.log(`user disconnected : ${socket.id}`)
        socket.broadcast.emit("user-disconnected",socket.id)
        console.log(socket.rooms)
    })

})

const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static('client/build'));
// Handle React routing, return all requests to React app
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client','build','index.html'));
  });
}



http.listen(process.env.PORT , function() {
    console.log('Express app running on port ' + (process.env.PORT))
});