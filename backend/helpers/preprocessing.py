# preprocessing.py
import os
import joblib
import numpy as np
import pandas as pd


class Preprocessor:
    def __init__(self, models_dir: str):
        self.models_dir = models_dir
        prep_dir = os.path.join(models_dir, "preprocessing")

        # Load encoder + scaler
        self.encoder = joblib.load(os.path.join(prep_dir, "encoder.pkl"))
        self.scaler = joblib.load(os.path.join(prep_dir, "scaler.pkl"))

        # Load selected feature names (full encoded feature list)
        self.selected_features = joblib.load(os.path.join(prep_dir, "selected_features.pkl"))

        # Your dataset has FIXED 3 categorical columns
        self.categorical_cols = ["protocol_type", "service", "flag"]

        # Encoder creates encoded names like: protocol_type_tcp, service_http etc.
        encoded_cats = list(self.encoder.get_feature_names_out(self.categorical_cols))

        # → numeric columns = selected_features excluding encoded categorical
        self.numeric_cols = [c for c in self.selected_features if c not in encoded_cats]

        # final original input order (raw input columns)
        self.all_features = self.categorical_cols + self.numeric_cols

    # ----------------------------------------------------------------------
    # Single-row preprocessing (manual input)
    # ----------------------------------------------------------------------
    def mk_input_df(self, row_dict: dict):
        df = pd.DataFrame([row_dict])

        # Add missing columns
        for col in self.all_features:
            if col not in df.columns:
                df[col] = 0

        df = df[self.all_features]

        # Split
        df_cat = df[self.categorical_cols]
        df_num = df[self.numeric_cols]

        # Transform
        X_cat = self.encoder.transform(df_cat)
        X_num = self.scaler.transform(df_num)

        X_final = np.hstack([X_cat, X_num])
        return X_final, df

    # ----------------------------------------------------------------------
    # Batch CSV preprocessing
    # ----------------------------------------------------------------------
    def mk_input_df_batch(self, df: pd.DataFrame):
        df = df.copy()

        for col in self.all_features:
            if col not in df.columns:
                df[col] = 0

        df = df[self.all_features]

        df_cat = df[self.categorical_cols]
        df_num = df[self.numeric_cols]

        X_cat = self.encoder.transform(df_cat)
        X_num = self.scaler.transform(df_num)

        X_final = np.hstack([X_cat, X_num])
        return X_final
    def get_most_likely_attack(self):
        """Return the most frequent attack type from training."""
        try:
            freq = joblib.load(os.path.join(self.models_dir, "preprocessing", "attack_frequency.pkl"))
            return max(freq, key=freq.get)
        except:
            return "unknown"