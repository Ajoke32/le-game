import { fightRepository } from "../repositories/fightRepository.js";
import { fighterService } from "./fighterService.js";

class FightService {
  getAll() {
    return fightRepository.getAll();
  }

  getById(id) {
    const fight = fightRepository.getOne({ id });

    if (!fight) {
      throw new Error("Fight not found");
    }

    return fight;
  }

  create({ fighter1, fighter2 }) {
    const [firstFighter, secondFighter] = this.getFighters(fighter1, fighter2);
    const log = this.simulate(firstFighter, secondFighter);

    return fightRepository.create({
      fighter1,
      fighter2,
      log,
    });
  }

  getFighters(fighter1, fighter2) {
    try {
      return [fighterService.getById(fighter1), fighterService.getById(fighter2)];
    } catch {
      throw new Error("Fight entity to create isn't valid");
    }
  }

  simulate(fighter1, fighter2) {
    let fighter1Health = fighter1.health;
    let fighter2Health = fighter2.health;
    const log = [];

    while (fighter1Health > 0 && fighter2Health > 0) {
      const fighter1Shot = this.getDamage(fighter1, fighter2);
      fighter2Health = Math.max(0, fighter2Health - fighter1Shot);

      let fighter2Shot = 0;
      if (fighter2Health > 0) {
        fighter2Shot = this.getDamage(fighter2, fighter1);
        fighter1Health = Math.max(0, fighter1Health - fighter2Shot);
      }

      log.push({
        fighter1Shot,
        fighter2Shot,
        fighter1Health,
        fighter2Health,
      });
    }

    return log;
  }

  getDamage(attacker, defender) {
    const hitPower = Math.floor(attacker.power * (1 + Math.random()));
    const blockPower = Math.floor(defender.defense * (1 + Math.random()));

    return Math.max(0, hitPower - blockPower);
  }
}

const fightService = new FightService();

export { fightService };
