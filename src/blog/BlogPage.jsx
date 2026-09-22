import { useEffect, useState } from 'react';
import EvilEyeButton from './EvilEyeButton';
import { posts } from './posts';
import './blog.css';

const featuredPost = posts[0];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function splitTitle(title) {
  const commaIndex = title.indexOf(',');
  if (commaIndex !== -1) {
    return [title.slice(0, commaIndex + 1), title.slice(commaIndex + 1).trim()];
  }
  const words = title.split(' ');
  if (words.length < 3) return [words.join(' '), ''];
  return [words.slice(0, -2).join(' '), words.slice(-2).join(' ')];
}

function NotesChrome({ children, article = false }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.style.background = dark ? '#171614' : '#e8e7e3';
  }, [dark]);

  return (
    <div className={dark ? 'notes-site is-dark' : 'notes-site'}>
      <header className="notes-header">
        {article ? (
          <a className="notes-back" href="blog.html">
            <span aria-hidden="true">←</span> All <em>notes</em>
          </a>
        ) : (
          <a className="notes-logo" href="index.html" aria-label="Back to Murat Eker portfolio">
            Murat
          </a>
        )}
        <div className="notes-controls">
          <button
            type="button"
            className="notes-control"
            aria-label={dark ? 'Use light theme' : 'Use dark theme'}
            aria-pressed={dark}
            onClick={() => setDark((value) => !value)}
          >
            <SunIcon />
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}

function NotesIndex() {
  return (
    <NotesChrome>
      <main className="notes-index notes-sheet" aria-label="All notes">
        <ol className="note-index-list">
          {posts.map((post) => {
            const [head, tail] = splitTitle(post.title);
            return (
              <li key={post.id} className="note-index-item">
                <a
                  className="note-index-entry"
                  href={post.featured ? 'blog-post.html' : `blog-post.html?post=${post.id}`}
                >
                  <h1 className="note-index-heading">
                    {head} {tail ? <em>{tail}</em> : null}
                  </h1>
                  <time dateTime={post.date}>{post.dateLabel}</time>
                </a>
              </li>
            );
          })}
        </ol>
      </main>
    </NotesChrome>
  );
}

function TitleArt({ lines }) {
  const renderLine = (line, key) => (
    <span key={key}>
      {Array.from(line).map((char, index) => (
        <span
          key={`${key}-${index}`}
          className={/[Ø03#]/.test(char) ? 'boxed' : undefined}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  );

  return (
    <div className="article-title-art" aria-hidden="true">
      {lines.map((line, index) => renderLine(line, `l${index}`))}
    </div>
  );
}

function ArticleBody({ post }) {
  return (
    <article className="note-article notes-sheet">
      <TitleArt lines={post.art || [post.title.toUpperCase()]} />

      <div className="article-copy">
        <p>{post.excerpt}</p>
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        {post.featured ? (
          <>
            <h2>Work in progress</h2>
            <p>
              A small unfinished experiment lives beside this note: an eye inside a button that
              follows the pointer. It studies how to make a state change visible without adding
              another status label.
            </p>
            <section className="article-lab" aria-label="Cursor follow experiment">
              <div className="article-lab-meta">
                <span>WIP / 001</span>
                <span>cursor study</span>
              </div>
              <EvilEyeButton
                eyeColor="#FF6F37"
                intensity={1.65}
                pupilSize={0.62}
                irisWidth={0.22}
                glowIntensity={0.56}
                scale={1.15}
                noiseScale={1}
                pupilFollow={1.2}
                flameSpeed={0.8}
                backgroundColor="#050000"
              >
                I SEE YOU
              </EvilEyeButton>
            </section>
          </>
        ) : null}

        <div className="article-end">
          <a href="blog.html">← All notes</a>
          <span>
            {post.dateLabel} / {post.readTime}
          </span>
        </div>
      </div>
    </article>
  );
}

function NotesArticle({ post }) {
  useEffect(() => {
    document.title = `${post.title} - Murat Eker`;
  }, [post]);

  return (
    <NotesChrome article>
      <main>
        <h1 className="sr-only">{post.title}</h1>
        <ArticleBody post={post} />
      </main>
    </NotesChrome>
  );
}

function resolvePost() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('post');
  if (!id) return featuredPost;
  return posts.find((post) => post.id === id) || featuredPost;
}

function BlogPage() {
  const isArticle = window.location.pathname.endsWith('blog-post.html');
  if (isArticle) return <NotesArticle post={resolvePost()} />;
  return <NotesIndex />;
}

export default BlogPage;
