import { Player } from './player'

const CANVAS_W = 800
const CANVAS_H = 450

export class Renderer {
  private ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  clear() {
    this.ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)
  }

  drawBackground() {
    const ctx = this.ctx

    const skyGrad = ctx.createLinearGradient(0, 0, 0, 380)
    skyGrad.addColorStop(0, '#0a0a2e')
    skyGrad.addColorStop(0.5, '#1a1a3e')
    skyGrad.addColorStop(1, '#2a1a3e')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, CANVAS_W, 380)

    ctx.fillStyle = '#ffffff'
    for (let i = 0; i < 40; i++) {
      const sx = (i * 137 + 50) % CANVAS_W
      const sy = (i * 89 + 20) % 200
      const size = (i % 3) + 1
      ctx.globalAlpha = 0.2 + (i % 5) * 0.15
      ctx.fillRect(sx, sy, size, size)
    }
    ctx.globalAlpha = 1

    const buildings = [
      { x: 30, w: 50, h: 90 }, { x: 100, w: 35, h: 60 },
      { x: 160, w: 55, h: 110 }, { x: 240, w: 40, h: 75 },
      { x: 310, w: 45, h: 95 }, { x: 380, w: 35, h: 55 },
      { x: 440, w: 60, h: 120 }, { x: 530, w: 35, h: 65 },
      { x: 590, w: 50, h: 85 }, { x: 660, w: 40, h: 70 },
      { x: 720, w: 55, h: 100 },
    ]
    for (const b of buildings) {
      ctx.fillStyle = '#151525'
      ctx.fillRect(b.x, 380 - b.h, b.w, b.h)
      ctx.fillStyle = '#ffdd66'
      for (let wy = 380 - b.h + 8; wy < 380 - 10; wy += 16) {
        for (let wx = b.x + 6; wx < b.x + b.w - 6; wx += 12) {
          if ((wx + wy) % 7 > 3) {
            ctx.globalAlpha = 0.2 + ((wx * 7 + wy * 3) % 5) * 0.1
            ctx.fillRect(wx, wy, 6, 8)
          }
        }
      }
      ctx.globalAlpha = 1
    }

    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, 380, CANVAS_W, 70)

    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 1
    for (let x = 0; x < CANVAS_W; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 380)
      ctx.lineTo(x, CANVAS_H)
      ctx.stroke()
    }
    for (let y = 380; y < CANVAS_H; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(CANVAS_W, y)
      ctx.stroke()
    }

    ctx.fillStyle = '#444444'
    ctx.fillRect(0, 378, CANVAS_W, 4)

    ctx.fillStyle = '#383838'
    ctx.fillRect(0, 380, CANVAS_W, 2)
  }

  drawPlayer(player: Player) {
    const ctx = this.ctx
    const { x, y, width, height } = player
    const c = player.colorScheme

    ctx.save()

    if (player.state === 'hit' && player.hitStun > 0 && player.hitStun % 4 < 2) {
      ctx.globalAlpha = 0.5
    }

    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fillRect(x + 4, 380, width - 8, 4)

    const isWalk = player.state === 'walk'
    const isAttack = player.state === 'attack'
    const isDefend = player.state === 'defend'
    const animFrame = player.animFrame
    const legSwing = isWalk ? Math.sin(animFrame * Math.PI / 2) * 3 : 0

    ctx.fillStyle = c.primary
    ctx.fillRect(x + 10, y, 12, 6)
    ctx.fillRect(x + 8, y + 4, 16, 4)
    ctx.fillRect(x + 6, y + 10, 20, 14)

    ctx.fillStyle = c.dark
    ctx.fillRect(x + 4, y + 10, 6, 4)
    ctx.fillRect(x + 22, y + 10, 6, 4)
    ctx.fillRect(x + 6, y + 22, 20, 3)

    ctx.fillStyle = c.light
    ctx.fillRect(x + 8, y + 13, 16, 7)

    ctx.fillStyle = c.accent
    ctx.fillRect(x + 10, y + 5, 12, 3)
    ctx.fillRect(x + 14, y + 16, 4, 4)

    ctx.fillStyle = c.primary
    ctx.fillRect(x + 12, y + 7, 8, 4)

    if (isAttack) {
      const extendX = player.facing === 'right' ? 14 : -14
      ctx.fillStyle = c.primary
      if (player.facing === 'right') {
        ctx.fillRect(x + 22, y + 13, 16 + extendX, 6)
        ctx.fillStyle = c.light
        ctx.fillRect(x + 32 + extendX, y + 12, 7, 8)
        ctx.fillStyle = c.primary
        ctx.fillRect(x - 2, y + 13, 8, 6)
      } else {
        ctx.fillRect(x - 6 + extendX, y + 13, 16 - extendX, 6)
        ctx.fillStyle = c.light
        ctx.fillRect(x - 7 + extendX, y + 12, 7, 8)
        ctx.fillStyle = c.primary
        ctx.fillRect(x + 26, y + 13, 8, 6)
      }
    } else if (isDefend) {
      ctx.fillStyle = c.dark
      ctx.fillRect(x + 6, y + 12, 20, 10)
      ctx.fillStyle = c.light
      ctx.fillRect(x + 9, y + 14, 14, 6)
    } else {
      ctx.fillStyle = c.primary
      const armSwing = isWalk ? Math.sin(animFrame * Math.PI / 2) * 2 : 0
      ctx.fillRect(x - 2, y + 13 + armSwing, 6, 10)
      ctx.fillRect(x + 28, y + 13 - armSwing, 6, 10)
      ctx.fillStyle = c.light
      ctx.fillRect(x - 3, y + 22 + armSwing, 7, 5)
      ctx.fillRect(x + 28, y + 22 - armSwing, 7, 5)
    }

    ctx.fillStyle = c.dark
    ctx.fillRect(x + 8, y + 24, 6, 12 + legSwing)
    ctx.fillRect(x + 18, y + 24, 6, 12 - legSwing)

    ctx.fillStyle = c.primary
    ctx.fillRect(x + 7, y + 34 + legSwing, 8, 6)
    ctx.fillRect(x + 17, y + 34 - legSwing, 8, 6)

    ctx.fillStyle = c.light
    ctx.fillRect(x + 7, y + 38 + legSwing, 8, 2)
    ctx.fillRect(x + 17, y + 38 - legSwing, 8, 2)

    ctx.restore()

    if (player.isAttackActive) {
      this.drawAttackEffect(player)
    }
  }

  private drawAttackEffect(player: Player) {
    const ctx = this.ctx
    const range = 40
    const ex = player.facing === 'right' ? player.x + player.width : player.x - range
    const ey = player.y + 8

    ctx.save()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.fillRect(ex, ey, range, player.height - 16)

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.lineWidth = 2
    const cx = ex + (player.facing === 'right' ? range : 0)
    const cy = ey + (player.height - 16) / 2
    for (let i = 0; i < 3; i++) {
      const angle = (i - 1) * 0.3 + (player.facing === 'right' ? 0 : Math.PI)
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(angle) * 20, cy + Math.sin(angle) * 20)
      ctx.stroke()
    }

    ctx.restore()
  }

  drawHUD(players: Player[]) {
    const ctx = this.ctx

    ctx.save()
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(0, 0, CANVAS_W, 34)
    ctx.restore()

    this.drawHealthBar(20, 8, 180, 20, players[0], 'P1 蓝机')
    this.drawHealthBar(600, 8, 180, 20, players[1], 'P2 红机')

    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.font = '9px monospace'
    ctx.fillText('WASD 移动 | J 攻击 | K 防御', 20, 435)
    ctx.textAlign = 'right'
    ctx.fillText('方向键 移动 | Enter 攻击 | Shift 防御', 780, 435)
    ctx.restore()
  }

  private drawHealthBar(x: number, y: number, w: number, h: number, player: Player, label: string) {
    const ctx = this.ctx

    ctx.save()
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(x, y, w, h)

    const hpRatio = Math.max(0, player.hp / player.maxHp)
    let hpColor: string
    if (hpRatio > 0.5) {
      hpColor = player.playerNumber === 1 ? '#4488ff' : '#ff4444'
    } else if (hpRatio > 0.25) {
      hpColor = '#ffaa00'
    } else {
      hpColor = '#ff0000'
    }
    ctx.fillStyle = hpColor
    ctx.fillRect(x + 2, y + 2, (w - 4) * hpRatio, h - 4)

    ctx.strokeStyle = '#666'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, w, h)

    ctx.fillStyle = '#ffffff'
    ctx.font = '10px monospace'
    ctx.fillText(label, x + 4, y + h - 4)

    ctx.textAlign = 'right'
    ctx.fillText(`${Math.ceil(player.hp)}`, x + w - 4, y + h - 4)
    ctx.restore()
  }

  drawGameOver(winner: Player) {
    const ctx = this.ctx

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    ctx.save()
    const boxW = 360
    const boxH = 150
    const boxX = (CANVAS_W - boxW) / 2
    const boxY = (CANVAS_H - boxH) / 2

    ctx.fillStyle = '#111'
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 3
    ctx.fillRect(boxX, boxY, boxW, boxH)
    ctx.strokeRect(boxX, boxY, boxW, boxH)

    ctx.strokeStyle = '#555'
    ctx.lineWidth = 1
    ctx.strokeRect(boxX + 6, boxY + 6, boxW - 12, boxH - 12)

    ctx.fillStyle = winner.colorScheme.primary
    ctx.font = '22px monospace'
    ctx.textAlign = 'center'
    const winLabel = winner.playerNumber === 1 ? '蓝色机甲' : '红色机甲'
    ctx.fillText(`⚡ ${winLabel} 胜利! ⚡`, CANVAS_W / 2, boxY + 55)

    ctx.fillStyle = '#aaa'
    ctx.font = '12px monospace'
    ctx.fillText('按 空格键 或 点击按钮 重新开始', CANVAS_W / 2, boxY + 95)

    const btnW = 160
    const btnH = 32
    const btnX = (CANVAS_W - btnW) / 2
    const btnY2 = boxY + 108
    ctx.fillStyle = '#333'
    ctx.fillRect(btnX, btnY2, btnW, btnH)
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 2
    ctx.strokeRect(btnX, btnY2, btnW, btnH)
    ctx.fillStyle = '#fff'
    ctx.font = '11px monospace'
    ctx.fillText('[ 重新开始 ]', CANVAS_W / 2, btnY2 + 21)

    ctx.restore()
  }

  getRestartButtonBounds() {
    const boxW = 360
    const boxH = 150
    const boxX = (CANVAS_W - boxW) / 2
    const boxY = (CANVAS_H - boxH) / 2
    const btnW = 160
    const btnH = 32
    return {
      x: (CANVAS_W - btnW) / 2,
      y: boxY + 108,
      width: btnW,
      height: btnH,
    }
  }
}