'use client'

import { useState, useEffect } from 'react'
import FileUploader from '@/components/FileUploader'
import PromptPanel from '@/components/PromptPanel'
import SummaryPanel from '@/components/SummaryPanel'
import { CSVData } from '@/lib/types'

// Helper function to safely check if we're in a browser context
const isBrowser = () => typeof window !== 'undefined'

export default function Home() {
  const [csvData, setCsvData] = useState<CSVData | null>(null)
  const [initialSummary, setInitialSummary] = useState<string>('')
  const [currentSummary, setCurrentSummary] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved summary from localStorage if available
  useEffect(() => {
    if (isBrowser() && !csvData) {
      try {
        const savedCsvData = localStorage.getItem('iris-csv-data')
        const savedSummary = localStorage.getItem('iris-summary')
        
        if (savedCsvData && savedSummary) {
          setCsvData(JSON.parse(savedCsvData))
          setInitialSummary(savedSummary)
          setCurrentSummary(savedSummary)
        }
      } catch (error) {
        console.error('Failed to load saved data:', error)
      }
    }
  }, [csvData])

  const handleCsvUpload = async (data: CSVData) => {
    setCsvData(data)
    setIsLoading(true)
    setError(null)
    
    try {
      // Generate initial summary from CSV data
      const summary = await generateSummary(data, [])
      setInitialSummary(summary)
      setCurrentSummary(summary)
      
      // Save to localStorage
      if (isBrowser()) {
        try {
          localStorage.setItem('iris-csv-data', JSON.stringify(data))
          localStorage.setItem('iris-summary', summary)
        } catch (error) {
          console.error('Failed to save data:', error)
        }
      }
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
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header style={{ 
        background: 'white', 
        borderBottom: '1px solid #e5e7eb', 
        padding: '1rem 1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '1.5rem', 
            height: '1.5rem', 
            borderRadius: '9999px', 
            background: '#3b82f6', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginRight: '0.75rem' 
          }}>
            <svg style={{ width: '0.75rem', height: '0.75rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937' }}>Iris Summary Prototype</h1>
        </div>
      </header>
      
      {/* Main content - 2 column layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel - Summary */}
        <div style={{ 
          width: '66.666667%', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '1.5rem', 
          overflowY: 'auto', 
          borderRight: '1px solid #e5e7eb'
        }}>
          <h2 style={{ 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            textTransform: 'uppercase', 
            letterSpacing: '0.025em', 
            color: '#4b5563', 
            marginBottom: '1rem' 
          }}>
            Summary
          </h2>
          <SummaryPanel 
            summary={currentSummary}
            onChange={setCurrentSummary}
            onReset={resetSummary}
            isLoading={isLoading}
            error={error}
          />
          
          {/* Placeholder for future visualizations */}
          {csvData && currentSummary && !isLoading && (
            <div style={{ 
              marginTop: '1.5rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.375rem', 
              background: 'white', 
              padding: '1rem' 
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.75rem' }}>
                Data Preview
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f9fafb' }}>
                    <tr>
                      {csvData.headers.slice(0, 5).map((header, index) => (
                        <th 
                          key={index}
                          style={{ 
                            padding: '0.5rem 0.75rem', 
                            textAlign: 'left', 
                            fontSize: '0.75rem', 
                            fontWeight: 500,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.025em',
                            borderBottom: '1px solid #e5e7eb'
                          }}
                        >
                          {header}
                        </th>
                      ))}
                      {csvData.headers.length > 5 && (
                        <th style={{ 
                          padding: '0.5rem 0.75rem', 
                          textAlign: 'left', 
                          fontSize: '0.75rem', 
                          fontWeight: 500,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.025em',
                          borderBottom: '1px solid #e5e7eb'
                        }}>
                          ...
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.rows.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex} style={{ background: rowIndex % 2 === 0 ? 'white' : '#f9fafb' }}>
                        {row.slice(0, 5).map((cell, cellIndex) => (
                          <td 
                            key={cellIndex} 
                            style={{ 
                              padding: '0.5rem 0.75rem', 
                              fontSize: '0.875rem', 
                              color: '#6b7280', 
                              maxWidth: '16rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              borderBottom: '1px solid #e5e7eb'
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                        {row.length > 5 && (
                          <td style={{ 
                            padding: '0.5rem 0.75rem', 
                            fontSize: '0.875rem', 
                            color: '#6b7280',
                            borderBottom: '1px solid #e5e7eb'
                          }}>...</td>
                        )}
                      </tr>
                    ))}
                    {csvData.rows.length > 5 && (
                      <tr>
                        <td 
                          colSpan={Math.min(6, csvData.headers.length)} 
                          style={{ 
                            padding: '0.5rem 0.75rem', 
                            fontSize: '0.875rem', 
                            color: '#6b7280', 
                            textAlign: 'center',
                            fontStyle: 'italic',
                            borderBottom: '1px solid #e5e7eb'
                          }}
                        >
                          {csvData.rows.length - 5} more rows
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Panel - Upload & Prompts */}
        <div style={{ 
          width: '33.333333%', 
          display: 'flex', 
          flexDirection: 'column', 
          background: '#f3f4f6', 
          borderLeft: '1px solid #e5e7eb', 
          overflowY: 'auto' 
        }}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '0.875rem', 
              fontWeight: 500, 
              textTransform: 'uppercase', 
              letterSpacing: '0.025em', 
              color: '#4b5563', 
              marginBottom: '1rem' 
            }}>
              Upload CSV
            </h2>
            {!csvData ? (
              <FileUploader onUpload={handleCsvUpload} />
            ) : (
              <div style={{ 
                marginBottom: '1.5rem', 
                background: 'white', 
                borderRadius: '0.375rem', 
                border: '1px solid #e5e7eb', 
                padding: '1rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>CSV Uploaded</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {csvData.rows.length} rows × {csvData.headers.length} columns
                    </div>
                  </div>
                  <button 
                    className="iris-button-secondary"
                    style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.5rem' 
                    }}
                    onClick={() => {
                      setCsvData(null);
                      setInitialSummary('');
                      setCurrentSummary('');
                    }}
                  >
                    Replace
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {csvData && (
            <div style={{ padding: '1.5rem', paddingTop: 0 }}>
              <h2 style={{ 
                fontSize: '0.875rem', 
                fontWeight: 500, 
                textTransform: 'uppercase', 
                letterSpacing: '0.025em', 
                color: '#4b5563', 
                marginBottom: '1rem' 
              }}>
                Prompts
              </h2>
              <PromptPanel onSubmit={handlePromptSubmit} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 