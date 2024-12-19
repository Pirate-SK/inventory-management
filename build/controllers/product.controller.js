"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = __importDefault(require("../models/product.model"));
class ProductController {
    // Create product
    async create(req, res) {
        try {
            const product = await product_model_1.default.create(req.body);
            res.status(201).json({
                success: true,
                data: product
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    // Get all products with filtering
    async getAll(req, res) {
        try {
            const { category } = req.query;
            const filter = category ? { category } : {};
            const products = await product_model_1.default.find(filter);
            res.json({
                success: true,
                count: products.length,
                data: products
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    // Get single product
    async getOne(req, res) {
        try {
            const product = await product_model_1.default.findById(req.params.id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            res.json({
                success: true,
                data: product
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    // Update product
    async update(req, res) {
        try {
            const product = await product_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            res.json({
                success: true,
                data: product
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    // Delete product
    async delete(req, res) {
        try {
            const product = await product_model_1.default.findByIdAndDelete(req.params.id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.default = new ProductController();
