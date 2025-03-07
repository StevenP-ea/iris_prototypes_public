'use client'

import { SummaryPanelProps } from '@/lib/types'

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  summary,
  onChange,
  onReset,
  isLoading,
  error
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Action bar */}
      <div className="flex justify-end mb-3">
        <button
          type="button"
          onClick={onReset}
          disabled={!summary}
          className="px-3 py-1.5 text-sm bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <svg className="inline-block -ml-0.5 mr-1.5 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center bg-white rounded-md border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center p-6">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-200 border-t-blue-600" />
            <p className="mt-4 text-sm text-gray-600">Generating summary...</p>
          </div>
        </div>
      ) : error ? (
        <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
          <textarea
            value={summary}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 p-4 font-mono text-sm text-gray-800 resize-none focus:outline-none"
            placeholder="Summary will appear here after CSV data is uploaded and processed..."
          />
          
          <div className="py-2 px-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
            {summary ? `${summary.length} characters` : 'No summary generated yet'}
          </div>
        </div>
      )}
    </div>
  )
}

export default SummaryPanel 