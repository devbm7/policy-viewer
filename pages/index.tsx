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
    name: "Non Standard Datasets",
    subtopics: [
      {
        name: "Scenario 1",
        description: "This is the description for Scenario 1...",
        goldenExampleThought: "This is the golden example thought for Scenario 1...",
        goldenExampleRTU: "This is the golden example RTU for Scenario 1...",
        goldenExampleCode: `
def example_function():
    print("This is the golden example code for Scenario 1...")
    for i in range(5):
        print(f"Iteration {i}")
        `,
      },
      {
        name: "Scenario 2",
        description: "This is the description for Scenario 2...",
        goldenExampleThought: "This is the golden example thought for Scenario 2...",
        goldenExampleRTU: "This is the golden example RTU for Scenario 2...",
        goldenExampleCode: `
class ExampleClass:
    def __init__(self):
        self.message = "This is the golden example code for Scenario 2..."
    
    def print_message(self):
        print(self.message)
        `,
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
        goldenExampleCode: `import numpy as np

def process_data(data):
    return np.mean(data)

print("This is the golden example code for Scenario A...")
data = [1, 2, 3, 4, 5]
result = process_data(data)
print(f"Result: {result}")
        `,
      },
    ],
  },
]

export default function Home() {
  const [showRaw, setShowRaw] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const copyToClipboard = useCallback((text: string, sectionId: string) => {
    navigator.clipboard.writeText(text)
    setActiveSection(sectionId)
    setTimeout(() => setActiveSection(null), 2000)
  }, [])

  const renderSection = (title: string, content: string, topicIndex: number, subtopicIndex: number) => {
    const sectionId = `${topicIndex}-${subtopicIndex}-${title.replace(/\s+/g, "-").toLowerCase()}`
    return (
      <div className="mb-4" id={sectionId}>
        <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
          {title}
          <button className="text-gray-500 hover:text-gray-700" onClick={() => copyToClipboard(content, sectionId)}>
            {activeSection === sectionId ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </h3>
        <div className="bg-white p-4 rounded shadow">
          {title === "Golden Example Code" ? (
            <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers>
              {content}
            </SyntaxHighlighter>
          ) : showRaw ? (
            <pre className="whitespace-pre-wrap">{content}</pre>
          ) : (
            <ReactMarkdown>{content}</ReactMarkdown>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Head>
        <title>Markdown Content Viewer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white ${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 ease-in-out`}
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
            <nav>
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

      {/* Main content */}
      <main className={`flex-grow p-8 ${sidebarOpen ? "ml-64" : "ml-16"} transition-all duration-300 ease-in-out`}>
        <h1 className="text-3xl font-bold mb-8">Markdown Content Viewer</h1>

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

