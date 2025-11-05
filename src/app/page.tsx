import HeroButton from "~/app/hero-button";

export default async function HomePage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-[18px] sm:gap-6">
      <div className="text-center text-[clamp(40px,10vw,44px)] leading-[1.2] font-bold tracking-tighter sm:text-[64px]">
        <div className="bg-[linear-gradient(91deg,#FFF_32.88%,rgba(255,255,255,0.40)_99.12%)] bg-clip-text text-transparent">
          Practice with <br /> purpose
        </div>
      </div>
      <p className="text-default-500 text-center leading-7 font-normal sm:w-[466px] sm:text-[18px]">
        An all-in-one practice hub for managing repertoire and scores, and
        turning daily sessions into measurable progress.
      </p>
      <HeroButton />
    </section>
  );
}
