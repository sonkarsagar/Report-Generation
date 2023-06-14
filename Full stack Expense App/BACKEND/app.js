require("dotenv").config();
const express = require("express");
const app = express();

const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const cors = require("cors");

const user = require("./models/user");
const expense = require("./models/expense");
const Orders = require("./models/orders");
const Leaderboard = require("./models/leaderboard");
const ForgotPasswordRequests = require("./models/ForgotPasswordRequests");
const Download=require('./models/download')

const loginRoute = require("./router/loginRoute");
const userRoute = require("./router/userRoute");
const expenseRoute = require("./router/expenseRoute");
const passwordRoute = require("./router/passwordRoute");

app.use(bodyParser.json());
app.use(cors());

app.use(loginRoute);

app.use(userRoute);

app.use(expenseRoute);

app.use(passwordRoute);

user.hasMany(expense);
expense.belongsTo(user);

user.hasMany(Orders);
Orders.belongsTo(user);

Leaderboard.belongsTo(user);

user.hasMany(Download)
Download.belongsTo(user)

ForgotPasswordRequests.belongsTo(user);

sequelize
  .sync()
  // .sync({force: true})
  .then((res) => {
    const hostname = "127.0.0.1";
    const port = 3000;
    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
