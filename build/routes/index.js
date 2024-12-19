"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const express_1 = require("express");
const jsonParser = body_parser_1.default.json({ limit: "50mb" });
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Welcome to the API!',
    });
    return;
});
router.use('/auth', auth_routes_1.default);
router.use('/products', product_routes_1.default);
exports.default = router;
