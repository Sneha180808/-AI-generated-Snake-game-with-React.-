import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GRID_SIZE, GAME_SPEED, INITIAL_SNAKE } from '../constants';
import { Point, Direction } from '../types';
import { GlitchText } from './GlitchText';
import { motion } from 'motion/react';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(Direction.UP);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowDown':
          if (direction !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          if (direction !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          if (direction !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
        case ' ':
          if (gameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case Direction.UP: newHead.y -= 1; break;
          case Direction.DOWN: newHead.y += 1; break;
          case Direction.LEFT: newHead.x -= 1; break;
          case Direction.RIGHT: newHead.x += 1; break;
        }

        // Check collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 100);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (very subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff007a';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff007a';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00ff9d';
      if (index === 0) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffffff';
      } else {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff9d';
      }
      
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      ctx.shadowBlur = 0;
    });

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [snake, food, gameOver]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] px-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-dim uppercase tracking-widest">Score</span>
          <GlitchText text={score.toString().padStart(6, '0')} className="text-2xl font-bold text-accent" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-text-dim uppercase tracking-widest">Status</span>
          <span className={`text-sm font-bold ${gameOver ? 'text-accent-alt' : isPaused ? 'text-yellow-500' : 'text-accent'}`}>
            {gameOver ? 'CRITICAL_FAILURE' : isPaused ? 'SYSTEM_PAUSED' : 'CORE_ACTIVE'}
          </span>
        </div>
      </div>

      <div className="relative p-1 sleek-border bg-black">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400}
          className="block cursor-none"
        />
        
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <GlitchText text="GAME_OVER" className="text-4xl font-black text-accent-alt mb-4" />
            <button 
              onClick={resetGame}
              className="px-6 py-2 border border-accent-alt text-accent-alt hover:bg-accent-alt hover:text-black transition-all uppercase tracking-widest text-sm"
            >
              Restart_System
            </button>
          </motion.div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <button 
              onClick={() => setIsPaused(false)}
              className="px-8 py-3 sleek-border text-accent hover:bg-accent hover:text-black transition-all uppercase tracking-[0.3em] font-bold"
            >
              Initialize
            </button>
            <p className="mt-4 text-[10px] text-text-dim animate-pulse uppercase">Press Space to Start</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-[400px] text-[10px] text-text-dim uppercase tracking-tighter">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between border-b border-border pb-1">
            <span>Grid_Resolution</span>
            <span>20x20</span>
          </div>
          <div className="flex justify-between border-b border-border pb-1">
            <span>Refresh_Rate</span>
            <span>100ms</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between border-b border-border pb-1">
            <span>Input_Device</span>
            <span>Keyboard_HID</span>
          </div>
          <div className="flex justify-between border-b border-border pb-1">
            <span>Buffer_State</span>
            <span>Stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
