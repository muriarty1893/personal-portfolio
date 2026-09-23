import { useDeferredValue, useEffect, useState } from 'react';
import { HyperText } from '../components/ui/HyperText';
import EvilEyeButton from './EvilEyeButton';
import { posts } from './posts';
import './blog.css';

const featuredPost = posts[0];

function getSearchText(post) {
  const content = post.content?.map((block) => block.text).join(' ') || post.body.join(' ');
  return [post.title, post.category, post.excerpt, post.tags.join(' '), content]
    .join(' ')
    .toLowerCase();
}

function getWordCount(post) {
  const content = post.content?.map((block) => block.text).join(' ') || post.body.join(' ');
  const text = [post.excerpt, content].join(' ').trim();
  return text ? text.split(/\s+/).length : 0;
}

function getReadingMeta(post) {
  const words = getWordCount(post);
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read · ${words} words`;
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" fill="none">
      <path
        d="M1.81213 19.1203L19.4395 1.43779M5.76584 1.24781L19.6484 1.2279L19.6922 15.1104"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
            Murat Eker
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
  const [input, setInput] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const query = useDeferredValue(input.trim().toLowerCase());
  const visiblePosts = query ? posts.filter((post) => getSearchText(post).includes(query)) : posts;

  useEffect(() => {
    const nextUrl = input.trim() ? `blog.html?q=${encodeURIComponent(input.trim())}` : 'blog.html';
    window.history.replaceState(null, '', nextUrl);
  }, [input]);

  useEffect(() => {
    const focusSearch = (event) => {
      if (event.key !== '/' || ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      event.preventDefault();
      document.querySelector('.notes-search-input')?.focus();
    };
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  return (
    <NotesChrome>
      <main className="notes-index notes-sheet" aria-label="All notes">
        <div className="notes-search-wrap">
          <label className="sr-only" htmlFor="notes-search">Search notes</label>
          <input
            id="notes-search"
            className="notes-search-input"
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Search notes / press /"
            autoComplete="off"
          />
          {input ? (
            <button className="notes-search-clear" type="button" onClick={() => setInput('')}>
              Clear
            </button>
          ) : null}
        </div>
        <p className="notes-search-status" aria-live="polite">
          {query ? `${visiblePosts.length} ${visiblePosts.length === 1 ? 'note' : 'notes'} found` : `${posts.length} notes`}
        </p>
        {visiblePosts.length ? (
          <ol className="note-index-list">
            {visiblePosts.map((post) => {
            const [head, tail] = splitTitle(post.title);
            return (
              <li key={post.id} className="note-index-item">
                <a
                  className="note-index-entry"
                  href={post.id === featuredPost.id ? 'blog-post.html' : `blog-post.html?post=${post.id}`}
                >
                  <div className="note-index-copy">
                    <h1 className="note-index-heading">
                      {head} {tail ? <em>{tail}</em> : null}
                    </h1>
                    <time dateTime={post.date}>{post.dateLabel}</time>
                  </div>
                  <span className="note-index-arrow" aria-hidden="true">
                    <ArrowIcon />
                  </span>
                </a>
              </li>
            );
            })}
          </ol>
        ) : (
          <p className="notes-empty">No notes match "{input}".</p>
        )}
      </main>
    </NotesChrome>
  );
}

function TitleArt({ lines }) {
  return (
    <div className="article-title-art" aria-hidden="true">
      {lines.map((line) => (
        <HyperText key={line} text={line} boxedCharacters="Ø03#" />
      ))}
    </div>
  );
}

function renderInlineText(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function ArticleContent({ post }) {
  if (post.content) {
    return post.content.map((block, index) => {
      if (block.type === 'heading') {
        return <h2 key={`${block.type}-${index}`}>{renderInlineText(block.text)}</h2>;
      }

      if (block.type === 'quote') {
        return <blockquote key={`${block.type}-${index}`}>{renderInlineText(block.text)}</blockquote>;
      }

      return <p key={`${block.type}-${index}`}>{renderInlineText(block.text)}</p>;
    });
  }

  return [
    <p key="excerpt">{post.excerpt}</p>,
    ...post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>),
  ];
}

function ArticleBody({ post }) {
  return (
    <article className="note-article notes-sheet">
      <TitleArt lines={post.art || [post.title.toUpperCase()]} />

      <div className="article-copy">
        <ArticleContent post={post} />

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
            {post.dateLabel} / {getReadingMeta(post)}
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
