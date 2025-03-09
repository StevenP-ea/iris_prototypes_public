# Iris - CSV Data Summarizer

Iris is a web application that helps users generate insightful summaries from CSV data using AI-powered analysis. The application provides an intuitive interface for uploading CSV files and creating customized summaries based on user prompts.

## Features

- **CSV Upload**: Easily upload and parse CSV files
- **Custom Prompts**: Create, rename, and manage multiple prompts for different summary styles
- **AI-Powered Summaries**: Generate in-depth analysis of CSV data using OpenAI's API
- **Editable Results**: Modify and refine generated summaries
- **Persistent Storage**: Automatically saves prompts and summaries to browser storage

## Technology Stack

- **Frontend**: Next.js 14 with React
- **Styling**: Custom CSS with inline styles for component-specific design
- **Data Processing**: Papa Parse for CSV handling
- **AI Integration**: OpenAI API for generating summaries
- **State Management**: React Hooks for local state management

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/StevenP-ea/iris_prototypes_public.git
   cd iris_prototypes_public
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## Usage

1. Upload a CSV file by dragging and dropping it into the upload area or clicking to browse files
2. Customize your prompts for generating summaries
3. Click "Generate Summary" to analyze your data
4. Edit and refine the generated summary as needed

## Project Structure

- `/src/app` - Next.js app router files including the main page
- `/src/components` - React components (FileUploader, PromptPanel, SummaryPanel)
- `/src/lib` - Utility functions and type definitions
- `/public` - Static assets

## License

MIT 