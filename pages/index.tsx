"use client"

import { useState } from "react"
import Head from "next/head"
import ReactMarkdown from "react-markdown"

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
    name: "Conversions",
    subtopics: [
      {
        name: "2A Cleaning",
        description: "This policy applies when df.info() indicates that the relevant column is of object type, and df.head() reveals non-numeric characters in the first five rows.",
        goldenExampleThought: "To find <Query's Requirement(s)>, I'll use the  <column name> columns. I need to calculate the sum of the  `<column name>` column for each  `<column name>`. First, I'll have to convert the  `<column name>` column to a numeric data type, as the output of df.info() indicates that it is currently of object type. From the output of df.head(), it is clear that  `<column name>` can be cleaned by removing the commas and the '€' sign, and then converting the column to a numeric format. Next, I'll calculate  <Query's Requirement(s)>. Finally, I'll identify  <Query's Requirement(s)>.",
        goldenExampleRTU: "To find that, I'll clean and convert the `<column name>` column to numeric, use it as the budget and identify the most expensive Cost Code within the budget.",
        goldenExampleCode: "console.log('This is the golden example code for Scenario 1...')",
      },
      {
        name: "3A Cleaning",
        description: "The relevant columns need to be converted to numeric based on df.info(), as they are of object type. However, df.head() does not show any visible non-numeric characters in those columns.",
        goldenExampleThought: "In order to <Query's Requirement(s)>, I'll make use of the `<relevant-column-names>` columns. From the output of `df.info()`, it can be seen that the `<column-name(s)>` column is of object type. From the output of `df.head()`, the `<column-name(s)>` column does not have any non-numeric characters, so I'll sample and print 20 non-numeric values to understand how to clean and convert it/them to numeric.",
        goldenExampleRTU: "I'll start by looking into the `GMV` column to prepare it for analysis.",
        goldenExampleCode: "console.log('This is the golden example code for Scenario 2...')",
      },
      {
        name: "3A conversion following failed 2A",
        description: "Scenario 2A was required, as per df.info() and df.head(), but the model runs into a ValueError during numerical conversion. The model then needs to do 3A sampling and conversion.",
        goldenExampleThought: "A ValueError occurred during conversion of the column `COLUMNAME`, because some unknown non-numeric characters were not removed. Therefore, I'll sample and print 20 non-numeric values from the column `COLUMNAME` to understand how to clean it completely.",
        goldenExampleRTU: "The `COLUMNAME` column appears to contain non-numeric characters. I'll sample 20 non-numeric values in this column to understand how to clean it completely.",
        goldenExampleCode: "console.log('This is the golden example code for Scenario 2...')",
      },
    ],
  },
  {
    name: "Categorical Sampling",
    subtopics: [
      {
        name:"Categorical Sampling",
        description: "Categorical sampling is necessary when at least one relevant column is of the object data type, is categorical in nature, and is required to answer the query.",
        goldenExampleThought:"In order to <Query's Requirement(s)>, I'll first inspect the values in the `<column name(s)>` column. This will help me unify any identical entries that may be represented inconsistently.",
        goldenExampleRTU: "I'll start by looking into the payment methods used by your clients.",
        goldenExampleCode: "print('Hi')\nprint(10)"
      },
    ],
  },
]

export default function Home() {
  const [showRaw, setShowRaw] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Content copied to clipboard!")
  }

  const renderSection = (title: string, content: string) => (
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="bg-white p-4 rounded shadow">
        {showRaw ? <pre className="whitespace-pre-wrap">{content}</pre> : <ReactMarkdown>{content}</ReactMarkdown>}
      </div>
      <button
        className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
        onClick={() => copyToClipboard(content)}
      >
        Copy {title}
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Policy Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Policy Viewer</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => setShowRaw(!showRaw)}
        >
          {showRaw ? "Show Compiled" : "Show Raw"}
        </button>

        {exampleTopics.map((topic, topicIndex) => (
          <div key={topicIndex} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{topic.name}</h2>
            {topic.subtopics.map((subtopic, subtopicIndex) => (
              <div key={subtopicIndex} className="mb-6 bg-gray-200 p-4 rounded">
                <h3 className="text-xl font-semibold mb-4">{subtopic.name}</h3>
                {renderSection("Description", subtopic.description)}
                {renderSection("Golden Example Thought", subtopic.goldenExampleThought)}
                {renderSection("Golden Example RTU", subtopic.goldenExampleRTU)}
                {renderSection("Golden Example Code", subtopic.goldenExampleCode)}
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  )
}

