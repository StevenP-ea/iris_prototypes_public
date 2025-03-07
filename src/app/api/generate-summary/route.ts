import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { CSVData } from '@/lib/types'

// Initialize OpenAI client (this runs server-side)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'your-api-key-here',
})

// This is a server-side API route that will handle the OpenAI requests
export async function POST(request: Request) {
  try {
    const { data, prompts } = await request.json()
    
    if (!data || !data.headers || !data.rows) {
      return NextResponse.json(
        { error: 'Invalid request. CSV data is required.' },
        { status: 400 }
      )
    }
    
    // Convert CSV data to a string format
    const csvString = formatCSVDataForPrompt(data)
    
    // Create the system message
    const systemMessage = `You are an expert data analyst. Your task is to analyze the following CSV data and provide a comprehensive summary.`
    
    // Create the user message combining CSV data and prompts
    let userMessage = `Here is the CSV data:\n\n${csvString}\n\n`
    
    // Add prompts if there are any
    if (prompts && prompts.length > 0) {
      userMessage += `Please incorporate the following instructions in your summary:\n`
      prompts.forEach((prompt: string, index: number) => {
        userMessage += `${index + 1}. ${prompt}\n`
      })
    } else {
      userMessage += `Please provide a comprehensive summary of this data.`
    }

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Updated to use GPT-4o model
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })

    // Return the generated summary
    return NextResponse.json({
      summary: response.choices[0]?.message?.content || 'Failed to generate summary.'
    })
  } catch (error) {
    console.error('Error generating summary with OpenAI:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary with AI.' },
      { status: 500 }
    )
  }
}

/**
 * Format CSV data as a string for the prompt
 */
function formatCSVDataForPrompt(data: CSVData): string {
  // Create header row
  let csvString = data.headers.join(',') + '\n'
  
  // Add data rows
  // Limit to first 100 rows to avoid token limits
  const maxRows = Math.min(data.rows.length, 100)
  for (let i = 0; i < maxRows; i++) {
    csvString += data.rows[i].join(',') + '\n'
  }
  
  // Add note if rows were truncated
  if (data.rows.length > maxRows) {
    csvString += `\n(Note: Only showing first ${maxRows} rows out of ${data.rows.length} total rows)`
  }
  
  return csvString
} 