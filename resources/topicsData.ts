// topicsData.ts
export type Section = {
    title: string
    content: string
  }
  
  export type Subtopic = {
    name: string
    description: string
    goldenExampleThought: string
    goldenExampleRTU: string
    goldenExampleCode: string
  }
  
  export type Topic = {
    name: string
    subtopics: Subtopic[]
  }
  
  export const exampleTopics: Topic[] = [
    {
      name: "Categorical Sampling",
      subtopics: [
        {
          name: "Categorical Sampling",
          description: 'The header is missing in the dataset, but the names of the columns of interest can be deduced from the column values.',
          goldenExampleThought: "In order to <Query's Requirement(s)>, I'll first inspect the values in the `<column name(s)>` column. This will help me unify any identical entries that may be represented inconsistently.",
          goldenExampleRTU: "I'll start by looking into the payment methods used by your clients.",
          goldenExampleCode: `# Get all unique values from \`Payment System Name\`
unique_values = df['Payment System Name'].unique()
# Check the number of unique values in \`Payment System Name\`
if len(unique_values) > 50:
    # If there are too many unique values, sample the top 50
    top_occurring_values = df['Payment System Name'].value_counts().head(50).index.tolist()
    print(top_occurring_values)
else:
    # Otherwise print all unique values in \`Payment System Name\`
    print(unique_values)`,
        },
      ],
    },
    {
      name: "Conversions",
      subtopics: [
        {
          name: "2A Conversion",
          description: "This policy applies when df.info() indicates that the relevant column is of object type, and df.head() reveals non-numeric characters in the first five rows.",
          goldenExampleThought: "To find <Query's Requirement(s)>, I'll use the `<column name(s)>` columns.From the output of `df.info()`, it can be seen that the `<column-name(s)>` columns is/are of object type. From the output of `df.head()`, it is clear that `<column name(s)>` can be cleaned by removing the < non-numeric characters> character(s), and then converting it/them to numeric. Next, I'll <Query's Requirement(s)>.",
          goldenExampleRTU: "I'll start by organizing the `Total` column and proceed with the analysis.",
          goldenExampleCode: `# Remove '€' and ',' from the \`Total\` column
  df['Total'] = df['Total'].str.replace('€', '', regex=False).str.replace(',', '', regex=False)
  
  # and convert it to numeric
  df['Total'] = pd.to_numeric(df['Total'])
  
  # Aggregate on \`Cost Code\` and sum \`Total\` column and pick top value by Budget
  expensive_cost_code = df.groupby('Cost Code')['Total'].sum().reset_index(name='Budget').sort_values(by='Budget', ascending=False).iloc[0]
  
  # Display the output
  print(expensive_cost_code)`,
        },
        // Other subtopics remain the same
        {
            name: "3A Conversion",
            description: "The relevant columns need to be converted to numeric based on df.info(), as they are of object type. However, df.head() does not show any visible non-numeric characters in those columns.",
            goldenExampleThought: "In order to calculate the percentage of `GMV` across different brands, I'll use the `GMV` and `Type` columns.I first need to convert the `GMV` column to numeric as the output of `df.info()` shows it is currently of object type. From the output of `df.head()`, `GMV` does not apparently have any non-numeric characters and thus, I'll sample and print 20 non-numeric values in that column to understand how to clean and convert it to numeric.",
            goldenExampleRTU: "I'll start by looking into the `GMV` column to prepare it for analysis.",
            goldenExampleCode: `import numpy as np
# Get all unique non-numeric values from \`GMV\`
non_numeric_gmv_value = df[pd.to_numeric(df['GMV'], errors='coerce').isna()]['GMV'].unique()
    
if (len(non_numeric_gmv_value  ) > 20):
    # Sample 20 of them if there are too many unique values
    print(f"Non Numeric values in GMV {np.random.choice(non_numeric_gmv_value  , 20, replace=False)}")
    
else:
    # Otherwise print all unique non-numeric values from \`GMV\`
    print(f"Non Numeric values in GMV {non_numeric_gmv_value}")`,
          },
          {
            name: "3A Conversion following failed 2A",
            description: "Scenario 2A was required, as per df.info() and df.head(), but the model runs into a ValueError during numerical conversion. The model then needs to do 3A sampling and conversion.",
            goldenExampleThought: "A ValueError occurred during the conversion of the `net_worth` column because this column contains non-numeric values, such as '1 141 dollars', which interferes with the numerical conversion. To address this issue, I'll sample 20 non-numeric values to determine a suitable method for cleaning and converting it to numeric type.",
            goldenExampleRTU: "It looks like there are non-numeric values in the `net_worth` and `Roth_IRA` columns. I'll review their values before moving forward.",
            goldenExampleCode: `import numpy as np
    
# Get all unique non-numeric values from \`net_worth\` column
non_numeric_net_worth_value = df[pd.to_numeric(df['net_worth'], errors='coerce').isna()]['net_worth'].unique()
if (len(non_numeric_net_worth_value) > 20):
    # Sample 20 of them if there are too many unique values
    print(np.random.choice(non_numeric_net_worth_value, 20, replace=False))
else:
    # Otherwise print all unique non-numeric values from \`net_worth\`
    print(non_numeric_net_worth_value)`,
          },
          {
            name: "Datetime Conversion",
            description: "This policy applies when date like column is relevant to the analysis.",
            goldenExampleThought: "In order to display a comparison of the monthly sales of different products, I'll first convert the `Date` column to a datetime format. Then I'll extract the month from the `Date` column and create a new column labeled `Month`. < Remaining-analysis>",
            goldenExampleRTU: "I'll organize the data then visualize the comparison of the monthly sales of different products. `<DEV:NOT-RECOMMENDED-TO-USE-THIS>`",
            goldenExampleCode: `# Convert \`Date\` column to datetime
df['Date'] = pd.to_datetime(df['Date'])
# Extract month from \`Date\` and save it to new column \`Month\`
df['Month'] = df['Date'].dt.month_name()`,
          },
    ],
    },
    {
        name: "ModuleNotFound",
        subtopics: [
            {
                name: "ModuleNotFound",
                description: "A ModuleNotFoundError occurs in the response when the model attempts to use a Python module that is not installed in its environment. NOTE: Here, golden example code is part of RTU.",
                goldenExampleThought: "It appears that I do not have access to the module, 'xgboost'. Therefore, I'll provide the code to prepare the data, train a logistic regressor, Random Forest classifier and XGBoost classifier on the training data and finally evaluate and compare their performance on the test data.",
                goldenExampleRTU: "I cannot address this query with the libraries currently available to me. However, you can find the code below and run it in your local environment.",
                goldenExampleCode:`from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler,LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score

# Separate features and target variable
X = df.drop('Stage', axis=1)
y = df['Stage']

# Identify categorical and numerical columns
categorical_cols = X.select_dtypes(include=['object']).columns
numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns

# One-hot encode categorical columns
encoder = OneHotEncoder(drop='first', sparse_output=False)
X_encoded = encoder.fit_transform(X[categorical_cols])
encoded_df = pd.DataFrame(X_encoded, columns=encoder.get_feature_names_out(categorical_cols))

# Standardize numerical columns
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X[numerical_cols])
scaled_df = pd.DataFrame(X_scaled, columns=numerical_cols)

# Combine encoded categorical columns and scaled numerical columns
X_processed = pd.concat([encoded_df, scaled_df], axis=1)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, random_state=42)

# Create and train models
models = {
    'Logistic Regression': LogisticRegression(),
    'Random Forest': RandomForestClassifier(),
    'XGBoost': XGBClassifier(),
}

results = {}
for name, model in models.items():
    # Adjust labels for XGBoost
    if name == 'XGBoost':
        # Encode labels to start from 0 as expected by XGBoost
        encoder = LabelEncoder()
        y_train_encoded = encoder.fit_transform(y_train)
        y_test_encoded = encoder.transform(y_test)

        # Fit the model using encoded labels
        model.fit(X_train, y_train_encoded)
        y_pred = model.predict(X_test)
        # Decode predictions to original labels for accuracy calculation
        y_pred_original = encoder.inverse_transform(y_pred)
        accuracy = accuracy_score(y_test, y_pred_original)
    else:
        # Fit the model using original labels
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)

    results[name] = accuracy
    print(f'{name} Accuracy: {accuracy:.4f}')

# Identify the best performing model
best_model = max(results, key=lambda name: results[name])
print(f'Best Performing Model: {best_model}')`
            },
        ],
    },
    {
        name: "Tie-breaking issue",
        subtopics:[
            {
                name: "Does not select multiple equally good responses when it should",
                description: "[Query - Example] Which pokemon has the highest HP? [Thought] Note: --> We don't have an exact policy for this yet. Basically thought must go for find the maximum value, filter the dataset with the rows with that maximum value to find every rows with maximum value without missing any row.",
                goldenExampleThought: "To identify the pokemon(s) with the highest HP, I'll analyze the `pokemon_hp` column to find the pokemons with the highest HP. First, I'll find the maximum HP in this dataset, then I'll filter all pokemons with maximum HP.",
                goldenExampleRTU: "I'll look into the pokemons to find with highest HP pokemon.",
                goldenExampleCode: `# Find the maximum HP in the \`pokemon_hp\` column
maximum_hp = df['pokemon_hp'].max()
# Filter the pokemons with maximum HP
filtered_df = df[df['pokemon_hp'] == maximum_hp]
# Print the pokemons with maximum HP
print(filtered_df[['pokemon' , 'pokemon_hp']])`
            },
        ],
    },
    {
      name: "Visualization",
      subtopics: [
        {
          name: "6L",
          description: "Sorting by List on User Request ErrorUser requests that the plot be sorted through an ordered list of levels.\nQuery Example: \"Make a bar plot of total sales across US, Canada, and Mexico. Sort in the following order: Mexico, Canada, US.\"",
          goldenExampleThought:`As requested, I'll create a bar chart to visualize the median calories burned for Yoga, HIIT, Cardio, and Strength, with the bars arranged in that order.Visualize the data:
1. Create a list \`order\` with elements 'Yoga', 'HIIT', 'Cardio', and 'Strength'.
2. Create a bar chart using the \`Workout_Type\` column on the x-axis and the \`Calories_Burned\` column on the y-axis.
3. Set x-axis title as 'Workout Type' and y-axis title as 'Median Calories Burned'.
4. Use the \`order\` list to control the order of the bars.
5. Add tooltips for columns \`Workout_Type\` and \`Calories_Burned\`.
6. Set the title of the plot to 'Median Calories Burned by Workout Type'.
7. Make the plot interactive enabling zooming and panning.
8. Save the plot as a JSON file.`,
          goldenExampleRTU: "I'll create a bar chart to visualize the median calories burned by workout type.",
          goldenExampleCode: `import altair as alt
# Create a list \`order\` with elements 'Yoga', 'HIIT', 'Cardio', and 'Strength'.
order = ['Yoga', 'HIIT', 'Cardio', 'Strength']
# Create a bar chart using the \`Workout_Type\` column on the x-axis and the \`Calories_Burned\` column on the y-axis.
chart = alt.Chart(median_calories_burned).mark_bar().encode(
    # Set x-axis title as 'Workout Type' and y-axis title as 'Median Calories Burned'.
    x=alt.X('Workout_Type', sort=order, title='Workout Type'),
    # Use the \`order\` list to control the order of the bars.
    y=alt.Y('Calories_Burned', title='Median Calories Burned'),
    # Add tooltips for columns \`Workout_Type\` and \`Calories_Burned\`.
    tooltip = ['Workout_Type', 'Calories_Burned']
).properties(
    # Set the title of the plot to 'Median Calories Burned by Workout Type'.
    title='Median Calories Burned by Workout Type'
).interactive() # Make the plot interactive enabling zooming and panning.
# Save the chart to a JSON file
chart.save('median_calories_burned_by_workout_type_bar_chart.json')`
        },
      ],
    },
  ]