const express = require("express");
var cors = require("cors");
var base64_img = require("base64-img");
var body_parser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 60000;

app.use(express.static("public"));
app.use(cors());
app.use(body_parser.json({ limit: "50mb" }));

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/api/base64/images", (req, res) => {
  const { imgs } = req.body;
  let response = [];
  imgs.forEach((img, i) => {
    base64_img.img(img, "./public", Date.now() + i, (err, path) => {
      let path_arr = path.split("/");
      let file_name = path_arr[path_arr.length - 1];
      response.push({
        success: true,
        url: `/${file_name}`,
      });
      if (response.length > imgs.length - 1) {
        return res.status(200).json({ data: response });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log("Listening at " + PORT);
});
