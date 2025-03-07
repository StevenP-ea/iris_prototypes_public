'use client'

import { useState } from 'react'
import FileUploader from '@/components/FileUploader'
import PromptPanel from '@/components/PromptPanel'
import SummaryPanel from '@/components/SummaryPanel'
import { CSVData } from '@/lib/types'

export default function Home() {
  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [initialSummary, setInitialSummary] = useState<string>('')
  const [currentSummary, setCurrentSummary] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleCsvUpload = async (data: CSVData) => {
    setCsvData(data)
    setIsLoading(true)
    setError(null)
    
    try {
      // Generate initial summary from CSV data
      const summary = await generateSummary(data, [])
      setInitialSummary(summary)
      setCurrentSummary(summary)
    } catch (err: any) {
      setError('Failed to generate summary. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptSubmit = async (prompts: string[]) => {
    if (!csvData) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const summary = await generateSummary(csvData, prompts)
      setCurrentSummary(summary)
    } catch (err: any) {
      setError('Failed to generate summary. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const resetSummary = () => {
    setCurrentSummary(initialSummary)
  }

  const generateSummary = async (data: CSVData, prompts: string[]): Promise<string> => {
    try {
      // Use the server-side API route instead of calling OpenAI directly
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, prompts }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const result = await response.json();
      return result.summary;
      
      // Keep the mock implementation as a fallback (commented out)
      /*
      return new Promise((resolve) => {
        setTimeout(() => {
          const headers = data.headers.join(', ')
          let summaryText = `This is a summary of the CSV data with ${data.rows.length} rows and columns: ${headers}.\n\n`;
          
          // Add a sample of the data
          summaryText += `Sample data preview (first 5 rows):\n`;
          for (let i = 0; i < Math.min(5, data.rows.length); i++) {
            summaryText += `Row ${i + 1}: ${data.rows[i].join(', ')}\n`;
          }
          
          summaryText += `\nData Analysis:\n`;
          summaryText += `- This dataset contains information about ${headers.toLowerCase()}.\n`;
          summaryText += `- There are ${data.rows.length} records in total.\n`;
          
          if (prompts.length > 0) {
            summaryText += `\nPrompt-specific insights:\n`;
            prompts.forEach((prompt, index) => {
              summaryText += `- Based on prompt "${prompt}": This would require further analysis of the data patterns.\n`;
            });
          }
          
          return resolve(summaryText);
        }, 1500);
      });
      */
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary');
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with logo and title */}
      <header className="bg-white border-b border-gray-200 py-3 px-6">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-medium text-gray-800">Iris CSV Analyzer</h1>
        </div>
      </header>
      
      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Summary */}
        <div className="w-1/2 flex flex-col border-r border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Summary</h2>
          </div>
          
          <div className="flex-1 overflow-auto p-5">
            <SummaryPanel 
              summary={currentSummary}
              onChange={setCurrentSummary}
              onReset={resetSummary}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
        
        {/* Right panel - File uploader and prompts */}
        <div className="w-1/2 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              {csvData ? 'Test Prompts' : 'Upload CSV'}
            </h2>
          </div>
          
          <div className="flex-1 overflow-auto p-5">
            {!csvData ? (
              <div className="h-full flex items-center justify-center">
                <div className="max-w-md w-full">
                  <FileUploader onUpload={handleCsvUpload} />
                </div>
              </div>
            ) : (
              <PromptPanel onSubmit={handlePromptSubmit} isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 