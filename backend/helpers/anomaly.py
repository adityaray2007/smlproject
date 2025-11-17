# anomaly.py
import os
import joblib
import numpy as np

class AnomalyDetect:
    def __init__(self, models_dir: str, preprocessor):
        self.models_dir = models_dir
        self.pre = preprocessor

        # Load Isolation Forest & One-Class SVM
        uns_dir = os.path.join(models_dir, "unsupervised")

        iso_path = os.path.join(uns_dir, "isolation_forest.pkl")
        ocsvm_path = os.path.join(uns_dir, "one_class_svm.pkl")
        thr_path = os.path.join(uns_dir, "thresholds.pkl")

        self.iso = joblib.load(iso_path) if os.path.exists(iso_path) else None
        self.ocsvm = joblib.load(ocsvm_path) if os.path.exists(ocsvm_path) else None

        try:
            self.thresholds = joblib.load(thr_path)
        except:
            self.thresholds = {}

    # ---------------------------------------------------------
    # SINGLE SAMPLE score
    # ---------------------------------------------------------
    def score(self, X_input):
        """
        X_input is a tuple returned from preprocessor: (X_final, original_row)
        Autoencoder disabled → return 0
        """
        if isinstance(X_input, (tuple, list)):
            X_final = X_input[0]
        else:
            X_final = X_input
        out = {}

        if self.iso:
            out["isolation_score"] = float(self.iso.decision_function(X_final)[0])

        if self.ocsvm:
            out["ocsvm_pred"] = int(self.ocsvm.predict(X_final)[0])

        # AUTOENCODER DISABLED
        out["autoencoder"] = 0.0

        return out

    # ---------------------------------------------------------
    # BATCH score
    # ---------------------------------------------------------
    def score_batch(self, X_input):
        """
        X_final is the processed numpy matrix from batch preprocessing.
        Autoencoder disabled → return zeros list
        """
        if isinstance(X_input, (tuple, list)):
            X_final = X_input[0]
        else:
            X_final = X_input
        out = {}

        if self.iso:
            out["isolation_score"] = list(self.iso.decision_function(X_final))

        if self.ocsvm:
            out["ocsvm_pred"] = list(self.ocsvm.predict(X_final))

        # AUTOENCODER DISABLED
        out["autoencoder"] = [0.0] * len(X_final)

        return out