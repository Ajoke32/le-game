import { userRepository } from "../repositories/userRepository.js";

class UserService {
  getAll() {
    return userRepository.getAll();
  }

  getById(id) {
    const user = userRepository.getOne({ id });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  create(userData) {
    this.ensureUnique(userData);
    return userRepository.create(userData);
  }

  update(id, userData) {
    this.getById(id);
    this.ensureUnique(userData, id);
    return userRepository.update(id, userData);
  }

  delete(id) {
    const user = this.getById(id);
    userRepository.delete(id);
    return user;
  }

  search(search) {
    const item = userRepository.getOne(search);
    return item ?? null;
  }

  findByCredentials({ email, password }) {
    const normalizedEmail = email.toLowerCase();

    return this.getAll().find((user) => {
      return (
        user.email.toLowerCase() === normalizedEmail &&
        user.password === password
      );
    });
  }

  ensureUnique(userData, currentUserId) {
    const users = this.getAll();
    for (const user of users) {
      if (user.id !== currentUserId) {
        if (userData.email && areEmailsEqual(user, userData)) {
          throw new Error("User with this email already exists");
        }
        if (userData.phone && arePhonesEqual(user, userData)) {
          throw new Error("User with this phone already exists");
        }
      }
    }
  }
}

const areEmailsEqual = (u1, u2) => {
  return u1.email.toLowerCase() === u2.email.toLowerCase();
};

const arePhonesEqual = (p1, p2) => {
  return p1.phone === p2.phone;
};

const userService = new UserService();

export { userService };
