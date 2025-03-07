'use client'

import { useState, useEffect } from 'react'
import { SummaryPanelProps } from '@/lib/types'

// Helper function to safely check if we're in a browser context
const isBrowser = () => typeof window !== 'undefined'

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  summary,
  onChange,
  onReset,
  isLoading,
  error
}) => {
  // Save current summary to localStorage when it changes
  useEffect(() => {
    if (isBrowser() && summary) {
      try {
        localStorage.setItem('iris-current-summary', summary)
      } catch (error) {
        console.error('Failed to save current summary:', error)
      }
    }
  }, [summary])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Content area */}
        {isLoading ? (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            background: 'white', 
            borderRadius: '0.375rem', 
            border: '1px solid #e5e7eb', 
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
              <div style={{ 
                height: '1.5rem', 
                width: '1.5rem', 
                animation: 'spin 1s linear infinite', 
                borderRadius: '9999px', 
                borderWidth: '3px', 
                borderColor: '#bfdbfe', 
                borderTopColor: '#3b82f6' 
              }} />
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>Generating summary...</p>
            </div>
          </div>
        ) : error ? (
          <div style={{ 
            marginTop: '0.5rem', 
            padding: '1rem', 
            background: '#fee2e2', 
            border: '1px solid #fecaca', 
            borderRadius: '0.375rem' 
          }}>
            <div style={{ display: 'flex' }}>
              <svg style={{ height: '1rem', width: '1rem', color: '#ef4444', marginRight: '0.5rem', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p style={{ fontSize: '0.875rem', color: '#b91c1c' }}>{error}</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onReset}
                disabled={!summary}
                style={{ 
                  padding: '0.375rem 0.75rem', 
                  backgroundColor: 'white', 
                  color: '#4b5563', 
                  fontWeight: 500, 
                  borderRadius: '0.375rem', 
                  borderWidth: '1px', 
                  borderColor: '#d1d5db', 
                  transition: 'all 150ms ease', 
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  opacity: !summary ? '0.5' : '1',
                  cursor: !summary ? 'not-allowed' : 'pointer'
                }}
              >
                <svg style={{ 
                  display: 'inline-block', 
                  marginLeft: '-0.125rem', 
                  marginRight: '0.375rem', 
                  height: '0.75rem', 
                  width: '0.75rem', 
                  color: '#6b7280' 
                }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            </div>
            
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              background: 'white', 
              borderRadius: '0.375rem', 
              border: '1px solid #e5e7eb', 
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', 
              overflow: 'hidden', 
              marginBottom: '0.75rem' 
            }}>
              <textarea
                value={summary}
                onChange={(e) => onChange(e.target.value)}
                style={{ 
                  flex: 1, 
                  width: '100%', 
                  padding: '1rem', 
                  borderWidth: 0,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', 
                  fontSize: '0.875rem',
                  resize: 'none',
                  outline: 'none'
                }}
                placeholder="Summary will appear here after uploading a CSV file and generating a summary."
              />
              
              {summary && (
                <div style={{ 
                  padding: '0.5rem 1rem', 
                  borderTop: '1px solid #f3f4f6', 
                  background: '#f9fafb', 
                  fontSize: '0.75rem', 
                  color: '#6b7280', 
                  display: 'flex', 
                  justifyContent: 'space-between' 
                }}>
                  <div>{summary.length} characters</div>
                  <div>~{Math.ceil(summary.length / 5)} words</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SummaryPanel 