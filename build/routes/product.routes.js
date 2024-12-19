"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = __importDefault(require("../controllers/product.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect); // Protect all product routes
router.post('/', product_controller_1.default.create);
router.get('/', product_controller_1.default.getAll);
router.get('/:id', product_controller_1.default.getOne);
router.put('/:id', product_controller_1.default.update);
router.delete('/:id', product_controller_1.default.delete);
exports.default = router;
