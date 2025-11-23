let users = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    passwordHash:
      "$2a$10$KIXQhZ6mGq9s1VJ1rvZPSe1a0Qx2mH0hQjKqQjQx8ZQhQv8b1cVxS",
    role: "admin",
  },
];
let nextId = 2;

function addUser(user) {
  user.id = nextId++;
  users.push(user);
  return user;
}

function findByUsername(username) {
  return users.find((u) => u.username === username);
}

function findById(id) {
  return users.find((u) => u.id === id);
}

module.exports = {
  addUser,
  findByUsername,
  findById,
  _rawUsers: users,
};
