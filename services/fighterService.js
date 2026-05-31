import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {
  getAll() {
    return fighterRepository.getAll();
  }

  getById(id) {
    const fighter = fighterRepository.getOne({ id });

    if (!fighter) {
      throw new Error("Fighter not found");
    }

    return fighter;
  }

  create(fighterData) {
    this.ensureUnique(fighterData);
    return fighterRepository.create({
      health: 85,
      ...fighterData,
    });
  }

  update(id, fighterData) {
    this.getById(id);
    this.ensureUnique(fighterData, id);
    return fighterRepository.update(id, fighterData);
  }

  delete(id) {
    const fighter = this.getById(id);
    fighterRepository.delete(id);
    return fighter;
  }

  ensureUnique(fighterData, currentFighterId) {
    const duplicateName =
      fighterData.name &&
      this.getAll().find((fighter) => {
        return fighter.id !== currentFighterId && fighter.name.toLowerCase() === fighterData.name.toLowerCase();
      });

    if (duplicateName) {
      throw new Error("Fighter with this name already exists");
    }
  }
}

const fighterService = new FighterService();

export { fighterService };
