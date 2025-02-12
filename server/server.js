import express from "express";
import cors from "cors";
import listingsRoutes from "./routes/listings.js";
import propertiesRoutes from "./routes/properties.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import userRoutes from "./routes/users.js";
import passport from "passport";
import session from "express-session";
// import { GitHub } from "./config/auth.js";
import "./config/dotenv.js";
import cookieParser from "cookie-parser";
import "./strategies/local.js";
import { conString } from "./config/database.js";
import connectPgSimple from "connect-pg-simple";
// import multer from "multer";
// import path from "path";

const CLIENT_URL = process.env.PROD_CLIENT_URL;

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_SERVER_URL
    : process.env.DEV_SERVER_URL;

const app = express();
const PORT = process.env.PORT || 3001;
// const memoryStore = new session.MemoryStore();
const PostgresqlStore = connectPgSimple(session);
const sessionStore = new PostgresqlStore({
  conString: conString,
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "devImages");
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage: storage });

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
// app.use(cors());
app.use(
  cors({
    origin: { API_URL },
    methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"],
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// passport.use(GitHub);

//to implement own strategy, can these functions in a custom way
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  res.redirect(CLIENT_URL);
});

app.use((req, res, next) => {
  console.log("Incoming Request Body:", req.body);
  next();
});
// app.use("/api/trips", tripRoutes);
// app.use("/api/activities", activityRoutes);
// app.use("/api/destinations", destinationRoutes);
// app.use("/api/trips-destinations", tripDestinationRoutes);

app.use("/api", listingsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
