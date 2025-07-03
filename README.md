
# 🛍️ FlockShop - Collaborative Wishlist App

FlockShop is a full-stack web application that allows users to create, manage, and share wishlists with others. It supports role-based collaboration so users can invite others as viewers or editors, and allows adding products manually or from a dummy product API.

---

## 🎥 Project Demo

🔗 **[Click to watch the video demo](https://drive.google.com/file/d/1bzFEHjMuP4sZrqG0fzie4U8htuOsGqii/view?usp=sharing)**

---

## 🧰 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React, Bootstrap, Firebase Auth     |
| Backend    | Java, Spring Boot, Firebase Firestore |
| Database   | Firebase Firestore (NoSQL)          |
| Auth       | Firebase Authentication             |
| Hosting    | Localhost (ready for Vercel/Render) |

---

## 📂 Folder Structure

```
FlockshopAi-Wishlist-/
├── wishlist-frontend/    # React app (Firebase Auth, Bootstrap UI)
├── wishlist-backend/     # Spring Boot app (REST APIs, Firebase Firestore)
└── .gitignore            # Ignores node_modules, .env, target, secrets
```

---

## ✅ Prerequisites

Before running the app, ensure you have:

- ✅ Node.js (v16+)
- ✅ Java 17+
- ✅ Maven
- ✅ Firebase Project (Firestore + Auth)
- ✅ Firebase Admin SDK service account key JSON

---

## 🚀 Running the App

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Vinay-Daripelly/FlockshopAi-Wishlist-.git
cd FlockshopAi-Wishlist-
```

---

### 2️⃣ Setup Firebase Admin Key

- Download your Firebase service account key from Firebase Console
- Place it in the backend folder:

```bash
wishlist-backend/src/main/resources/serviceAccountKey.json
```

✅ Make sure this file is NOT committed (it's excluded by .gitignore)

---

### 3️⃣ Run the Backend (Spring Boot)

```bash
cd wishlist-backend
mvn clean install
mvn spring-boot:run
```

📡 Your backend server should now be running at: `http://localhost:8090`

---

### 4️⃣ Run the Frontend (React App)

Open a new terminal window and run:

```bash
cd wishlist-frontend
npm install
npm start
```

🌐 React app will open at: `http://localhost:3000`

---

### 5️⃣ Sign Up & Test

- Visit the frontend in your browser
- Sign up or log in with Firebase Authentication
- Create wishlists, invite collaborators, add items

---

## 👥 Collaborator Roles

| Role    | Permissions                        |
|---------|------------------------------------|
| Owner   | Full control (edit/share/delete)   |
| Editor  | Add or remove items                |
| Viewer  | View-only access                   |

---

## 📦 Features

- 🔐 Firebase Auth (Signup/Login)
- 📝 Create multiple wishlists
- 🧑‍🤝‍🧑 Invite collaborators (Owner, Editor, Viewer)
- 🛒 Add products manually or from FakeStore API
- 🖼️ Hover animations + Bootstrap UI
- 🔒 Role-based access enforcement
- 🧼 Firestore integration with clean backend APIs

---

## 📎 Downloadable Assets

- 📁 Backend: `/wishlist-backend`
- 📁 Frontend: `/wishlist-frontend`
- 🔒 Keep `serviceAccountKey.json` private (excluded by `.gitignore`)

---

## 🙋‍♂️ Author

**Vinay Daripelly**  
📧 daripellyvinay@gmail.com  
🔗 [GitHub Profile](https://github.com/Vinay-Daripelly)

---

## 🌟 Show Your Support

If you liked this project, consider giving it a ⭐️ on GitHub and sharing it with others!
