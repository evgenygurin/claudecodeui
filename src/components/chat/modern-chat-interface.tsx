'use client';

import { getErrorMessage } from '@/utils/error-handler';
import { logger } from '@/utils/logger';
import { chatStorageService, type ChatSession, type ChatMessage } from '@/services/chat-storage.service';
import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Sparkles,
  Zap,
  Brain,
  MessageSquare,
  Settings,
  Volume2,
  VolumeX,
  Download,
  Share,
  Bookmark,
  Trash2,
  Edit,
  RotateCcw,
  X,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  isStreaming?: boolean;
  attachments?: File[];
  reactions?: {
    thumbsUp: number;
    thumbsDown: number;
  };
  isBookmarked?: boolean;
  isEdited?: boolean;
}

interface ChatInterfaceProps {
  className?: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      "Hello! I'm Claude, your AI coding assistant. I can help you with React components, debugging, code optimization, and much more. How can I assist you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    reactions: { thumbsUp: 2, thumbsDown: 0 },
    isBookmarked: true,
  },
  {
    id: '2',
    role: 'user',
    content:
      'Can you help me create a modern React component for a file uploader with drag and drop functionality?',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: '3',
    role: 'assistant',
    content:
      'Of course! I\'ll help you create a modern file uploader component with drag-and-drop functionality. Here\'s a comprehensive solution:\n\n```tsx\nimport React, { useState, useRef, useCallback } from \'react\';\nimport { Upload, X, File, CheckCircle } from \'lucide-react\';\n\ninterface FileUploaderProps {\n  onFileSelect: (files: File[]) => void;\n  maxFiles?: number;\n  acceptedTypes?: string[];\n  maxSize?: number; // in MB\n}\n\nexport const FileUploader: React.FC<FileUploaderProps> = ({\n  onFileSelect,\n  maxFiles = 10,\n  acceptedTypes = [\'image/*\', \'application/pdf\', \'text/*\'],\n  maxSize = 10\n}) => {\n  const [isDragOver, setIsDragOver] = useState(false);\n  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);\n  const [errors, setErrors] = useState<string[]>([]);\n  const fileInputRef = useRef<HTMLInputElement>(null);\n\n  const validateFile = (file: File): string | null => {\n    if (file.size > maxSize * 1024 * 1024) {\n      return `File ${file.name} is too large. Maximum size is ${maxSize}MB.`;\n    }\n    \n    const isValidType = acceptedTypes.some(type => {\n      if (type.endsWith(\'/*\')) {\n        return file.type.startsWith(type.slice(0, -1));\n      }\n      return file.type === type;\n    });\n    \n    if (!isValidType) {\n      return `File ${file.name} is not an accepted type.`;\n    }\n    \n    return null;\n  };\n\n  const handleFiles = useCallback((files: File[]) => {\n    const validFiles: File[] = [];\n    const newErrors: string[] = [];\n    \n    files.slice(0, maxFiles - uploadedFiles.length).forEach(file => {\n      const error = validateFile(file);\n      if (error) {\n        newErrors.push(error);\n      } else {\n        validFiles.push(file);\n      }\n    });\n    \n    if (newErrors.length > 0) {\n      setErrors(newErrors);\n      setTimeout(() => setErrors([]), 5000);\n    }\n    \n    if (validFiles.length > 0) {\n      const updatedFiles = [...uploadedFiles, ...validFiles];\n      setUploadedFiles(updatedFiles);\n      onFileSelect(updatedFiles);\n    }\n  }, [uploadedFiles, maxFiles, maxSize, acceptedTypes, onFileSelect]);\n\n  const handleDrop = useCallback((e: React.DragEvent) => {\n    e.preventDefault();\n    setIsDragOver(false);\n    const files = Array.from(e.dataTransfer.files);\n    handleFiles(files);\n  }, [handleFiles]);\n\n  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {\n    const files = Array.from(e.target.files || []);\n    handleFiles(files);\n  }, [handleFiles]);\n\n  const removeFile = (index: number) => {\n    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);\n    setUploadedFiles(updatedFiles);\n    onFileSelect(updatedFiles);\n  };\n\n  return (\n    <div className="w-full max-w-2xl mx-auto">\n      <div\n        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${\n          isDragOver \n            ? \'border-primary bg-primary/5 scale-105\' \n            : \'border-muted-foreground/25 hover:border-primary/50\'\n        }`}\n        onDragOver={(e) => {\n          e.preventDefault();\n          setIsDragOver(true);\n        }}\n        onDragLeave={() => setIsDragOver(false)}\n        onDrop={handleDrop}\n      >\n        <input\n          ref={fileInputRef}\n          type="file"\n          multiple\n          accept={acceptedTypes.join(\',\')}\n          onChange={handleFileInput}\n          className="hidden"\n        />\n        \n        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />\n        <h3 className="text-lg font-semibold mb-2">\n          Drag and drop files here, or click to select\n        </h3>\n        <p className="text-sm text-muted-foreground mb-4">\n          Maximum {maxFiles} files, up to {maxSize}MB each\n        </p>\n        <Button \n          onClick={() => fileInputRef.current?.click()}\n          className="mb-2"\n        >\n          Choose Files\n        </Button>\n        <p className="text-xs text-muted-foreground">\n          Accepted types: {acceptedTypes.join(\', \')}\n        </p>\n      </div>\n      \n      {errors.length > 0 && (\n        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">\n          {errors.map((error, index) => (\n            <p key={index} className="text-sm text-destructive">{error}</p>\n          ))}\n        </div>\n      )}\n      \n      {uploadedFiles.length > 0 && (\n        <div className="mt-4 space-y-2">\n          <h4 className="font-medium">Uploaded Files:</h4>\n          {uploadedFiles.map((file, index) => (\n            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">\n              <div className="flex items-center gap-3">\n                <File className="h-4 w-4 text-muted-foreground" />\n                <div>\n                  <p className="font-medium text-sm">{file.name}</p>\n                  <p className="text-xs text-muted-foreground">\n                    {(file.size / 1024 / 1024).toFixed(2)} MB\n                  </p>\n                </div>\n              </div>\n              <div className="flex items-center gap-2">\n                <CheckCircle className="h-4 w-4 text-green-500" />\n                <Button\n                  variant="ghost"\n                  size="sm"\n                  onClick={() => removeFile(index)}\n                >\n                  <X className="h-4 w-4" />\n                </Button>\n              </div>\n            </div>\n          ))}\n        </div>\n      )}\n    </div>\n  );\n};\n```\n\nThis component includes:\n- **Drag and drop functionality** with visual feedback\n- **File validation** for size and type restrictions\n- **Error handling** with user-friendly messages\n- **File preview** with remove functionality\n- **Accessibility** features and keyboard navigation\n- **TypeScript support** with proper interfaces\n- **Customizable props** for different use cases\n\nWould you like me to explain any specific part of this implementation or add additional features like progress indicators or cloud upload integration?',
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    reactions: { thumbsUp: 5, thumbsDown: 0 },
    isBookmarked: true,
  },
];

