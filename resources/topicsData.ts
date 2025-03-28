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
      name: "Non-Standard Datasets",
      subtopics: [
        {
          name: "Scenario 2",
          description: "The header is missing in the dataset, but the names of the columns of interest can be deduced from the column values.",
          goldenExampleThought: `Upon reviewing the first few rows, it seems that the dataset lacks proper headers, as the first row appears to be part of the data rather than containing meaningful labels. However, based on the column values, I can deduce that the column at index 0 (\`January\`) represents the \`Month\`, and the column at index 3 (\`250\`) contains \`Cost\` information. These columns are clearly distinguishable, and no other columns have similar values that could lead to confusion. To prepare the dataframe for analysis, I'll reload the dataset using the 'header=None' option, treating the first row as data instead of headers. Then, I'll rename the columns at indices 0 and 3 to \`Month\` and \`Cost\`, respectively (assuming a 0-based index). Finally, I'll display the first five rows along with the column names and data types, as reloading the dataset might alter the data types.`,
          goldenExampleRTU: "**Note:** It looks like the dataset's missing some headers, so I'll figure out the column names from the values themselves.",
          goldenExampleCode: `# Load the csv file without the header
df = pd.read_csv('Truck Repairs for 2023 - Sheet1 - Dr. Victoria Gamble.csv', header=None)

# Rename the columns
df.rename(columns={0: 'Month', 3: 'Cost'}, inplace=True)

# Display the first 5 rows
print(df.head().to_markdown(index=False, numalign="left", stralign="left"))

# Print the column names and their data types
print(df.info())`
        },
        {
          name: "Scenario 5",
          description: "The dataset contains metadata or additional data in the first row(s) that are not part of the header, with the actual headers located in a subsequent row.",
          goldenExampleThought: `The first five rows suggest that the dataset includes metadata before the actual header, as row 2 contains meaningful column names like \`Product\` and \`Noon\` that are relevant to the user request and accurately describe the data below. To address this, I'll reload the dataset using the same parameters as before, adding the 'header' parameter set to 1 (accounting for the 0-based index). I'll then display the first 5 rows along with the columns and their types, as the reload might alter the column types.`,
          goldenExampleRTU: `**Note:** It looks like the dataset wasn't loaded with the correct headers due to extra information at the top. I'll reload it with the proper headers and continue with the analysis.`,
          goldenExampleCode: `# Read the CSV file into a DataFrame with the correct header starting from row 2
df = pd.read_csv("product_sales_-_ps pivot table.csv", encoding='latin-1', header=1)

# Display the first 5 rows
print(df.head().to_markdown(index=False, numalign="left", stralign="left"))

# Print the column names and their data types
print(df.info())`
        },
      ]
    },
    {
      name: "Categorical Sampling",
      subtopics: [
        {
          name: "Categorical Sampling",
          description: 'Categorical sampling is necessary when at least one relevant column is of the object data type, is categorical in nature, and is required to answer the query.',
          goldenExampleThought: "In order to <Query's Requirement(s)>, I'll first inspect the values in the `<column name(s)>` column. This will help me unify any identical entries that may be represented inconsistently.",
          goldenExampleRTU: "I'll start by looking into the payment methods used by your clients.",
          goldenExampleCode: `# Get all unique values from \`Z\`
unique_values = df['Z'].unique()

# Check the number of unique values in \`Z\`
if len(unique_values) > 50:
    # If there are too many unique values, sample the top 50
    top_occurring_values = df['Z'].value_counts().head(50).index.tolist()
    print(top_occurring_values)
else:
    # Otherwise print all unique values in \`Z\`
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
df['Total'] = df['Total'].astype(str).str.replace('€', '', regex=False).str.replace(',', '', regex=False)
  
# and convert it to numeric
df['Total'] = pd.to_numeric(df['Total'])
  
# Aggregate on \`Cost Code\` and sum \`Total\` column and pick top value by Budget
expensive_cost_code = df.groupby('Cost Code')['Total'].sum().reset_index(name='Budget').sort_values(by='Budget', ascending=False).iloc[0]
  
# Display the output
print(expensive_cost_code)`,
        },
        {
            name: "3A Conversion",
            description: "The relevant columns need to be converted to numeric based on df.info(), as they are of object type. However, df.head() does not show any visible non-numeric characters in those columns.",
            goldenExampleThought: "In order to calculate the percentage of `GMV` across different brands, I'll use the `GMV` and `Type` columns.I first need to convert the `GMV` column to numeric as the output of `df.info()` shows it is currently of object type. From the output of `df.head()`, `GMV` does not apparently have any non-numeric characters and thus, I'll sample and print 20 non-numeric values in that column to understand how to clean and convert it to numeric.",
            goldenExampleRTU: "I'll start by looking into the `GMV` column to prepare it for analysis.",
            goldenExampleCode: `import numpy as np

# Get all unique non-numeric values from \`GMV\`
non_numeric_values = df[pd.to_numeric(df['GMV'], errors='coerce').isna()]['GMV'].unique()
    
if (len(non_numeric_values) > 20):
    # Sample 20 of them if there are too many unique values
    print(f"Non Numeric values in GMV {np.random.choice(non_numeric_values, 20, replace=False)}")
else:
    # Otherwise print all unique non-numeric values from \`GMV\`
    print(f"Non Numeric values in GMV {non_numeric_values}")`,
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
                goldenExampleCode: `# Find the maximum \`Quantity_Sold\`
maximum_quantity_sold_liters = avg_quantity_sorted['Quantity_Sold'].max()

# Filter the data with the maximum \`Quantity_Sold\`
filtered_df = avg_quantity_sorted[avg_quantity_sorted['Quantity_Sold'] == maximum_quantity_sold_liters]

# Print the data with the maximum \`Quantity_Sold\`
print(filtered_df[['Fuel_Type' , 'Quantity_Sold']].to_markdown(index=False, numalign="left", stralign="left"))`
            },
        ],
    },
    {
      name: "Visualization",
      subtopics: [
        {
          name: "6L",
          description: "Sorting by List on User Request ErrorUser requests that the plot be sorted through an ordered list of levels.\nQuery Example: \"Make a bar plot of total sales across US, Canada, and Mexico. Sort in the following order: Mexico, Canada, US.\"",
          goldenExampleThought:`As requested, I'll create a bar chart to visualize the median calories burned for Yoga, HIIT, Cardio, and Strength, with the bars arranged in that order.
Visualize the data:
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
        {
          name:"23L",
          description:"Non-tooltip ChartsThe model should always add the relevant variables in the tooltip.",
          goldenExampleThought:`As requested, I'll now create a pie chart using the aggregated data to visualize the distribution of marital status.
Visualize the data:
1. Create a pie chart using the \`marital.status\` and \`count\` columns.
2. Use \`count\` as the theta and \`marital.status\` for the color.
3. Set the title of the plot to 'Distribution of Marital Status'.
4. Order the pie slices by \`percentage\` in descending order.
5. Add \`percentage\` labels to the pie chart.
6. Add tooltips for the \`marital.status\` and \`count\` columns and \`percentage\` with the format '.1%'.
7. Save the plot to a JSON file.`,
          goldenExampleRTU:"Now, I'll create a pie chart to show the distribution of marital status.",
          goldenExampleCode:`import altair as alt

# Create the base chart
base = alt.Chart(df_plot).encode(theta=alt.Theta("count", stack=True))
# Specify the outer radius of the arcs and encode color based on the \`marital.status\` 
columnpie = base.mark_arc(outerRadius=120).encode(
  color=alt.Color("marital.status"),
  # Order the arcs by \`count\` in descending order
  order=alt.Order("percentage", sort="descending"),
  tooltip=["marital.status", "count", alt.Tooltip("percentage", format=".1%")]
)
# Add text to show the percentage on the chart
text = base.mark_text(radius=140).encode(
  text=alt.Text("percentage", format=".1%"),
  order=alt.Order("percentage", sort="descending"),
  color=alt.value("black") # Set the color of the labels to black
)
# Combine the pie chart and text
chart = pie + text
# Add title to the chart
chart = chart.properties(title='Distribution of Marital Status')
# Save the chart in json file
chart.save('marital_status_pie_chart.json')`,
        },
        {
          name:"24L",
          description:`Non-interactive ChartsThe model should always make the chart interactive using .interactive() method to allow for zooming and panning.`,
          goldenExampleThought:`As requested, I'll create a stacked bar chart using the \`Company\`, \`TypeName\`, and \`Number of Laptops\` columns to visualize the total number of laptops sold by each company, grouped by laptop type.Visualize the data:
1. Create a stacked bar chart using the columns \`Company\`, \`TypeName\`, and \`Number of Laptops\`.
2. Map the \`Company\` column to the x-axis and add title 'Company'.
3. Map the \`Number of Laptops\` column to the y-axis and add title 'Number of Laptops'.
4. Map the \`TypeName\` column to color.
5. Add tooltips for columns \`Company\`, \`TypeName\`, and \`Number of Laptops\`.
6. Add plot title as 'Total Laptops Sold by Company and Type'.
7. Make the plot interactive enabling zooming and panning.
8. Save the chart as a JSON file.`,
          goldenExampleRTU:`Now, I'll create a stacked bar chart to visualize the number of laptops sold by company and type.`,
          goldenExampleCode:`import altair as alt
          
# Create a stacked bar chart
chart = alt.Chart(df_plot).mark_bar().encode(
  # Set the x-axis to display the companies
  x=alt.X('Company', title='Company'),
  # Set the y-axis to display the number of laptops sold
  y=alt.Y('Number of Laptops', title='Number of Laptops'),
  # Use different colors for each laptop
  typecolor='TypeName',
  # Add tooltips to show details when hovering over each bar
  tooltip=['Company', 'TypeName', 'Number of Laptops']).properties(
    # Set the chart title
    title='Total Laptops Sold by Company and Type'
    ).interactive() # Make the chart interactive for zooming and panning
# Save the chart as a JSON file
chart.save('total_laptops_sold_by_company_and_type_stacked_bar_chart.json')`
        },
      ],
    },
  ]