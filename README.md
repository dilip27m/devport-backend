# 🚀 DevPort — Dynamic Portfolio Builder for Developers

DevPort is built to go far beyond a traditional, static résumé. Instead of limiting your achievements to a single page, DevPort transforms your entire professional journey into a dynamic, interactive, and personalized portfolio—specially crafted for Computer Science Engineering students.

With DevPort, you can:

- Showcase your projects, skills, achievements, and experience in an engaging, modern format.  
- Store and manage all your career data in one place, update it effortlessly, and customize your portfolio style.  
- Deploy your portfolio instantly and share a professional link across platforms like LinkedIn, GitHub, LeetCode, CodeChef, Hackathons, and even your résumé.  
- Stand out from your peers with a portfolio that reflects your work, growth, and identity—much more effectively than any static PDF.  

DevPort empowers students to present themselves with clarity, creativity, and confidence, helping them reach the right opportunities and make a strong impact in the tech community.

---

## ✨ Features

### 🔹 Core User Features
- **User Signup & Login** (email or username based)  
- **Complete Account Management** — update password, delete account  
- **Real-Time Live Editor** with instant preview  
- **Private Preview Mode** (only the owner can see unpublished versions)  
- **View & Select Portfolio Templates**  
- **Multiple Portfolio Templates** designed for developers  
- **Auto-Generated Public Portfolio Link** at `/p/[username]`  
- **Upload résumé, certificates, images** using Cloudinary  
- **Store all portfolio data in clean JSON format**  
- **Edit/Update your portfolio anytime**  
- **Secure public portfolio rendering**

### 🔹 Developer & System Features
- **Dynamic template loader** (scalable architecture)  
- **Cloudinary direct uploads**  
- **JWT-based authentication**  
- **MongoDB Atlas database**  
- **Next.js App Router + Express.js API**  
- **Responsive UI built with Tailwind CSS**  

---

## 🛠️ Technology Stack

### **Frontend**
- Next.js 14+ (App Router)  
- Tailwind CSS  
- lucide-react / react-icons  
- Context API for global state (AuthContext)

### **Backend**
- Express.js  
- MongoDB Atlas  
- Cloudinary SDK  
- JWT Authentication  
- Nodemailer (Gmail SMTP)

---

## 🔗 Repository Links

- **Frontend Repository:**  
  [https://github.com/dilip27m/devport-frontend](https://github.com/dilip27m/devport-frontend)

- **Backend Repository:**  
  [https://github.com/dilip27m/devport-backend](https://github.com/dilip27m/devport-backend)

---

## ⚙️ Frontend Setup (Next.js)

### 📦 Prerequisites
- Node.js v18+  
- npm or yarn  

### 📥 Clone & Install

```bash
git clone https://github.com/dilip27m/devport-frontend
cd devport-frontend
npm install
```

### 🔐 Environment Variables

Create `.env.local`:

```bash
cp .env.example .env.local
```

Inside `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### ▶️ Run Development Server

```bash
npm run dev
```

App runs at: 👉 [http://localhost:3000](http://localhost:3000)

---

## 🖥️ Backend Setup (Express.js)

### 📦 Clone & Install

```bash
git clone https://github.com/dilip27m/devport-backend
cd devport-backend
npm install
```

### 🔐 Environment Variables

Create `.env`:

```env
PORT=5000
MONGO_URI=your-mongodb-uri-here
JWT_SECRET=choose-a-secret-key

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=http://localhost:3000

GMAIL_USER=
GMAIL_APP_PASSWORD=
```

**Note:** Make sure to replace `MONGO_URI` with your real MongoDB connection string and set a secure `JWT_SECRET`.

### ▶️ Run Backend Server

```bash
npm run dev
```

---

## 📁 Folder Structure (Frontend)

```
src/
 ├── app/(main)/         → Main pages: "/", "/login", "/editor", "/profile"
 ├── app/p/[username]/   → Public portfolio routes
 ├── app/preview/        → Private preview
 ├── app/templates/      → Portfolio templates
 ├── context/            → Auth Context
 └── hooks/              → useCloudinaryUpload and other hooks
```

---

##  Screenshots & Preview

*(Add real images later)*

-  Landing Page
-  Editor Page
-  Templates Page
-  Profile Page
-  Deployed Portfolio Page

---

##  Future Scope

- More customizable templates
- AI-generated portfolio summaries
- Custom domain support
- SEO meta customization
- Analytics dashboard
- Dark/light mode templates
- Admin dashboard for managing users, templates, reports, and platform operations
- **One-to-one premium template creation**
  - Users can request a custom portfolio
  - A developer/designer builds it according to their needs
  - Payment processed like a freelancing workflow
- More fields and sections for deeper personalization
- **Template Marketplace**
  - Developers can create and sell their own premium templates
  - Users can purchase templates built by other creators
- **Community template builder**
  - Space where users can create, publish, customize, and sell templates

---

## 🤝 Contributing

Contributions, feature requests, and issues are welcome!  
Feel free to open a PR or start a discussion.

---

## 📄 License

This project is licensed under the MIT License.