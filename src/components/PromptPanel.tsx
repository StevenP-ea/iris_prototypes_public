'use client'

import { useState, useEffect } from 'react'
import { PromptOption, PromptPanelProps } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

// Helper function to safely check if we're in a browser context
const isBrowser = () => typeof window !== 'undefined'

const PromptPanel: React.FC<PromptPanelProps> = ({ onSubmit, isLoading }) => {
  const [prompts, setPrompts] = useState<PromptOption[]>([
    { id: uuidv4(), text: '', isActive: true, name: 'General Summary' },
    { id: uuidv4(), text: '', isActive: false, name: 'Key Insights' },
  ])
  
  const [editingNameId, setEditingNameId] = useState<string | null>(null)

  // Load saved prompts from localStorage
  useEffect(() => {
    if (isBrowser()) {
      try {
        const savedPrompts = localStorage.getItem('iris-prompts')
        if (savedPrompts) {
          // Handle backward compatibility with older saved prompts that might not have name field
          const parsedPrompts = JSON.parse(savedPrompts)
          const updatedPrompts = parsedPrompts.map((p: any, index: number) => ({
            ...p, 
            name: p.name || `Prompt ${index + 1}`
          }))
          setPrompts(updatedPrompts)
        }
      } catch (error) {
        console.error('Failed to load saved prompts:', error)
      }
    }
  }, [])

  // Save prompts to localStorage when they change
  useEffect(() => {
    if (isBrowser()) {
      try {
        localStorage.setItem('iris-prompts', JSON.stringify(prompts))
      } catch (error) {
        console.error('Failed to save prompts:', error)
      }
    }
  }, [prompts])

  const handleAddPrompt = () => {
    const newPromptIndex = prompts.length + 1
    setPrompts([...prompts, { 
      id: uuidv4(), 
      text: '', 
      isActive: false, 
      name: `Prompt ${newPromptIndex}` 
    }])
  }

  const handleRemovePrompt = (id: string) => {
    if (prompts.length <= 1) return
    setPrompts(prompts.filter(prompt => prompt.id !== id))
  }

  const handlePromptChange = (id: string, text: string) => {
    setPrompts(
      prompts.map(prompt => 
        prompt.id === id ? { ...prompt, text } : prompt
      )
    )
  }

  const handleNameChange = (id: string, name: string) => {
    setPrompts(
      prompts.map(prompt => 
        prompt.id === id ? { ...prompt, name } : prompt
      )
    )
  }

  const handleTogglePrompt = (id: string) => {
    setPrompts(
      prompts.map(prompt => 
        prompt.id === id ? { ...prompt, isActive: !prompt.isActive } : prompt
      )
    )
  }

  const handleSubmit = () => {
    const activePrompts = prompts
      .filter(prompt => prompt.isActive && prompt.text.trim() !== '')
      .map(prompt => prompt.text)
    
    onSubmit(activePrompts)
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem', 
        flex: 1, 
        overflowY: 'auto', 
        paddingRight: '0.25rem', 
        marginBottom: '1rem' 
      }}>
        {prompts.map((prompt, index) => (
          <div 
            key={prompt.id} 
            style={{ 
              padding: '0.75rem', 
              borderRadius: '0.375rem', 
              border: '1px solid', 
              borderColor: prompt.isActive ? '#93c5fd' : '#e5e7eb', 
              backgroundColor: prompt.isActive ? '#eff6ff' : 'white', 
              transition: 'all 150ms ease' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id={`prompt-${prompt.id}`}
                  checked={prompt.isActive}
                  onChange={() => handleTogglePrompt(prompt.id)}
                  style={{ 
                    height: '0.875rem', 
                    width: '0.875rem', 
                    borderRadius: '0.25rem', 
                    borderColor: '#d1d5db',
                    color: '#3b82f6',
                    accentColor: '#3b82f6' 
                  }}
                />
                {editingNameId === prompt.id ? (
                  <input
                    type="text"
                    value={prompt.name}
                    onChange={(e) => handleNameChange(prompt.id, e.target.value)}
                    onBlur={() => setEditingNameId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingNameId(null)
                      }
                    }}
                    autoFocus
                    style={{ 
                      marginLeft: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#4b5563',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      width: '10rem',
                      outline: 'none'
                    }}
                  />
                ) : (
                  <label 
                    htmlFor={`prompt-${prompt.id}`} 
                    style={{ 
                      marginLeft: '0.5rem', 
                      fontSize: '0.875rem', 
                      fontWeight: 500, 
                      color: '#4b5563',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      setEditingNameId(prompt.id)
                    }}
                  >
                    {prompt.name}
                    <svg
                      style={{ 
                        marginLeft: '0.25rem', 
                        height: '0.75rem', 
                        width: '0.75rem', 
                        color: '#9ca3af',
                        opacity: 0.7
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </label>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => handleRemovePrompt(prompt.id)}
                disabled={prompts.length <= 1}
                style={{ 
                  color: '#9ca3af', 
                  opacity: prompts.length <= 1 ? '0.5' : '1',
                  cursor: prompts.length <= 1 ? 'not-allowed' : 'pointer'
                }}
                aria-label="Remove prompt"
              >
                <svg style={{ height: '0.75rem', width: '0.75rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <textarea
              value={prompt.text}
              onChange={(e) => handlePromptChange(prompt.id, e.target.value)}
              placeholder="Enter instructions for summarizing the CSV data..."
              style={{ 
                width: '100%', 
                padding: '0.5rem 0.75rem', 
                fontSize: '0.875rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.375rem', 
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', 
                outline: 'none',
                minHeight: '4rem',
                resize: 'vertical'
              }}
              rows={2}
            />
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={handleAddPrompt}
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '0.375rem', 
            fontSize: '0.875rem', 
            backgroundColor: 'white', 
            color: '#4b5563', 
            fontWeight: 500, 
            borderRadius: '0.375rem', 
            border: '1px solid #d1d5db', 
            transition: 'all 150ms ease', 
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
          }}
        >
          <svg style={{ marginRight: '0.375rem', height: '0.75rem', width: '0.75rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Prompt
        </button>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !prompts.some(p => p.isActive && p.text.trim() !== '')}
          style={{ 
            width: '100%', 
            padding: '0.625rem 1rem', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            fontWeight: 500, 
            borderRadius: '0.375rem', 
            transition: 'all 150ms ease', 
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            opacity: isLoading || !prompts.some(p => p.isActive && p.text.trim() !== '') ? '0.5' : '1',
            cursor: isLoading || !prompts.some(p => p.isActive && p.text.trim() !== '') ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ 
                marginRight: '0.5rem', 
                height: '0.75rem', 
                width: '0.75rem', 
                animation: 'spin 1s linear infinite', 
                borderRadius: '9999px', 
                borderWidth: '2px', 
                borderColor: 'white', 
                borderTopColor: 'transparent' 
              }} />
              <span>Generating Summary...</span>
            </div>
          ) : (
            'Generate Summary'
          )}
        </button>
      </div>
    </div>
  )
}

export default PromptPanel 