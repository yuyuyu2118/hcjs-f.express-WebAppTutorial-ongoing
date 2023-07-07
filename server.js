const express = require("express");
const app = express();
const PORT = 60180;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true, useUnifiedTopology: true});
const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));

//リクエストのメソッドのURLをコンソールに出力するミドルウェア
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
//静的関数を扱うことのできるミドルウェア
app.use(express.static("assets"));
app.use("/static", express.static("assets"));

//テンプレートエンジンを使ったページの表示
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { title: "Main Page", heading: "Welcome" });
});

app.get("/about", (req, res) => {
  let randomNum = Math.floor(Math.random() * 100);
  let currentTime = new Date().toLocaleString();
  res.render("about", {
    title: "About Page",
    randomNum: randomNum,
    currentTime: currentTime,
  });
});

//ルーティング
app.get("/route", (req, res) => {
  res.send("<h1>Route Page</h1><a href=\"http://localhost:60180/\">index</a>");
});

//404エラーハンドリング
app.use((req,res,next) => {
  res.status(404).render('404',{title: "Sorry,page not found", index: "http://localhost:60180/"});
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => console.log("起動"));
