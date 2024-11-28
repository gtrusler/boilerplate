'use client'

import { useState } from 'react'
import { Highlight } from 'prism-react-renderer'

interface CodeExampleProps {
  code: string
  language: string
  live?: boolean
}

export function CodeExample({ code, language, live }: CodeExampleProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="rounded-lg border">
      <div className="flex justify-between p-2 bg-gray-50">
        <span>{language}</span>
        {live && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-blue-600"
          >
            {isEditing ? 'Preview' : 'Edit'}
          </button>
        )}
      </div>
      <Highlight code={code} language={language}>
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <pre className={className}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
} 