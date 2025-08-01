import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Minh Pham"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
          data-ai-hint="man portrait"
        />
      </div>
      <div className="relative z-10 text-center text-background px-4">
        <p className="text-sm md:text-base tracking-[0.3em] mb-4">MINH PHAM</p>
        <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none tracking-tighter">
          Making <span className="text-primary">Good</span><br />
          Shit Since<br />
          2009
        </h1>
      </div>
    </div>
  );
}
