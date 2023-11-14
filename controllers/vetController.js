import Vet from "../models/Vet.js";
import generateJWT from "../helpers/generateJWT.js";
import idGenerator from "../helpers/idGenerator.js";
import { RegisterEmail, ResetPassEmail } from "../helpers/emailSender.js";

export const register = async (req, res) => {

  const { email, name } = req.body;

  // Check duplicate email
  const userEmail = await Vet.findOne({ email });
  if (userEmail) {
    const error = new Error('This email is already being used');
    return res.status(400).json({ msg: error.message });
  }

  try {
    // Save New Vet instance
    const vet = new Vet(req.body);
    const saveVet = await vet.save();

    // send email
    RegisterEmail({
      email,
      name,
      token: saveVet.token
    });

    res.send({
      msg: "Vet saved successfuly"
    });

  } catch (error) {
    console.log(error);
  }
}

export const confirmEmail = async (req, res) => {
  const { token } = req.params;

  const confirmedUser = await Vet.findOne({ token });

  if (!confirmedUser) {
    const error = new Error('Invalid token!');
    return res.status(404).json({ msg: error.message });
  }

  try {
    confirmedUser.token = null;
    confirmedUser.confirmedAccount = true;
    await confirmedUser.save();

    res.json({
      msg: 'Account confirmed'
    });
  } catch (error) {
    console.log(error);
  }
}

export const profile = (req, res) => {

  const { vet } = req;

  res.json(vet);
}

export const auth = async (req, res) => {
  const { email, password } = req.body;

  const user = await Vet.findOne({ email });

  if (!user) {
    const error = new Error("User doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  if (!user.confirmedAccount) {
    const error = new Error("Your account hasn't been confirmed!");
    return res.status(403).json({ msg: error.message });
  }

  if (await user.checkPass(password)) {
    user.token = await generateJWT(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: user.token
    });
  } else {
    const error = new Error('Incorrect password!');
    return res.status(403).json({ msg: error.message });
  }

}

export const resetPass = async (req, res) => {
  const { email } = req.body;

  const existUser = await Vet.findOne({ email });

  if (!existUser) {
    const error = new Error("User doesn't exist");
    return res.status(400).json({ name: error.name, msg: error.message });
  }

  try {
    existUser.token = idGenerator();
    await existUser.save();

    // Send email to reset the pass
    ResetPassEmail({
      email,
      token: existUser.token,
      name: existUser.name
    });

    res.json({ msg: "We have sent you a email to restart you password!" });
  } catch (error) {
    console.log(error);
  }
}

export const checkToken = async (req, res) => {
  const { token } = req.params;
  const validToken = await Vet.findOne({ token });

  if (validToken) {
    res.json({ msg: "Valid token" });
  } else {
    const error = new Error("Invalid token");
    return res.status(403).json({ name: error.name, msg: error.message });
  }
}

export const newPass = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const vet = await Vet.findOne({ token });

  if (!vet) {
    const error = new Error("User doesn't exist!");
    return res.status(404).send({ name: error.name, msg: error.message });
  }

  if (!password) {
    const error = new Error("Invalid password!");
    return res.status(403).send({ name: error.name, msg: error.message });
  }

  try {
    vet.token = null;
    vet.password = password;
    await vet.save();
    return res.json({ msg: "New password added successfuly!" });
  } catch (error) {
    console.log(error);
  }
}

export const updateProfile = async (req, res) => {
  const vet = await Vet.findById(req.params.id);

  if (!vet) {
    const error = new Error("User doesn't exist!");
    return res.status(404).send({ name: error.name, msg: error.message });
  }

  const { email } = req.body;
  if (vet.email !== req.body.email) {
    const existEmail = await Vet.findOne({ email });
    if (existEmail) {
      const error = new Error("This email is already taken!");
      return res.status(404).send({ name: error.name, msg: error.message });
    }
  }

  try {
    vet.name = req.body?.name;
    vet.email = req.body?.email;
    vet.phoneNumber = req.body.phoneNumber;
    vet.website = req.body.website;

    const updatedVet = await vet.save();
    res.json(updatedVet);
  } catch (error) {
    console.log(error)
  }
}

export const updatePass = async (req, res) => {
  // Extrac info
  const { id } = req.vet;
  const { pwdCurrent, pwdNew } = req.body;

  // Check if vet exist
  const vet = await Vet.findById(id);
  if (!vet) {
    const error = new Error("Error!");
    return res.status(400).send({ name: error.name, msg: error.message });
  }
  // check that is the same pass
  if (await vet.checkPass(pwdCurrent)) {
    // save pass
    vet.password = pwdNew;
    await vet.save();
    res.json({ msg: "Password updated successfuly" });
  } else {
    const error = new Error("The current pass is incorrect!");
    return res.status(400).send({ name: error.name, msg: error.message });
  }
}