"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadBill = exports.getBills = exports.createBill = exports.patchCompany = exports.deleteCompany = exports.getCompanies = exports.getAllCompanies = exports.createCompany = exports.updateProfile = exports.createProfile = exports.getProfile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const uuid_1 = require("uuid");
const handlebars_1 = __importDefault(require("handlebars"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const validationResultHandler_1 = require("./../../util/helpers/validationResultHandler");
const HttpError_1 = require("./../../models/HttpError");
const ProfileModel_1 = __importDefault(require("../../models/ProfileModel"));
const CompanyModel_1 = __importDefault(require("../../models/CompanyModel"));
const userInterface_1 = require("../../util/interface/userInterface");
const UserModel_1 = __importDefault(require("../../models/UserModel"));
const BillModel_1 = __importDefault(require("../../models/BillModel"));
/*=================================================================================================================
get Profile
=====================================================================================================================*/
const getProfile = async (req, res, next) => {
    let profile;
    try {
        profile = await ProfileModel_1.default.findOne({ user: req.userData.userId });
    }
    catch (err) {
        return next(new HttpError_1.HttpError(err, 500));
    }
    res.status(200).json(profile === null || profile === void 0 ? void 0 : profile.toObject({ getters: true }));
};
exports.getProfile = getProfile;
/*=================================================================================================================
create Profile
=====================================================================================================================*/
const createProfile = async (req, res, next) => {
    validationResultHandler_1.validationResultHandler(req, res, next);
    let user;
    try {
        user = await UserModel_1.default.findById(req.userData.userId);
    }
    catch (err) {
        return next(new HttpError_1.HttpError(err, 500));
    }
    if (!user) {
        return next(new HttpError_1.HttpError("User not Found", 404));
    }
    if (user.profile) {
        return next(new HttpError_1.HttpError("User already exists", 422));
    }
    const createdProfile = new ProfileModel_1.default({
        ...req.body,
        user: req.userData.userId,
    });
    try {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        await createdProfile.save({ session });
        user.profile = createdProfile;
        user.status = userInterface_1.Status.active;
        await user.save({ session });
        await session.commitTransaction();
    }
    catch (err) {
        return next(new HttpError_1.HttpError("Anlegen des Profiles fehlgeschlagen, bitte versuchen sie es später erneut", 500));
    }
    res.status(200).json({
        message: "Profile created",
    });
};
exports.createProfile = createProfile;
/*=================================================================================================================
patch Profile
=====================================================================================================================*/
const updateProfile = async (req, res, next) => {
    validationResultHandler_1.validationResultHandler(req, res, next);
    const profileId = req.params.id;
    let profile;
    try {
        profile = await ProfileModel_1.default.findById(profileId);
    }
    catch (err) {
        return next(new HttpError_1.HttpError("Something went wrong", 500));
    }
    if (!profile) {
        return next(new HttpError_1.HttpError("Place not found", 404));
    }
    if (profile.user.toString() !== req.userData.userId) {
        return next(new HttpError_1.HttpError("Not Authorized", 401));
    }
    Object.keys(req.body).map(val => {
        profile[val] = req.body[val];
    });
    try {
        await profile.save();
    }
    catch (err) {
        return next(new HttpError_1.HttpError("Speichern fehlgeschlagen, bitte erneut versuchen", 500));
    }
    res.status(200).json({ message: "Profile wurde gespeichert." });
};
exports.updateProfile = updateProfile;
/*=================================================================================================================
create Company
=====================================================================================================================*/
const createCompany = async (req, res, next) => {
    validationResultHandler_1.validationResultHandler(req, res, next);
    let user;
    try {
        user = await UserModel_1.default.findById(req.userData.userId).populate("companies");
    }
    catch (err) {
        return next(new HttpError_1.HttpError(err, 500));
    }
    const existingCompany = user === null || user === void 0 ? void 0 : user.companies.filter(comp => comp.companyName === req.body.companyName);
    if ((existingCompany === null || existingCompany === void 0 ? void 0 : existingCompany.length) !== 0) {
        return next(new HttpError_1.HttpError("Diese Firma existiert bereits", 422));
    }
    if (!user) {
        return next(new HttpError_1.HttpError("User not Found", 404));
    }
    const createdCompany = new CompanyModel_1.default({
        ...req.body,
        user: req.userData.userId,
    });
    try {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        await createdCompany.save({ session });
        user.companies.push(createdCompany);
        await user.save({ session });
        await session.commitTransaction();
    }
    catch (err) {
        return next(new HttpError_1.HttpError("Anlegen einer Firma fehlgeschlagen, bitte versuchen sie es später erneut", 500));
    }
    res.status(200).json({ message: "Profile wurde gespeichert." });
};
exports.createCompany = createCompany;
/*=================================================================================================================
get All Companies
=====================================================================================================================*/
const getAllCompanies = async (req, res, next) => {
    let companies;
    try {
        companies = await CompanyModel_1.default.find({ user: req.userData.userId });
    }
    catch (err) {
        return next(new HttpError_1.HttpError("Something went wrong", 500));
    }
    if (companies) {
        companies = companies.map(comp => comp.toObject({ getters: true }));
    }
    res.status(200).json(companies);
};
exports.getAllCompanies = getAllCompanies;
/*=================================================================================================================
get Companies load onDemand
=====================================================================================================================*/
const getCompanies = async (req, res, next) => {
    let index = +req.params.index;
    let ammount = 20;
    let companies;
    try {
        const response = await UserModel_1.default.findById(req.userData.userId, {
            companies: { $slice: [index, ammount] },
        }).populate("companies");
        companies = response === null || response === void 0 ? void 0 : response.companies;
    }
    catch (err) {
        return next(new HttpError_1.HttpError(err, 500));
    }
    if (companies) {
        companies = companies.map(comp => comp.toObject({ getters: true }));
    }
    res.status(200).json(companies);
};
exports.getCompanies = getCompanies;
/*=================================================================================================================
delete Company
=====================================================================================================================*/
const deleteCompany = async (req, res, next) => {
    const companyId = req.params.id;
    try {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        await UserModel_1.default.findOneAndUpdate({
            _id: req.userData.userId,
        }, {
            $pull: {
                companies: companyId,
            },
        }, { useFindAndModify: false, session: session });
        await CompanyModel_1.default.findByIdAndDelete(companyId);
        await session.commitTransaction();
    }
    catch (err) {
        return next(new HttpError_1.HttpError("Anlegen des Profiles fehlgeschlagen, bitte versuchen sie es später erneut", 500));
    }
    res.status(200).json({ message: "Company wurde erfolgreich gelöscht" });
};
exports.deleteCompany = deleteCompany;
/*=================================================================================================================
patch Company
=====================================================================================================================*/
const patchCompany = async (req, res, next) => {
    validationResultHandler_1.validationResultHandler(req, res, next);
    const companyId = req.params.id;
    let company;
    try {
        company = await CompanyModel_1.default.findById(companyId);
    }
    catch (err) {
        return next(new HttpError_1.HttpError("Something went wrong", 500));
    }
    if (!company) {
        return next(new HttpError_1.HttpError("Place not found", 404));
    }
    if (company.user.toString() !== req.userData.userId) {
        return next(new HttpError_1.HttpError("Not Authorized", 401));
    }
    Object.keys(req.body).map(val => {
        company[val] = req.body[val];
    });
    try {
        await company.save();
    }
    catch (err) {
        return next(new HttpError_1.HttpError("Speichern fehlgeschlagen, bitte erneut versuchen", 500));
    }
    res.status(200).json({ message: "Profile wurde gespeichert." });
};
exports.patchCompany = patchCompany;
/*=================================================================================================================
createBill
=====================================================================================================================*/
const createBill = async (req, res, next) => {
    validationResultHandler_1.validationResultHandler(req, res, next);
    let user;
    try {
        user = await UserModel_1.default.findById(req.userData.userId).populate("profile");
    }
    catch (err) {
        return next(new HttpError_1.HttpError(err, 500));
    }
    let company;
    try {
        company = await CompanyModel_1.default.findById(req.body.companies);
    }
    catch (err) {
        return next(new HttpError_1.HttpError(err, 500));
    }
    const userDir = `./pdf/${user === null || user === void 0 ? void 0 : user.id}`;
    if (!fs_extra_1.default.existsSync(userDir)) {
        fs_extra_1.default.mkdirSync(userDir);
    }
    const date = Date.now();
    const formatedDate = new Intl.DateTimeFormat("de-DE").format(date);
    const year = formatedDate.split(".")[2];
    const dir = `./pdf/${user === null || user === void 0 ? void 0 : user.id}/${year}`;
    if (!fs_extra_1.default.existsSync(dir)) {
        fs_extra_1.default.mkdirSync(dir);
    }
    const billNr = uuid_1.v4();
    const createdBill = new BillModel_1.default({
        companyName: company === null || company === void 0 ? void 0 : company.companyName,
        billNr: billNr,
        user: user,
    });
    const filePath = path_1.default.join(process.cwd(), "src", "util", "pdfTemplate", "bill.hbs");
    handlebars_1.default.registerHelper("breaklines", function (text) {
        text = handlebars_1.default.Utils.escapeExpression(text);
        text = text.replace(/(\r\n|\n|\r)/gm, "<br>");
        return new handlebars_1.default.SafeString(text);
    });
    const PriceAddition = req.body.jobs.reduce((accumulator, currentValue) => accumulator + +currentValue.price, 0);
    const html = await fs_extra_1.default.readFile(filePath, "utf-8");
    const template = handlebars_1.default.compile(html)({
        profileName: user === null || user === void 0 ? void 0 : user.profile.companyName,
        profileStreet: user === null || user === void 0 ? void 0 : user.profile.street,
        profilePostal: user === null || user === void 0 ? void 0 : user.profile.postal,
        profileCity: user === null || user === void 0 ? void 0 : user.profile.city,
        companyName: company === null || company === void 0 ? void 0 : company.companyName,
        companyStreet: company === null || company === void 0 ? void 0 : company.companyStreet,
        companyPostal: company === null || company === void 0 ? void 0 : company.companyPostal,
        companyCity: company === null || company === void 0 ? void 0 : company.companyCity,
        date: formatedDate,
        billNr: billNr,
        taxNumber: user === null || user === void 0 ? void 0 : user.profile.taxNumber,
        taxId: user === null || user === void 0 ? void 0 : user.profile.taxId,
        jobs: req.body.jobs,
        result: PriceAddition,
        billDescription: user === null || user === void 0 ? void 0 : user.profile.defaultText,
        bankFirstName: user === null || user === void 0 ? void 0 : user.profile.firstName,
        bankLastName: user === null || user === void 0 ? void 0 : user.profile.lastName,
        iban: user === null || user === void 0 ? void 0 : user.profile.iban,
        bic: user === null || user === void 0 ? void 0 : user.profile.bic,
    });
    let pdf;
    try {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        await createdBill.save({ session });
        user === null || user === void 0 ? void 0 : user.bills.push(createdBill);
        await (user === null || user === void 0 ? void 0 : user.save({ session }));
        const browser = await puppeteer_1.default.launch();
        const page = await browser.newPage();
        await page.setContent(template);
        await page.emulateMediaType("screen");
        pdf = await page.pdf({
            path: `./pdf/${user === null || user === void 0 ? void 0 : user.id}/${year}/${company === null || company === void 0 ? void 0 : company.companyName}_${billNr}.pdf`,
            format: "A4",
            printBackground: true,
        });
        await browser.close();
        await session.commitTransaction();
    }
    catch (err) {
        return next(new HttpError_1.HttpError("Das Speichern der Rechnung ist fehlgeschlagen", 500));
    }
    res.status(200).json(pdf);
};
exports.createBill = createBill;
/*=================================================================================================================
get Bills load onDemand
=====================================================================================================================*/
const getBills = async (req, res, next) => {
    let bills;
    try {
        const response = await UserModel_1.default.findById(req.userData.userId).populate("bills");
        bills = response === null || response === void 0 ? void 0 : response.bills;
    }
    catch (err) {
        return next(new HttpError_1.HttpError(err, 500));
    }
    if (bills) {
        bills = bills.map(bill => bill.toObject({ getters: true }));
    }
    res.status(200).json(bills);
};
exports.getBills = getBills;
/*=================================================================================================================
download Bill
=====================================================================================================================*/
const downloadBill = async (req, res, next) => {
    var _a;
    const billId = req.params.billId;
    let bill;
    try {
        bill = await BillModel_1.default.find({ user: req.userData.userId, billNr: billId });
    }
    catch (err) {
        return next(new HttpError_1.HttpError("Something went wrong", 500));
    }
    const year = (_a = bill[0]) === null || _a === void 0 ? void 0 : _a.createdAt.getFullYear();
    const filePath = `./pdf/${req.userData.userId}/${year}/${bill[0].companyName}_${billId}.pdf`;
    //fs.access(filePath, fs.constants.F_OK, err => {
    //  console.log(`${filePath} ${err ? "does not exist" : "exists"}`);
    //});
    res.download(filePath, function (err) {
        if (err) {
            return next(new HttpError_1.HttpError("Something went wrong", 404));
        }
        res.end();
    });
};
exports.downloadBill = downloadBill;
