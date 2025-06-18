// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose')
// const AuthRouter = require('./routes/Auth');
// const adminRoutes = require('./routes/Admin')
// const pocRoutes = require('./routes/Poc');
// const hosRoutes = require('./routes/Hod');
// const departmentRoute = require('./routes/departmet');
// const collegeRoute = require("./routes/college");
// const projectRoute = require("./routes/Project");
// const likeRoute = require("./routes/Like");
// const commentRoute = require("./routes/Comment");
// const savedRoute = require("./routes/Saved");

// const cloudinary = require("./utils/imageuploadUtils");
// const dotenv = require("dotenv");
// const http = require("http");
// const { Server } = require("socket.io");

// dotenv.config();
// const app = express();
// app.use(cors({
//     origin: "*"
// }))

// app.use(express.json({ limit: '100mb' }));
// app.use(express.urlencoded({ limit: '100mb', extended: true }));
// const MONGO_URL = process.env.MONGO_URL;
// mongoose.set("strictQuery", false);


// mongoose
//     .connect(MONGO_URL)
//     .then(() => {
//         console.log("Mongo connected");
//     })
//     .catch((err) => {
//         console.log(err);
//     });


// app.use('/api/auth', AuthRouter);
// app.use('/api/admin', adminRoutes);
// app.use('/api/poc', pocRoutes);
// app.use('/api/hod', hosRoutes);
// app.use('/api/dpt', departmentRoute);
// app.use('/api/college', collegeRoute);
// app.use('/api/project', projectRoute);

// app.use("/api/like", likeRoute);
// app.use("/api/comment", commentRoute);
// app.use('/api/save', savedRoute);

// app.post("/Image", async (req, res) => {
//     //console.log("vycy", req.body);
//     try {
//         //console.log("qwer", req.body);
//         const result = await cloudinary.uploader.upload(req.body.image);
//         console.log(result);
//         return res.status(200).json({ result });
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(400).json({
//             err
//         })
//     }
// });

// app.listen(8000, () => {
//     console.log("server started on http://localhost:8000");
// })



// server.js (Main Server File)

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const app = express();
app.use(cors({
    origin: "*"
}))
const server = http.createServer(app);


app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Mongo connected"))
.catch(err => console.log(err));

// Import Routes
const AuthRouter = require("./routes/Auth");
const adminRoutes = require("./routes/Admin");
const pocRoutes = require("./routes/Poc");
const hosRoutes = require("./routes/Hod");
const departmentRoute = require("./routes/departmet");
const collegeRoute = require("./routes/college");
const projectRoute = require("./routes/Project");
const likeRoute = require("./routes/Like");
const commentRoute = require("./routes/Comment");
const savedRoute = require("./routes/Saved");
// const chatBotRoutes =require("./routes/ChatBotRoute")
// Use Routes
app.use("/api/auth", AuthRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/poc", pocRoutes);
app.use("/api/hod", hosRoutes);
app.use("/api/dpt", departmentRoute);
app.use("/api/college", collegeRoute);
app.use("/api/project", projectRoute);
app.use("/api/like", likeRoute);
app.use("/api/comment", commentRoute);
app.use("/api/save", savedRoute);
// app.use("/api/chat", chatBotRoutes);

// Image Upload Endpoint
const cloudinary = require("./utils/imageuploadUtils");
app.post("/Image", async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.body.image);
        console.log(result);
        return res.status(200).json({ result });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ err });
    }
});



server.listen(8000, () => console.log("Server started on http://localhost:8000"));
