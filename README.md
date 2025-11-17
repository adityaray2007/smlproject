# 🛡️ Intrusion Detection System (IDS)

A machine-learning powered **Intrusion Detection System (IDS)** capable of detecting malicious network activity such as DoS, Probe, R2L, U2R, and unknown attack variants.  
The project combines **supervised ML models + anomaly detection** and provides a modern **Next.js dashboard** for visualization.

---

## 🚀 Features
- 🔥 Real-time intrusion prediction (single & batch CSV)  
- 🧠 7 supervised ML models + 3 anomaly detectors  
- 📊 Interactive Next.js dashboard  
- 🌈 SHAP explainability support  
- 🗂 FastAPI backend for inference  
- 🛡 Hybrid ensemble decision logic  
- 📁 Clean preprocessing & feature engineering pipeline  

---

## 🧠 Machine Learning Models Used

### Supervised Models
- XGBoost  
- Random Forest  
- SVM  
- Logistic Regression  
- Naive Bayes  
- KNN  
- Decision Tree  

### Anomaly Detectors
- Isolation Forest  
- One-Class SVM  
- Autoencoder  

### Additional Techniques
- PCA  
- Feature Selection  
- Data Preprocessing  
- Train–Test Split  
- Evaluation Metrics (Precision, Recall, F1, ROC-AUC)

---

## 📦 Project Architecture
```
project/
├── backend/
│   ├── api/ (FastAPI endpoints)
│   ├── models/ (generated .pkl files go here)
│   ├── dataset/ (NSL-KDD files + notebook)
│   └── training_notebook.ipynb
└── ml-frontend/ (Next.js + Tailwind dashboard)
```

---

## 🧩 Ensemble Decision Logic (How Predictions Work)

Our Intrusion Detection System uses a **hybrid ensemble**, combining:

### ✅ 7 Supervised ML Models  
(XGBoost, RandomForest, SVM, Logistic Regression, Naive Bayes, KNN, Decision Tree)

### ✅ 3 Anomaly Detectors  
(Isolation Forest, One-Class SVM, Autoencoder)

This method balances **high accuracy for known attacks** with **strong generalization for unknown threats**.

---

### 🔬 How the Ensemble Works — Step by Step

#### 1️⃣ Step 1 — Individual Model Predictions
Each of the 7 supervised models predicts:
- `Normal` OR  
- `Attack` (and possibly attack class)  

Each model also outputs probability/confidence scores.

#### 2️⃣ Step 2 — Majority Voting (Supervised Models)
We take the predictions from all supervised models.

Example:  
```
Normal  → 4 models  
Attack  → 3 models  
```

This results in a supervised majority of `Normal`.

#### 3️⃣ Step 3 — Anomaly Detector Influence
The 3 anomaly detectors generate:
- Reconstruction error (Autoencoder)  
- Anomaly score (Isolation Forest)  
- Outlier decision (One-Class SVM)  

If **any anomaly detector returns a strong anomaly score**, or a majority of them flag, the ensemble raises suspicion.

#### 4️⃣ Step 4 — Hybrid Rule-Based Override
We combine both results:

- **Clear supervised majority** (6–1 or 7–0): final = supervised majority.  
- **Weak supervised margin** (4–3): if anomaly detectors flag → override to Attack; else keep supervised result.  
- **Tie or no clear majority**: decision leans on anomaly detectors.

#### 5️⃣ Step 5 — Attack Type Selection
If the final label is `Attack`, the system selects the most likely attack type using:
- Weighted probabilities (favoring XGBoost and RandomForest)  
- Consensus among high-confidence models

This yields output like:
```
final_label: 1
attack_type: DoS
confidence: 0.94
```

---

### 🎯 Why This Ensemble Is Strong
- Detects both **known** and **unknown** attacks  
- Reduces false positives via model consensus  
- Anomaly detectors capture novel/zero-day behavior  
- Balances interpretability (trees, logistic) and power (XGBoost, autoencoder)

---

## ⚠️ Model Files Not Included (Important)

GitHub blocks files larger than **100 MB**, and several trained `.pkl` models exceed this limit.  
Therefore, **trained ML model files are not included in this repository**.

However, the repository **contains**:
- The **NSL-KDD dataset folder** (or instructions to download it)  
- The **training notebook** used to produce models  
- All preprocessing and training code

### 🛠 How to Regenerate the `.pkl` Files on Your Machine

1. Clone the repository:
```bash
git clone https://github.com/adityaray2007/smlproject.git
cd smlproject
```

2. Find and open the training notebook (example):
```
backend/training_notebook.ipynb
```

3. Run the notebook end-to-end. It will:
- Load & preprocess NSL-KDD  
- Train supervised & anomaly models  
- Save models to:
```
backend/models/supervised/
backend/models/anomaly/
backend/models/preprocessor.pkl
```

4. Once models are generated, start the backend.

---

## ▶️ Running the Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
uvicorn api.main:app --reload
```

Backend available at:
```
http://localhost:8000
```

---

## 🌐 Running the Frontend (Next.js)

```bash
cd ml-frontend
npm install
npm run dev
```

Frontend available at:
```
http://localhost:3000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict_single` | Predict a single sample (JSON input) |
| POST | `/predict_csv` | Predict multiple entries from CSV |
| GET  | `/model_metrics`  | Return model performance metrics |
| GET  | `/dashboard_stats`| Return logs & dashboard analytics |
| GET  | `/shap_files`     | List SHAP visualization files |

---

## 📂 Dataset
Uses the **NSL-KDD** dataset for training and evaluation (training and test splits included in the dataset folder).

---

## 🔮 Future Improvements
- Live packet capture + streaming pipeline  
- Time-series deep models (LSTM/Transformer)  
- Auto-retraining pipeline and CI/CD  
- Docker + Cloud deployment  
- SHAP interactive explorer

---

## ❤️ Credits
**Aditya Ray** — Project Lead  
Contributors: Aditya raj, Aayushman Mathpati