export function ModernChatInterface({ className }: ChatInterfaceProps) {
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [allChats, setAllChats] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chats on component mount
  useEffect(() => {
    const loadChats = () => {
      try {
        const chats = chatStorageService.getAllChats();
        setAllChats(chats);
        
        if (chats.length > 0) {
          // Load the most recent chat
          const recentChat = chats[0];
          setCurrentChat(recentChat);
          setMessages(recentChat.messages.map(msg => ({
            ...msg,
            role: msg.role as 'user' | 'assistant' | 'system',
          })));
        } else {
          // Create a new chat if none exist
          const newChat = chatStorageService.createChat();
          setCurrentChat(newChat);
          setAllChats([newChat]);
          setMessages([]);
        }
      } catch (error) {
        logger.error('Failed to load chats', { error });
        // Fallback to mock messages if storage fails
        setMessages(mockMessages);
      }
    };

    loadChats();
  }, []);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !currentChat) return;

    try {
      // Save user message to storage
      const savedUserMessage = chatStorageService.addMessage(currentChat.id, 'user', inputValue);
      
      const userMessage: Message = {
        id: savedUserMessage.id,
        role: 'user',
        content: inputValue,
        timestamp: savedUserMessage.timestamp,
        attachments: attachments.length > 0 ? [...attachments] : undefined,
      };

      setMessages(prev => [...prev, userMessage]);
      const messageContent = inputValue;
      setInputValue('');
      setAttachments([]);
      setIsLoading(true);

    try {
      // Call MCP API for AI response
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'tools/call',
          params: {
            name: 'claude_code_execute',
            arguments: {
              command: 'chat',
              projectPath: '/current-project',
              options: {
                message: inputValue,
                context: 'claude-code-ui',
                attachments: attachments.map(f => ({ name: f.name, size: f.size, type: f.type })),
              },
            },
          },
        }),
      });

      const data = await response.json();

      const assistantContent = data.content?.[0]?.text ||
        `I received your message: "${messageContent}". This is a response from the MCP API.`;
      
      // Save assistant message to storage
      const savedAssistantMessage = chatStorageService.addMessage(currentChat.id, 'assistant', assistantContent);

      const assistantMessage: Message = {
        id: savedAssistantMessage.id,
        role: 'assistant',
        content: assistantContent,
        timestamp: savedAssistantMessage.timestamp,
        reactions: { thumbsUp: 0, thumbsDown: 0 },
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      logger.error('Error sending message:', error);

      const errorContent = `Sorry, I encountered an error: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`;
      
      // Save error message to storage
      const savedErrorMessage = chatStorageService.addMessage(currentChat.id, 'assistant', errorContent);

      const errorMessage: Message = {
        id: savedErrorMessage.id,
        role: 'assistant',
        content: errorContent,
        timestamp: savedErrorMessage.timestamp,
        reactions: { thumbsUp: 0, thumbsDown: 0 },
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
    } catch (error) {
      logger.error('Error in handleSendMessage:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleReaction = (messageId: string, reaction: 'thumbsUp' | 'thumbsDown') => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          const currentReactions = msg.reactions || { thumbsUp: 0, thumbsDown: 0 };
          return {
            ...msg,
            reactions: {
              ...currentReactions,
              [reaction]: currentReactions[reaction] + 1,
            },
          };
        }
        return msg;
      })
    );
  };

  const toggleBookmark = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, isBookmarked: !msg.isBookmarked };
        }
        return msg;
      })
    );
  };

  const createNewChat = () => {
    try {
      const newChat = chatStorageService.createChat();
      setCurrentChat(newChat);
      setAllChats(prev => [newChat, ...prev]);
      setMessages([]);
      logger.info('Created new chat', { chatId: newChat.id });
    } catch (error) {
      logger.error('Failed to create new chat', { error });
    }
  };

  const switchToChat = (chatId: string) => {
    try {
      const chat = chatStorageService.getChat(chatId);
      if (chat) {
        setCurrentChat(chat);
        setMessages(chat.messages.map(msg => ({
          ...msg,
          role: msg.role as 'user' | 'assistant' | 'system',
        })));
        logger.info('Switched to chat', { chatId });
      }
    } catch (error) {
      logger.error('Failed to switch chat', { error, chatId });
    }
  };

  const deleteChat = (chatId: string) => {
    try {
      const success = chatStorageService.deleteChat(chatId);
      if (success) {
        setAllChats(prev => prev.filter(chat => chat.id !== chatId));
        
        // If we deleted the current chat, switch to another one or create new
        if (currentChat?.id === chatId) {
          const remainingChats = allChats.filter(chat => chat.id !== chatId);
          if (remainingChats.length > 0) {
            switchToChat(remainingChats[0].id);
          } else {
            createNewChat();
          }
        }
        
        logger.info('Deleted chat', { chatId });
      }
    } catch (error) {
      logger.error('Failed to delete chat', { error, chatId });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show toast notification
    } catch (error) {
      logger.error('Failed to copy text:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={cn('w-full h-full flex flex-col', className)}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/claude-avatar.png" alt="Claude" />
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Claude Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">AI Coding Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={createNewChat}>
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/claude-avatar.png" alt="Claude" />
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-3',
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">{message.content}</pre>
                  </div>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <Paperclip className="h-3 w-3" />
                          <span>{file.name}</span>
                          <span className="text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>

                    <div className="flex items-center gap-1">
                      {message.role === 'assistant' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleReaction(message.id, 'thumbsUp')}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            {message.reactions?.thumbsUp && (
                              <span className="ml-1 text-xs">{message.reactions.thumbsUp}</span>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleReaction(message.id, 'thumbsDown')}
                          >
                            <ThumbsDown className="h-3 w-3" />
                            {message.reactions?.thumbsDown && (
                              <span className="ml-1 text-xs">{message.reactions.thumbsDown}</span>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(message.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleBookmark(message.id)}
                          >
                            <Bookmark
                              className={cn(
                                'h-3 w-3',
                                message.isBookmarked && 'fill-current text-yellow-500'
                              )}
                            />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div
                        className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">Claude is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {attachments.length > 0 && (
          <div className="border-t p-3">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t p-4">
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-2">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="ghost" size="sm" asChild>
                  <span>
                    <Paperclip className="h-4 w-4" />
                  </span>
                </Button>
              </label>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRecording}
                className={cn(isRecording && 'text-red-500')}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>

            <Input
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <div className="flex items-center gap-4">
              <span>Powered by Claude AI</span>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>MCP Integration</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
