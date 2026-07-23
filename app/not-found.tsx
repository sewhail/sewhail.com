import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <Image
          src="/avatar-sketch.jpg"
          alt=""
          width={88}
          height={88}
          className="not-found-art"
          aria-hidden="true"
        />

        <div>
          <p className="not-found-code">404</p>
          <h1 className="not-found-title">nothing here.</h1>
          <Link className="not-found-link" href="/">
            go home <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
