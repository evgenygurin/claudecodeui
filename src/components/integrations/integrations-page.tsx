'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Plus,
  Settings,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Database,
  MessageSquare,
  Code,
  Palette,
  Shield,
  Globe,
  CreditCard,
  Github,
  Gitlab,
  Slack,
  Twitter,
  Linkedin,
  Youtube,
  Figma,
  FileText,
  BarChart3,
  Cloud,
  Server,
  Monitor,
  Activity,
  AlertTriangle,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Download,
  Upload,
  Share,
  Copy,
  Edit,
  Trash2,
  User,
  Users,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Filter,
  SortAsc,
  SortDesc,
  Minus,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Home,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Link,
  Unlink,
  Bookmark,
  BookmarkCheck,
  Tag,
  Tags,
  Calendar,
  Timer,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Moon,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Flame,
  Snowflake,
  Umbrella,
  TreePine,
  Leaf,
  Flower,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Turtle,
  Snail,
  Ghost,
  Skull,
  Cross,
  Infinity,
  Pi,
  Sigma,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  icon: any;
  color: string;
  users: number;
  lastUsed: string;
  rating: number;
}

const integrations: Integration[] = [
  {
    id: '1',
    name: 'Vercel',
    description: 'Deploy and host your applications with zero configuration',
    category: 'Deployment',
    status: 'active',
    icon: Zap,
    color: 'bg-black text-white',
    users: 1250000,
    lastUsed: '2 hours ago',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'GitHub',
    description: 'Version control and collaboration platform',
    category: 'Development',
    status: 'active',
    icon: Github,
    color: 'bg-gray-900 text-white',
    users: 100000000,
    lastUsed: '1 hour ago',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Slack',
    description: 'Team communication and collaboration',
    category: 'Communication',
    status: 'active',
    icon: Slack,
    color: 'bg-purple-600 text-white',
    users: 12000000,
    lastUsed: '5 minutes ago',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Discord',
    description: 'Voice, video, and text communication',
    category: 'Communication',
    status: 'active',
    icon: MessageSquare,
    color: 'bg-indigo-600 text-white',
    users: 150000000,
    lastUsed: '30 minutes ago',
    rating: 4.6,
  },
  {
    id: '5',
    name: 'Figma',
    description: 'Collaborative interface design tool',
    category: 'Design',
    status: 'active',
    icon: Palette,
    color: 'bg-pink-500 text-white',
    users: 4000000,
    lastUsed: '1 day ago',
    rating: 4.8,
  },
  {
    id: '6',
    name: 'Notion',
    description: 'All-in-one workspace for notes and docs',
    category: 'Productivity',
    status: 'active',
    icon: FileText,
    color: 'bg-gray-800 text-white',
    users: 30000000,
    lastUsed: '3 hours ago',
    rating: 4.5,
  },
  {
    id: '7',
    name: 'Linear',
    description: 'Issue tracking and project management',
    category: 'Project Management',
    status: 'active',
    icon: BarChart3,
    color: 'bg-blue-600 text-white',
    users: 500000,
    lastUsed: '1 hour ago',
    rating: 4.9,
  },
  {
    id: '8',
    name: 'Jira',
    description: 'Advanced issue and project tracking',
    category: 'Project Management',
    status: 'active',
    icon: BarChart3,
    color: 'bg-blue-500 text-white',
    users: 10000000,
    lastUsed: '2 hours ago',
    rating: 4.3,
  },
  {
    id: '9',
    name: 'Stripe',
    description: 'Online payment processing',
    category: 'Payments',
    status: 'active',
    icon: CreditCard,
    color: 'bg-purple-500 text-white',
    users: 2000000,
    lastUsed: '1 day ago',
    rating: 4.7,
  },
  {
    id: '10',
    name: 'AWS',
    description: 'Cloud computing services',
    category: 'Cloud',
    status: 'active',
    icon: Cloud,
    color: 'bg-orange-500 text-white',
    users: 1000000,
    lastUsed: '6 hours ago',
    rating: 4.6,
  },
  {
    id: '11',
    name: 'Google Cloud',
    description: 'Cloud computing platform',
    category: 'Cloud',
    status: 'active',
    icon: Cloud,
    color: 'bg-blue-500 text-white',
    users: 800000,
    lastUsed: '4 hours ago',
    rating: 4.5,
  },
  {
    id: '12',
    name: 'Azure',
    description: 'Microsoft cloud services',
    category: 'Cloud',
    status: 'active',
    icon: Cloud,
    color: 'bg-blue-600 text-white',
    users: 600000,
    lastUsed: '8 hours ago',
    rating: 4.4,
  },
];

const categories = [
  'All',
  'Development',
  'Deployment',
  'Communication',
  'Design',
  'Productivity',
  'Project Management',
  'Payments',
  'Cloud',
  'Analytics',
  'Marketing',
  'Support',
];

export function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredIntegrations, setFilteredIntegrations] = useState(integrations);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterIntegrations(term, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterIntegrations(searchTerm, category);
  };

  const filterIntegrations = (search: string, category: string) => {
    let filtered = integrations;

    if (search) {
      filtered = filtered.filter(
        integration =>
          integration.name.toLowerCase().includes(search.toLowerCase()) ||
          integration.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'All') {
      filtered = filtered.filter(integration => integration.category === category);
    }

    setFilteredIntegrations(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatUsers = (users: number) => {
    if (users >= 1000000) {
      return `${(users / 1000000).toFixed(1)}M`;
    } else if (users >= 1000) {
      return `${(users / 1000).toFixed(1)}K`;
    }
    return users.toString();
  };

  const handleConfigure = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      alert(`Configuring ${integration.name}...\n\nThis would open the configuration dialog for ${integration.name}.`);
      console.log('Configure integration:', integration);
    }
  };

  const handleViewDocs = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      const docsUrl = `https://docs.${integration.name.toLowerCase().replace(/\s+/g, '')}.com`;
      window.open(docsUrl, '_blank');
      console.log('View docs for:', integration.name);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your favorite tools and services to streamline your workflow
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search integrations..."
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => {
                console.log('Adding new integration');
                alert('Opening integration marketplace...');
                // TODO: Implement actual add integration logic
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{integrations.length}</div>
              <p className="text-xs text-muted-foreground">+2 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {integrations.filter(i => i.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Currently connected</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <p className="text-xs text-muted-foreground">Available categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatUsers(integrations.reduce((sum, i) => sum + i.users, 0))}
              </div>
              <p className="text-xs text-muted-foreground">Across all integrations</p>
            </CardContent>
          </Card>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map(integration => {
            const IconComponent = integration.icon;
            return (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${integration.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{integration.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline">{integration.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Users:</span>
                    <span className="font-medium">{formatUsers(integration.users)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{integration.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last used:</span>
                    <span className="font-medium">{integration.lastUsed}</span>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleConfigure(integration.id)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDocs(integration.id)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setFilteredIntegrations(integrations);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
