export type PlayerState = 'idle' | 'walk' | 'attack' | 'defend' | 'hit'
export type Direction = 'left' | 'right'

export interface ColorScheme {
  primary: string
  dark: string
  light: string
  accent: string
  outline: string
}

export class Player {
  x: number
  y: number
  vx: number = 0
  vy: number = 0
  width: number = 32
  height: number = 48
  hp: number = 100
  maxHp: number = 100
  speed: number = 3
  state: PlayerState = 'idle'
  direction: Direction = 'right'
  facing: Direction = 'right'
  animFrame: number = 0
  animTimer: number = 0
  attackCooldown: number = 0
  attackDuration: number = 0
  hitStun: number = 0
  isDefending: boolean = false
  isOnGround: boolean = false
  hasHitThisAttack: boolean = false
  playerNumber: 1 | 2
  colorScheme: ColorScheme

  constructor(x: number, y: number, playerNumber: 1 | 2) {
    this.x = x
    this.y = y
    this.playerNumber = playerNumber
    if (playerNumber === 1) {
      this.facing = 'right'
      this.colorScheme = {
        primary: '#4488ff',
        dark: '#2266cc',
        light: '#66aaff',
        accent: '#ffdd00',
        outline: '#003366',
      }
    } else {
      this.facing = 'left'
      this.colorScheme = {
        primary: '#ff4444',
        dark: '#cc2222',
        light: '#ff6666',
        accent: '#ffdd00',
        outline: '#660000',
      }
    }
  }

  get attackBox() {
    const range = 40
    if (this.facing === 'right') {
      return {
        x: this.x + this.width,
        y: this.y + 8,
        width: range,
        height: this.height - 16,
      }
    } else {
      return {
        x: this.x - range,
        y: this.y + 8,
        width: range,
        height: this.height - 16,
      }
    }
  }

  get hitBox() {
    return {
      x: this.x + 4,
      y: this.y + 4,
      width: this.width - 8,
      height: this.height - 8,
    }
  }

  get isAttackActive(): boolean {
    return this.state === 'attack' && this.attackDuration >= 5 && this.attackDuration <= 14
  }

  takeDamage(amount: number) {
    if (this.isDefending) {
      this.hp -= Math.floor(amount * 0.5)
    } else {
      this.hp -= amount
    }
    this.state = 'hit'
    this.hitStun = 18
    this.vx = this.facing === 'right' ? -6 : 6
    this.vy = -4
    this.isOnGround = false
  }

  update(input: { p1Left: () => boolean; p1Right: () => boolean; p1Jump: () => boolean; p1Attack: () => boolean; p1Defend: () => boolean; p2Left: () => boolean; p2Right: () => boolean; p2Jump: () => boolean; p2Attack: () => boolean; p2Defend: () => boolean }) {
    if (this.attackCooldown > 0) this.attackCooldown--
    if (this.attackDuration > 0) this.attackDuration--
    if (this.hitStun > 0) this.hitStun--

    if (this.state === 'hit' && this.hitStun <= 0) {
      this.state = 'idle'
    }

    if (this.state === 'attack' && this.attackDuration <= 0) {
      this.state = 'idle'
    }

    if (this.state === 'hit') {
      this.applyPhysics()
      return
    }

    this.isDefending = false

    const isP1 = this.playerNumber === 1
    const moveLeft = isP1 ? input.p1Left() : input.p2Left()
    const moveRight = isP1 ? input.p1Right() : input.p2Right()
    const jump = isP1 ? input.p1Jump() : input.p2Jump()
    const attack = isP1 ? input.p1Attack() : input.p2Attack()
    const defend = isP1 ? input.p1Defend() : input.p2Defend()

    if (this.state === 'attack' && this.attackDuration <= 4) {
      this.vx = 0
      this.applyPhysics()
      return
    }

    if (moveLeft) {
      this.vx = -this.speed
      this.facing = 'left'
      if (this.state !== 'attack') this.state = 'walk'
    } else if (moveRight) {
      this.vx = this.speed
      this.facing = 'right'
      if (this.state !== 'attack') this.state = 'walk'
    } else {
      if (this.state !== 'attack') {
        this.vx = 0
        this.state = 'idle'
      }
    }

    if (jump && this.isOnGround && this.state !== 'attack') {
      this.vy = -10
      this.isOnGround = false
    }

    if (attack && this.attackCooldown <= 0 && this.state !== 'attack') {
      this.state = 'attack'
      this.attackDuration = 20
      this.attackCooldown = 30
      this.hasHitThisAttack = false
      this.vx = 0
    }

    if (defend && this.state !== 'attack') {
      this.isDefending = true
      this.state = 'defend'
      this.vx = 0
    }

    this.animTimer++
    if (this.animTimer >= 8) {
      this.animTimer = 0
      this.animFrame = (this.animFrame + 1) % 4
    }

    this.applyPhysics()
    this.checkBounds()
  }

  private applyPhysics() {
    if (!this.isOnGround) {
      this.vy += 0.5
    }

    this.x += this.vx
    this.y += this.vy

    if (this.y + this.height >= 380) {
      this.y = 380 - this.height
      this.vy = 0
      this.isOnGround = true
      if (Math.abs(this.vx) < 0.5) this.vx = 0
    }

    if (this.state === 'idle' || this.state === 'defend') {
      this.vx *= 0.8
    }
  }

  private checkBounds() {
    if (this.x < 0) this.x = 0
    if (this.x + this.width > 800) this.x = 800 - this.width
  }
}