const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();
const server = http.createServer(app);
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
const User = require("./models/user");
const validator = require("validator");
const cors = require("cors");
const { socketAuth } = require("./middlewares/socketAuth");
const { initializeSocket } = require("./socket/socketHandler");

// CORS configuration - Allow both Vite default ports (5173 and 5174)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow localhost on common development ports
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174"
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // For development, allow all origins
      // In production, uncomment below:
      // callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) return callback(null, true);
      
      // Allow localhost on common development ports
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // For development, allow all origins
      }
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// Log connection attempts (before auth)
io.engine.on("connection_error", (err) => {
  console.error("❌ Socket.io engine connection error:", err.message);
  console.error("Error details:", err);
});

// Socket.io authentication
io.use(socketAuth);

// Initialize socket handlers
initializeSocket(io);

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const messageRouter = require("./routes/message");
const connectionManagementRouter = require("./routes/connectionManagement");
const collegesRouter = require("./routes/colleges");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);
app.use("/", messageRouter);
app.use("/", connectionManagementRouter);
app.use("/", collegesRouter);


// app.get("/user", async (req,res)=>{
//   const userEmail=req.body.emailId;
//   try{
//     const users =await User.find({emailId:userEmail});
//     if(users.length==0){
//       res.status(400).send("someting went wrong")
//     }else{
//       res.send(users);
//     }
    
//   }catch(err){
//     res.status(400).send("somenting went wrong")
//   }
// })

// app.delete("/user",async(req,res)=>{
//   const userId=req.body.userId;
//   console.log("User is",userId);
//   try{
//     const users=await User.findByIdAndDelete(userId);
//     res.send("user deleted sussessfully")

//   }catch(err){
//     res.status(400).send("somenting went wrong")

//   }
// })

// app.patch("/user/usedId", async (req, res) => {
//   const { userId, ...data } = req.body.params?.userId;
//   const ALLOWED_UPDATES = ["photourl", "about", "gender", "age", "skills"];

//   // ✅ Step 1: Validate keys
//   const updates = Object.keys(data);
//   const isValidOperation = updates.every((key) =>
//     ALLOWED_UPDATES.includes(key)
//   );

//   if (!isValidOperation) {
//     return res.status(400).send("Invalid updates");
//   }
//   if(data?.skills.length>10){
//     throw new Error("skills size not more than 10")
//   }

//   try {
//     // ✅ Step 2: Update user
//     const user = await User.findByIdAndUpdate(userId, data, {
//       new: true,
//       runValidators: true, // ✅ ensures schema validators run
//     });

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     res.send({ message: "User updated successfully", user });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(400).send("Something went wrong");
//   }
// });

// app.get("/feed",async (req,res)=>{
//   try{
//     const users=await User.find({})
//     res.send(users)
//   }catch(err){
//     res.status(400).send("somenting went wrong")

//   }
// })

// Redis removed - not needed for single-server Socket.io messaging

// Connect to database and start server
connectDB()
  .then(() => {
    console.log("✅ Database connected successfully");
    
    server.listen(8001, () => {
      console.log("✅ HTTP Server is successfully listening on port 8001");
      console.log("✅ WebSocket Server is ready for connections");
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

