const jwt = require("jsonwebtoken");
const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"];
  // console.log(token)
  if (!token) {
    res.status(400).json({ error: "token is required" });
  }
  try {
    const tokendata = jwt.verify(token, process.env.secret);
    // console.log(tokendata)
    req.user = {
      id: tokendata.userId
    };
    next()
   
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

module.exports = authenticateUser;