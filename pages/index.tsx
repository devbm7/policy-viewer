"use client"

import { useState, useCallback, useEffect } from "react"
import Head from "next/head"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, nord } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sun, 
  Moon, 
  Link, 
  Search, 
  Edit, 
  X,
  BookOpen,
  Code,
  FileText,
  Lightbulb
} from "lucide-react"
import { Topic, exampleTopics } from "../resources/topicsData"

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
        customStyle={{
          borderRadius: '0.5rem',
          margin: '1rem 0',
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code 
        className={`${className || ''} ${inline ? 'bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-red-500 dark:text-red-400 font-mono' : ''}`} 
        {...props}
      >
        {children}
      </code>
    )
  },
  ol: ({ className, children, ...props }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <ol className="list-decimal pl-8 mb-4 space-y-2" {...props}>
        {children}
      </ol>
    )
  },
  ul: ({ className, children, ...props }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <ul className="list-disc pl-8 mb-4 space-y-2" {...props}>
        {children}
      </ul>
    )
  },
  li: ({ className, children, ...props }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <li className="mb-1" {...props}>
        {children}
      </li>
    )
  },
  p: ({ className, children, ...props }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <p className="mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    )
  },
  h1: ({ className, children, ...props }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <h1 className="text-3xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700" {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ className, children, ...props }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <h2 className="text-2xl font-bold mt-8 mb-4" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ className, children, ...props }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-3" {...props}>
        {children}
      </h3>
    )
  }
}

