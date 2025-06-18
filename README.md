# PollyconnectHub

A full-stack platform for managing college projects, users, and collaboration, featuring a React frontend and a Node.js/Express backend.

## Project Structure

```
PollyconnectHub_Backend/   # Node.js/Express backend
PollyconnectHub_Frontend/  # React frontend
chatbot/                   # Chatbot scripts and data
chroma_db/                 # Vector DB for chatbot
```

---

## Backend (`PollyconnectHub_Backend`)

### Features

- RESTful API for authentication, projects, colleges, departments, and more
- Image upload support (Cloudinary)
- MongoDB database
- JWT authentication

### Setup

1. **Install dependencies:**
   ```sh
   cd PollyconnectHub_Backend
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in your MongoDB URI, JWT key, and Cloudinary credentials.

3. **Run the server:**
   ```sh
   npm start
   ```
   The server runs on [http://localhost:8000](http://localhost:8000).

---

## Frontend (`PollyconnectHub_Frontend`)

### Features

- React + Vite + Tailwind CSS
- Student and POC dashboards
- Project management UI
- College info management

### Setup

1. **Install dependencies:**
   ```sh
   cd PollyconnectHub_Frontend
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env` and set `VITE_BACKEND_API` to your backend URL (e.g., `http://localhost:8000`).

3. **Run the frontend:**
   ```sh
   npm run dev
   ```
   The app runs on [http://localhost:5173](http://localhost:5173) by default.

---

## Chatbot

- Python-based chatbot in `chatbot/`
- Uses `chroma_db/` for vector storage

### Setup

1. **Install dependencies:**
   ```sh
   cd chatbot
   pip install -r requirements.txt
   ```

2. **Run the bot:**
   ```sh
   python bot.py
   ```

---

## Environment Variables

- See `.env.example` files in both backend and frontend for required variables.

---

## License

MIT

---

## Authors

- [Shivraj Kolwankar](https://github.com/shivraj0124)
- [Yash Mulik](https://github.com/YashMulik2005)
- [Yash Aghane](https://github.com/yashaghane21)
- [Vedant Shetye](https://github.com/NOOBPOOK)
