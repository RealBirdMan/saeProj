import mongoose from "mongoose";
import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";

import Handlebars from "handlebars";

import fs from "fs-extra";
import path from "path";

import { profileInterface } from "../../util/interface/profileInterface";
import { validationResultHandler } from "./../../util/helpers/validationResultHandler";
import { HttpError } from "./../../models/HttpError";
import { RequestHandler, response } from "express";
import Profile from "../../models/ProfileModel";
import Company from "../../models/CompanyModel";
import { Status } from "../../util/interface/userInterface";
import User from "../../models/UserModel";
import Bill from "../../models/BillModel";

/*=================================================================================================================
get Profile
=====================================================================================================================*/
export const getProfile: RequestHandler = async (req: any, res, next) => {
  let profile: profileInterface | null;
  try {
    profile = await Profile.findOne({ user: req.userData.userId });
  } catch (err) {
    return next(new HttpError(err, 500));
  }

  res.status(200).json(profile?.toObject({ getters: true }));
};

/*=================================================================================================================
create Profile
=====================================================================================================================*/

export const createProfile: RequestHandler = async (req: any, res, next) => {
  validationResultHandler(req, res, next);

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError(err, 500));
  }

  if (!user) {
    return next(new HttpError("User not Found", 404));
  }
  if (user.profile) {
    return next(new HttpError("User already exists", 422));
  }

  const createdProfile = new Profile({
    ...req.body,
    user: req.userData.userId,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdProfile.save({ session });
    user.profile = createdProfile;
    user.status = Status.active;
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return next(
      new HttpError(
        "Anlegen des Profiles fehlgeschlagen, bitte versuchen sie es später erneut",
        500
      )
    );
  }

  res.status(200).json({
    message: "Profile created",
  });
};

