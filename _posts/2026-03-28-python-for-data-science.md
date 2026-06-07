---
layout: post
title: "Python for Data Science: Getting Started"
date: 2026-03-28
categories: [python]
author: Evan Krocker
excerpt: "Python has become the dominant language for data science. Here's your roadmap to getting started with pandas, NumPy, and matplotlib."
---

Python's simplicity combined with powerful libraries like NumPy, pandas, and matplotlib make it the go-to language for data science and machine learning.

## Essential Libraries

- **NumPy** — fast numerical computing with N-dimensional arrays
- **pandas** — data manipulation and analysis with DataFrames
- **matplotlib / seaborn** — data visualization
- **scikit-learn** — machine learning algorithms

```bash
pip install numpy pandas matplotlib scikit-learn
```

## Loading and Exploring Data

```python
import pandas as pd

df = pd.read_csv('data.csv')
print(df.head())       # first 5 rows
print(df.shape)        # (rows, columns)
print(df.describe())   # summary statistics
print(df.info())       # column types + nulls
```

## Data Cleaning

Real-world data is messy. Cleaning it is usually 80% of the work.

```python
# Remove rows with missing values
df.dropna(inplace=True)

# Fill missing values with column mean
df['age'] = df['age'].fillna(df['age'].mean())

# Remove duplicates
df.drop_duplicates(inplace=True)

# Rename columns
df.rename(columns={'old_name': 'new_name'}, inplace=True)
```

## Filtering and Grouping

```python
# Filter rows
engineers = df[df['job'] == 'Engineer']

# Multiple conditions
seniors = df[(df['age'] > 40) & (df['salary'] > 80000)]

# Group and aggregate
by_dept = df.groupby('department')['salary'].mean()
```

## Quick Visualization

```python
import matplotlib.pyplot as plt

df['salary'].hist(bins=30)
plt.title('Salary Distribution')
plt.xlabel('Salary')
plt.ylabel('Count')
plt.tight_layout()
plt.show()
```

This is just scratching the surface. Once you're comfortable with pandas and matplotlib, exploring **scikit-learn** for machine learning and **Jupyter notebooks** for interactive analysis are natural next steps.
