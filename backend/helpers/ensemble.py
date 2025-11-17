# ensemble logic placeholder
# ensemble.py
from collections import Counter
import numpy as np

def ensemble_vote(sup_preds: dict, anomaly_scores: dict):
    """
    sup_preds: dict model -> (label or array, prob or array)
    anomaly_scores: dict name -> scalar (or dict of scalars)
    returns final_label (0/1), confidence (0..1)
    """
    # collect supervised votes (single-sample case)
    votes = []
    probs = []
    for m, (pred, prob) in sup_preds.items():
        # pred may be int or None
        if pred is None:
            continue
        votes.append(int(pred))
        if prob is not None:
            probs.append(float(prob))

    # majority vote
    if len(votes) == 0:
        vote_label = 0
    else:
        c = Counter(votes)
        vote_label = c.most_common(1)[0][0]

    # anomaly heuristic: if any anomaly flag looks suspicious, raise to attack
    anomaly_flag = False
    # iso: decision_function lower indicates anomaly — if provided as scalar in anomaly_scores
    iso_score = anomaly_scores.get("isolation_score", None)
    if iso_score is not None:
        # if iso_score is very low -> anomaly
        if iso_score < 0:  # this threshold is simple; you saved thresholds too for production
            anomaly_flag = True
    ocsvm_pred = anomaly_scores.get("ocsvm_pred", None)
    if ocsvm_pred is not None:
        if ocsvm_pred == -1:
            anomaly_flag = True

    # final rule: if anomaly_flag True -> final attack (1)
    final = 1 if anomaly_flag else vote_label

    # confidence: average of supervised probs (if available) else 1.0 when unanimous
    if probs:
        conf = float(sum(probs)/len(probs))
    else:
        # fallback: fraction votes for winning label
        if len(votes) == 0:
            conf = 0.0
        else:
            conf = float(votes.count(final) / len(votes))

    # normalize conf to [0,1]
    conf = max(0.0, min(1.0, conf))
    return final, conf