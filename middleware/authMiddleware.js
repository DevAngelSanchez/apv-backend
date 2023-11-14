import jwt from "jsonwebtoken";
import Vet from "../models/Vet.js";

const checkAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Compare token from JWT
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const { id } = decode;
      req.vet = await Vet.findById(id).select("-password -confirmedAccount -token");
      return next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ name: error.name, msg: error.message });
    }
  }

  if (!token) {
    const error = new Error("Token doesn't exist!");
    res.status(403).json({ msg: error.message });
  }

  next();
}

export default checkAuth;