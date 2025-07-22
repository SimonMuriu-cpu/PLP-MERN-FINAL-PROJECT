# LocalMart - Localized E-Commerce Platform

A full-stack e-commerce platform designed for local communities, enabling same-day delivery from nearby vendors. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### Customer Features
- Browse products from local vendors
- Filter by category, location, and search
- Add items to cart and place orders
- Real-time order tracking
- Same-day delivery from local vendors
- User profile management

### Vendor Features
- Product management (CRUD operations)
- Order management and status updates
- Dashboard with analytics
- Image uploads for products
- Inventory management
- Customer order notifications

### Technical Features
- JWT authentication
- Real-time updates with Socket.IO
- Image upload with Cloudinary
- Responsive design with Tailwind CSS
- RESTful API architecture
- MongoDB database
- Role-based access control

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Image Storage**: Cloudinary
- **File Upload**: Multer

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image uploads)

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd localmart
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Set up environment variables:

**Server (.env in server folder):**
```bash
cp server/.env.example server/.env
```
Update the server/.env file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/localmart
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLIENT_URL=http://localhost:5173
```

**Client (.env in client folder):**
```bash
cp client/.env.example client/.env
```
Update the client/.env file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Seed the database with demo data:
```bash
npm run seed
```

5. Start both client and server:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:5173

### Individual Setup

#### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

5. Seed the database:
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

## Demo Accounts

After running the seed script, you can use these demo accounts:

- **Customer**: `customer@demo.com` / `password`
- **Vendor**: `vendor@demo.com` / `password`
- **Vendor 2**: `freshfruits@demo.com` / `password`
- **Vendor 3**: `electronics@demo.com` / `password`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (vendor only)
- `PUT /api/products/:id` - Update product (vendor only)
- `DELETE /api/products/:id` - Delete product (vendor only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get single order

### Vendor
- `GET /api/vendor/stats` - Get vendor statistics
- `GET /api/vendor/orders` - Get vendor orders
- `GET /api/vendor/products` - Get vendor products
- `PATCH /api/vendor/orders/:id/status` - Update order status

### Upload
- `POST /api/upload/image` - Upload image

## Project Structure

```
localmart/
├── client/                 # Frontend application
│   ├── src/               # React source files
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   ├── public/            # Static files
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── server/                # Backend application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── scripts/           # Utility scripts
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── package.json           # Root package.json for scripts
└── README.md
```

## Socket.IO Events

- `newOrder` - Notifies vendors of new orders
- `orderStatusUpdated` - Notifies customers of order status changes

## Available Scripts

### Root Level
- `npm run dev` - Start both client and server
- `npm run client` - Start only client
- `npm run server` - Start only server
- `npm run build` - Build client for production
- `npm run seed` - Seed database with demo data
- `npm run install-all` - Install dependencies for both client and server

### Client (cd client)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server (cd server)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


## Render deployment link:
https://plp-mern-final-project.onrender.com/