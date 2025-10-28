const bcrypt = require("bcryptjs");

let users = [];
let idCounter = 1;

const userModel = {
  addUser: async (userData) => {
    try {
      const { username, email, password } = userData;

      const userExists = users.find((user) => user.username === username);
      if (userExists) {
        throw new Error("Usuário já existe");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = {
        id: idCounter++,
        username,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  },

  findByUsername: (username) => {
    return users.find((user) => user.username === username);
  },
};

module.exports = userModel;
