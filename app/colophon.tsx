import { AmsterdamWindow } from "./amsterdam-window";

export function Colophon() {
  return (
    <details className="colophon">
      <summary>colophon <span aria-hidden="true" /></summary>
      <div className="colophon-content">
        <div>
          <h2>About this little website</h2>
          <p>
            Set in Geist and Instrument Serif, with locally hosted fonts.
            Built with Next.js and TypeScript, and exported as a static site.
          </p>
          <p>
            A small reading desk, a little light, and room for the words.
            The window is an imagined scene, not live weather.
          </p>
        </div>
        <AmsterdamWindow />
      </div>
    </details>
  );
}
