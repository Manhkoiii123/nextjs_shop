# E-Commerce Admin Dashboard Template

A comprehensive **Next.js 14** e-commerce admin dashboard template built with **TypeScript**, **Material-UI (MUI)**, and **Redux Toolkit**. This template provides a complete solution for managing an online store with features including product management, order processing, user administration, and role-based access control.

## 🚀 Features

### Authentication & Authorization

- **Multi-provider Authentication**: Login/Register via Email, Google, and Facebook
- **JWT Token Management**: Access token, refresh token, and automatic token refresh
- **Role-Based Access Control (RBAC)**: Granular permissions using CASL
- **Protected Routes**: AuthGuard, GuestGuard, and AclGuard components
- **Password Management**: Forgot password and reset password functionality

### Product Management

- **Products**: Create, view, update, and delete products
- **Product Types/Categories**: Manage product categories
- **Comments**: Moderate product comments and reviews

### Order Management

- **Orders**: View and manage customer orders
- **Reviews**: Manage product reviews and ratings
- **Payment Integration**: VNPay payment gateway support

### User & System Management

- **User Management**: CRUD operations for users
- **Role Management**: Create and assign roles with specific permissions
- **Dashboard**: Analytics and reporting

### Settings

- **City Management**: Manage delivery locations
- **Delivery Types**: Configure shipping methods
- **Payment Types**: Configure payment methods

### UI/UX Features

- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Theme switching support
- **Internationalization (i18n)**: Multi-language support (English, Vietnamese)
- **Toast Notifications**: User feedback with react-hot-toast
- **Data Grid**: Advanced data tables with MUI X Data Grid
- **Rich Text Editor**: WYSIWYG editor with react-draft-wysiwyg
- **File Upload**: Drag and drop file uploads with react-dropzone
- **Carousel**: Image carousels with react-multi-carousel

### Real-time Features

- **Socket.io Integration**: Real-time updates
- **Firebase Cloud Messaging**: Push notifications
- **Chat Bot AI**: AI-powered chat assistance

## 🛠️ Tech Stack

| Category                 | Technologies                          |
| ------------------------ | ------------------------------------- |
| **Framework**            | Next.js 14 (Pages Router)             |
| **Language**             | TypeScript                            |
| **UI Library**           | Material-UI (MUI) v5                  |
| **State Management**     | Redux Toolkit, React-Redux            |
| **Form Handling**        | React Hook Form, Yup validation       |
| **Authentication**       | NextAuth.js, JWT                      |
| **Authorization**        | CASL (Attribute-Based Access Control) |
| **HTTP Client**          | Axios                                 |
| **Styling**              | SCSS, Styled Components, Emotion      |
| **Internationalization** | i18next, react-i18next                |
| **Charts**               | Chart.js, ApexCharts                  |
| **Rich Text Editor**     | Draft.js, react-draft-wysiwyg         |
| **Real-time**            | Socket.io Client                      |
| **Push Notifications**   | Firebase Cloud Messaging              |
| **Icons**                | Iconify                               |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── acl/            # Access control components
│   ├── auth/           # Authentication guards
│   ├── custom-*/       # Custom UI components (DataGrid, Modal, etc.)
│   └── ...
├── configs/            # Application configurations
│   ├── acl.ts          # ACL configuration
│   ├── api.ts          # API endpoints
│   ├── auth.ts         # Auth settings
│   ├── permissions.ts  # Permission definitions
│   ├── route.ts        # Route configuration
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication context
│   └── SettingsContext.tsx
├── helpers/            # Utility helpers
│   ├── axios/          # Axios interceptors
│   ├── socket/         # Socket.io helpers
│   └── storage/        # Local storage helpers
├── hooks/              # Custom React hooks
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard page
│   ├── manage-order/   # Order management
│   ├── manage-product/ # Product management
│   ├── settings/       # Settings pages
│   ├── system/         # User & role management
│   └── ...
├── services/           # API service functions
├── stores/             # Redux store slices
├── styles/             # Global styles
├── theme/              # MUI theme configuration
├── types/              # TypeScript type definitions
└── views/              # Page view components
    └── layout/         # Layout components
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd template
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```env
NEXT_PUBLIC_API_HOST=your_api_host
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Firebase (optional - for push notifications)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📝 Available Scripts

| Command            | Description               |
| ------------------ | ------------------------- |
| `npm run dev`      | Start development server  |
| `npm run build`    | Build for production      |
| `npm run start`    | Start production server   |
| `npm run lint`     | Run ESLint                |
| `npm run lint:fix` | Fix ESLint errors         |
| `npm run format`   | Format code with Prettier |

## 🔐 Permission System

The application uses a hierarchical permission system:

```typescript
PERMISSIONS = {
  ADMIN: 'ADMIN.GRANTED',
  BASIC: 'BASIC.PUBLIC',
  DASHBOARD: 'DASHBOARD',
  MANAGE_PRODUCT: {
    PRODUCT: { CREATE, VIEW, UPDATE, DELETE },
    PRODUCT_TYPE: { CREATE, UPDATE, DELETE },
    COMMENT: { UPDATE, DELETE }
  },
  SYSTEM: {
    USER: { VIEW, CREATE, UPDATE, DELETE },
    ROLE: { VIEW, CREATE, UPDATE, DELETE }
  },
  MANAGE_ORDER: {
    REVIEW: { UPDATE, DELETE },
    ORDER: { VIEW, UPDATE, DELETE }
  },
  SETTING: {
    PAYMENT_TYPE: { CREATE, UPDATE, DELETE },
    DELIVERY_TYPE: { CREATE, UPDATE, DELETE },
    CITY: { CREATE, UPDATE, DELETE }
  }
}
```

## 🌐 API Endpoints

The template is configured to work with a RESTful API backend:

- **Auth**: `/api/auth/*` - Authentication endpoints
- **Users**: `/api/users` - User management
- **Roles**: `/api/roles` - Role management
- **Products**: `/api/products` - Product CRUD
- **Product Types**: `/api/product-types` - Category management
- **Orders**: `/api/orders` - Order management
- **Reviews**: `/api/reviews` - Review management
- **Settings**: `/api/city`, `/api/delivery-type`, `/api/payment-type`
- **Notifications**: `/api/notifications` - Push notifications
- **Payment**: `/api/payment/vnpay` - VNPay integration

## 🎨 Theme Configuration

Customize the theme in [`src/configs/themeConfig.ts`](src/configs/themeConfig.ts):

```typescript
const themeConfig = {
  templateName: 'Your App Name',
  layout: 'vertical' | 'horizontal',
  mode: 'light' | 'dark',
  direction: 'ltr' | 'rtl',
  skin: 'default' | 'bordered',
  contentWidth: 'full' | 'boxed'
  // ... more options
}
```

## 🌍 Internationalization

Language files are located in `public/locales/`:

- `en.json` - English
- `vi.json` - Vietnamese

Add new languages by creating additional JSON files and updating the i18n configuration.

## 📦 Key Dependencies

- **@mui/material** v5.14.20 - Material-UI components
- **@reduxjs/toolkit** v2.0.1 - State management
- **next** v14.0.4 - React framework
- **next-auth** v4.24.7 - Authentication
- **@casl/react** v3.1.0 - Authorization
- **axios** v1.6.2 - HTTP client
- **react-hook-form** v7.49.2 - Form handling
- **yup** v1.3.3 - Validation
- **socket.io-client** v4.8.0 - Real-time communication
- **firebase** v10.14.0 - Push notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For support, please contact the development team.
