'use client'

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { CSVData, FileUploaderProps } from '@/lib/types'

// Helper function to safely check if we're in a browser context
const isBrowser = () => typeof window !== 'undefined'

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentFiles, setRecentFiles] = useState<string[]>([])

  // Load recent files from localStorage
  useEffect(() => {
    if (isBrowser()) {
      try {
        const savedRecentFiles = localStorage.getItem('iris-recent-files')
        if (savedRecentFiles) {
          setRecentFiles(JSON.parse(savedRecentFiles))
        }
      } catch (error) {
        console.error('Failed to load recent files:', error)
      }
    }
  }, [])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setIsLoading(true)
      setError(null)

      Papa.parse(file, {
        header: true,
        complete: (results) => {
          try {
            if (results.errors && results.errors.length > 0) {
              throw new Error(`CSV parsing error: ${results.errors[0].message}`)
            }

            // Extract headers from results
            const headers = results.meta.fields || []
            
            // Extract data rows
            const rows = results.data.map((row: any) => 
              headers.map(header => row[header])
            )

            // Create CSV data object
            const csvData: CSVData = {
              headers,
              rows
            }

            // Update recent files
            if (isBrowser()) {
              try {
                const updatedRecentFiles = [file.name, ...recentFiles.filter(name => name !== file.name).slice(0, 4)]
                setRecentFiles(updatedRecentFiles)
                localStorage.setItem('iris-recent-files', JSON.stringify(updatedRecentFiles))
              } catch (error) {
                console.error('Failed to save recent files:', error)
              }
            }

            onUpload(csvData)
          } catch (err: any) {
            setError(err.message || 'Failed to parse CSV file')
            console.error(err)
          } finally {
            setIsLoading(false)
          }
        },
        error: (err) => {
          setError(err.message || 'Failed to parse CSV file')
          setIsLoading(false)
        }
      })
    },
    [onUpload, recentFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  })

  return (
    <div style={{ width: '100%' }}>
      <div
        {...getRootProps()}
        style={{ 
          borderWidth: '2px', 
          borderStyle: 'dashed', 
          borderRadius: '0.375rem', 
          padding: '1.25rem', 
          textAlign: 'center', 
          cursor: 'pointer', 
          transition: 'all 150ms ease',
          borderColor: isDragActive ? '#3b82f6' : '#d1d5db',
          backgroundColor: isDragActive ? '#eff6ff' : 'transparent'
        }}
      >
        <input {...getInputProps()} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <svg 
            style={{ margin: '0 auto', height: '1.5rem', width: '1.5rem', color: '#9ca3af' }} 
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563' }}>
            {isDragActive 
              ? 'Drop your CSV file here' 
              : 'Drag and drop your CSV file here'}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>or click to browse files</p>
        </div>
      </div>

      {isLoading && (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ 
            display: 'inline-block', 
            animation: 'spin 1s linear infinite', 
            height: '1rem', 
            width: '1rem', 
            borderWidth: '2px', 
            borderStyle: 'solid',
            borderColor: '#3b82f6', 
            borderTopColor: 'transparent', 
            borderRadius: '9999px', 
            marginRight: '0.5rem' 
          }} />
          <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>Processing file...</span>
        </div>
      )}

      {error && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          backgroundColor: '#fee2e2', 
          border: '1px solid #fecaca', 
          borderRadius: '0.375rem' 
        }}>
          <p style={{ fontSize: '0.875rem', color: '#b91c1c' }}>{error}</p>
        </div>
      )}
      
      {!isLoading && recentFiles.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.5rem' }}>
            Recent Files
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {recentFiles.map((fileName, index) => (
              <div key={index} style={{ 
                fontSize: '0.75rem', 
                color: '#4b5563', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap' 
              }}>
                {fileName}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader 