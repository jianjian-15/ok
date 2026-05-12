export interface KeyState {
  [key: string]: boolean
}

export class InputManager {
  private keys: KeyState = {}
  private justPressed: Set<string> = new Set()

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  init() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.keys[e.key]) {
      this.justPressed.add(e.key)
    }
    this.keys[e.key] = true
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault()
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    this.keys[e.key] = false
  }

  isDown(key: string): boolean {
    return !!this.keys[key]
  }

  wasJustPressed(key: string): boolean {
    return this.justPressed.has(key)
  }

  clearJustPressed() {
    this.justPressed.clear()
  }

  p1Left() { return this.isDown('a') || this.isDown('A') }
  p1Right() { return this.isDown('d') || this.isDown('D') }
  p1Jump() { return this.wasJustPressed('w') || this.wasJustPressed('W') }
  p1Attack() { return this.wasJustPressed('j') || this.wasJustPressed('J') }
  p1Defend() { return this.isDown('k') || this.isDown('K') }

  p2Left() { return this.isDown('ArrowLeft') }
  p2Right() { return this.isDown('ArrowRight') }
  p2Jump() { return this.wasJustPressed('ArrowUp') }
  p2Attack() { return this.wasJustPressed('Enter') }
  p2Defend() { return this.isDown('Shift') }

  isRestartPressed() {
    return this.wasJustPressed(' ') || this.wasJustPressed('r') || this.wasJustPressed('R')
  }
}