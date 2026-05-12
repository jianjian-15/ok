import { Player } from './player'

function rectsOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

export function processCombat(players: [Player, Player]): [boolean, boolean] {
  const hits: [boolean, boolean] = [false, false]

  const attacker1 = players[0]
  const defender1 = players[1]
  if (attacker1.isAttackActive && !attacker1.hasHitThisAttack) {
    if (rectsOverlap(
      attacker1.attackBox.x, attacker1.attackBox.y, attacker1.attackBox.width, attacker1.attackBox.height,
      defender1.hitBox.x, defender1.hitBox.y, defender1.hitBox.width, defender1.hitBox.height
    )) {
      defender1.takeDamage(8)
      attacker1.hasHitThisAttack = true
      hits[1] = true
    }
  }

  const attacker2 = players[1]
  const defender2 = players[0]
  if (attacker2.isAttackActive && !attacker2.hasHitThisAttack) {
    if (rectsOverlap(
      attacker2.attackBox.x, attacker2.attackBox.y, attacker2.attackBox.width, attacker2.attackBox.height,
      defender2.hitBox.x, defender2.hitBox.y, defender2.hitBox.width, defender2.hitBox.height
    )) {
      defender2.takeDamage(8)
      attacker2.hasHitThisAttack = true
      hits[0] = true
    }
  }

  return hits
}