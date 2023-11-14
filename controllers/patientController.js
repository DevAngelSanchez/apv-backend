import Patient from "../models/Patient.js";

export const addPatient = async (req, res) => {
  const patient = Patient(req.body);
  patient.vet = req.vet._id;

  try {
    const savedPatient = await patient.save();
    res.json(savedPatient);
  } catch (error) {
    console.log(error);
  }
}

export const getPatients = async (req, res) => {
  const patients = await Patient.find().where('vet').equals(req.vet);
  res.json(patients);
}

export const getPatient = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);

  if (!patient) {
    return res.status(404).json({ msg: "Patient not found!" });
  }

  if (patient.vet._id.toString() !== req.vet._id.toString()) {
    return res.json({ msg: "Action not allowed" });
  }

  return res.json(patient);
}

export const updatePatient = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);

  if (!patient) {
    return res.status(404).json({ msg: "Patient not found!" });
  }

  if (patient.vet._id.toString() !== req.vet._id.toString()) {
    return res.json({ msg: "Action not allowed" });
  }

  // Update patient
  patient.name = req.body.name || patient.name;
  patient.owner = req.body.owner || patient.owner;
  patient.email = req.body.email || patient.email;
  patient.date = req.body.date || patient.date;
  patient.symptoms = req.body.symptoms || patient.symptoms;

  try {
    const updatePatient = await patient.save();
    return res.json(updatePatient);
  } catch (error) {
    console.log(error);
  }
}

export const deletePatient = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);

  if (!patient) {
    return res.status(404).json({ msg: "Patient not found!" });
  }

  if (patient.vet._id.toString() !== req.vet._id.toString()) {
    return res.json({ msg: "Action not allowed" });
  }

  try {
    await patient.deleteOne();
    return res.json({ msg: "Patient removed successfuly" });
  } catch (error) {
    console.log(error);
  }
}
