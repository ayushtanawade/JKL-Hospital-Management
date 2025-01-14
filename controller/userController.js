import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    nic,
    role,
  } = req.body;

  // Check for missing fields
  if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User Already Registered!", 400));
  }

  // Create new user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password, // Ensure password is hashed in the User model
    gender,
    dob,
    nic,
    role,
  });

  // Generate token and send response
  generateToken(newUser, "User Registered Successfully!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Check if all required fields are provided
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please Provide All Details!", 400));
  }

  // Find the user by email and include the password field
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password!", 400));
  }

  // Check if the entered password matches the stored password
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password!", 400));
  }

  // Check if the role matches
  if (role !== user.role) {
    return next(new ErrorHandler("User With This Role Not Found!", 400));
  }

  // Generate token and send response
  generateToken(user, "User Login Successfully!", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;

  // Check for missing fields
  if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Check if admin already exists
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} With This Mail Already Exists!`, 400));
  }

  // Create new admin
  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password, // Ensure password is hashed in the User model
    gender,
    dob,
    nic,
    role: "Admin",
  });

  // Send response
  res.status(200).json({
    success: true,
    message: "New Admin Registered!",
    admin, // Optionally include the admin object
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Admin logged out successfully!",
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite: "None",
      secure: true,
    })
    .json({
      success: true,
      message: "Patient logged out successfully!",
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res , next) => {
  const { firstName, lastName, email, phone, password, gender, dob, nic } = req.body;

  // Check for missing fields
  if (!firstName || !lastName || !email || !phone || !password || !gender || !dob || !nic) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Check if doctor already exists
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} With This Mail Already Exists!`, 400));
  }

  // Create new doctor
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password, // Ensure password is hashed in the User model
    gender,
    dob,
    nic,
    role: "Doctor",
  });

  // Send response
  res.status(200).json({
    success: true,
    message: "New Doctor Registered!",
    doctor, // Optionally include the doctor object
  });
});

// Define the getAllPatients function
export const getAllPatients = catchAsyncErrors(async (req, res, next) => {
  const patients = await User.find({ role: "Patient" });
  res.status(200).json({
    success: true,
    patients,
  });
});

// Define the getAllCaregivers function
export const getAllCaregivers = catchAsyncErrors(async (req, res, next) => {
  const caregivers = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    caregivers,
  });
});
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender } = req.body;

  // Check for missing fields
  if (!firstName || !lastName || !email || !phone || !nic || !dob || !gender) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Find the user by email
  const user = await User.findById(req.user._id);

  // Check if user exists
  if (!user) {
    return next(new ErrorHandler("User Not Found!", 404));
  }

  // Update the user details
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.phone = phone;
  user.nic = nic;
  user.dob = dob;
  user.gender = gender;

  // Save the changes
  await user.save();

  // Send response
  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully!",
    user,
  });
});