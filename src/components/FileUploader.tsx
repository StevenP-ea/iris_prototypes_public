'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import { CSVData, FileUploaderProps } from '@/lib/types'

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-3">
          <svg 
            className="mx-auto h-10 w-10 text-gray-400" 
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
          <p className="text-base font-medium text-gray-700">
            {isDragActive 
              ? 'Drop your CSV file here' 
              : 'Drag and drop your CSV file here'}
          </p>
          <p className="text-sm text-gray-500">or click to browse files</p>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2" />
          <span className="text-sm text-gray-600">Processing file...</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}

export default FileUploader 