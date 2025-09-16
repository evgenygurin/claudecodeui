import { getErrorMessage } from '@/utils/error-handler';
import { createError } from '@/utils/error-handler';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';
import { claudeCLIService } from '@/services/claude-cli.service';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// MCP tool definitions with real implementations
const tools = {
  claude_code_execute: {
    name: 'claude_code_execute',
    description: 'Execute Claude Code CLI commands with real process integration',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'The command to execute' },
        projectPath: { type: 'string', description: 'Project path to execute command in' },
        options: { type: 'object', description: 'Additional options for the command' }
      },
      required: ['command']
    },
    handler: async ({ command, projectPath, options }: any) => {
      try {
        logger.info('Executing Claude Code command', { command, projectPath });
        
        // Start or use existing Claude CLI session
        const status = claudeCLIService.getStatus();
        if (!status.isRunning) {
          await claudeCLIService.startSession(projectPath);
        }
        
        const response = await claudeCLIService.sendMessage(command);
        
        return {
          content: [
            {
              type: 'text',
              text: response.content || 'Command executed successfully',
            },
          ],
        };
      } catch (error) {
        logger.error('Claude Code execution error', { error: getErrorMessage(error) });
        return {
          content: [
            {
              type: 'text',
              text: `Error executing command: ${getErrorMessage(error)}`,
            },
          ],
        };
      }
    },
  },

  file_operations: {
    name: 'file_operations',
    description: 'Perform real file operations (read, write, list, delete)',
    inputSchema: {
      type: 'object',
      properties: {
        operation: { type: 'string', enum: ['read', 'write', 'list', 'delete', 'create'] },
        path: { type: 'string', description: 'File or directory path' },
        content: { type: 'string', description: 'Content for write operations' }
      },
      required: ['operation', 'path']
    },
    handler: async ({ operation, path: filePath, content }: any) => {
      try {
        logger.info('File operation', { operation, path: filePath });
        
        const safePath = path.resolve(process.cwd(), filePath);
        
        // Security check - ensure we're not accessing system files
        if (safePath.includes('../') || safePath.startsWith('/etc') || safePath.startsWith('/usr')) {
          throw createError('Access denied: Invalid file path');
        }
        
        switch (operation) {
          case 'read':
            try {
              const fileContent = await fs.readFile(safePath, 'utf-8');
              return {
                content: [
                  {
                    type: 'text',
                    text: `File: ${filePath}\n\n${fileContent}`,
                  },
                ],
              };
            } catch (error) {
              throw createError(`Cannot read file: ${getErrorMessage(error)}`);
            }
            
          case 'write':
            if (!content) {
              throw createError('Content is required for write operation');
            }
            await fs.writeFile(safePath, content, 'utf-8');
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully wrote to file: ${filePath}`,
                },
              ],
            };
            
          case 'list':
            try {
              const entries = await fs.readdir(safePath, { withFileTypes: true });
              const listing = entries.map(entry => {
                const type = entry.isDirectory() ? 'DIR' : 'FILE';
                return `${type}: ${entry.name}`;
              }).join('\n');
              
              return {
                content: [
                  {
                    type: 'text',
                    text: `Directory: ${filePath}\n\n${listing}`,
                  },
                ],
              };
            } catch (error) {
              throw createError(`Cannot list directory: ${getErrorMessage(error)}`);
            }
            
          case 'delete':
            try {
              const stat = await fs.stat(safePath);
              if (stat.isDirectory()) {
                await fs.rmdir(safePath, { recursive: true });
              } else {
                await fs.unlink(safePath);
              }
              return {
                content: [
                  {
                    type: 'text',
                    text: `Successfully deleted: ${filePath}`,
                  },
                ],
              };
            } catch (error) {
              throw createError(`Cannot delete: ${getErrorMessage(error)}`);
            }
            
          case 'create':
            try {
              await fs.mkdir(safePath, { recursive: true });
              return {
                content: [
                  {
                    type: 'text',
                    text: `Successfully created directory: ${filePath}`,
                  },
                ],
              };
            } catch (error) {
              throw createError(`Cannot create directory: ${getErrorMessage(error)}`);
            }
            
          default:
            throw createError(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        logger.error('File operation error', { error: getErrorMessage(error) });
        return {
          content: [
            {
              type: 'text',
              text: `Error performing file operation: ${getErrorMessage(error)}`,
            },
          ],
        };
      }
    },
  },

  project_management: {
    name: 'project_management',
    description: 'Manage Claude Code projects with real CLI integration',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['list', 'create', 'delete', 'switch', 'info', 'status'] },
        projectName: { type: 'string', description: 'Project name' },
        projectPath: { type: 'string', description: 'Project path' }
      },
      required: ['action']
    },
    handler: async ({ action, projectName, projectPath }: any) => {
      try {
        logger.info('Project management action', { action, projectName, projectPath });
        
        switch (action) {
          case 'list':
            // Get sessions from Claude CLI service
            const sessions = await claudeCLIService.getSessions();
            const sessionList = sessions.map(session => 
              `Session: ${session.name} (ID: ${session.id}) - ${session.messages.length} messages`
            ).join('\n');
            
            return {
              content: [
                {
                  type: 'text',
                  text: sessions.length > 0 ? 
                    `Active Claude Code sessions:\n\n${sessionList}` :
                    'No active Claude Code sessions',
                },
              ],
            };
            
          case 'create':
            if (!projectName || !projectPath) {
              throw createError('Project name and path are required for create action');
            }
            
            // Create directory if it doesn't exist
            const safePath = path.resolve(process.cwd(), projectPath);
            await fs.mkdir(safePath, { recursive: true });
            
            // Initialize git if not already initialized
            try {
              await execAsync('git init', { cwd: safePath });
            } catch (error) {
              // Git init might fail if already initialized
              logger.debug('Git init failed or already initialized', { error: getErrorMessage(error) });
            }
            
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully created project: ${projectName} at ${projectPath}`,
                },
              ],
            };
            
          case 'delete':
            if (!projectName) {
              throw createError('Project name is required for delete action');
            }
            
            // Stop session if it's the current project
            const status = claudeCLIService.getStatus();
            if (status.isRunning) {
              await claudeCLIService.stopSession();
            }
            
            return {
              content: [
                {
                  type: 'text',
                  text: `Session for project ${projectName} has been stopped`,
                },
              ],
            };
            
          case 'switch':
            if (!projectName) {
              throw createError('Project name is required for switch action');
            }
            
            // Stop current session and start new one
            const currentStatus = claudeCLIService.getStatus();
            if (currentStatus.isRunning) {
              await claudeCLIService.stopSession();
            }
            
            const newSession = await claudeCLIService.startSession(projectPath);
            
            return {
              content: [
                {
                  type: 'text',
                  text: `Switched to project: ${projectName} (Session ID: ${newSession.id})`,
                },
              ],
            };
            
          case 'info':
            if (!projectName) {
              const currentStatus = claudeCLIService.getStatus();
              return {
                content: [
                  {
                    type: 'text',
                    text: currentStatus.isRunning ? 
                      `Current session: ${currentStatus.sessionId}` :
                      'No active Claude Code session',
                  },
                ],
              };
            }
            
            const session = await claudeCLIService.getSession(projectName);
            if (!session) {
              throw createError(`Session ${projectName} not found`);
            }
            
            return {
              content: [
                {
                  type: 'text',
                  text: `Project: ${session.name}\nSession ID: ${session.id}\nMessages: ${session.messages.length}\nCreated: ${session.createdAt.toISOString()}\nUpdated: ${session.updatedAt.toISOString()}`,
                },
              ],
            };
            
          case 'status':
            const statusInfo = claudeCLIService.getStatus();
            return {
              content: [
                {
                  type: 'text',
                  text: `Claude CLI Status:\nRunning: ${statusInfo.isRunning}\nSession ID: ${statusInfo.sessionId || 'None'}`,
                },
              ],
            };
            
          default:
            throw createError(`Unknown action: ${action}`);
        }
      } catch (error) {
        logger.error('Project management error', { error: getErrorMessage(error) });
        return {
          content: [
            {
              type: 'text',
              text: `Error managing project: ${getErrorMessage(error)}`,
            },
          ],
        };
      }
    },
  },

  session_management: {
    name: 'session_management',
    description: 'Manage Claude CLI sessions directly',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['start', 'stop', 'send', 'status', 'history'] },
        projectPath: { type: 'string', description: 'Project path for new sessions' },
        message: { type: 'string', description: 'Message to send to Claude CLI' }
      },
      required: ['action']
    },
    handler: async ({ action, projectPath, message }: any) => {
      try {
        logger.info('Session management action', { action, projectPath });
        
        switch (action) {
          case 'start':
            const session = await claudeCLIService.startSession(projectPath);
            return {
              content: [
                {
                  type: 'text',
                  text: `Started new Claude CLI session: ${session.id}`,
                },
              ],
            };
            
          case 'stop':
            await claudeCLIService.stopSession();
            return {
              content: [
                {
                  type: 'text',
                  text: 'Claude CLI session stopped successfully',
                },
              ],
            };
            
          case 'send':
            if (!message) {
              throw createError('Message is required for send action');
            }
            
            const response = await claudeCLIService.sendMessage(message);
            return {
              content: [
                {
                  type: 'text',
                  text: response.content,
                },
              ],
            };
            
          case 'status':
            const status = claudeCLIService.getStatus();
            return {
              content: [
                {
                  type: 'text',
                  text: `Status: ${status.isRunning ? 'Running' : 'Stopped'}\nSession: ${status.sessionId || 'None'}`,
                },
              ],
            };
            
          case 'history':
            const sessions = await claudeCLIService.getSessions();
            const history = sessions.map(s => {
              const messageHistory = s.messages.map(m => 
                `[${m.timestamp.toISOString()}] ${m.role}: ${m.content.substring(0, 100)}${m.content.length > 100 ? '...' : ''}`
              ).join('\n');
              return `Session: ${s.name}\n${messageHistory}`;
            }).join('\n\n');
            
            return {
              content: [
                {
                  type: 'text',
                  text: history || 'No session history available',
                },
              ],
            };
            
          default:
            throw createError(`Unknown action: ${action}`);
        }
      } catch (error) {
        logger.error('Session management error', { error: getErrorMessage(error) });
        return {
          content: [
            {
              type: 'text',
              text: `Error managing session: ${getErrorMessage(error)}`,
            },
          ],
        };
      }
    },
  },
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
      },
      serverInfo: {
        name: 'claude-code-ui-mcp',
        version: '1.0.0',
        description: 'Advanced MCP server for Claude Code UI with real CLI integration',
      },
    });
  } catch (error) {
    logger.error('MCP GET Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, params } = body;

    switch (method) {
      case 'tools/list':
        return NextResponse.json({
          tools: Object.values(tools).map(tool => ({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
          })),
        });

      case 'tools/call':
        const { name, arguments: args } = params;
        const tool = tools[name as keyof typeof tools];

        if (!tool) {
          logger.error('Tool not found', { toolName: name, availableTools: Object.keys(tools) });
          return NextResponse.json({ error: `Tool ${name} not found` }, { status: 404 });
        }

        logger.info('Executing MCP tool', { toolName: name, args });
        const result = await tool.handler(args);
        
        return NextResponse.json({
          content: result.content,
          isError: false,
        });

      case 'initialize':
        return NextResponse.json({
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'claude-code-ui-mcp',
            version: '1.0.0',
            description: 'Advanced MCP server for Claude Code UI with real CLI integration',
          },
        });

      case 'ping':
        return NextResponse.json({ success: true });

      default:
        logger.warn('Unsupported MCP method', { method });
        return NextResponse.json({ error: `Method ${method} not supported` }, { status: 400 });
    }
  } catch (error) {
    logger.error('MCP API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: getErrorMessage(error)
    }, { status: 500 });
  }
}
