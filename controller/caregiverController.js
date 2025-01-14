import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";

export const assignCaregiver = catchAsyncErrors(async (req, res, next) => {
  const { patientId, caregiverId } = req.body;
  console.log(patientId);
  console.log(caregiverId);

  // Check for missing fields
  if (!patientId || !caregiverId) {
    return next(new ErrorHandler("Please Provide Patient and Caregiver IDs!", 400));
  }

  // Find patient and caregiver
  const patient = await User.findById(patientId);
  const caregiver = await User.findById(caregiverId);

  // Check if patient and caregiver exist
  if (!patient || !caregiver) {
    return next(new ErrorHandler("Patient or Caregiver Not Found!", 404));
  }

  // Assign caregiver to patient
  patient.caregivers.push(caregiverId);
  caregiver.patients.push(patientId);
  caregiver.caregiverAvailability = false;
  caregiver.ongoingAssignments.push(patientId);

  // Save changes
  await patient.save();
  await caregiver.save();

  // Send response with patient and caregiver details
  res.status(200).json({
    success: true,
    message: "Caregiver Assigned Successfully!",
    patient: patient,
    caregiver: caregiver,
  });
});

export const removeCaregiver = catchAsyncErrors(async (req, res, next) => {
  const { patientId, caregiverId } = req.body;

  // Check for missing fields
  if (!patientId || !caregiverId) {
    return next(new ErrorHandler("Please Provide Patient and Caregiver IDs!", 400));
  }

  // Find patient and caregiver
  const patient = await User.findById(patientId);
  const caregiver = await User.findById(caregiverId);

  // Check if patient and caregiver exist
  if (!patient || !caregiver) {
    return next(new ErrorHandler("Patient or Caregiver Not Found!", 404));
  }

  // Remove caregiver from patient
  patient.caregivers.pull(caregiverId);
  caregiver.patients.pull(patientId);
  caregiver.caregiverAvailability = true;
  caregiver.ongoingAssignments.pull(patientId);

  // Save changes
  await patient.save();
  await caregiver.save();

  // Send response with patient and caregiver details
  res.status(200).json({
    success: true,
    message: "Caregiver Removed Successfully!",
    patient: patient,
    caregiver: caregiver,
  });
});

export const getCaregiverAvailability = catchAsyncErrors(async (req, res, next) => {
  const caregiverId = req.params.caregiverId;

  // Check for missing fields
  if (!caregiverId) {
    return next(new ErrorHandler("Please Provide Caregiver ID!", 400));
  }

  // Find caregiver
  const caregiver = await User.findById(caregiverId);

  // Check if caregiver exists
  if (!caregiver) {
    return next(new ErrorHandler("Caregiver Not Found!", 404));
  }

  // Send response
  res.status(200).json({
    success: true,
    availability: caregiver.caregiverAvailability,
  });
});

export const getOngoingAssignments = catchAsyncErrors(async (req, res, next) => {
  const caregiverId = req.params.caregiverId;

  // Check for missing fields
  if (!caregiverId) {
    return next(new ErrorHandler("Please Provide Caregiver ID!", 400));
  }

  // Find caregiver
  const caregiver = await User.findById(caregiverId);

  // Check if caregiver exists
  if (!caregiver) {
    return next(new ErrorHandler("Caregiver Not Found!", 404));
  }

  // Send response
  res.status(200).json({
    success: true,
    ongoingAssignments: caregiver.ongoingAssignments,
  });
});