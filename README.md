# FormFlow

**AI-Powered Form Builder & Response Analysis Platform (WIP)**

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Overview

FormFlow is an innovative AI-powered form builder platform that revolutionizes how you create, customize, and analyze forms. Using advanced AI technology, FormFlow enables you to rapidly generate forms, analyze responses with our intelligent agent, automate workflows, and seamlessly integrate with third-party services.

## Key Features

### AI Form Generation & Customization
- **AI-Powered Form Creation**: Generate complete forms instantly using natural language
- **AI-Assisted Editing**: Request specific modifications to your form through AI
- **Unlimited Flexibility**: Build any form you can imagine with our powerful editor
- **Themes & Styling**: Customize the look and feel of your forms with themes

### Fatten - Your AI Analysis Assistant
- **Response Understanding**: Get AI-powered insights on form submissions
- **Automated Filtering**: Sort and filter responses using natural language
- **Advanced Visualization**: Generate charts and reports from your data
- **Multimedia Analysis**: AI can process text, images, videos, and files in responses
- **Time-Saving Automation**: Automate repetitive analysis tasks

### Powerful Workflow Automation
- **AI Workflow Builder**: Get AI assistance to create sophisticated workflows
- **Third-Party Integrations**: Connect with CRM systems and other business tools
- **Automation Pipeline**: Build advanced automation similar to n8n
- **Conditional Logic**: Create complex form logic and branching

### Headless & API Capabilities
- **Headless Form Submissions**: Submit responses through API
- **Custom UI Integration**: Build your own UI while leveraging FormFlow's backend
- **Embed Anywhere**: Integrate into embedded systems, AI agents, or any application
- **Full API Access**: Access all FormFlow features programmatically

## Project Structure

FormFlow is built as a monorepo using Turborepo, with the following main components:

### Apps

- **app**: Main FormFlow application with AI form builder and dashboard
- **api**: Backend API services
- **form-preview**: Form preview functionality
- **web**: Marketing website
- **docs**: Documentation site
- **email**: Email template preview and testing
- **storybook**: Component library documentation

### Packages

- **ai**: AI capabilities for form generation, analysis, and enhancement
- **design-system**: Shared UI components and styling
- **database**: Database schema and services
- **auth**: Authentication utilities
- **analytics**: Analytics integration
- **collaboration**: Real-time collaboration features
- **email**: Email templates and sending functionality
- **payments**: Payment processing
- **webhooks**: Webhook handling for third-party integrations
- **schema-types**: Shared type definitions
- **and more**: Various utility packages

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PNPM (v9.15.4 or later)
- Supabase or PostgreSQL (for database)
- Doppler (for environment management)

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/your-username/formflow.git
   cd formflow
   ```

2. Install dependencies
   ```sh
   pnpm install
   ```

3. Set up environment variables
   ```sh
   # Set up your .env files or use Doppler
   ```

4. Initialize the database
   ```sh
   pnpm db:migrate
   pnpm db:push
   ```

5. Start the development server
   ```sh
   pnpm dev
   ```

## Development

### Commands

- `pnpm dev` - Start the development server
- `pnpm build` - Build all packages and applications
- `pnpm lint` - Lint the codebase
- `pnpm format` - Format code
- `pnpm test` - Run tests
- `pnpm db:migrate` - Run database migrations
- `pnpm db:generate` - Generate database schema
- `pnpm db:push` - Push changes to the database

### Architecture

FormFlow uses a modern architecture with:

- **Next.js** for frontend and API routes
- **React** for UI components
- **Tailwind CSS** for styling
- **Drizzle ORM** for database interactions
- **AI Models** for form generation and response analysis
- **Zustand** for state management
- **React Hook Form** for form handling
- **Zod** for validation
- **Clerk** for authentication
- **Liveblocks** for collaboration features

## Deployment

The applications can be deployed to Vercel or any other hosting provider that supports Next.js applications.

```sh
pnpm build
```

## Use Cases

- **Customer Feedback**: Generate insightful feedback forms and analyze responses automatically
- **Lead Generation**: Create forms that integrate with your CRM and automate follow-ups
- **Data Collection**: Gather and analyze data with AI-powered insights
- **Surveys**: Build complex surveys with branching logic and AI analysis
- **Applications**: Process applications with AI filtering and sorting
- **Embedded Systems**: Use our API to collect data from IoT devices
- **AI Agents**: Integrate form capabilities into your own AI systems

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Turborepo](https://turbo.build/repo)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
