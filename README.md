# Policy Viewer

## Overview
A Next.js React project for visualizing and exploring data with markdown rendering and interactive components. Purpose is to show policies.

## Features
- Next.js Pages Router
- React Markdown rendering
- Syntax highlighting
- Dark/Light mode support
- Responsive design
- Custom logo and navigation

## Prerequisites
- Node.js (v16+)
- npm or yarn

## Installation
1. Clone the repository
   ```bash
   git clone https://github.com/devbm7/policy-viewer.git
   cd project-viewer
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Project
- Development mode
  ```bash
  npm run dev
  # or
  yarn dev
  ```

- Production build
  ```bash
  npm run build
  npm start
  # or
  yarn build
  yarn start
  ```

## Project Structure
```
/
├── pages/
│   ├── index.tsx
│   └── ...
├── public/
│   └── favicon.ico
├── resources/
│   └── topicsData.ts
└── styles/
    └── globals.css
```

## Technologies
- Next.js
- React
- Tailwind CSS
- React Markdown
- Syntax Highlighter

## Customization
- Modify `topicsData.ts` to update content
- Adjust Tailwind config for theming
- Customize Logo and Layout components

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Create a pull request

## License
MIT License
