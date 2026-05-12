import { useEffect, useRef } from 'react'
import { Game } from './game/game'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const game = new Game(canvasRef.current)
    game.start()
    return () => game.destroy()
  }, [])

  return (
    <div className="game-container">
      <h1 className="game-title">像素机甲对战</h1>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="game-canvas"
        />
      </div>
    </div>
  )
}