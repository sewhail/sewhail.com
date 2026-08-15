import Image from "next/image";

export function Portrait() {
  return (
    <div className="portrait-control">
      <Image
        src="/avatar-ink-plate.jpg"
        alt="Ink portrait of Suhail"
        width={480}
        height={560}
        className="avatar avatar-ink-plate"
        priority
      />
    </div>
  );
}
