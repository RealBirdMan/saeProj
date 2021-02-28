"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateAuth_1 = require("../../util/middleware/validateAuth");
const dashboardController_1 = require("../../controllers/dashboard/dashboardController");
const validateProfile_1 = require("../../util/middleware/validateProfile");
const validateCompany_1 = require("../../util/middleware/validateCompany");
const validateBill_1 = require("../../util/middleware/validateBill");
const router = express_1.Router();
router.use(validateAuth_1.isAuth);
// @route   GET /api/dashboard/profile
// @desc    create user profile
// @access  Private
router.get("/profile", dashboardController_1.getProfile);
// @route   POST /api/dashboard/profile
// @desc    create user profile
// @access  Private
router.post("/profile", validateProfile_1.validateProfile(), dashboardController_1.createProfile);
// @route   POST /api/dashboard/profile
// @desc    create user profile
// @access  Private
router.patch("/profile/:id", validateProfile_1.validateProfile(), dashboardController_1.updateProfile);
// @route   POST /api/dashboard/create-company
// @desc    create new company
// @access  Private
router.post("/create-company", validateCompany_1.validateCompany(), dashboardController_1.createCompany);
// @route   PATCH /api/dashboard/create-company/:id
// @desc    update Company
// @access  Private
router.patch("/create-company/:id", validateCompany_1.validateCompany(), dashboardController_1.patchCompany);
// @route   GET /api/dashboard/companies/all
// @desc    get all user companies
// @access  Private
router.get("/companies/all", dashboardController_1.getAllCompanies);
// @route   GET /api/dashboard/companies/idx
// @desc    get all user companies by index
// @access  Private
router.get("/companies/:index", dashboardController_1.getCompanies);
// @route   DELETE /api/dashboard/company/:id
// @desc    delete a Company
// @access  Private
router.delete("/company/:id", dashboardController_1.deleteCompany);
// @route   post /api/dashboard/bill
// @desc    post bill
// @access  Private
router.post("/bill", validateBill_1.validateBill(), dashboardController_1.createBill);
// @route   GET /api/dashboard/bills
// @desc    get all bills
// @access  Private
router.get("/bills", dashboardController_1.getBills);
// @route   GET /api/dashboard/bill/:billId
// @desc    download Bill
// @access  Private
router.get("/bill/:billId", dashboardController_1.downloadBill);
exports.default = router;
