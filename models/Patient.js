import mongoose from 'mongoose';

const patientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  symptoms: {
    type: String,
    required: true,
  },
  vet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vets'
  }
}, {
  timestamps: true,
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;

