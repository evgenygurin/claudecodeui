'use client';

import { useState } from 'react';
import { Button } from './button';
import { Play, ExternalLink, Loader2 } from 'lucide-react';

interface DeployButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function DeployButton({ 
  className, 
  variant = 'default',
  size = 'default' 
}: DeployButtonProps) {
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    try {
      // Открываем Vercel в новой вкладке с правильным URL
      const deployUrl = 'https://vercel.com/new/clone?repository-url=https://github.com/evgenygurin/claudecodeui&project-name=claude-code-ui&repository-name=claudecodeui';
      window.open(deployUrl, '_blank', 'noopener,noreferrer');
      
      // Сбрасываем состояние через 2 секунды
      setTimeout(() => {
        setIsDeploying(false);
      }, 2000);
    } catch (error) {
      // Handle deploy error silently
      setIsDeploying(false);
    }
  };

  return (
    <Button
      onClick={handleDeploy}
      disabled={isDeploying}
      variant={variant}
      size={size}
      className={className}
    >
      {isDeploying ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Deploying...
        </>
      ) : (
        <>
          <Play className="h-4 w-4 mr-2" />
          Deploy to Vercel
          <ExternalLink className="h-3 w-3 ml-1" />
        </>
      )}
    </Button>
  );
}