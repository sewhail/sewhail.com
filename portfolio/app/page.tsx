import Image from 'next/image';

export default function Page() {
  return (
    <main className="page">
      {/* Header */}
      <section className="header">
        <h1 className="name">suhail</h1>
        <div className="bio-row">
          <Image
            src="/avatar.jpg"
            alt="Suhail"
            width={64}
            height={64}
            className="avatar"
          />
          <div className="bio-text">
            <p>software engineer</p>
            <p className="muted">amsterdam, the netherlands</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section">
        <p className="tagline">software engineer // web development + machine learning.</p>

        <p>
          I&apos;m interested in open source, delightful user experiences, and the future of technology.
        </p>

        <p>
          When not writing code, I enjoy admiring bookshelves, capturing photographs, reading, and discovering more about what I don&apos;t know.
        </p>

        <p>
          Building meaningful digital experiences.
        </p>

        <p>
          Find me on{' '}
          <a href="https://github.com/sewhail" target="_blank" rel="noopener noreferrer">GitHub</a>,{' '}
          <a href="https://linkedin.com/in/sewhail" target="_blank" rel="noopener noreferrer">LinkedIn</a>, or{' '}
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">Twitter</a>.
        </p>
      </section>

      {/* Current */}
      <section className="section">
        <h2 className="section-heading">Now</h2>
        <ul className="garden-list">
          <li>exploring ml fundamentals</li>
          <li>mathematical concepts deep dive</li>
          <li>advancing python skills</li>
          <li>building practical projects</li>
        </ul>
      </section>

      {/* Stack */}
      <section className="section">
        <h2 className="section-heading">Stack</h2>
        <div className="stack-list">
          {['js', 'py', 'react', 'node', 'ts', 'psql', 'docker', 'aws'].map((skill) => (
            <span key={skill} className="stack-item">{skill}</span>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="section">
        <h2 className="section-heading">Contact</h2>
        <p>
          Open to opportunities and collaborations.
          <br />
          Let&apos;s build something together.
        </p>
        <p>
          <a href="mailto:sxhail@outlook.in">sxhail@outlook.in</a>
        </p>
      </section>
    </main>
  );
}
