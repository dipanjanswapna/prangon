
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car, ArrowLeft, RefreshCw, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const Game = () => {
  const [playerPos, setPlayerPos] = useState({ x: 130, y: 480 });
  const [opponents, setOpponents] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const movePlayer = (e: MouseEvent) => {
    if (!gameAreaRef.current || gameOver) return;
    const gameArea = gameAreaRef.current;
    let newX = e.clientX - gameArea.getBoundingClientRect().left - 25; // car width / 2
    if (newX < 0) newX = 0;
    if (newX > 250) newX = 250;
    setPlayerPos(prev => ({ ...prev, x: newX }));
  };
  
   const movePlayerTouch = (e: TouchEvent) => {
    if (!gameAreaRef.current || gameOver) return;
    const gameArea = gameAreaRef.current;
    let newX = e.touches[0].clientX - gameArea.getBoundingClientRect().left - 25;
    if (newX < 0) newX = 0;
    if (newX > 250) newX = 250;
    setPlayerPos(prev => ({ ...prev, x: newX }));
  };

  const resetGame = () => {
    setPlayerPos({ x: 130, y: 480 });
    setOpponents([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    gameLoop();
  };

  const gameLoop = () => {
    if (gameOver) {
        if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        return;
    }
    
    setOpponents(prevOpponents => {
      let newOpponents = prevOpponents
        .map(op => ({ ...op, y: op.y + 5 + Math.floor(score / 100) }))
        .filter(op => op.y < 600);

      if (Math.random() < 0.05 && (newOpponents.length === 0 || newOpponents[newOpponents.length - 1].y > 150)) {
        newOpponents.push({
          id: Date.now(),
          x: Math.random() * 250,
          y: -50,
        });
      }
      return newOpponents;
    });

    setScore(prev => prev + 1);

    animationFrameId.current = requestAnimationFrame(gameLoop);
  };
  
   useEffect(() => {
    opponents.forEach(op => {
      if (
        !gameOver &&
        playerPos.x < op.x + 50 &&
        playerPos.x + 50 > op.x &&
        playerPos.y < op.y + 50 &&
        playerPos.y + 50 > op.y
      ) {
        setGameOver(true);
        if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      }
    });
  }, [playerPos, opponents, gameOver]);


  useEffect(() => {
    if (gameStarted && !gameOver) {
      if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameStarted, gameOver]);
  
  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    
    gameArea.addEventListener('mousemove', movePlayer);
    gameArea.addEventListener('touchmove', movePlayerTouch);
    return () => {
      gameArea.removeEventListener('mousemove', movePlayer);
      gameArea.removeEventListener('touchmove', movePlayerTouch);
    };
  }, [gameAreaRef.current, gameOver]);


  return (
    <div className="flex flex-col items-center">
      <div 
        ref={gameAreaRef}
        className="relative w-[300px] h-[600px] bg-gray-700 overflow-hidden border-8 border-gray-900 rounded-xl shadow-2xl cursor-pointer"
        style={{
            backgroundImage: `linear-gradient(white 20%, transparent 20%),
                             linear-gradient(white 20%, transparent 20%)`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: '2px 40px',
            backgroundPosition: '100px 0, 200px 0',
            animation: gameStarted && !gameOver ? `road-animation 2s linear infinite` : 'none',
        }}
      >
        <AnimatePresence>
            {!gameStarted && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 text-center"
                >
                    <Gamepad2 className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-4">Racing Game</h3>
                    <p className="text-muted-foreground mb-6 px-4">Move your mouse or finger to avoid the other cars!</p>
                    <Button onClick={() => { setGameStarted(true); }}>Start Game</Button>
                </motion.div>
            )}
        </AnimatePresence>
        
        <AnimatePresence>
            {gameOver && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20"
                >
                    <h3 className="text-4xl font-bold text-red-500 mb-2">Game Over</h3>
                    <p className="text-xl text-white mb-4">Your Score: {score}</p>
                    <Button onClick={resetGame}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Play Again
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.div
            className="absolute z-10"
            style={{ width: 50, height: 50, left: playerPos.x, top: playerPos.y }}
            animate={{ left: playerPos.x }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
             <Car className="w-full h-full text-primary" fill="hsl(var(--primary))"/>
        </motion.div>

        {opponents.map((op) => (
          <motion.div
            key={op.id}
            className="absolute z-10"
            style={{ width: 50, height: 50, left: op.x, top: op.y, transform: 'rotate(180deg)' }}
            initial={{ y: -50 }}
            animate={{ y: op.y }}
            transition={{ type: 'linear' }}
          >
             <Car className="w-full h-full text-red-500" fill="hsl(var(--destructive))"/>
          </motion.div>
        ))}
      </div>
       <div className="mt-4 text-center p-4 rounded-lg bg-muted w-[300px]">
          <h4 className="text-xl font-bold text-primary-foreground">Score: {score}</h4>
      </div>
    </div>
  );
};

export default function NotFound() {
  return (
    <>
      <style jsx global>{`
        @keyframes road-animation {
          from { background-position-y: 0px; }
          to { background-position-y: 40px; }
        }
      `}</style>
      <div className="relative min-h-screen bg-background flex flex-col md:flex-row items-center justify-center text-center md:text-left p-4 gap-16">
        <Image
            src="https://cdna.artstation.com/p/assets/images/images/047/389/466/large/srabon-arafat-uploded-file.jpg?1647467605"
            alt="404 background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0 opacity-10"
            data-ai-hint="abstract background"
        />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto gap-16">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="md:w-1/2"
            >
                <h1 className="text-8xl md:text-9xl font-black text-primary font-headline tracking-tighter">404</h1>
                <p className="text-2xl md:text-3xl font-semibold text-primary-foreground mt-2">Page Not Found</p>
                <p className="text-muted-foreground mt-4 max-w-md md:mx-0 mx-auto">
                Oops! The page you are looking for does not exist. But you can play a game while you're here!
                </p>
                <Link href="/" passHref>
                <Button variant="outline" className="mt-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back Home
                </Button>
                </Link>
            </motion.div>

            <motion.div
                className="mt-12 md:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Game />
            </motion.div>
        </div>
      </div>
    </>
  );
}
