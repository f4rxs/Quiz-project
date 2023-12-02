const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path= require('path');

const port = process.env.PORT || 3001;

const instruct = require('./routes/instructor.routes');
const quiz = require(`./routes/quiz.routes`);
const question = require('./routes/question.routes');
const student = require('./routes/student.routes');
const choices = require('./routes/choices.routes');
const result = require('./routes/result.routes');

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get("/quizsystem", (req, res) => {
  res.render('index');
  // res.status(200).json({ message: "This is the index page" });
});

app.use('/quizsystem', instruct);
app.use('/quizsystem', quiz);
app.use('/quizsystem', question);
app.use('/quizsystem', student);
app.use('/quizsystem', choices);
app.use('/quizsystem', result);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
