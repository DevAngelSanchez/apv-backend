import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import idGenerator from "../helpers/idGenerator.js";

const vetSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    default: null,
    trim: true
  },
  website: {
    type: String,
    default: null
  },
  token: {
    type: String,
    default: idGenerator()
  },
  confirmedAccount: {
    type: Boolean,
    default: false
  }
});

vetSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

vetSchema.methods.checkPass = async function (formPass) {
  return await bcrypt.compare(formPass, this.password);
}

const Vet = mongoose.model("Vets", vetSchema);
export default Vet;