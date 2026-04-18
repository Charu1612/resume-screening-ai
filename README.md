# SkillSync – Resume Screening & Skill Matching System

A full‑stack web application that uses AI to analyze resumes, match them with job descriptions, and generate ATS compatibility scores—helping candidates improve applications and companies screen better.

---

## 🚀 Features

### 👩‍💼 For Candidates

* **ATS Resume Checker** – Compatibility score vs. job descriptions
* **Job Matching** – Browse jobs with match percentages
* **Skill Analysis** – Missing skills + improvement recommendations
* **Application Tracking** – Status tracking for applied jobs
* **Profile Management** – Manage resume & professional profile

### 🏢 For Companies

* **Job Posting** – Create and manage job listings
* **Application Management** – Review applicants with match scores
* **Candidate Screening** – Detailed resume & profile views
* **Dashboard Analytics** – Application stats & insights

---

## 🛠 Tech Stack

### Frontend

* React 18 (Hooks)
* Vite
* Tailwind CSS
* React Router
* Axios
* Lucide React

### Backend

* Python Flask (REST API)
* MongoDB
* JWT Authentication
* PyPDF2, python‑docx
* NLTK, spaCy
* scikit‑learn

---

## 📋 Prerequisites

* Node.js >= 16
* Python >= 3.8
* MongoDB >= 4.4
* Git

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/resume-screening-ai.git
cd resume-screening-ai
```

### 2️⃣ Frontend Setup

```bash
cd client
npm install
```

### 3️⃣ Backend Setup

```bash
cd ../server
pip install -r requirements.txt
```

### 4️⃣ Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with MongoDB URI, JWT secret, etc.

### 5️⃣ Database Setup

Ensure MongoDB is running locally or remotely. Collections are auto‑created.

### 6️⃣ NLP Models (Optional but Recommended)

```bash
python -m spacy download en_core_web_sm
python -m nltk.downloader punkt stopwords
```

---

## ▶️ Running the Application

### Backend

```bash
cd server
python app.py
```

Runs on **[http://localhost:5000](http://localhost:5000)**

### Frontend

```bash
cd client
npm run dev
```

Runs on **[http://localhost:5173](http://localhost:5173)**

---

## 📁 Project Structure

```
resume-screening-ai/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── candidate/
│   │   │   └── company/
│   │   ├── routes/
│   │   └── ...
│   └── package.json
├── server/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.py
│   ├── config.py
│   └── requirements.txt
└── README.md
```

---

## 📊 ATS Scoring Logic

| Factor               | Weight |
| -------------------- | ------ |
| Skill Matching       | 40%    |
| Keyword Density      | 20%    |
| Experience Relevance | 20%    |
| Education Match      | 10%    |
| Resume Structure     | 10%    |

---

## 🔐 Authentication

* JWT‑based authentication
* Role‑based access (Candidate / Company)
* Protected APIs & routes
* bcrypt password hashing

---

## 🔌 API Endpoints

### Auth

* POST `/api/auth/signup`
* POST `/api/auth/login`
* GET `/api/auth/profile`
* PUT `/api/auth/profile`

### Jobs

* GET `/api/jobs`
* POST `/api/jobs`
* GET `/api/jobs/company`
* PUT `/api/jobs/:id`
* DELETE `/api/jobs/:id`

### Resume

* POST `/api/resume/upload`
* POST `/api/resume/analyze`
* GET `/api/resume/ats-score/:jobId`
* GET `/api/resume/skill-analysis/:jobId`

### Applications

* POST `/api/applications`
* GET `/api/applications/candidate`
* GET `/api/applications/company`
* PUT `/api/applications/:id/status`

---

## 🖼️ Screenshots

Create a `screenshots/` folder in the root of your repository:

```
resume-screening-ai/
└── screenshots/
    ├── SignUp.png
    ├── dashboard.png
    ├── resume-analysis.png
    ├── job-matching.png
    └── company-dashboard.png
```

### 🔐 Authentication

<img width="1255" height="873" alt="image" src="https://github.com/user-attachments/assets/11128e86-250e-4fc7-8036-a2de4e6edfba" />


### 👩‍💼 Candidate Dashboard

<img width="1907" height="909" alt="image" src="https://github.com/user-attachments/assets/2bb87721-3a28-4070-9fdb-6f44ce31f391" />


### 📄 Resume ATS Analysis

<img width="1900" height="909" alt="image" src="https://github.com/user-attachments/assets/4828fee3-8278-4f0b-a149-86851c8b04e4" />


### 🏢 Company Dashboard

<img width="1877" height="898" alt="image" src="https://github.com/user-attachments/assets/a6550f5e-0f3f-436f-aa20-4af799a277d4" />


### 🔍 Job Matching

<img width="1906" height="910" alt="image" src="https://github.com/user-attachments/assets/f792070e-14b7-41bd-8027-6ea6da2f25a9" />



### Vedio Link
https://youtu.be/ojSbkayNNE8?si=VgNRNOmRbYhVRBGx
---


## 🔮 Future Enhancements

* AI resume rewriting suggestions
* LinkedIn & job‑board integrations
* Advanced analytics & reporting
* Email notifications
* Bulk resume uploads
* ML model fine‑tuning
* Multi‑language support

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Push branch
5. Open a Pull Request

---

## 📄 License

MIT License – see `LICENSE` file.

---

## 🆘 Support

* Check GitHub issues
* Open a new issue with details

---

## 🙏 Acknowledgments

* Open‑source community
* NLP & ML libraries
* Contributors & testers

---

**SkillSync** – Revolutionizing recruitment with AI‑powered resume intelligence 🚀
