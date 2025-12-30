import { Client } from 'pg';
import path from 'path';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

client.connect();

async function initDb() {
  try {
await client.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  catch(error) {
    console.error('Ошибка инициализации БД:', error)
  }
  }

  initDb();

  export const getUsers = async () => {
    const result = await client.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  };
  
  export const getUserById = async (id: number) => {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  };
  
  export const createNewUser = async (user: { name: string; email: string; role: string }) => {
    const result = await client.query(
      'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
      [user.name, user.email, user.role]
    );
    return result.rows[0];
  };
  
  export const updateUser = async (id: number, user: { name: string; email: string; role: string }) => {
    const result = await client.query(
      'UPDATE users SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [user.name, user.email, user.role, id]
    );
    return result;
  };
  
  export const deleteUser = async (id: number) => {
    const result = await client.query('DELETE FROM users WHERE id = $1', [id]);
    return result;
  };
  
  export { client };
