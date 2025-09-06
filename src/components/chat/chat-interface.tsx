"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  MoreHorizontal,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Bot,
  User,
} from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface ChatInterfaceProps {
  className?: string
}

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m Claude, your AI coding assistant. How can I help you today?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    role: 'user',
    content: 'Can you help me create a React component for a file uploader?',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Of course! I\'ll help you create a file uploader component. Here\'s a modern React component with drag-and-drop functionality:\n\n```tsx\nimport React, { useState, useRef } from \'react\';\n\ninterface FileUploaderProps {\n  onFileSelect: (files: File[]) => void;\n  maxFiles?: number;\n  acceptedTypes?: string[];\n}\n\nexport const FileUploader: React.FC<FileUploaderProps> = ({\n  onFileSelect,\n  maxFiles = 10,\n  acceptedTypes = [\'image/*\', \'application/pdf\']\n}) => {\n  const [isDragOver, setIsDragOver] = useState(false);\n  const fileInputRef = useRef<HTMLInputElement>(null);\n\n  const handleDrop = (e: React.DragEvent) => {\n    e.preventDefault();\n    setIsDragOver(false);\n    \n    const files = Array.from(e.dataTransfer.files);\n    onFileSelect(files.slice(0, maxFiles));\n  };\n\n  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const files = Array.from(e.target.files || []);\n    onFileSelect(files.slice(0, maxFiles));\n  };\n\n  return (\n    <div\n      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${\n        isDragOver ? \'border-primary bg-primary/5\' : \'border-muted-foreground/25\'\n      }`}\n      onDragOver={(e) => {\n        e.preventDefault();\n        setIsDragOver(true);\n      }}\n      onDragLeave={() => setIsDragOver(false)}\n      onDrop={handleDrop}\n    >\n      <input\n        ref={fileInputRef}\n        type="file"\n        multiple\n        accept={acceptedTypes.join(\',\')}\n        onChange={handleFileInput}\n        className="hidden"\n      />\n      <p className="text-lg font-medium mb-2">\n        Drag and drop files here, or click to select\n      </p>\n      <p className="text-sm text-muted-foreground mb-4">\n        Maximum {maxFiles} files\n      </p>\n      <Button onClick={() => fileInputRef.current?.click()}>\n        Choose Files\n      </Button>\n    </div>\n  );\n};\n```\n\nThis component includes:\n- Drag and drop functionality\n- File type restrictions\n- Maximum file limits\n- Clean, accessible design\n- TypeScript support',
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
  },
]

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand your request. Let me help you with that. This is a simulated response from Claude.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Claude Assistant</h3>
            <p className="text-sm text-muted-foreground">AI Coding Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-4",
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyMessage(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end space-x-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="min-h-[40px] max-h-32 resize-none"
            />
          </div>
          
          <Button
            variant={isRecording ? "destructive" : "ghost"}
            size="icon"
            onClick={toggleRecording}
          >
            {isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
