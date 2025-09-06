'use client';

import { logger } from '@/utils/logger';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Wand2,
  Copy,
  Download,
  RefreshCw,
  Check,
  Code,
  Palette,
  FileText,
  Image,
  Zap,
} from 'lucide-react';

interface GeneratedCard {
  id: string;
  title: string;
  description: string;
  type: 'component' | 'page' | 'layout' | 'utility';
  code: string;
  preview?: string;
  tags: string[];
  createdAt: Date;
}

interface AICardGenerationProps {
  className?: string;
  onCardGenerated?: (card: GeneratedCard) => void;
}

export function AICardGeneration({ className, onCardGenerated }: AICardGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [prompt, setPrompt] = useState('');

  const cardTypes = [
    { id: 'component', label: 'Component', icon: Code, color: 'bg-blue-500' },
    { id: 'page', label: 'Page', icon: FileText, color: 'bg-green-500' },
    { id: 'layout', label: 'Layout', icon: Palette, color: 'bg-purple-500' },
    { id: 'utility', label: 'Utility', icon: Zap, color: 'bg-orange-500' },
  ];

  const generateCard = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setProgress(0);

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newCard: GeneratedCard = {
        id: Date.now().toString(),
        title: `Generated ${prompt.split(' ').slice(0, 2).join(' ')}`,
        description: `AI-generated ${prompt.toLowerCase()} component with modern design patterns`,
        type: 'component',
        code: `// Generated code for: ${prompt}
import React from 'react'
import { cn } from '@/lib/utils'

interface GeneratedComponentProps {
  className?: string
}

export function GeneratedComponent({ className }: GeneratedComponentProps) {
  return (
    <div className={cn("p-4 border rounded-lg", className)}>
      <h3 className="text-lg font-semibold">${prompt}</h3>
      <p className="text-muted-foreground">
        This is an AI-generated component based on your prompt.
      </p>
    </div>
  )
}`,
        tags: ['ai-generated', 'react', 'typescript', 'tailwind'],
        createdAt: new Date(),
      };

      setGeneratedCards(prev => [newCard, ...prev]);
      onCardGenerated?.(newCard);
      setProgress(100);

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
        setPrompt('');
      }, 500);
    } catch (error) {
      logger.error('Generation failed:', error);
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const downloadCard = (card: GeneratedCard) => {
    const blob = new Blob([card.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.title.toLowerCase().replace(/\s+/g, '-')}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Generation Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>AI Card Generation</span>
          </CardTitle>
          <CardDescription>
            Generate React components, pages, and utilities using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe what you want to generate</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g., A modern login form with email and password fields, validation, and social login buttons"
              className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isGenerating}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={generateCard}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Card
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Generating your card...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Cards */}
      {generatedCards.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Cards</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {generatedCards.map(card => (
              <Card key={card.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {cardTypes.find(t => t.id === card.type)?.icon && (
                        <div
                          className={cn(
                            'p-2 rounded-lg text-white',
                            cardTypes.find(t => t.id === card.type)?.color
                          )}
                        >
                          {React.createElement(cardTypes.find(t => t.id === card.type)!.icon, {
                            className: 'h-4 w-4',
                          })}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-base">{card.title}</CardTitle>
                        <CardDescription className="text-sm">{card.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {card.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{card.createdAt.toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(card.code)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadCard(card)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
