# Iris - CSV Data Summary Generator

Iris is a web application that helps you process CSV data and generate summaries using AI. It allows you to test multiple prompt variations and iterate on the generated summaries.

## Features

- **CSV Data Upload**: Upload CSV files through a drag-and-drop interface
- **Multi-prompt Testing**: Create and toggle multiple prompt variations
- **Dual-panel Layout**: Left sidebar for prompt management, right panel for summary viewing/editing
- **Summary Generation**: Generate summaries based on CSV data and selected prompts
- **Editable Summaries**: Manually edit generated summaries and reset to original versions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Upload a CSV file using the file uploader.
2. Once the CSV is processed, an initial summary will be generated automatically.
3. Use the left sidebar to create and toggle different prompt variations.
4. Click "Generate Summary" to apply selected prompts to the data.
5. Edit the generated summary in the right panel if needed.
6. Click "Reset" to revert to the original generated summary.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI API
- PapaParse (for CSV parsing)
- React Dropzone (for file uploads) 