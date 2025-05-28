# Book Shelf - Next.js Application

A full-featured web application for managing your book collection, built with Next.js, Redux Toolkit, RTK Query, and Tailwind CSS.

## 🚀 Features

- 🏠 **Home Page** - Search and browse books with advanced filtering
- 📖 **Book Details** - Detailed book information with recommendations
- 👤 **User Profile** - View and edit user profile with favorite books
- ✏️ **Profile Editing** - Update user information and password
- 🔐 **Authentication** - Sign in modal and registration page
- 🔄 **Password Reset** - Secure password recovery system
- ❤️ **Favorites System** - Add/remove books from favorites
- 🎨 **Smooth Animations** - Enhanced user experience with CSS animations
- 📱 **Responsive Design** - Works perfectly on all devices

## 🛠 Technologies

- **Next.js 15** with App Router
- **JavaScript** (ES6+)
- **Redux Toolkit** + **RTK Query** for state management and API calls
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Docker** for containerization

## 📦 Installation and Setup

### Local Development

1. **Clone the repository:**<br>
```
git clone https://github.com/SobutskyiBohdan/Hackathon-WebSite

cd Hackathon-WebSite
```
2. **Install dependencies:**
```
npm install
```

3. **Set up environment variables:**
```
cp .env.example .env.local
```

Edit `.env.local` and set your backend API URL:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

4. **Run in development mode:**
```
npm run dev
```

The application will be available at: http://localhost:3000

5. **Build for production:**
```bash
npm run build
npm start
```

## 🔌 API Integration

The application expects the following API endpoints from your backend:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/reset-password` - Password reset

### Books
- `GET /api/books` - Get books list with search and filtering
- `GET /api/books/:id` - Get book details
- `GET /api/books/:id/recommended` - Get recommended books

### Favorites
- `GET /api/favorites` - Get user's favorite books
- `POST /api/favorites/:id` - Add book to favorites
- `DELETE /api/favorites/:id` - Remove book from favorites

## 📊 API Response Formats

### Book Object
```javascript
{
  id: "string",
  title: "string",
  author: "string",
  year: "string",
  price: "string",
  image: "string",
  description: "string", // optional
  rating: "number", // optional
  inStock: "number" // optional
}
```

### Books List Response
```javascript
{
  books: [Book],
  total: "number",
  page: "number",
  limit: "number"
}
```

### Authentication Response
```javascript
{
  user: {
    id: "string",
    username: "string",
    email: "string"
  },
  token: "string"
}
```

## 🏗 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── signup/        # Registration page
│   │   └── reset-password/ # Password reset page
│   ├── books/             # Book pages
│   │   └── [id]/          # Book details page
│   ├── profile/           # User profile page
│   ├── layout.jsx         # Root layout
│   └── page.jsx           # Home page
├── components/            # React components
│   ├── book-card.jsx      # Book card component
│   ├── breadcrumb.jsx     # Breadcrumb navigation
│   ├── header.jsx         # Site header
│   ├── modal.jsx          # Modal component
│   ├── providers.jsx      # Redux provider
│   └── signin-modal.jsx   # Sign in modal
├── lib/                   # Utilities and configuration
│   ├── api/              # RTK Query API slices
│   │   ├── authApi.js     # Authentication API
│   │   └── booksApi.js    # Books API
│   ├── slices/           # Redux slices
│   │   ├── authSlice.js   # Authentication state
│   │   └── favoritesSlice.js # Favorites state
│   ├── hooks.js          # Custom hooks
│   └── store.js          # Redux store
├── public/               # Static files
└── styles/               # Global styles
```

## 🎨 Design Features

- **Cream color scheme** matching the original design
- **Smooth animations** on page load and interactions
- **Modal-based sign in** for better UX
- **Hover effects** on cards and buttons
- **Responsive grid layouts**
- **Custom shadows and gradients**

## ⚙️ Backend Configuration

Ensure your backend:

1. **Supports CORS** for your frontend domain
2. **Uses JWT tokens** for authentication
3. **Returns data in the correct format** (see API Response Formats above)
4. **Handles errors** and returns appropriate HTTP status codes
5. **Supports search parameters** for book filtering

## 🚀 Development

### Adding New API Endpoints

1. Edit the appropriate file in `lib/api/`
2. Add new JavaScript object types as needed
3. Use the generated hooks in components

### Adding New Pages

1. Create a new `page.jsx` file in the `app/` directory
2. Add navigation in `components/header.jsx`
3. Update breadcrumbs if needed

### Customizing Animations

Edit the CSS animations in `app/globals.css`:
- `animate-fade-in` - Fade in with slide up
- `animate-slide-in` - Slide in from left
- `animate-scale-in` - Scale in effect

## 🐛 Troubleshooting

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running and accessible
- Verify CORS settings on backend

### Docker Issues
- Ensure port 3000 is not in use
- Check environment variables in container
- Verify Docker daemon is running

### Authentication Issues
- Check JWT token format
- Verify API endpoints are correct
- Ensure proper error handling

## 📝 License

<a href="./LICENSE">MIT License</a>

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Create an issue in the repository
