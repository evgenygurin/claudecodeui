import { sql } from '@vercel/postgres';
import crypto from 'crypto';

// Postgres adapter for Vercel Postgres
// Uses @vercel/postgres SDK which automatically connects using environment variables:
// POSTGRES_URL, POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING, etc.

// Initialize database with schema
const initializeDatabase = async () => {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `;

    // Create indexes for users
    await sql`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active)`;

    // Create api_keys table
    await sql`
      CREATE TABLE IF NOT EXISTS api_keys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        key_name TEXT NOT NULL,
        api_key TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_used TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    // Create indexes for api_keys
    await sql`CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(api_key)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active)`;

    // Create user_credentials table
    await sql`
      CREATE TABLE IF NOT EXISTS user_credentials (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        credential_name TEXT NOT NULL,
        credential_type TEXT NOT NULL,
        credential_value TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    // Create indexes for user_credentials
    await sql`CREATE INDEX IF NOT EXISTS idx_user_credentials_user_id ON user_credentials(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_credentials_type ON user_credentials(credential_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_credentials_active ON user_credentials(is_active)`;

    console.log('Postgres database initialized successfully');
  } catch (error) {
    console.error('Error initializing Postgres database:', error.message);
    throw error;
  }
};

// User database operations
const userDb = {
  // Check if any users exist
  hasUsers: async () => {
    try {
      const result = await sql`SELECT COUNT(*) as count FROM users`;
      return result.rows[0].count > 0;
    } catch (err) {
      throw err;
    }
  },

  // Create a new user
  createUser: async (username, passwordHash) => {
    try {
      const result = await sql`
        INSERT INTO users (username, password_hash)
        VALUES (${username}, ${passwordHash})
        RETURNING id, username
      `;
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  // Get user by username
  getUserByUsername: async (username) => {
    try {
      const result = await sql`
        SELECT * FROM users
        WHERE username = ${username} AND is_active = true
      `;
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  },

  // Update last login time
  updateLastLogin: async (userId) => {
    try {
      await sql`
        UPDATE users
        SET last_login = CURRENT_TIMESTAMP
        WHERE id = ${userId}
      `;
    } catch (err) {
      throw err;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const result = await sql`
        SELECT id, username, created_at, last_login
        FROM users
        WHERE id = ${userId} AND is_active = true
      `;
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  },

  getFirstUser: async () => {
    try {
      const result = await sql`
        SELECT id, username, created_at, last_login
        FROM users
        WHERE is_active = true
        LIMIT 1
      `;
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
};

// API Keys database operations
const apiKeysDb = {
  // Generate a new API key
  generateApiKey: () => {
    return 'ck_' + crypto.randomBytes(32).toString('hex');
  },

  // Create a new API key
  createApiKey: async (userId, keyName) => {
    try {
      const apiKey = apiKeysDb.generateApiKey();
      const result = await sql`
        INSERT INTO api_keys (user_id, key_name, api_key)
        VALUES (${userId}, ${keyName}, ${apiKey})
        RETURNING id, key_name as keyName, api_key as apiKey
      `;
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  // Get all API keys for a user
  getApiKeys: async (userId) => {
    try {
      const result = await sql`
        SELECT id, key_name, api_key, created_at, last_used, is_active
        FROM api_keys
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  // Validate API key and get user
  validateApiKey: async (apiKey) => {
    try {
      const result = await sql`
        SELECT u.id, u.username, ak.id as api_key_id
        FROM api_keys ak
        JOIN users u ON ak.user_id = u.id
        WHERE ak.api_key = ${apiKey}
          AND ak.is_active = true
          AND u.is_active = true
      `;

      if (result.rows.length > 0) {
        // Update last_used timestamp
        await sql`
          UPDATE api_keys
          SET last_used = CURRENT_TIMESTAMP
          WHERE id = ${result.rows[0].api_key_id}
        `;
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw err;
    }
  },

  // Delete an API key
  deleteApiKey: async (userId, apiKeyId) => {
    try {
      const result = await sql`
        DELETE FROM api_keys
        WHERE id = ${apiKeyId} AND user_id = ${userId}
      `;
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  },

  // Toggle API key active status
  toggleApiKey: async (userId, apiKeyId, isActive) => {
    try {
      const result = await sql`
        UPDATE api_keys
        SET is_active = ${isActive}
        WHERE id = ${apiKeyId} AND user_id = ${userId}
      `;
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }
};

// User credentials database operations
const credentialsDb = {
  // Create a new credential
  createCredential: async (userId, credentialName, credentialType, credentialValue, description = null) => {
    try {
      const result = await sql`
        INSERT INTO user_credentials (user_id, credential_name, credential_type, credential_value, description)
        VALUES (${userId}, ${credentialName}, ${credentialType}, ${credentialValue}, ${description})
        RETURNING id, credential_name as credentialName, credential_type as credentialType
      `;
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  // Get all credentials for a user, optionally filtered by type
  getCredentials: async (userId, credentialType = null) => {
    try {
      let result;
      if (credentialType) {
        result = await sql`
          SELECT id, credential_name, credential_type, description, created_at, is_active
          FROM user_credentials
          WHERE user_id = ${userId} AND credential_type = ${credentialType}
          ORDER BY created_at DESC
        `;
      } else {
        result = await sql`
          SELECT id, credential_name, credential_type, description, created_at, is_active
          FROM user_credentials
          WHERE user_id = ${userId}
          ORDER BY created_at DESC
        `;
      }
      return result.rows;
    } catch (err) {
      throw err;
    }
  },

  // Get active credential value for a user by type (returns most recent active)
  getActiveCredential: async (userId, credentialType) => {
    try {
      const result = await sql`
        SELECT credential_value
        FROM user_credentials
        WHERE user_id = ${userId}
          AND credential_type = ${credentialType}
          AND is_active = true
        ORDER BY created_at DESC
        LIMIT 1
      `;
      return result.rows[0]?.credential_value || null;
    } catch (err) {
      throw err;
    }
  },

  // Delete a credential
  deleteCredential: async (userId, credentialId) => {
    try {
      const result = await sql`
        DELETE FROM user_credentials
        WHERE id = ${credentialId} AND user_id = ${userId}
      `;
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  },

  // Toggle credential active status
  toggleCredential: async (userId, credentialId, isActive) => {
    try {
      const result = await sql`
        UPDATE user_credentials
        SET is_active = ${isActive}
        WHERE id = ${credentialId} AND user_id = ${userId}
      `;
      return result.rowCount > 0;
    } catch (err) {
      throw err;
    }
  }
};

// Backward compatibility - keep old names pointing to new system
const githubTokensDb = {
  createGithubToken: (userId, tokenName, githubToken, description = null) => {
    return credentialsDb.createCredential(userId, tokenName, 'github_token', githubToken, description);
  },
  getGithubTokens: (userId) => {
    return credentialsDb.getCredentials(userId, 'github_token');
  },
  getActiveGithubToken: (userId) => {
    return credentialsDb.getActiveCredential(userId, 'github_token');
  },
  deleteGithubToken: (userId, tokenId) => {
    return credentialsDb.deleteCredential(userId, tokenId);
  },
  toggleGithubToken: (userId, tokenId, isActive) => {
    return credentialsDb.toggleCredential(userId, tokenId, isActive);
  }
};

export {
  initializeDatabase,
  userDb,
  apiKeysDb,
  credentialsDb,
  githubTokensDb
};
