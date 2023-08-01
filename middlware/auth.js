const jwt = require("jsonwebtoken");

exports.authUser = async (req, res, next) => {
  console.log("Enter");
  try {
    let tmp = req.headers.authorization;

    const token = tmp ? tmp.slice(7, tmp.length) : "";

    if (!token) {
      return res.status(400).json({ message: "Invalid Authentication" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid Authentication2" });
      }
      console.log("Get user");
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
