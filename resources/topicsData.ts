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
      name: "",
      subtopics: [
        {
          name: "",
          description: '',
          goldenExampleThought: "",
          goldenExampleRTU: "",
          goldenExampleCode: ``,
        },
      ],
    },
  ]