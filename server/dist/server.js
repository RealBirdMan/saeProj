"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config/config");
const HttpError_1 = require("./models/HttpError");
const authRoutes_1 = __importDefault(require("./routes/auth/authRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboard/dashboardRoutes"));
const app = express_1.default();
//Middlewares
app.use(cors_1.default());
app.use(body_parser_1.default.json());
//Routes
app.use("/api/auth/", authRoutes_1.default);
app.use("/api/dashboard/", dashboardRoutes_1.default);
app.use((req, res, next) => {
    const error = new HttpError_1.HttpError("Route not Found", 404);
    throw error;
});
//Run App
app.use((error, req, res, next) => {
    if (res.headersSent)
        return next(error);
    res
        .status(error.code || 500)
        .json({ message: error.message || "An unknown error occurred!" });
});
mongoose_1.default
    .connect(config_1.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => {
    app.listen(config_1.PORT);
    console.log("db and server are running");
})
    .catch(err => {
    throw new HttpError_1.HttpError("An unknown error occurred!", 500);
});
