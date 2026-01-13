import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

print("🍷 Loading Dataset...")
df = pd.read_csv('winequality-red.csv')

# 1. Prepare Data
# Convert quality to Binary (0 = Bad/Regular, 1 = Good/Premium)
# We treat quality >= 7 as Premium
df['quality'] = df['quality'].apply(lambda x: 1 if x >= 7 else 0)

X = df.drop('quality', axis=1)
y = df['quality']

# 2. Split Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Scale Data (CRITICAL)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. Train Model with BALANCING
print("🧠 Training Smarter Model...")
# class_weight='balanced' fixes the bias issue!
model = RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=42)
model.fit(X_train_scaled, y_train)

# 5. Evaluate
predictions = model.predict(X_test_scaled)
print("\n--- NEW MODEL PERFORMANCE ---")
print(classification_report(y_test, predictions))

# 6. Save Files
joblib.dump(model, 'wine_model.pkl')
joblib.dump(scaler, 'wine_scaler.pkl')
print("\n✅ Success! New 'wine_model.pkl' and 'wine_scaler.pkl' saved.")