/*=================================================================================================================
patch Profile
=====================================================================================================================*/
export const updateProfile: RequestHandler = async (req: any, res, next) => {
  validationResultHandler(req, res, next);

  const profileId = req.params.id;

  let profile: any;
  try {
    profile = await Profile.findById(profileId);
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  if (!profile) {
    return next(new HttpError("Place not found", 404));
  }

  if (profile.user.toString() !== req.userData.userId) {
    return next(new HttpError("Not Authorized", 401));
  }

  Object.keys(req.body).map(val => {
    profile[val] = req.body[val];
  });

  try {
    await profile.save();
  } catch (err) {
    return next(
      new HttpError("Speichern fehlgeschlagen, bitte erneut versuchen", 500)
    );
  }

  res.status(200).json({ message: "Profile wurde gespeichert." });
};

/*=================================================================================================================
create Company
=====================================================================================================================*/
export const createCompany: RequestHandler = async (req: any, res, next) => {
  validationResultHandler(req, res, next);

  let user;
  try {
    user = await User.findById(req.userData.userId).populate("companies");
  } catch (err) {
    return next(new HttpError(err, 500));
  }

  const existingCompany = user?.companies.filter(
    comp => comp.companyName === req.body.companyName
  );
  if (existingCompany?.length !== 0) {
    return next(new HttpError("Diese Firma existiert bereits", 422));
  }

  if (!user) {
    return next(new HttpError("User not Found", 404));
  }

  const createdCompany = new Company({
    ...req.body,
    user: req.userData.userId,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createdCompany.save({ session });
    user.companies.push(createdCompany);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return next(
      new HttpError(
        "Anlegen einer Firma fehlgeschlagen, bitte versuchen sie es später erneut",
        500
      )
    );
  }

  res.status(200).json({ message: "Profile wurde gespeichert." });
};

/*=================================================================================================================
get All Companies
=====================================================================================================================*/
export const getAllCompanies: RequestHandler = async (req: any, res, next) => {
  let companies;
  try {
    companies = await Company.find({ user: req.userData.userId });
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  if (companies) {
    companies = companies.map(comp => comp.toObject({ getters: true }));
  }

  res.status(200).json(companies);
};

/*=================================================================================================================
get Companies load onDemand
=====================================================================================================================*/
export const getCompanies: RequestHandler = async (req: any, res, next) => {
  let index = +req.params.index;
  let ammount = 20;

  let companies;
  try {
    const response = await User.findById(req.userData.userId, {
      companies: { $slice: [index, ammount] },
    }).populate("companies");
    companies = response?.companies;
  } catch (err) {
    return next(new HttpError(err, 500));
  }

  if (companies) {
    companies = companies.map(comp => comp.toObject({ getters: true }));
  }

  res.status(200).json(companies);
};

/*=================================================================================================================
delete Company
=====================================================================================================================*/
export const deleteCompany: RequestHandler = async (req: any, res, next) => {
  const companyId = req.params.id;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await User.findOneAndUpdate(
      {
        _id: req.userData.userId,
      },
      {
        $pull: {
          companies: companyId,
        },
      },
      { useFindAndModify: false, session: session }
    );

    await Company.findByIdAndDelete(companyId);

    await session.commitTransaction();
  } catch (err) {
    return next(
      new HttpError(
        "Anlegen des Profiles fehlgeschlagen, bitte versuchen sie es später erneut",
        500
      )
    );
  }

  res.status(200).json({ message: "Company wurde erfolgreich gelöscht" });
};

/*=================================================================================================================
patch Company
=====================================================================================================================*/
export const patchCompany: RequestHandler = async (req: any, res, next) => {
  validationResultHandler(req, res, next);

  const companyId = req.params.id;

  let company: any;
  try {
    company = await Company.findById(companyId);
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  if (!company) {
    return next(new HttpError("Place not found", 404));
  }

  if (company.user.toString() !== req.userData.userId) {
    return next(new HttpError("Not Authorized", 401));
  }

  Object.keys(req.body).map(val => {
    company[val] = req.body[val];
  });

  try {
    await company.save();
  } catch (err) {
    return next(
      new HttpError("Speichern fehlgeschlagen, bitte erneut versuchen", 500)
    );
  }

  res.status(200).json({ message: "Profile wurde gespeichert." });
};

/*=================================================================================================================
createBill
=====================================================================================================================*/
export const createBill: RequestHandler = async (req: any, res, next) => {
  validationResultHandler(req, res, next);

  let user;
  try {
    user = await User.findById(req.userData.userId).populate("profile");
  } catch (err) {
    return next(new HttpError(err, 500));
  }
  let company;
  try {
    company = await Company.findById(req.body.companies);
  } catch (err) {
    return next(new HttpError(err, 500));
  }

  const userDir = `./pdf/${user?.id}`;

  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir);
  }

  const date = Date.now();
  const formatedDate = new Intl.DateTimeFormat("de-DE").format(date);
  const year = formatedDate.split(".")[2];
  const dir = `./pdf/${user?.id}/${year}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const billNr = uuidv4();

  const createdBill = new Bill({
    companyName: company?.companyName,
    billNr: billNr,
    user: user,
  });

  const filePath = path.join(
    process.cwd(),
    "src",
    "util",
    "pdfTemplate",
    "bill.hbs"
  );

  Handlebars.registerHelper("breaklines", function (text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, "<br>");
    return new Handlebars.SafeString(text);
  });

  const PriceAddition = req.body.jobs.reduce(
    (accumulator: number, currentValue: { price: number }) =>
      accumulator + +currentValue.price,
    0
  );

  const html = await fs.readFile(filePath, "utf-8");
  const template = Handlebars.compile(html)({
    profileName: user?.profile.companyName,
    profileStreet: user?.profile.street,
    profilePostal: user?.profile.postal,
    profileCity: user?.profile.city,

    companyName: company?.companyName,
    companyStreet: company?.companyStreet,
    companyPostal: company?.companyPostal,
    companyCity: company?.companyCity,

    date: formatedDate,

    billNr: billNr,
    taxNumber: user?.profile.taxNumber,
    taxId: user?.profile.taxId,

    jobs: req.body.jobs,
    result: PriceAddition,

    billDescription: user?.profile.defaultText,
    bankFirstName: user?.profile.firstName,
    bankLastName: user?.profile.lastName,
    iban: user?.profile.iban,
    bic: user?.profile.bic,
  });

  let pdf;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await createdBill.save({ session });
    user?.bills.push(createdBill);
    await user?.save({ session });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(template);
    await page.emulateMediaType("screen");
    pdf = await page.pdf({
      path: `./pdf/${user?.id}/${year}/${company?.companyName}_${billNr}.pdf`,
      format: "A4",
      printBackground: true,
    });
    await browser.close();

    await session.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Das Speichern der Rechnung ist fehlgeschlagen", 500)
    );
  }

  res.status(200).json(pdf);
};

/*=================================================================================================================
get Bills load onDemand
=====================================================================================================================*/
export const getBills: RequestHandler = async (req: any, res, next) => {
  let bills;
  try {
    const response = await User.findById(req.userData.userId).populate("bills");
    bills = response?.bills;
  } catch (err) {
    return next(new HttpError(err, 500));
  }

  if (bills) {
    bills = bills.map(bill => bill.toObject({ getters: true }));
  }

  res.status(200).json(bills);
};

/*=================================================================================================================
download Bill
=====================================================================================================================*/
export const downloadBill: RequestHandler = async (req: any, res, next) => {
  const billId = req.params.billId;
  let bill;
  try {
    bill = await Bill.find({ user: req.userData.userId, billNr: billId });
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  const year = bill[0]?.createdAt.getFullYear();
  const filePath = `./pdf/${req.userData.userId}/${year}/${bill[0].companyName}_${billId}.pdf`;

  //fs.access(filePath, fs.constants.F_OK, err => {
  //  console.log(`${filePath} ${err ? "does not exist" : "exists"}`);
  //});

  res.download(filePath, function (err) {
    if (err) {
      return next(new HttpError("Something went wrong", 404));
    }
    res.end();
  });
};
