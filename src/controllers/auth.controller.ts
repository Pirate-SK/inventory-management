import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import validator from 'validator';

class AuthController {
  // Register user
  public async register(req: Request, res: Response) {
    try {
      const payload = req.body;
      
      // Define validation rules
      const validationRules = {
        name: {
          required: true,
          validate: (value: string) => {
            const sanitized = validator.escape(value?.trim());
            return sanitized.length >= 2;
          },
          requiredMessage: 'Name is required',
          invalidMessage: 'Name must be at least 2 characters'
        },
        email: {
          required: true,
          validate: (value: string) => {
            const sanitized = validator.normalizeEmail(value);
            return sanitized && validator.isEmail(sanitized);
          },
          requiredMessage: 'Email is required',
          invalidMessage: 'Invalid email format'
        },
        password: {
          required: true,
          validate: (value: string) => value.length >= 6,
          requiredMessage: 'Password is required',
          invalidMessage: 'Password must be at least 6 characters'
        }
      };

      // Validate all fields
      const errors = [];
      for (const [field, rules] of Object.entries(validationRules)) {
        if (rules.required && !payload[field]) {
          errors.push(rules.requiredMessage);
        } else if (payload[field] && rules.validate && !rules.validate(payload[field])) {
          errors.push(rules.invalidMessage);
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: errors.join('. ')
        });
      }

      // Sanitize inputs after validation
      const sanitizedEmail = validator.normalizeEmail(payload.email);
      const sanitizedName = validator.escape(payload.name?.trim());

      // Check if user exists
      const userExists = await User.findOne({ email: sanitizedEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Create user
      const user = await User.create({
        name: sanitizedName,
        email: sanitizedEmail,
        password: payload.password
      });

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: '30d'
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Login user
  public async login(req: Request, res: Response) {
    try {
      const payload = req.body;
      
      const validationRules = {
        email: {
          required: true,
          validate: (value: string) => {
            const sanitized = validator.normalizeEmail(value);
            return sanitized && validator.isEmail(sanitized);
          },
          message: 'Invalid email address'
        },
        password: {
          required: true,
          validate: (value: string) => value.length >= 6,
          message: 'Password is required'
        }
      };

      const errors = [];
      for (const [field, rules] of Object.entries(validationRules)) {
        if (rules.required && !payload[field]) {
          errors.push(rules.message);
        } else if (rules.validate && !rules.validate(payload[field])) {
          errors.push(rules.message);
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: errors.join('. ')
        });
      }

      const sanitizedEmail = validator.normalizeEmail(payload.email);

      // Check if user exists
      const user = await User.findOne({ email: sanitizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await user.comparePassword(payload.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: '30d'
      });

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new AuthController(); 