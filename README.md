# SmartBrain - AI Face Detection Application

A full-stack web application that allows users to submit image URLs, detects human faces in the images, draws responsive bounding boxes around them, and tracks user search ranks.

This application is modernized to use **Hugging Face's serverless inference API** for face detection and a serverless **Neon PostgreSQL** database.

---

## 🚀 Key Features

*   **Multi-Face Detection**: Detects and highlights multiple faces simultaneously in any image using Hugging Face's vision transformer model (`detr-resnet-50`).
*   **User Ranks**: Keeps track of user query entries using a PostgreSQL database.
*   **Secure Authentication**: Secure register and sign-in functionality with hashed passwords powered by `bcryptjs`.
*   **Responsive UI**: Sleek, interactive frontend utilizing custom React components and particle background animations (`particles-bg`).
*   **Automatic Database Schema Initialization**: The server automatically initializes its database tables on boot.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React.js
*   **Styling**: Vanilla CSS + Tachyons (functional CSS library)
*   **Animations**: `particles-bg`

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database Client**: Knex.js
*   **Security**: `bcryptjs` for passwords, `dotenv` for secrets management

### Database & AI
*   **Database**: Neon Serverless PostgreSQL
*   **AI Engine**: Hugging Face Inference API (`facebook/detr-resnet-50` model)

---

## 📂 Project Structure

```text
SmartBrain-AI-Face-Detection-Application/
├── frontend/             # React application
│   ├── public/
│   └── src/              # React components & main App logic
├── backend/              # Node.js / Express API
│   ├── controllers/      # Route controllers (image, signin, register)
│   ├── server.js         # Server entrypoint and DB setup
│   └── schema.sql        # Reference SQL schema
├── .gitignore            # Git exclusions (ignores .env and node_modules)
└── README.md             # Project documentation (this file)
```

---

## ⚙️ Local Setup Instructions

### 1. Database Setup
*   Sign up for a free PostgreSQL database at [Neon](https://neon.tech/) or [Supabase](https://supabase.com/).
*   Create a project and copy the PostgreSQL connection URI.

### 2. Hugging Face Setup
*   Create an account at [Hugging Face](https://huggingface.co/).
*   Go to **Settings > Access Tokens** and generate a token with **"Make calls to Inference Providers"** permission.

### 3. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory based on the `.env.example` template:
    ```env
    PORT=3000
    DATABASE_URL=postgres://your_neon_db_url
    HF_TOKEN=hf_your_hugging_face_token
    ```
4.  Start the backend server:
    ```bash
    npm run dev
    ```
    *(The backend will start on port 3000 and automatically build your database tables!)*

### 4. Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React app:
    ```bash
    npm start
    ```
4.  Open `http://localhost:3001` in your browser. Register, log in, and test face detection!

---

## ☁️ Deployment Guide

### Backend (Render / Railway)
1.  Push this repository to GitHub.
2.  Deploy the `backend` subdirectory as a **Web Service**.
3.  Set the start command to `node server.js` (defined in `package.json`).
4.  Configure the environment variables (`DATABASE_URL`, `HF_TOKEN`) on your hosting platform dashboard.

### Frontend (Vercel / Netlify)
1.  Update the fetch URLs in the frontend (`src/App.js`, `src/components/Signin/Signin.js`, `src/components/Register/Register.js`) to point to your live deployed backend URL instead of `http://localhost:3000`.
2.  Deploy the `frontend` subdirectory as a static site.
