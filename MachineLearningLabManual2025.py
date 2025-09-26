import pandas as pd
import numpy as np

def load_data(file_name):
    try:
        df = pd.read_csv(file_name)
        print("--- Training Data ---\n", df, "\n", "="*30, "\n")
        return df.iloc[:, :-1].values, df.iloc[:, -1].values
    except FileNotFoundError:
        print("Error: File not found. Please create the file with training data.")
        exit()

# FIND-S Algorithm
def find_s(X, y):
    hypothesis = None
    for example, label in zip(X, y):
        if label == 'Yes':
            hypothesis = example if hypothesis is None else [h if h == v else '?' for h, v in zip(hypothesis, example)]
    return hypothesis

# LIST-THEN-ELIMINATE Algorithm
def is_consistent(h, example, target):
    return all(h[i] in ('?', val) for i, val in enumerate(example)) if target == 'Yes' else not all(h[i] == val for i, val in enumerate(example))

def list_then_eliminate(X, y):
    version_space = [np.array(['?'] * X.shape[1])]
    for example, target in zip(X, y):
        version_space = [h for h in version_space if is_consistent(h, example, target)]
    return version_space

# Interactive Prediction
def predict(h, test_instance):
    return "Yes" if all(h[i] in ('?', val) for i, val in enumerate(test_instance)) else "No"

def interactive_mode(hypothesis, version_space):
    print("--- Interactive Test Mode ---")
    while True:
        user_input = input("Enter test case (comma-separated) or 'quit' to exit: ").lower()
        if user_input == 'quit':
            break
        test_case = user_input.split(',')
        if len(test_case) != len(hypothesis):
            print("Invalid input. Check number of attributes.")
            continue
        find_s_pred = predict(hypothesis, test_case)
        lte_preds = [predict(h, test_case) for h in version_space]
        lte_result = "Yes (All agree)" if all(p == "Yes" for p in lte_preds) else "No (All agree)" if all(p == "No" for p in lte_preds) else "Ambiguous (Disagreement)"
        print(f"\nTest Case: {test_case}\nFIND-S Prediction: {find_s_pred}\nLIST-THEN-ELIMINATE: {lte_result}\n")

if __name__ == "__main__":
    X, y = load_data('finds.csv')
    hypothesis = find_s(X, y)
    print("--- FIND-S Algorithm ---\nMost Specific Hypothesis:", hypothesis, "\n", "="*30, "\n")

    version_space = list_then_eliminate(X, y)
    print("--- LIST-THEN-ELIMINATE Algorithm ---\nVersion Space:", version_space, "\n", "="*30, "\n")

    interactive_mode(hypothesis, version_space)