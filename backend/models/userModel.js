const db = require('../config/db');

exports.findUserByEmail = async (email) => {
  try {
    const [rows] = await db.execute(
      `SELECT u.UserID, u.Name, u.Email, c.PasswordHash, c.Role 
       FROM users u 
       JOIN credentials c ON u.UserID = c.UserID 
       WHERE c.Email = ?`,
      [email]
    );
    
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

exports.findUserById = async (userId) => {
  try {
    const [rows] = await db.execute(
      `SELECT u.UserID, u.Name, u.Email, u.Height, u.Weight, c.Role 
       FROM users u 
       JOIN credentials c ON u.UserID = c.UserID 
       WHERE u.UserID = ?`,
      [userId]
    );
    
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
};

exports.getAllUsers = async () => {
  try {
    const [rows] = await db.execute(
      `SELECT u.UserID, u.Name, u.Email, u.Height, u.Weight, c.Role 
       FROM users u 
       JOIN credentials c ON u.UserID = c.UserID 
       ORDER BY u.UserID ASC`
    );
    
    return rows;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

exports.addUser = async (userData, credentialsData) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Insert user
    const [userResult] = await connection.execute(
      'INSERT INTO users (Name, Email, Height, Weight) VALUES (?, ?, ?, ?)',
      [userData.name, userData.email, userData.height || 0, userData.weight || 0]
    );
    
    const userId = userResult.insertId;
    
    // Insert credentials
    await connection.execute(
      'INSERT INTO credentials (Email, PasswordHash, Role, UserID) VALUES (?, ?, ?, ?)',
      [credentialsData.email, credentialsData.password, credentialsData.role, userId]
    );
    
    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    console.error('Error adding user:', error);
    throw error;
  } finally {
    connection.release();
  }
};

exports.deleteUser = async (userId) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Delete credentials first (foreign key constraint)
    await connection.execute('DELETE FROM credentials WHERE UserID = ?', [userId]);
    
    // Delete user
    await connection.execute('DELETE FROM users WHERE UserID = ?', [userId]);
    
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting user:', error);
    throw error;
  } finally {
    connection.release();
  }
};

exports.updateUserHealthProfile = async (userId, height, weight) => {
  try {
    await db.execute(
      'UPDATE users SET Height = ?, Weight = ? WHERE UserID = ?',
      [height, weight, userId]
    );
    
    return true;
  } catch (error) {
    console.error('Error updating user health profile:', error);
    throw error;
  }
};