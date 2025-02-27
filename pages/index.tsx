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
    name: "Non Standard Datasets",
    subtopics: [
      {
        name: "Scenario 1",
        description: "This is the description for Scenario 1...",
        goldenExampleThought: "This is the golden example thought for Scenario 1...",
        goldenExampleRTU: "This is the golden example RTU for Scenario 1...",
        goldenExampleCode: "console.log('This is the golden example code for Scenario 1...')",
      },
      {
        name: "Scenario 2",
        description: "This is the description for Scenario 2...",
        goldenExampleThought: "This is the golden example thought for Scenario 2...",
        goldenExampleRTU: "This is the golden example RTU for Scenario 2...",
        goldenExampleCode: "console.log('This is the golden example code for Scenario 2...')",
      },
    ],
  },
  {
    name: "Standard Datasets",
    subtopics: [
      {
        name: "Scenario A",
        description: "This is the description for Scenario A...",
        goldenExampleThought: "This is the golden example thought for Scenario A...",
        goldenExampleRTU: "This is the golden example RTU for Scenario A...",
        goldenExampleCode: "console.log('This is the golden example code for Scenario A...')",
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
        <title>Markdown Content Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Markdown Content Viewer</h1>
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

