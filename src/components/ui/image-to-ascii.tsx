'use client';

import { getErrorMessage } from '@/utils/error-handler';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Download,
  Copy,
  RefreshCw,
  Image as ImageIcon,
  FileText,
  Settings,
  Palette,
} from 'lucide-react';

interface ImageToASCIIProps {
  className?: string;
  onConvert?: (ascii: string) => void;
}

export function ImageToASCII({ className, onConvert }: ImageToASCIIProps) {
  const [image, setImage] = useState<File | null>(null);
  const [ascii, setAscii] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [settings, setSettings] = useState({
    width: 80,
    height: 40,
    characters: ' .:-=+*#%@',
    invert: false,
    color: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const convertImageToASCII = useCallback(async () => {
    if (!image || !canvasRef.current) return;

    setIsConverting(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Create image element
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = settings.width;
        canvas.height = settings.height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, settings.width, settings.height);

        // Get image data
        const imageData = ctx.getImageData(0, 0, settings.width, settings.height);
        const data = imageData.data;

        // Convert to ASCII
        let asciiResult = '';
        for (let y = 0; y < settings.height; y++) {
          for (let x = 0; x < settings.width; x++) {
            const index = (y * settings.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Calculate brightness
            const brightness = ((r || 0) + (g || 0) + (b || 0)) / 3;

            // Map brightness to character
            const normalizedBrightness = settings.invert ? 1 - brightness / 255 : brightness / 255;

            const charIndex = Math.floor(normalizedBrightness * (settings.characters.length - 1));
            asciiResult += settings.characters[charIndex];
          }
          asciiResult += '\n';
        }

        setAscii(asciiResult);
        onConvert?.(asciiResult);
        setIsConverting(false);
      };

      img.src = URL.createObjectURL(image);
    } catch (error) {
      logger.error('Image to ASCII conversion failed', { error: getErrorMessage(error) });
      setIsConverting(false);
    }
  }, [image, settings, onConvert]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setAscii('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ascii);
  };

  const downloadASCII = () => {
    const blob = new Blob([ascii], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const presetCharacters = [
    { name: 'Basic', chars: ' .:-=+*#%@' },
    { name: 'Blocks', chars: ' ░▒▓█' },
    { name: 'Dots', chars: ' ··●●●' },
    { name: 'Lines', chars: ' │║─═┌┐└┘' },
    { name: 'Shades', chars: ' ░▒▓█' },
    { name: 'Custom', chars: ' .:-=+*#%@' },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <span>Image to ASCII Converter</span>
          </CardTitle>
          <CardDescription>Convert images to ASCII art with customizable settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Image</label>
              <div className="flex items-center space-x-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {image ? image.name : 'Choose Image'}
                </Button>
                {image && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setImage(null);
                      setAscii('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Settings</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm">Width</label>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={settings.width}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, width: parseInt(e.target.value) }))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{settings.width}px</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Height</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={settings.height}
                    onChange={e =>
                      setSettings(prev => ({ ...prev, height: parseInt(e.target.value) }))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{settings.height}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Character Set</label>
                <div className="flex flex-wrap gap-2">
                  {presetCharacters.map(preset => (
                    <Button
                      key={preset.name}
                      variant={settings.characters === preset.chars ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSettings(prev => ({ ...prev, characters: preset.chars }))}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
                <input
                  type="text"
                  value={settings.characters}
                  onChange={e => setSettings(prev => ({ ...prev, characters: e.target.value }))}
                  className="w-full p-2 border rounded-md font-mono text-sm"
                  placeholder="Enter custom characters"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.invert}
                    onChange={e => setSettings(prev => ({ ...prev, invert: e.target.checked }))}
                  />
                  <span className="text-sm">Invert colors</span>
                </label>
              </div>
            </div>

            {/* Convert Button */}
            <Button
              onClick={convertImageToASCII}
              disabled={!image || isConverting}
              className="w-full"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Convert to ASCII
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ASCII Output */}
      {ascii && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>ASCII Art</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadASCII}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Size: {settings.width} × {settings.height}
                </span>
                <span>Characters: {settings.characters.length}</span>
              </div>

              <div className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-xs font-mono leading-tight whitespace-pre-wrap">{ascii}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
