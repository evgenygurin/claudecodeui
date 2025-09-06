import { getErrorMessage } from '@/utils/error-handler';
import { createError } from '@/utils/error-handler';
import { logger } from '@/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

// Simple MCP tool definitions
const tools = {
  claude_code_execute: {
    name: 'claude_code_execute',
    description: 'Execute Claude Code CLI commands',
    handler: async ({ command, projectPath, options }: any) => {
      try {
        return {
          content: [
            {
              type: 'text',
              text: `Executed Claude Code command: ${command}${projectPath ? ` in ${projectPath}` : ''}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing command: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`,
            },
          ],
        };
      }
    },
  },

  file_operations: {
    name: 'file_operations',
    description: 'Perform file operations (read, write, list, delete)',
    handler: async ({ operation, path, content }: any) => {
      try {
        switch (operation) {
          case 'read':
            return {
              content: [
                {
                  type: 'text',
                  text: `Reading file: ${path}`,
                },
              ],
            };
          case 'write':
            return {
              content: [
                {
                  type: 'text',
                  text: `Writing content to file: ${path}`,
                },
              ],
            };
          case 'list':
            return {
              content: [
                {
                  type: 'text',
                  text: `Listing directory: ${path}`,
                },
              ],
            };
          case 'delete':
            return {
              content: [
                {
                  type: 'text',
                  text: `Deleting: ${path}`,
                },
              ],
            };
          case 'create':
            return {
              content: [
                {
                  type: 'text',
                  text: `Creating: ${path}`,
                },
              ],
            };
          default:
            throw createError(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error performing file operation: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`,
            },
          ],
        };
      }
    },
  },

  project_management: {
    name: 'project_management',
    description: 'Manage Claude Code projects',
    handler: async ({ action, projectName, projectPath }: any) => {
      try {
        switch (action) {
          case 'list':
            return {
              content: [
                {
                  type: 'text',
                  text: 'Listing Claude Code projects...',
                },
              ],
            };
          case 'create':
            return {
              content: [
                {
                  type: 'text',
                  text: `Creating project: ${projectName} at ${projectPath}`,
                },
              ],
            };
          case 'delete':
            return {
              content: [
                {
                  type: 'text',
                  text: `Deleting project: ${projectName}`,
                },
              ],
            };
          case 'switch':
            return {
              content: [
                {
                  type: 'text',
                  text: `Switching to project: ${projectName}`,
                },
              ],
            };
          case 'info':
            return {
              content: [
                {
                  type: 'text',
                  text: `Project info for: ${projectName}`,
                },
              ],
            };
          default:
            throw createError(`Unknown action: ${action}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error managing project: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`,
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
      },
    });
  } catch (error) {
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
            inputSchema: {
              type: 'object',
              properties: {
                command: { type: 'string', description: 'The command to execute' },
                projectPath: { type: 'string', description: 'Project path to execute command in' },
                options: { type: 'object', description: 'Additional options for the command' },
              },
              required: ['command'],
            },
          })),
        });

      case 'tools/call':
        const { name, arguments: args } = params;
        const tool = tools[name as keyof typeof tools];

        if (!tool) {
          return NextResponse.json({ error: `Tool ${name} not found` }, { status: 404 });
        }

        const result = await tool.handler(args);
        return NextResponse.json({
          content: result.content,
        });

      default:
        return NextResponse.json({ error: `Method ${method} not supported` }, { status: 400 });
    }
  } catch (error) {
    logger.error('MCP API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
