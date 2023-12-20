const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const session = require("express-session");
const auth = require("../middlewares/auth.js");
const { StatusCodes } = require("http-status-codes");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const { TOKEN_KEY } = process.env;
const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    const { accessToken: token } = req.session.authorization;
    jwt.verify(token, TOKEN_KEY, (err, user) => {
      if (!err) {
        req.user = user;
        console.log(req.user);
        next();
      } else {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ msg: "Invalid credentials" });
      }
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "user not logged in" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);

app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is runnin on port ${PORT}`));
