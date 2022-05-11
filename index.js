const express = require("express");
const { cloudinary } = require("./utils/cloudnary");
const app = express();
const Post = require("./models/Post.js");
const mongoose = require("mongoose");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comment");
// const multer = require("multer");
// const path = require("path");
var cors = require("cors");

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to MongoDB");
  }
);

// app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/post");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   try {
//     res.status(200).json("File Uploaded Successfully");
//   } catch (err) {
//     console.log(err);
//   }
// });

// const profilePicStorage = multer.diskStorage({
//   destination: (req, profilePic, cb) => {
//     cb(null, "public/images/post");
//   },
//   filename: (req, profilePic, cb) => {
//     cb(null, profilePic.originalname);
//   },
// });

// const profilePicUpload = multer({ storage: profilePicStorage });
// try {
//   app.post(
//     "/api/uploadProfilePic",
//     profilePicUpload.single("profilePic"),
//     (req, res) => {
//       res.status(200).json("File Uploaded Successfully");
//     }
//   );
// } catch (err) {
//   console.log(err);
// }

// app.get("/api/images", async (req, res) => {
//   const { resources } = await cloudinary.search
//     .expression("folder:dev_setups")
//     .sort_by("public_id", "desc")
//     .max_results(30)
//     .execute();

//   const publicIds = resources.map((file) => file.public_id);
//   console.log(publicIds);
//   res.send(publicIds);
// });

// app.post("/api/upload", async (req, res) => {
//   console.log(req.body.userId);
//   try {
//     const fileStr = req.body.data;
//     const uploadResponse = await cloudinary.uploader.upload(fileStr, {
//       upload_preset: "myfolder",
//     });
//     console.log(uploadResponse);
//     res.send(uploadResponse);
//     // res.json({ msg: "yaya" });
//     // return uploadResponse.public_id;
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ err: "Something went wrong" });
//   }
// });

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

app.listen(process.env.PORT || 8800, () => {
  console.log("Backend server is running At 8800");
});
