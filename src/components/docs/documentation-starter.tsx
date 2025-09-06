'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen,
  Search,
  ChevronRight,
  ChevronDown,
  FileText,
  Code,
  Image,
  Link,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface DocumentationSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'code' | 'image' | 'link';
  children?: DocumentationSection[];
  isExpanded?: boolean;
  isVisible?: boolean;
}

interface DocumentationStarterProps {
  className?: string;
  onSectionUpdate?: (sections: DocumentationSection[]) => void;
}

export function DocumentationStarter({ className, onSectionUpdate }: DocumentationStarterProps) {
  const [sections, setSections] = useState<DocumentationSection[]>([
    {
      id: '1',
      title: 'Getting Started',
      content: 'Welcome to the documentation! This is your starting point.',
      type: 'text',
      children: [
        {
          id: '1.1',
          title: 'Installation',
          content: '```bash\nnpm install claudecodeui\n```',
          type: 'code',
          isVisible: true,
        },
        {
          id: '1.2',
          title: 'Quick Start',
          content: 'Follow these steps to get up and running quickly.',
          type: 'text',
          isVisible: true,
        },
      ],
      isExpanded: true,
      isVisible: true,
    },
    {
      id: '2',
      title: 'API Reference',
      content: 'Complete API documentation for all components and functions.',
      type: 'text',
      children: [
        {
          id: '2.1',
          title: 'Components',
          content: 'Documentation for all React components.',
          type: 'text',
          isVisible: true,
        },
        {
          id: '2.2',
          title: 'Hooks',
          content: 'Custom React hooks and their usage.',
          type: 'text',
          isVisible: true,
        },
      ],
      isExpanded: false,
      isVisible: true,
    },
    {
      id: '3',
      title: 'Examples',
      content: 'Real-world examples and use cases.',
      type: 'text',
      children: [],
      isExpanded: false,
      isVisible: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const filteredSections = sections.filter(
    section =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId ? { ...section, isExpanded: !section.isExpanded } : section
      )
    );
  };

  const toggleVisibility = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId ? { ...section, isVisible: !section.isVisible } : section
      )
    );
    onSectionUpdate?.(sections);
  };

  const addSection = (parentId?: string) => {
    const newSection: DocumentationSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: 'Add your content here...',
      type: 'text',
      children: [],
      isExpanded: true,
      isVisible: true,
    };

    if (parentId) {
      setSections(prev =>
        prev.map(section =>
          section.id === parentId
            ? { ...section, children: [...(section.children || []), newSection] }
            : section
        )
      );
    } else {
      setSections(prev => [...prev, newSection]);
    }
  };

  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const updateSection = (sectionId: string, updates: Partial<DocumentationSection>) => {
    setSections(prev =>
      prev.map(section => (section.id === sectionId ? { ...section, ...updates } : section))
    );
    onSectionUpdate?.(sections);
  };

  const getTypeIcon = (type: DocumentationSection['type']) => {
    switch (type) {
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'code':
        return <Code className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'link':
        return <Link className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderSection = (section: DocumentationSection, level = 0) => (
    <div key={section.id} className="space-y-2">
      <div
        className={cn(
          'flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors',
          level > 0 && 'ml-4'
        )}
      >
        {section.children && section.children.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => toggleSection(section.id)}
          >
            {section.isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}

        <div className="flex items-center space-x-2 flex-1">
          {getTypeIcon(section.type)}
          <span className={cn('font-medium', !section.isVisible && 'opacity-50 line-through')}>
            {section.title}
          </span>
          <Badge variant="outline" className="text-xs">
            {section.type}
          </Badge>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => toggleVisibility(section.id)}
          >
            {section.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setEditingSection(section.id)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={() => deleteSection(section.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {section.isExpanded && section.children && (
        <div className="space-y-1">
          {section.children.map(child => renderSection(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Documentation Starter</span>
          </CardTitle>
          <CardDescription>Create and organize your project documentation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button onClick={() => addSection()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-1">
              {filteredSections.map(section => renderSection(section))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Section Editor */}
      {editingSection && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(() => {
              const section = sections.find(s => s.id === editingSection);
              if (!section) return null;

              return (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={e => updateSection(section.id, { title: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <textarea
                      value={section.content}
                      onChange={e => updateSection(section.id, { content: e.target.value })}
                      className="w-full min-h-[200px] p-2 border rounded-md resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select
                      value={section.type}
                      onChange={e =>
                        updateSection(section.id, {
                          type: e.target.value as DocumentationSection['type'],
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="text">Text</option>
                      <option value="code">Code</option>
                      <option value="image">Image</option>
                      <option value="link">Link</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button onClick={() => setEditingSection(null)}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setEditingSection(null)}>
                      Cancel
                    </Button>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
