export const posts = [
  {
    id: 'search-is-a-systems-problem',
    category: 'Systems',
    date: '2026-09-18',
    dateLabel: '18 Sep 2026',
    readTime: '6 min read',
    title: 'Search is a systems problem, not a text box',
    art: ['S3ARCH IS', 'A SYST3M'],
    excerpt:
      'What changes when search becomes part of the architecture instead of a feature added at the end.',
    tags: ['Elasticsearch', 'Architecture'],
    body: [
      'A search box looks small in a product brief, but the moment people rely on it, it becomes a contract between data, ranking, latency, and the user interface.',
      'The useful work starts before the first query. Decide what a document means, which fields deserve weight, how stale data can be, and what the system should do when no result is a good result.',
      'Thinking about those questions as system boundaries makes the implementation calmer. Indexing, querying, and observing the search path become separate jobs with visible failure modes.'
    ],
    featured: true
  },
  {
    id: 'small-go-services',
    category: 'Backend',
    date: '2026-09-05',
    dateLabel: '05 Sep 2026',
    readTime: '5 min read',
    title: 'The case for small Go services',
    art: ['TH3 CAS3', 'SMALL GØ'],
    excerpt:
      'A practical checklist for deciding when a small service is clearer than another layer in a larger application.',
    tags: ['Go', 'APIs'],
    body: [
      'A service should earn its process boundary. If it does not own a clear responsibility, its own data, or a useful deployment rhythm, it may only be adding ceremony.',
      'When the boundary is real, Go makes the boring parts pleasant: a small binary, explicit dependencies, straightforward concurrency, and a standard library that keeps the surface area readable.',
      'The goal is not more services. The goal is fewer places where a future change has to be explained twice.'
    ]
  },
  {
    id: 'linux-as-a-workbench',
    category: 'Open source',
    date: '2026-08-22',
    dateLabel: '22 Aug 2026',
    readTime: '4 min read',
    title: 'Linux is a workbench, not a badge',
    art: ['LINUX IS', 'WØRKB3NCH'],
    excerpt:
      'The small habits that make an operating system feel like a dependable part of the development stack.',
    tags: ['Linux', 'Workflow'],
    body: [
      'The best Linux setup is not the one with the most customized screenshots. It is the one that makes routine work predictable and investigation cheap.',
      'That usually means knowing where logs live, keeping shell commands discoverable, scripting the repeated setup, and treating the filesystem as a useful interface rather than a mystery.',
      'A good workbench disappears while you are using it. It gives you back attention for the problem in front of you.'
    ]
  },
  {
    id: 'measure-before-optimizing',
    category: 'Backend',
    date: '2026-08-09',
    dateLabel: '09 Aug 2026',
    readTime: '7 min read',
    title: 'Measure before optimizing the request path',
    art: ['M3ASUR3', 'TH3 PATH'],
    excerpt:
      'A lightweight way to find the slow part of a web request before reaching for a new abstraction.',
    tags: ['Performance', 'Python'],
    body: [
      'Performance work is easier when the request path is visible. Start with timings around the boundaries: network calls, database queries, serialization, and expensive application work.',
      'The first useful result is often not a fix. It is a narrower question. Once one segment is responsible for most of the time, the tradeoff becomes concrete enough to discuss.',
      'Optimizing from a trace also protects the codebase from speculative complexity. Keep the change that moves the measurement, not the change that merely looks fast.'
    ]
  },
  {
    id: 'learning-in-public',
    category: 'Notes',
    date: '2026-07-27',
    dateLabel: '27 Jul 2026',
    readTime: '3 min read',
    title: 'Learning in public without turning work into content',
    art: ['L3ARNING', 'IN PUBLIC'],
    excerpt:
      'A note on documenting the decisions, dead ends, and small discoveries that usually disappear after shipping.',
    tags: ['Learning', 'Writing'],
    body: [
      'Writing is most useful when it follows the work instead of competing with it. A short note about a decision or a failed approach can be more valuable than a polished summary.',
      'The constraint is simple: write for the next version of yourself first. Keep the examples concrete, name the uncertainty, and leave out the performance of certainty.',
      'Over time, those notes become a map of how your engineering judgment is changing.'
    ]
  }
];

export const categories = ['All', ...new Set(posts.map((post) => post.category))];
