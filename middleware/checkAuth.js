import jwt from "jsonwebtoken";
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = await jwt.verify(token, "secret");
    res.userData = decode;
    next();
  } catch (error) {
    console.log(error);
    res.send({
      code: 401,
      msg: "Authentication failed",
    });
  }
};
