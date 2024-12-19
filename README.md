# inventory Management API

## Description

This project is a RESTful API for managing products, built using TypeScript, Express, and MongoDB. It provides functionalities for creating, retrieving, updating, and deleting products. The API includes validation for input data and handles user authentication to ensure secure operations.

## Features

- **Create Product**: Allows users to add new products with validation for required fields.
- **Get Products**: Retrieve a list of products or a specific product by ID or category, with support for filtering out soft-deleted products.
- **Update Product**: Update product details, including tracking who made the changes.
- **Delete Product**: Allowing products to be permanently removed or marked as deleted.
- **Input Validation**: Utilizes `validatorjs` for validating incoming request data.
- **Error Handling**: Comprehensive error handling to provide meaningful feedback to API consumers.

## Technologies Used

- **Node.js**: JavaScript runtime for building the API.
- **Express**: Web framework for building the RESTful API.
- **MongoDB**: NoSQL database for storing product data.
- **TypeScript**: Superset of JavaScript that adds static types.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Validator.js**: Library for validating and sanitizing data.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/product-management-api.git
   ```

2. Navigate to the project directory:
   ```bash
   cd product-management-api
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your environment variables (e.g., database connection string) in a `.env` file.

5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /products` - Create a new product
- `GET /products` - Retrieve all products or filter by category(Bassed on ID and category we can able to filter the product)
- `POST /products` - Update an existing product
- `POST /products` - Delete a product 

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
