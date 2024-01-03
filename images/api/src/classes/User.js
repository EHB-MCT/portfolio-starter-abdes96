const bcrypt = require("bcryptjs");

class User {
  constructor({ name, email, password }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  
  

 

  validatePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
  
}

module.exports = User;
