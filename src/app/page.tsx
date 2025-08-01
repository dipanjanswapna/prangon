import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://scontent.fdac138-1.fna.fbcdn.net/v/t39.30808-6/489643954_1207618031366053_6391368232504397889_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=bybr_YZJzsUQ7kNvwFkUVAN&_nc_oc=AdknBg_ukuAGHBLRTJ3Z23JbDfxZOAVYo6-Kh_2pziZc2q3gqRlUagLlkiogSv0V5dU&_nc_zt=23&_nc_ht=scontent.fdac138-1.fna&_nc_gid=Ep4pWuNIWrzdeH-MHntHnw&oh=00_AfR85qb8KAeVlYCXXzNw4eT8e7SX-_Hejf8RFCRoD84ZFA&oe=6892201F"
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
