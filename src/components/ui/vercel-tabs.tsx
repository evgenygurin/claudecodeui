'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import {
  Play,
  ExternalLink,
  CheckCircle,
  Clock,
  Zap,
  Globe,
  Code,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

export function VercelTabs() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);

    try {
      const deployUrl =
        'https://vercel.com/new/clone?repository-url=https://github.com/evgenygurin/claudecodeui&project-name=claude-code-ui&repository-name=claudecodeui';
      window.open(deployUrl, '_blank', 'noopener,noreferrer');

      setTimeout(() => {
        setIsDeploying(false);
      }, 2000);
    } catch (error) {
      // Handle deploy error silently
      setIsDeploying(false);
    }
  };

  const copyCommand = async () => {
    const command = 'npx vercel --prod';
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch (error) {
      // Handle copy error silently
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Instant Deploy',
      description: 'Deploy with zero configuration in seconds',
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Lightning-fast performance worldwide',
    },
    {
      icon: Code,
      title: 'Git Integration',
      description: 'Automatic deployments on every push',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Connect Repository',
      description: 'Link your GitHub repository to Vercel',
      status: 'completed',
    },
    {
      number: 2,
      title: 'Configure Project',
      description: 'Set build settings and environment variables',
      status: 'completed',
    },
    {
      number: 3,
      title: 'Deploy',
      description: 'Deploy your application to production',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">▲</span>
          </div>
          <h1 className="text-3xl font-bold">Deploy to Vercel</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Deploy Claude Code UI to Vercel in seconds with zero configuration. Get global CDN,
          automatic HTTPS, and instant deployments.
        </p>
      </div>

      <Tabs defaultValue="deploy" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deploy">Quick Deploy</TabsTrigger>
          <TabsTrigger value="cli">CLI Deploy</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="deploy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>One-Click Deploy</span>
              </CardTitle>
              <CardDescription>Deploy directly from GitHub with zero configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <Button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Deploy to Vercel
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                This will open Vercel in a new tab where you can deploy the project
              </div>
            </CardContent>
          </Card>

          {/* Deployment Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Deployment Steps</CardTitle>
              <CardDescription>Follow these steps to deploy your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map(step => (
                  <div key={step.number} className="flex items-center space-x-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-medium">{step.number}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {step.status === 'completed' && <Badge variant="secondary">Completed</Badge>}
                    {step.status === 'pending' && <Badge variant="outline">Pending</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cli" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deploy with Vercel CLI</CardTitle>
              <CardDescription>Deploy from your terminal using the Vercel CLI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Install Vercel CLI</h4>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">npm i -g vercel</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Deploy to Production</h4>
                <div className="flex items-center space-x-2">
                  <div className="bg-muted p-3 rounded-md font-mono text-sm flex-1">
                    npx vercel --prod
                  </div>
                  <Button variant="outline" size="sm" onClick={copyCommand}>
                    {copiedCommand ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Make sure you&apos;re in the project directory before running the deploy command.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Why Vercel?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Performance</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Global Edge Network</li>
                    <li>• Automatic Image Optimization</li>
                    <li>• Static Site Generation</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Developer Experience</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Zero Configuration</li>
                    <li>• Git Integration</li>
                    <li>• Preview Deployments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
