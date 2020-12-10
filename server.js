const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const router = require("./routes/routes");
const mongo = require("./connections/mongo");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use("/", router);

mongo();
app.listen(3001, () => {
  console.log("listening on port 3001");
});
