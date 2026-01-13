import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler

# 1. Load the Model and Scaler
try:
    model = joblib.load('wine_model.pkl')
    scaler = joblib.load('wine_scaler.pkl')
    print("✅ Model & Scaler loaded.")
except:
    print("❌ Could not load model/scaler. Make sure you are in the backend folder.")
    exit()

# 2. Load the original data
df = pd.read_csv('winequality-red.csv')

# 3. Prepare the features (Drop 'quality' column)
X = df.drop('quality', axis=1)

# 4. Scale the data (Just like the app does)
X_scaled = scaler.transform(X)

# 5. Predict on ALL 1599 wines
predictions = model.predict(X_scaled)

# 6. Count the results
premium_count = (predictions == 1).sum()
regular_count = (predictions == 0).sum()

print("\n--- MODEL DIAGNOSIS ---")
print(f"Total Wines Tested: {len(predictions)}")
print(f"Predicted Premium (1): {premium_count}")
print(f"Predicted Regular (0): {regular_count}")

if premium_count == 0:
    print("\n🚨 DIAGNOSIS: YOUR MODEL IS BROKEN.")
    print("It learned to ALWAYS predict 0. You need to retrain it using SMOTE (Balancing).")
else:
    print(f"\n✅ DIAGNOSIS: Model is working! It found {premium_count} premium wines.")
    print("Use the CSV file to find a row where 'quality' is high and copy those EXACT numbers into your slider.")