require("dotenv").config();

const express = require("express");
const http = require('http');
const cors = require("cors");
const path = require("path");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");

const {Server} = require("socket.io");
// const socketSetup = require('./socket');

// database connection
const {connectMongoDB} = require("./connection");

const {checkForAuthenticationCookie} = require("./middleware/authentication")

// routes require
const userRoute = require("./routes/users");
const session = require("express-session");
const userDashboard = require("./routes/dashboard");
const searchRoute = require("./routes/search");
const followingRoutes = require('./routes/following');



const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const io = new Server(server);
// socketSetup(server);

// Socket.io
io.on("connection", (socket) => {
  socket.on("user-message", ({ username, message }) => {
    io.emit("message", { username, message });
  });
});


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/stylesheets', express.static(path.join(__dirname, 'public', 'stylesheets')));

app.use(session({
  secret: 'gtsum',
  resave: false,
  saveUninitialized: true,
}));

// Use cors middleware to allow requests from your front-end origin
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(flash());
app.use(cookieParser());
// app.use(checkForAuthenticationCookie("token"));

// Set views directory
app.set('view engine', 'ejs');
app.set("views", path.resolve('./views'));

app.get('/', (req,res) => {
  res.render('home-guest.ejs');
});

app.get('/single-post', (req, res) => {
  res.render('single-post-screen');
});

app.use('/user', userRoute);

app.use('/api', checkForAuthenticationCookie("token"), followingRoutes);

app.use('/dashboard', checkForAuthenticationCookie("token"), userDashboard);

app.use('/search',checkForAuthenticationCookie("token"), searchRoute);

// app.use('/follow',checkForAuthenticationCookie("token"), followRoute);



// mongodb connection
connectMongoDB(process.env.MONGO_URL)
.then(() => console.log("Mongodb connected\n"));

const User = require("./models/User");
//listen on port
server.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});