// Custom button component
const Button = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md",
  className = "",
  ...props 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  [key: string]: any;
}) => {
  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg"
  };
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg",
    outline: "bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
  };
  
  return (
    <button
      onClick={onClick}
      className={`rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
      ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom card component
const Card = ({ 
  children, 
  className = "" 
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default function Home() {
  const [showRaw, setShowRaw] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [currentBreadcrumbs, setCurrentBreadcrumbs] = useState<{topic: string, subtopic: string, section: string | null}>({
    topic: '',
    subtopic: '',
    section: null
  })
  const [searchQuery, setSearchQuery] = useState("")
  
  // New state variables for text replacement feature
  const [replacementText, setReplacementText] = useState("")
  const [searchText, setSearchText] = useState("")
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [modifiedContent, setModifiedContent] = useState<{[key: string]: string}>({})

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    // Check for saved preference
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true')
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(prefersDark)
    }
  }, [])

  // Update localStorage and apply dark mode class when darkMode changes
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Update breadcrumbs based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id^="section-"]')
      const subtopicHeaders = document.querySelectorAll('[id^="subtopic-"]')
      const topicHeaders = document.querySelectorAll('[id^="topic-"]')
      
      // Find the section currently in view
      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom >= 150) {
          const id = section.id
          const parts = id.split('-')
          
          if (parts.length >= 4) {
            const topicIndex = parseInt(parts[1])
            const subtopicIndex = parseInt(parts[2])
            const sectionName = parts.slice(3).join('-').replace(/-/g, ' ')
            
            setCurrentBreadcrumbs({
              topic: exampleTopics[topicIndex].name,
              subtopic: exampleTopics[topicIndex].subtopics[subtopicIndex].name,
              section: sectionName
            })
            return
          }
        }
      }
      
      // If no section is in view, check for subtopic headers
      for (const header of subtopicHeaders) {
        const rect = header.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom >= 150) {
          const id = header.id
          const parts = id.split('-')
          
          if (parts.length >= 3) {
            const topicIndex = parseInt(parts[1])
            const subtopicIndex = parseInt(parts[2])
            
            setCurrentBreadcrumbs({
              topic: exampleTopics[topicIndex].name,
              subtopic: exampleTopics[topicIndex].subtopics[subtopicIndex].name,
              section: null
            })
            return
          }
        }
      }
      
      // If no subtopic is in view, check for topic headers
      for (const header of topicHeaders) {
        const rect = header.getBoundingClientRect()
        if (rect.top <= 150 && rect.bottom >= 150) {
          const id = header.id
          const parts = id.split('-')
          
          if (parts.length >= 2) {
            const topicIndex = parseInt(parts[1])
            
            setCurrentBreadcrumbs({
              topic: exampleTopics[topicIndex].name,
              subtopic: '',
              section: null
            })
            return
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Function to handle content replacement
  const replaceInContent = (sectionId: string, originalContent: string) => {
    if (!searchText) return
    
    const newContent = originalContent.replace(new RegExp(searchText, 'g'), replacementText)
    setModifiedContent({
      ...modifiedContent,
      [sectionId]: newContent
    })
    
    // Reset editing section after successful replacement
    setEditingSection(null)
  }

  // Updated copyToClipboard function to use modified content when available
  const copyToClipboard = useCallback((text: string, sectionId: string) => {
    const contentToCopy = modifiedContent[sectionId] || text
    navigator.clipboard.writeText(contentToCopy)
    setActiveSection(sectionId)
    setTimeout(() => setActiveSection(null), 2000)
  }, [modifiedContent])
  
  const copyLinkToClipboard = useCallback((id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard.writeText(url)
    // Show a temporary message
    setActiveSection(`link-${id}`)
    setTimeout(() => setActiveSection(null), 2000)
  }, [])

  // This function ensures correct display of multi-line content with nested code blocks
  const renderContent = (content: string, isCode: boolean) => {
    if (isCode) {
      return (
        <SyntaxHighlighter 
          language="python" 
          style={darkMode ? vscDarkPlus : nord} 
          showLineNumbers
          customStyle={{
            borderRadius: '0.5rem',
            fontSize: '0.95rem',
          }}
        >
          {content}
        </SyntaxHighlighter>
      )
    } else if (showRaw) {
      return <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
    } else {
      return (
        <div className="markdown-content">
          <ReactMarkdown components={components}>
            {content}
          </ReactMarkdown>
        </div>
      )
    }
  }

  // Get icon for section types
  const getSectionIcon = (title: string) => {
    switch(title) {
      case "Description":
        return <FileText size={18} className="mr-2" />;
      case "Golden Example Thought":
        return <Lightbulb size={18} className="mr-2" />;
      case "Golden Example RTU":
        return <BookOpen size={18} className="mr-2" />;
      case "Golden Example Code":
        return <Code size={18} className="mr-2" />;
      default:
        return null;
    }
  };

  // Updated renderSection function to include replacement UI
  const renderSection = (title: string, content: string, topicIndex: number, subtopicIndex: number) => {
    const sectionSlug = title.replace(/\s+/g, "-").toLowerCase()
    const sectionId = `section-${topicIndex}-${subtopicIndex}-${sectionSlug}`
    const isCode = title === "Golden Example Code"
    const displayContent = modifiedContent[sectionId] || content
    
    return (
      <div className="mb-6" id={sectionId}>
        <div className="flex items-center justify-between mb-2 border-b dark:border-gray-700 pb-2">
          <h3 className="text-xl font-semibold flex items-center">
            {getSectionIcon(title)}
            <span>{title}</span>
          </h3>
          <div className="flex items-center space-x-2">
            {isCode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingSection(editingSection === sectionId ? null : sectionId)
                }}
                aria-label="Edit content"
                className="group"
              >
                {editingSection === sectionId ? (
                  <X size={18} className="text-gray-500 group-hover:text-red-500" />
                ) : (
                  <Edit size={18} className="text-gray-500 group-hover:text-blue-500" />
                )}
              </Button>
            )}
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => copyLinkToClipboard(sectionId)}
              aria-label="Copy link to section"
              className="group"
            >
              <Link size={18} className={`
                text-gray-500 group-hover:text-blue-500
                ${activeSection === `link-${sectionId}` ? 'text-green-500' : ''}
              `} />
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(content, sectionId)}
              aria-label="Copy content"
              className="group"
            >
              {activeSection === sectionId ? (
                <Check size={18} className="text-green-500" />
              ) : (
                <Copy size={18} className="text-gray-500 group-hover:text-blue-500" />
              )}
            </Button>
          </div>
        </div>
        
        {editingSection === sectionId && (
          <Card className="mb-4 border border-blue-400 dark:border-blue-600">
            <div className="p-4">
              <div className="flex flex-col space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Text to find"
                    className="pl-10 p-2 w-full rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <Edit size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={replacementText}
                    onChange={(e) => setReplacementText(e.target.value)}
                    placeholder="Replace with"
                    className="pl-10 p-2 w-full rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => replaceInContent(sectionId, content)}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    disabled={!searchText}
                  >
                    Replace All
                  </Button>
                  <Button
                    onClick={() => {
                      // Reset any modifications
                      const newModifiedContent = {...modifiedContent}
                      delete newModifiedContent[sectionId]
                      setModifiedContent(newModifiedContent)
                      setEditingSection(null)
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        <Card className={`overflow-auto ${isCode ? 'max-h-[500px]' : ''}`}>
          <div className="p-4">
            {renderContent(displayContent, isCode)}
          </div>
        </Card>
      </div>
    )
  }

  // Filter topics and subtopics based on search query
  const filteredTopics = searchQuery 
    ? exampleTopics
        .map(topic => ({
          ...topic,
          subtopics: topic.subtopics.filter(subtopic => 
            subtopic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subtopic.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }))
        .filter(topic => 
          topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.subtopics.length > 0
        )
    : exampleTopics;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} flex transition-colors duration-300`}>
      <Head>
        <title>Policy Viewer</title>
        <link rel="icon" href="/logo.jpg" />
        <style jsx global>{`
          html.dark body {
            background-color: #111827;
            color: white;
          }
          
          /* Add smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Better focus styles */
          *:focus-visible {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
          }
        `}</style>
      </Head>

      {/* Sidebar */}
      <div
        className={`${
          darkMode 
            ? 'bg-gray-900 border-r border-gray-700 text-gray-100' 
            : 'bg-white border-r border-gray-200 text-gray-800'
        } ${
          sidebarOpen ? "w-72" : "w-20"
        } transition-all duration-300 ease-in-out fixed h-screen overflow-hidden z-20 shadow-lg`}
      >
        <div className={`p-4 flex ${sidebarOpen ? "justify-between" : "justify-center"} items-center border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image 
                  src="/logo.jpg"
                  alt="Project Logo" 
                  fill
                  className="object-cover"
                />
              </div>
              <span className="ml-3 font-semibold">Policy Viewer</span>
            </div>
          ) : (
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image 
                src="/logo.jpg"
                alt="Project Logo" 
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="rounded-full p-2"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              className="rounded-full p-2"
            >
              {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </Button>
          </div>
        </div>
        
        {sidebarOpen && (
          <>
            <div className="p-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics..."
                  className="pl-10 p-2 w-full rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={() => setShowRaw(!showRaw)}
                  variant={showRaw ? "primary" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  {showRaw ? "Raw Mode" : "Formatted"}
                </Button>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100vh-180px)] hide-scrollbar px-2">
              <nav className="pb-16">
                {filteredTopics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="mb-2">
                    <a 
                      href={`#topic-${topicIndex}`}
                      className={`
                        block rounded-lg px-3 py-2 font-medium
                        ${currentBreadcrumbs.topic === topic.name
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800/60'
                        }
                        transition-colors duration-150
                      `}
                    >
                      {topic.name}
                    </a>
                    
                    {topic.subtopics.length > 0 && (
                      <ul className="mt-1 ml-2">
                        {topic.subtopics.map((subtopic, subtopicIndex) => (
                          <li key={subtopicIndex}>
                            <a 
                              href={`#subtopic-${topicIndex}-${subtopicIndex}`}
                              className={`
                                block rounded-lg px-3 py-1.5 mb-1 text-sm
                                ${currentBreadcrumbs.subtopic === subtopic.name
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800/40 text-gray-700 dark:text-gray-300'
                                }
                                transition-colors duration-150
                              `}
                            >
                              {subtopic.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Breadcrumbs - Fixed at the top of the main content */}
      <div className={`fixed ${sidebarOpen ? "left-72" : "left-20"} z-10 top-0 right-0 backdrop-blur-sm bg-opacity-80 ${darkMode ? 'bg-gray-900/80 border-b border-gray-700' : 'bg-white/80 border-b border-gray-200'} transition-all duration-300 ease-in-out shadow-sm`}>
        <div className="flex items-center h-14 px-6">
          <div className="flex items-center text-sm">
            {currentBreadcrumbs.topic && (
              <>
                <a 
                  href={`#topic-${exampleTopics.findIndex(t => t.name === currentBreadcrumbs.topic)}`}
                  className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline`}
                >
                  {currentBreadcrumbs.topic}
                </a>
                {currentBreadcrumbs.subtopic && (
                  <>
                    <ChevronRight size={16} className="mx-2 text-gray-400" />
                    <a 
                      href={`#subtopic-${exampleTopics.findIndex(t => t.name === currentBreadcrumbs.topic)}-${exampleTopics.find(t => t.name === currentBreadcrumbs.topic)?.subtopics.findIndex(s => s.name === currentBreadcrumbs.subtopic)}`}
                      className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline`}
                    >
                      {currentBreadcrumbs.subtopic}
                    </a>
                  </>
                )}
                {currentBreadcrumbs.section && (
                  <>
                    <ChevronRight size={16} className="mx-2 text-gray-400" />
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {currentBreadcrumbs.section}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className={`flex-grow p-8 pt-20 ${sidebarOpen ? "ml-72" : "ml-20"} transition-all duration-300 ease-in-out`}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Policy Viewer
            </span>
          </h1>

          {filteredTopics.map((topic, topicIndex) => (
            <div key={topicIndex} className="mb-12">
              <div 
                id={`topic-${topicIndex}`}
                className={`
                  mb-6 px-6 py-4 rounded-lg 
                  ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border-gray-200 shadow-md border'}
                `}
              >
                <h2 className="text-2xl font-bold flex items-center justify-between">
                  <span>{topic.name}</span>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => copyLinkToClipboard(`topic-${topicIndex}`)}
                    aria-label="Copy link to topic"
                    className="group"
                  >
                    <Link size={16} className={`
                      text-gray-500 group-hover:text-blue-500
                      ${activeSection === `link-topic-${topicIndex}` ? 'text-green-500' : ''}
                    `} />
                  </Button>
                </h2>
              </div>
              
              {topic.subtopics.map((subtopic, subtopicIndex) => (
                <div key={subtopicIndex} className="mb-10">
                  <div 
                    id={`subtopic-${topicIndex}-${subtopicIndex}`}
                    className={`
                      mb-6 px-6 py-3 rounded-lg
                      ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}
                    `}
                  >
                    <h3 className="text-xl font-semibold flex items-center justify-between">
                      <span>{subtopic.name}</span>
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => copyLinkToClipboard(`subtopic-${topicIndex}-${subtopicIndex}`)}
                        aria-label="Copy link to subtopic"
                        className="group"
                      >
                        <Link size={16} className={`
                          text-gray-500 group-hover:text-blue-500
                          ${activeSection === `link-subtopic-${topicIndex}-${subtopicIndex}` ? 'text-green-500' : ''}
                        `} />
                      </Button>
                    </h3>
                  </div>
                  
                  {renderSection("Description", subtopic.description, topicIndex, subtopicIndex)}
                  {renderSection("Golden Example Thought", subtopic.goldenExampleThought, topicIndex, subtopicIndex)}
                  {renderSection("Golden Example RTU", subtopic.goldenExampleRTU, topicIndex, subtopicIndex)}
                  {renderSection("Golden Example Code", subtopic.goldenExampleCode, topicIndex, subtopicIndex)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
    
  )
}