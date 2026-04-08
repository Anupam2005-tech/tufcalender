# Calendar Application

A modern calendar application built with Next.js and Tailwind.

## Technology Stack & Detailed Choices

### Frontend Framework: Next.js 16 & React 19
- **Why Next.js?** We chose Next.js (specifically version 16) to leverage its powerful App Router and Server Components architecture. This allows us to fetch data efficiently on the server and ship less JavaScript to the client, leading to a highly performant application. Its built-in routing, API routes, and optimized build process drastically reduce boilerplate.
- **Why React 19?** React remains the industry standard for component-based UI development. Version 19 introduces significant performance improvements and concurrency features that make our calendar's interactive state management smooth, especially when handling complex view transitions or rapid user interactions.

### Styling: Tailwind CSS (v4)
- **Why Tailwind CSS?** For our styling solution, we needed rapid iteration without sacrificing maintainability. Tailwind CSS allows developers to apply utility classes directly in the markup, avoiding the context-switching and naming fatigue associated with traditional CSS or CSS modules. Version 4 provides a modern styling engine with outstanding performance and zero-configuration out of the box, ensuring our calendar looks beautifully responsive on all devices.

### Date Manipulation: `date-fns`
- **Why `date-fns`?** Building a calendar inherently requires complex date arithmetic, formatting, and time zone management. `date-fns` operates on native JavaScript `Date` objects and offers modular capabilities. This means we can import only the specific functions we need (like `addDays`, `startOfWeek`, `format`), resulting in a significantly smaller bundle size compared to monolithic libraries like Moment.js, all while retaining strong locale support.

### Icons: Lucide React
- **Why Lucide React?** Lucide is an open-source, community-driven icon library that provides clean, consistent SVG icons. Using `lucide-react` allows us to import icons individually as React components. It integrates seamlessly into our application, allowing us to dynamically scale and color them using Tailwind utility classes while keeping the final bundle small.

### Language: TypeScript
- **Why TypeScript?** A calendar entails complex logic involving recurring events, date ranges, and intersecting time periods. TypeScript provides robust static typing, enabling us to define strict data models, interfaces, and function signatures. This dramatically improves developer confidence, catches bugs at compile-time instead of runtime, and delivers a superb autocompletion experience in code editors.

## Setup & Running Locally

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

You need to have Node.js and a package manager (npm, yarn, or pnpm) installed on your system.

### Installation

1. Clone this repository and navigate into the project directory:

(with ssh key)
```bash
git clone git@github.com:Anupam2005-tech/tufcalender.git
cd calender
```

2. Install the application dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running the Development Server

Start the application in development mode:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will start, and you can view it by opening your browser and navigating to [http://localhost:3000](http://localhost:3000).


## Scripts Overview

- `npm run dev`: Starts the development server.
- `npm run build`: Compiles the application for production deployment.
- `npm run start`: Starts a Next.js production server.
- `npm run lint`: Runs ESLint to identify code quality issues.
