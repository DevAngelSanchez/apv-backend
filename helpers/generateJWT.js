import jwt from 'jsonwebtoken';
import "dotenv/config";

const generateJWT = async (id) => {

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
}

export default generateJWT;