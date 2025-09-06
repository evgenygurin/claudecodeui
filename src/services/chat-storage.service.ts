interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

class ChatStorageService {
  private readonly STORAGE_KEY = 'claude-code-ui-chats';

  // Get all chat sessions
  getAllChats(): ChatSession[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const chats = JSON.parse(stored);
      return chats.map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    } catch (error) {
      console.error('Failed to load chats:', error);
      return [];
    }
  }

  // Get a specific chat session
  getChat(chatId: string): ChatSession | null {
    const chats = this.getAllChats();
    return chats.find(chat => chat.id === chatId) || null;
  }

  // Create a new chat session
  createChat(title: string = 'New Chat'): ChatSession {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const chats = this.getAllChats();
    chats.unshift(newChat);
    this.saveChats(chats);
    
    return newChat;
  }

  // Add a message to a chat
  addMessage(chatId: string, role: 'user' | 'assistant', content: string): ChatMessage {
    const chats = this.getAllChats();
    const chatIndex = chats.findIndex(chat => chat.id === chatId);
    
    if (chatIndex === -1) {
      throw new Error('Chat not found');
    }

    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
    };

    chats[chatIndex].messages.push(message);
    chats[chatIndex].updatedAt = new Date();
    
    // Update title if it's the first user message
    if (role === 'user' && chats[chatIndex].messages.length === 1) {
      chats[chatIndex].title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
    }

    this.saveChats(chats);
    return message;
  }

  // Update a chat session
  updateChat(chatId: string, updates: Partial<ChatSession>): ChatSession | null {
    const chats = this.getAllChats();
    const chatIndex = chats.findIndex(chat => chat.id === chatId);
    
    if (chatIndex === -1) {
      return null;
    }

    chats[chatIndex] = {
      ...chats[chatIndex],
      ...updates,
      updatedAt: new Date(),
    };

    this.saveChats(chats);
    return chats[chatIndex];
  }

  // Delete a chat session
  deleteChat(chatId: string): boolean {
    const chats = this.getAllChats();
    const filteredChats = chats.filter(chat => chat.id !== chatId);
    
    if (filteredChats.length === chats.length) {
      return false; // Chat not found
    }

    this.saveChats(filteredChats);
    return true;
  }

  // Clear all chats
  clearAllChats(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Export chats as JSON
  exportChats(): string {
    const chats = this.getAllChats();
    return JSON.stringify(chats, null, 2);
  }

  // Import chats from JSON
  importChats(jsonData: string): boolean {
    try {
      const chats = JSON.parse(jsonData);
      if (!Array.isArray(chats)) {
        throw new Error('Invalid format');
      }

      // Validate structure
      chats.forEach(chat => {
        if (!chat.id || !chat.title || !Array.isArray(chat.messages)) {
          throw new Error('Invalid chat structure');
        }
      });

      this.saveChats(chats);
      return true;
    } catch (error) {
      console.error('Failed to import chats:', error);
      return false;
    }
  }

  // Get chat statistics
  getStats() {
    const chats = this.getAllChats();
    const totalMessages = chats.reduce((sum, chat) => sum + chat.messages.length, 0);
    const userMessages = chats.reduce(
      (sum, chat) => sum + chat.messages.filter(msg => msg.role === 'user').length,
      0
    );
    const assistantMessages = totalMessages - userMessages;

    return {
      totalChats: chats.length,
      totalMessages,
      userMessages,
      assistantMessages,
      averageMessagesPerChat: chats.length > 0 ? Math.round(totalMessages / chats.length) : 0,
    };
  }

  private saveChats(chats: ChatSession[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Failed to save chats:', error);
      throw new Error('Failed to save chat data');
    }
  }
}

export const chatStorageService = new ChatStorageService();
export type { ChatMessage, ChatSession };
