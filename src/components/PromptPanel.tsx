'use client'

import { useState, useEffect } from 'react'
import { PromptOption, PromptPanelProps } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

const PromptPanel: React.FC<PromptPanelProps> = ({ onSubmit, isLoading }) => {
  const [prompts, setPrompts] = useState<PromptOption[]>([
    { id: uuidv4(), text: '', isActive: true },
    { id: uuidv4(), text: '', isActive: false },
    { id: uuidv4(), text: '', isActive: false }
  ])

  const handleAddPrompt = () => {
    setPrompts([...prompts, { id: uuidv4(), text: '', isActive: false }])
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
    <div className="w-full h-full flex flex-col">
      <div className="space-y-3 flex-grow overflow-y-auto pr-1">
        {prompts.map((prompt, index) => (
          <div 
            key={prompt.id} 
            className={`
              p-3 rounded-md border transition-all
              ${prompt.isActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-200 bg-white'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`prompt-${prompt.id}`}
                  checked={prompt.isActive}
                  onChange={() => handleTogglePrompt(prompt.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label 
                  htmlFor={`prompt-${prompt.id}`} 
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Prompt {index + 1}
                </label>
              </div>
              
              <button
                type="button"
                onClick={() => handleRemovePrompt(prompt.id)}
                disabled={prompts.length <= 1}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                aria-label="Remove prompt"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <textarea
              value={prompt.text}
              onChange={(e) => handlePromptChange(prompt.id, e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
        ))}
      </div>
      
      <div className="flex mt-4 space-x-3">
        <button
          type="button"
          onClick={handleAddPrompt}
          className="flex items-center px-3 py-1.5 text-sm bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-colors shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="mr-1.5 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Prompt
        </button>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !prompts.some(p => p.isActive && p.text.trim() !== '')}
          className="flex-1 flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generating...
            </>
          ) : (
            'Generate Summary'
          )}
        </button>
      </div>
    </div>
  )
}

export default PromptPanel 