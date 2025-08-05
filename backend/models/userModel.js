const db = require('../config/db');

// Hardcoded users for demonstration (keeping database import for other functions that might need it)
const hardcodedUsers = [
  {
    UserID: 1,
    Name: 'AdminOne',
    Email: 'admin@nutritrack.com',
    PasswordHash: 'admin123',
    Role: 'admin',
    Height: 175,
    Weight: 70
  },
  {
    UserID: 2,
    Name: 'Rohit',
    Email: 'rohit@nutritrack.com',
    PasswordHash: 'patient123',
    Role: 'patient',
    Height: 180,
    Weight: 75
  }
];

exports.findUserByEmail = async (email) => {
  try {
    // For demonstration: Use hardcoded data instead of database
    const user = hardcodedUsers.find(u => u.Email.toLowerCase() === email.toLowerCase());
    return user || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

exports.findUserById = async (userId) => {
  try {
    // For demonstration: Use hardcoded data instead of database
    const user = hardcodedUsers.find(u => u.UserID === parseInt(userId));
    return user || null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
};

exports.getAllUsers = async () => {
  try {
    // For demonstration: Return hardcoded users instead of database query
    return hardcodedUsers.map(user => ({
      UserID: user.UserID,
      Name: user.Name,
      Email: user.Email,
      Height: user.Height,
      Weight: user.Weight,
      Role: user.Role
    }));
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

exports.addUser = async (userData, credentialsData) => {
  try {
    // For demonstration: Add user to hardcoded list temporarily
    const newUserId = Date.now(); // Use timestamp as unique ID

    const newUser = {
      UserID: newUserId,
      Name: userData.name,
      Email: userData.email,
      PasswordHash: credentialsData.password,
      Role: credentialsData.role,
      Height: userData.height || 0,
      Weight: userData.weight || 0
    };

    hardcodedUsers.push(newUser);

    console.log('Demo: Added user to hardcoded list:', newUser);
    console.log('Total users now:', hardcodedUsers.length);

    return newUserId;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

exports.deleteUser = async (userId) => {
  try {
    // For demonstration: Remove user from hardcoded list temporarily
    const userIndex = hardcodedUsers.findIndex(u => u.UserID === parseInt(userId));

    if (userIndex !== -1) {
      const deletedUser = hardcodedUsers.splice(userIndex, 1)[0];
      console.log('Demo: Deleted user from hardcoded list:', deletedUser);
      console.log('Total users now:', hardcodedUsers.length);
    } else {
      console.log('Demo: User not found for deletion:', userId);
    }

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

exports.updateUserHealthProfile = async (userId, height, weight) => {
  try {
    // For demonstration: Update hardcoded user data temporarily
    const userIndex = hardcodedUsers.findIndex(u => u.UserID === parseInt(userId));

    if (userIndex !== -1) {
      hardcodedUsers[userIndex].Height = height;
      hardcodedUsers[userIndex].Weight = weight;
      console.log('Demo: Updated user profile:', {
        userId,
        height,
        weight,
        user: hardcodedUsers[userIndex]
      });
    } else {
      console.log('Demo: User not found for profile update:', userId);
    }

    return true;
  } catch (error) {
    console.error('Error updating user health profile:', error);
    throw error;
  }
};