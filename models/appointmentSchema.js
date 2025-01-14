import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: true, 
    minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
  },
  nic: {
    type: String,
    required: true,
    minLength: [13, "NIC Must Contain Only 13 Digits!"],
    maxLength: [13, "NIC Must Contain Only 13 Digits!"],
  },
  dob: {
    type: Date,
    required: [true, "DOB Is Required!"],
  },
  gender: {
    type: String,
    required: true, 
    enum: ["Male", "Female"],
  },
  appointment_date:{
    type:String,
    require: true,
  },
  department: {
    type:String,
    require: true,
  },
  doctor: {
    firstName:{
        type:String,
        require: true,
    },
    lastName: {
        type:String,
        require: true,  
    }
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    require: true
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    require: true
  },
  address: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["pending", "Accepted", "Rejected"],
    default: "pending",
  }
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);