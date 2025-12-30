# BeyondChats – Backend Assignment (Phase 1)

Backend implementation for the **BeyondChats Internship Assignment**.  
This project focuses on building a clean, scalable backend foundation with proper database integration, modular architecture, and preparation for data scraping workflows.

---

## 🚀 Objective

The goal of this assignment is to demonstrate:
- Strong backend fundamentals
- Clean project structuring
- Secure database connectivity
- Readable, maintainable code
- Readiness for real-world feature expansion

This repository covers **Phase 1**, which focuses on backend setup and groundwork for scraping and API development.

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **dotenv**
- **Git & GitHub**

---

## 📂 Project Structure

```text
beyondchats-backend/
│── src/
│   ├── models/        # Mongoose schemas and database models
│   ├── routes/        # API route definitions
│   ├── controllers/   # Request–response handling logic
│   ├── services/      # Core business logic
│   ├── scripts/       # Scraping and utility scripts
│   └── app.js         # Express app configuration
│
├── .env               # Environment variables
├── server.js          # Application entry point
├── .gitignore
└── README.md

Here’s a **short, reviewer-friendly version** of your `README.md`.
It’s concise, clean, and easy to scan in under a minute.

You can **copy-paste this directly**.

---

## ⚙️ Setup Instructions

### Clone the repository
```bash
git clone https://github.com/<your-username>/beyondchats-backend.git
cd beyondchats-backend
````

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@canary.fobr15o.mongodb.net/canary
```

### Start the server

```bash
npm start
```

---

## 🔌 Database

* MongoDB Atlas with Mongoose
* Database name: `canary`
* IP whitelist: `0.0.0.0/0`

Test connection:

```bash
mongosh "mongodb+srv://<username>:<password>@canary.fobr15o.mongodb.net/canary"
```

---

## 📡 Backend Scope (Phase 1)

* Structured Express backend
* Modular architecture (routes, controllers, services, models)
* Secure database integration
* Ready for API expansion and scraping logic

Example endpoints (planned):

```text
GET  /api/health
POST /api/data
```

---

## 🕷️ Scraping Design (Phase 1)

* Scraping scripts isolated in `src/scripts/`
* Data validation and processing via services
* Clean separation between scraping, storage, and APIs

---

## 📌 Status

* ✅ Phase 1: Backend setup & DB connectivity
* ⏳ Phase 2: Scraping logic
* ⏳ Phase 3: API expansion

---

## 👩‍💻 Author

**Ritu Mathad**

---

## 📜 Disclaimer

Created as part of the BeyondChats internship evaluation.

```
