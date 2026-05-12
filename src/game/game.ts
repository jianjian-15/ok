import { Player } from './player'
import { InputManager } from './input'
import { Renderer } from './renderer'
import { processCombat } from './combat'

type GameState = 'playing' | 'ended'

export class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private input: InputManager
  private renderer: Renderer
  private players: [Player, Player]
  private state: GameState = 'playing'
  private winner: Player | null = null
  private animFrameId: number = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.input = new InputManager()
    this.renderer = new Renderer(this.ctx)
    this.players = [
      new Player(100, 0, 1),
      new Player(800 - 100 - 32, 0, 2),
    ]
  }

  start() {
    this.input.init()
    this.canvas.addEventListener('click', this.handleClick)
    this.loop()
  }

  destroy() {
    this.input.destroy()
    this.canvas.removeEventListener('click', this.handleClick)
    cancelAnimationFrame(this.animFrameId)
  }

  private handleClick = (e: MouseEvent) => {
    if (this.state !== 'ended') return
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY
    const btn = this.renderer.getRestartButtonBounds()
    if (
      mx >= btn.x && mx <= btn.x + btn.width &&
      my >= btn.y && my <= btn.y + btn.height
    ) {
      this.restart()
    }
  }

  private loop = () => {
    this.update()
    this.render()
    this.animFrameId = requestAnimationFrame(this.loop)
  }

  private update() {
    if (this.state === 'ended') {
      this.input.clearJustPressed()
      if (this.input.isRestartPressed()) {
        this.restart()
      }
      return
    }

    this.players[0].update(this.input)
    this.players[1].update(this.input)

    this.preventOverlap()

    processCombat(this.players)

    if (this.players[0].hp <= 0) {
      this.state = 'ended'
      this.winner = this.players[1]
    } else if (this.players[1].hp <= 0) {
      this.state = 'ended'
      this.winner = this.players[0]
    }

    this.input.clearJustPressed()
  }

  private preventOverlap() {
    const p1 = this.players[0]
    const p2 = this.players[1]
    if (p1.x < p2.x + p2.width && p1.x + p1.width > p2.x &&
        p1.y < p2.y + p2.height && p1.y + p1.height > p2.y) {
      const overlap = (p1.x + p1.width) - p2.x
      if (overlap > 0) {
        p1.x -= overlap / 2
        p2.x += overlap / 2
      }
    }
  }

  private render() {
    this.renderer.clear()
    this.renderer.drawBackground()
    this.renderer.drawPlayer(this.players[0])
    this.renderer.drawPlayer(this.players[1])
    this.renderer.drawHUD(this.players)

    if (this.state === 'ended' && this.winner) {
      this.renderer.drawGameOver(this.winner)
    }
  }

  private restart() {
    this.players = [
      new Player(100, 0, 1),
      new Player(800 - 100 - 32, 0, 2),
    ]
    this.state = 'playing'
    this.winner = null
  }
}