"use client"

import { useState, useCallback } from "react"
import Head from "next/head"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { Copy, Check, ChevronRight, ChevronLeft } from "lucide-react"

type Section = {
  title: string
  content: string
}

type Subtopic = {
  name: string
  description: string
  goldenExampleThought: string
  goldenExampleRTU: string
  goldenExampleCode: string
}

type Topic = {
  name: string
  subtopics: Subtopic[]
}

const exampleTopics: Topic[] = [
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
]

// Custom components for ReactMarkdown to handle nested code blocks correctly
const components = {
  code: ({ inline, className, children, ...props }: {
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
  }) => {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <SyntaxHighlighter
        language={match[1]}
        style={vscDarkPlus}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }
}

export default function Home() {
  const [showRaw, setShowRaw] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const copyToClipboard = useCallback((text: string, sectionId: string) => {
    navigator.clipboard.writeText(text)
    setActiveSection(sectionId)
    setTimeout(() => setActiveSection(null), 2000)
  }, [])

  // This function ensures correct display of multi-line content with nested code blocks
  const renderContent = (content: string, isCode: boolean) => {
    if (isCode) {
      return (
        <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers>
          {content}
        </SyntaxHighlighter>
      )
    } else if (showRaw) {
      return <pre className="whitespace-pre-wrap">{content}</pre>
    } else {
      return (
        <ReactMarkdown components={components}>
          {content}
        </ReactMarkdown>
      )
    }
  }

  const renderSection = (title: string, content: string, topicIndex: number, subtopicIndex: number) => {
    const sectionId = `${topicIndex}-${subtopicIndex}-${title.replace(/\s+/g, "-").toLowerCase()}`
    const isCode = title === "Golden Example Code"
    
    return (
      <div className="mb-4" id={sectionId}>
        <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
          {title}
          <button className="text-gray-500 hover:text-gray-700" onClick={() => copyToClipboard(content, sectionId)}>
            {activeSection === sectionId ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </h3>
        <div className="bg-white p-4 rounded shadow overflow-auto">
          {renderContent(content, isCode)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Head>
        <title>Policy Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Fixed Sidebar */}
      <div
        className={`bg-gray-800 text-white ${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 ease-in-out fixed h-screen overflow-y-auto`}
      >
        <div className="p-4">
          <button
            className="w-full text-left flex items-center justify-between"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen && <span>Topics</span>}
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        {sidebarOpen && (
          <>
            <div className="p-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                onClick={() => setShowRaw(!showRaw)}
              >
                {showRaw ? "Show Compiled" : "Show Raw"}
              </button>
            </div>
            <nav className="pb-16">
              {exampleTopics.map((topic, topicIndex) => (
                <div key={topicIndex} className="mb-4">
                  <h2 className="text-lg font-semibold px-4 py-2">{topic.name}</h2>
                  <ul>
                    {topic.subtopics.map((subtopic, subtopicIndex) => (
                      <li key={subtopicIndex} className="px-4 py-1">
                        <a href={`#${topicIndex}-${subtopicIndex}-description`} className="hover:text-gray-300">
                          {subtopic.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </>
        )}
      </div>

      {/* Main content with adjusted margin */}
      <main className={`flex-grow p-8 ${sidebarOpen ? "ml-64" : "ml-16"} transition-all duration-300 ease-in-out`}>
        <h1 className="text-3xl font-bold mb-8">Policy Viewer</h1>

        {exampleTopics.map((topic, topicIndex) => (
          <div key={topicIndex} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{topic.name}</h2>
            {topic.subtopics.map((subtopic, subtopicIndex) => (
              <div key={subtopicIndex} className="mb-6 bg-gray-200 p-4 rounded">
                <h3 className="text-xl font-semibold mb-4">{subtopic.name}</h3>
                {renderSection("Description", subtopic.description, topicIndex, subtopicIndex)}
                {renderSection("Golden Example Thought", subtopic.goldenExampleThought, topicIndex, subtopicIndex)}
                {renderSection("Golden Example RTU", subtopic.goldenExampleRTU, topicIndex, subtopicIndex)}
                {renderSection("Golden Example Code", subtopic.goldenExampleCode, topicIndex, subtopicIndex)}
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  )
}