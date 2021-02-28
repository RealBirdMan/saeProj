import { Router } from "express";

import { isAuth } from "../../util/middleware/validateAuth";
import {
  createProfile,
  getProfile,
  updateProfile,
  createCompany,
  getCompanies,
  getAllCompanies,
  deleteCompany,
  patchCompany,
  createBill,
  getBills,
  downloadBill,
} from "../../controllers/dashboard/dashboardController";
import { validateProfile } from "../../util/middleware/validateProfile";
import { validateCompany } from "../../util/middleware/validateCompany";
import { validateBill } from "../../util/middleware/validateBill";

const router = Router();

router.use(isAuth);

// @route   GET /api/dashboard/profile
// @desc    create user profile
// @access  Private
router.get("/profile", getProfile);

// @route   POST /api/dashboard/profile
// @desc    create user profile
// @access  Private
router.post("/profile", validateProfile(), createProfile);

// @route   POST /api/dashboard/profile
// @desc    create user profile
// @access  Private
router.patch("/profile/:id", validateProfile(), updateProfile);

// @route   POST /api/dashboard/create-company
// @desc    create new company
// @access  Private
router.post("/create-company", validateCompany(), createCompany);

// @route   PATCH /api/dashboard/create-company/:id
// @desc    update Company
// @access  Private
router.patch("/create-company/:id", validateCompany(), patchCompany);

// @route   GET /api/dashboard/companies/all
// @desc    get all user companies
// @access  Private
router.get("/companies/all", getAllCompanies);

// @route   GET /api/dashboard/companies/idx
// @desc    get all user companies by index
// @access  Private
router.get("/companies/:index", getCompanies);

// @route   DELETE /api/dashboard/company/:id
// @desc    delete a Company
// @access  Private
router.delete("/company/:id", deleteCompany);

// @route   post /api/dashboard/bill
// @desc    post bill
// @access  Private
router.post("/bill", validateBill(), createBill);

// @route   GET /api/dashboard/bills
// @desc    get all bills
// @access  Private
router.get("/bills", getBills);

// @route   GET /api/dashboard/bill/:billId
// @desc    download Bill
// @access  Private
router.get("/bill/:billId", downloadBill);

export default router;
