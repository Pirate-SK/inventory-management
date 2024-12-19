import { Request, Response } from 'express';
import Product from '../models/product.model';
import Validator from 'validatorjs';
import mongoose from 'mongoose';
import { all } from 'axios';

class ProductController {
  // Create product
  public async create(req: Request & { user?: any }, res: Response) {
    try {
      
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: 'User ID not found in token'
        });
      }

      const validatorRules = {
        name: 'required|string|min:2',
        description: 'required|string|min:10',
        price: 'required|numeric|min:0',
        category: 'required|string',
        quantity: 'required|numeric|min:0'
      };

      const validation = new Validator(req.body, validatorRules);
      const matched = await validation.check();

      if (!matched) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      const productData = {
        ...req.body,
        createdBy: req.user._id
      };

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get products (single or all)
  public async getProducts(req: Request, res: Response) {
    try {
      const { category, id} = req.query;
      // Check if either id or category is provided
      if (!category) {
        if(id== undefined){
          return res.status(400).json({
            success: false,
            message: 'Either product ID or category is required'
          });
        }
      }

      // Get by ID
      if (id) {
        const validatorRules = {
          id: 'required|string|regex:/^[0-9a-fA-F]{24}$/'
        };

        const v = new Validator({ id }, validatorRules);
        const matched = await v.check();

        if (!matched) {
          return res.status(400).json({
            success: false,
            message: 'Invalid product ID format'
          });
        }

        const product = await Product.findById(id);
        
        if (!product) {
          return res.status(404).json({
            success: false,
            message: 'Product not found'
          });
        }

        return res.json({
          success: true,
          data: product
        });
      }

      // Get by category
      if (category) {
        const validatorRules = {
          category: 'required|string'
        };

        const v = new Validator({ category }, validatorRules);
        const matched = await v.check();

        if (!matched) {
          return res.status(400).json({
            success: false,
            message: 'Invalid category format'
          });
        }

        const products = await Product.find({ category });
        
        return res.status(200).json({
          success: true,
          count: products.length,
          data: products
        });
      }else{
        const entierProducts = await Product.find({});
        return res.status(200).json({
          success: false,
          count: entierProducts.length,
          data: entierProducts
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update product
  public async update(req: Request, res: Response) {
    try {
      
      const id:any = req.body.id;
      console.log(req.body);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
      }

      // Validation 
      const validatorRules = {
        name: 'string|min:2',
        description: 'string|min:10',
        price: 'numeric|min:0',
        category: 'string',
        quantity: 'numeric|min:0'
      };

      const validation = new Validator(req.body, validatorRules);
      const matched = await validation.check();

      if (!matched) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }
      req.body.updatedBy = req.user._id;
      
      const product = await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete product
  public async delete(req: Request, res: Response) {
    try {
      const id: any = req.body.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
      }

        const product = await Product.findByIdAndDelete(id);
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
      
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new ProductController(); 