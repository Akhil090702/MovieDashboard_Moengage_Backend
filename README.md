
---

# 📄 Backend README (MovieDashboard_Moengage_Backend)

```markdown
# 🎬 MovieFlix Dashboard – Backend

This is the **backend** of MovieFlix, a Node.js + Express.js API server.  
It handles fetching movies from the OMDb API, caching results in MongoDB, and serving them to the frontend for faster performance.

---

## 🌐 Live Link

- **Backend API (Render):** [MovieFlix Backend](https://moviedashboard-moengage-backend.onrender.com)  

---

## 📂 GitHub Repository

- **Backend Repo:** [MovieFlix Backend GitHub](https://github.com/Akhil090702/MovieDashboard_Moengage_Backend.git)  

---

## 🚀 Features

- ⚡ Fetch movies from OMDb API  
- 🗂️ Caching of results in MongoDB for faster access  
- 📑 Supports pagination (10 results per page)  
- 📊 Provides data for movie analytics (genres, ratings, runtimes)  

---

## 🛠️ Tech Stack

- **Node.js**  
- **Express.js**  
- **MongoDB (Mongoose)**  
- **Axios**   

---

## 📦 Installation & Setup

# Clone the repo:

   ```bash
   git clone https://github.com/Akhil090702/MovieDashboard_Moengage_Backend.git
   cd MovieDashboard_Moengage_Backend

# Install dependencies
npm install

# Create a .env file in the root directory
PORT=5000
OMDB_API_KEY=your_omdb_api_key
MONGO_URI=mongodb://localhost:27017/moviedb

# Start the backend server
npm run dev
