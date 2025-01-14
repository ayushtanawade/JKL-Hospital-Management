import express from "express";
import { patientRegister,
         login, 
         addNewAdmin, 
         getAllDoctors, 
         getUserDetails, 
         logoutAdmin, 
         logoutPatient, 
         addNewDoctor, 
         updateProfile,
        getAllPatients,
        getAllCaregivers } from "../controller/userController.js";
import { assignCaregiver,
         removeCaregiver,
         getCaregiverAvailability,
         getOngoingAssignments

 } from "../controller/caregiverController.js";
import { isAdminAuthenticated,
         isPatientAuthenticated,
         } from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
router.put("/update-profile", isPatientAuthenticated, updateProfile);
router.post("/assign-caregiver",  assignCaregiver);
router.post("/remove-caregiver",  removeCaregiver);
router.get("/caregiver-availability/:caregiverId", isAdminAuthenticated, getCaregiverAvailability);
router.get("/ongoing-assignments/:caregiverId", isAdminAuthenticated, getOngoingAssignments);
router.get("/patients", getAllPatients);
router.get("/caregivers", getAllCaregivers);

export default router;