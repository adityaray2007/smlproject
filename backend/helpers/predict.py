# prediction logic placeholder
# predict.py
import os
import joblib
import numpy as np
from tensorflow.keras.models import load_model

class ModelEnsemble:
    def __init__(self, models_dir: str, preprocessor):
        self.models_dir = models_dir
        self.pre = preprocessor
        # load supervised models
        self.supervised = {}
        sup_dir = os.path.join(models_dir, "supervised")
        for fname in os.listdir(sup_dir):
            if fname.endswith(".pkl"):
                name = fname.replace(".pkl", "")
                self.supervised[name] = joblib.load(os.path.join(sup_dir, fname))
        # load unsupervised objects if needed elsewhere (not used here)
        self.unsupervised = {}
        uns_dir = os.path.join(models_dir, "unsupervised")
        for fname in os.listdir(uns_dir):
            if fname.endswith(".pkl"):
                name = fname.replace(".pkl", "")
                self.unsupervised[name] = joblib.load(os.path.join(uns_dir, fname))
        # load keras autoencoder if exists
        ae_path = os.path.join(uns_dir, "autoencoder.h5")
        if os.path.exists(ae_path):
            self.autoencoder = None  # temporarily disabled
        else:
            self.autoencoder = None

    def predict_supervised(self, X_input):
        """
        X_input: either (X_final, raw_df) returned by Preprocessor._transform_raw_df
        returns dict model -> (pred_label, pred_prob)
        """
        # Accept either (X_final, raw_df) OR X_final alone
        if isinstance(X_input, (tuple, list)):
            X_final = X_input[0]
        else:
            X_final = X_input
        out = {}
        for name, model in self.supervised.items():
            try:
                if hasattr(model, "predict_proba"):
                    prob = model.predict_proba(X_final)[:,1]
                    pred = (prob >= 0.5).astype(int)
                    out[name] = (int(pred[0]), float(prob[0]))
                else:
                    p = model.predict(X_final)
                    out[name] = (int(p[0]), None)
            except Exception as e:
                out[name] = (None, None)
        return out

    def predict_supervised_batch(self, X_final):
        """
        X_final: numpy array shaped (n_samples, n_features)
        returns dict -> (pred_array, prob_array or None)
        """
        out = {}
        for name, model in self.supervised.items():
            try:
                if hasattr(model, "predict_proba"):
                    prob = model.predict_proba(X_final)[:,1]
                    pred = (prob >= 0.5).astype(int)
                    out[name] = (pred.tolist(), prob.tolist())
                else:
                    p = model.predict(X_final)
                    out[name] = (p.tolist(), None)
            except Exception as e:
                out[name] = ([None]*len(X_final), None)
        return out