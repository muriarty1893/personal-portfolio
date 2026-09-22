export const posts = [
  {
    id: 'search-is-a-systems-problem',
    category: 'Search',
    date: '2026-09-18',
    dateLabel: '18 Sep 2026',
    title: 'Search is a systems problem, not a text box',
    art: ['S3ARCH IS', 'A SYST3M'],
    excerpt:
      'The search box is the visible part. The difficult part is everything that decides what a result means.',
    tags: ['Elasticsearch', 'Architecture'],
    body: [
      'I used to think of search as a feature that sat near the end of a product. A user types a phrase, a database returns rows, and the interface shows them. Working with Elasticsearch changed that picture for me. Search is a system with its own data model, failure modes, performance profile, and maintenance work.',
      'A result is only useful when the indexed document represents the thing a user is actually looking for. That means thinking about fields, mappings, stale data, ranking, empty states, and the difference between a technically valid match and a helpful one.',
      'The most important part of search is not the input box. It is the set of decisions behind it. Once those decisions are visible, the implementation becomes easier to discuss and easier to improve.'
    ],
    featured: true
  },
  {
    id: 'moving-product-search-to-elasticsearch',
    category: 'Search',
    date: '2026-09-12',
    dateLabel: '12 Sep 2026',
    title: 'What I learned migrating product search from SQL',
    art: ['SQL TO', 'S3ARCH'],
    excerpt:
      'A migration is not just replacing one query with another. It changes how the product thinks about searchable data.',
    tags: ['Elasticsearch', 'Migration', 'SQL'],
    body: [
      'During my software development internship, I worked on moving a product search system from SQL to Elasticsearch. The task sounded straightforward when described as a technology change, but the real work was understanding what the existing search was expected to do and where it became slow or difficult to extend.',
      'The migration made me separate the source of truth from the search representation. The database still had its job. The index had a different job: making the fields useful for retrieval, filtering, and ranking. That distinction helped me think more clearly about synchronization and index management.',
      'I came away with a practical lesson: changing a search engine is also changing a product boundary. The migration is successful only when the new system makes the user experience and the operational work better, not simply when the new technology is running.'
    ]
  },
  {
    id: 'kibana-as-a-search-feedback-loop',
    category: 'Search',
    date: '2026-09-06',
    dateLabel: '06 Sep 2026',
    title: 'Kibana made the index easier to question',
    art: ['LOOK AT', 'THE INDEX'],
    excerpt:
      'Visualizing indexed data helped me notice the difference between what I intended to store and what the system actually knew.',
    tags: ['Kibana', 'Elasticsearch', 'Debugging'],
    body: [
      'I used Kibana while working with Elasticsearch indexes, and its value was not limited to making dashboards. It gave me a way to inspect the data that search was built on. That matters because assumptions about mappings and documents are easy to keep in your head until a real query exposes them.',
      'Looking at the index made questions more concrete. Which fields are populated? Are values consistent? Is the document shape useful for the queries the product needs? Is a slow result caused by the query, or by the way the data was prepared?',
      'I like tools that turn vague debugging into an observable conversation. Kibana did that for search work. It made the index less like an invisible implementation detail and more like something I could inspect, challenge, and improve.'
    ]
  },
  {
    id: 'python-at-the-system-boundary',
    category: 'Backend',
    date: '2026-08-30',
    dateLabel: '30 Aug 2026',
    title: 'Python became useful at the boundary',
    art: ['PYTHON', 'AT THE EDGE'],
    excerpt:
      'The language became more valuable to me when it connected a prototype to a real system instead of staying inside a notebook.',
    tags: ['Python', 'Backend', 'Integration'],
    body: [
      'Python is the language I have used most often across my projects. I first appreciated how quickly it lets me test an idea, but my understanding changed when I used it around real boundaries: a backend, a search index, a data pipeline, or another application that needed to consume the result.',
      'At Teknology House Yazilim ve Bilisim, I prototyped with Python while integrating with C# .NET. That experience made the boundary visible. The useful question was not whether Python was comfortable to write. It was whether the contract between systems was clear enough for both sides to rely on.',
      'I now think of Python as both a building tool and a connecting tool. Its speed is helpful at the beginning, but its real value depends on whether the surrounding interface, errors, and data expectations are made explicit.'
    ]
  },
  {
    id: 'building-rottector-end-to-end',
    category: 'Machine Learning',
    date: '2026-08-23',
    dateLabel: '23 Aug 2026',
    title: 'Rottector taught me to finish the whole path',
    art: ['ROTTECTOR', 'END TO END'],
    excerpt:
      'A model is only one part of a useful application. Rottector pushed me to connect detection, backend behavior, and a web interface.',
    tags: ['Python', 'YOLOv8', 'FastAPI'],
    body: [
      'Rottector is an AI-powered fruit detection project that classifies fruit as fresh or rotten using a hybrid of two models. What I value most about the project is not only the model work. It forced me to think about the complete path from an input image to a result someone can actually use.',
      'That path includes the backend, the model interface, the response shape, and the web layer. Each part can work in isolation and the product can still feel broken if the handoff between them is unclear.',
      'The project reinforced a habit I want to keep: finish enough of the surrounding system to experience the result as a user. End-to-end work exposes problems that are easy to miss when attention stays focused on one technical component.'
    ]
  },
  {
    id: 'fastapi-keeps-the-model-honest',
    category: 'Machine Learning',
    date: '2026-08-16',
    dateLabel: '16 Aug 2026',
    title: 'FastAPI made the model answer to the application',
    art: ['MODEL IN', 'THE LOOP'],
    excerpt:
      'Putting a model behind an API changes the questions you ask about inputs, errors, and what happens after prediction.',
    tags: ['FastAPI', 'Python', 'APIs'],
    body: [
      'I used FastAPI in Rottector because the project needed more than a prediction script. Once a model sits behind an endpoint, the application has to define how an input arrives, how invalid input is reported, and how a prediction is returned to the interface.',
      'That made the model feel less like an isolated experiment. It became one component in a workflow. The API boundary also gave me a place to think about naming, response structure, and the difference between a model confidence and a product decision.',
      'I enjoy this stage because it makes machine learning more honest. A good prediction in a notebook is useful, but a dependable service has to communicate with the rest of the application clearly.'
    ]
  },
  {
    id: 'rag-with-memory-and-feedback',
    category: 'AI Systems',
    date: '2026-08-09',
    dateLabel: '09 Aug 2026',
    title: 'RAG became interesting when I added memory',
    art: ['RAG WITH', 'MEMORY'],
    excerpt:
      'My second RAG tutorial moved beyond retrieval and made me think about conversation, multilingual input, and feedback as one system.',
    tags: ['RAG', 'LangChain', 'ChromaDB', 'Llama'],
    body: [
      'RAG Tutorial v2 gave me a way to explore a more complete retrieval-augmented system. The project includes conversational memory, PDF processing, multilingual support, and interactive feedback. Those features made the project feel less like a demo that answers one question and more like a system that has to maintain context.',
      'Memory changes the shape of a question. Retrieval is no longer only about finding a relevant document; it is also about understanding what the current question refers to and which earlier information should remain available.',
      'The feedback part matters for the same reason. An answer is not automatically useful because it is fluent. I want systems that give me a way to notice when retrieval or response quality is falling short and use that information to improve the next version.'
    ]
  },
  {
    id: 'lavida-and-small-tools',
    category: 'Tools',
    date: '2026-08-02',
    dateLabel: '02 Aug 2026',
    title: 'Lavida is a reminder that small tools can be personal',
    art: ['SMALL', 'TOOLS'],
    excerpt:
      'A lightweight desktop widget for saved videos became an exercise in removing friction from a routine I already had.',
    tags: ['Python', 'PyQt6', 'SQLite'],
    body: [
      'Lavida is a small always-on-top desktop widget for managing saved video links. It fetches titles, stores the links, and supports global keyboard shortcuts. There is nothing grand about the idea, and that is exactly why I liked building it.',
      'The project started from a personal workflow rather than a large product brief. That changed how I evaluated features. A shortcut was valuable because it reduced a repeated action. A title fetch was useful because it made a saved link recognizable later.',
      'Small tools teach a different kind of product thinking. The goal is not to impress every user. It is to remove one small piece of friction so reliably that the tool becomes part of your normal work.'
    ]
  },
  {
    id: 'what-a-scraper-needs-after-the-first-request',
    category: 'Tools',
    date: '2026-07-26',
    dateLabel: '26 Jul 2026',
    title: 'A scraper needs a life after the first request',
    art: ['SCRAPE', 'THEN OBSERVE'],
    excerpt:
      'dataPull made me care about modularity, performance tracking, and structured output instead of treating scraping as a one-off script.',
    tags: ['Python', 'BeautifulSoup4', 'Pandas'],
    body: [
      'dataPull is a modular, CLI-based scraping tool with performance tracking and structured CSV export. The useful shift for me was thinking about what happens after the first successful request. A script can fetch a page once and still be difficult to run, measure, or adapt.',
      'A modular design gives different sites or extraction steps clearer boundaries. Performance tracking makes the cost visible. Structured output means the result can move into another part of a workflow instead of ending as an unexamined pile of text.',
      'I see scraping as a small example of backend engineering. The request is only the beginning. Reliability comes from understanding inputs, outputs, failure, and the person who has to run the tool again later.'
    ]
  },
  {
    id: 'justzipit-and-boring-utilities',
    category: 'Tools',
    date: '2026-07-19',
    dateLabel: '19 Jul 2026',
    title: 'The best utility is allowed to be boring',
    art: ['BORING', 'IS USEFUL'],
    excerpt:
      'JustZipIt is a simple compression utility, and that simplicity made the interface and failure cases more important than the feature list.',
    tags: ['Python', 'GUI', 'Utilities'],
    body: [
      'JustZipIt is a file compression utility with a user-facing interface for archiving and extraction. It is a modest project, but modest projects are good places to practice finishing details because the core feature is easy to understand.',
      'A utility like this should make the normal path obvious. It should also communicate when a file cannot be opened, when an output already exists, or when an operation has finished. The absence of complexity does not remove the need for care.',
      'I like building tools that do one ordinary job cleanly. They are a reminder that software quality is often felt in the small moments where nothing surprising happens.'
    ]
  },
  {
    id: 'linux-as-a-daily-workbench',
    category: 'Open Source',
    date: '2026-07-12',
    dateLabel: '12 Jul 2026',
    title: 'Linux is part of how I learn',
    art: ['LINUX', 'AS A DESK'],
    excerpt:
      'For me Linux is not a badge. It is the environment where I test ideas, inspect systems, and keep learning by building.',
    tags: ['Linux', 'Open Source', 'Workflow'],
    body: [
      'Linux has become part of my daily way of working. I try different distributions, explore open-source tools, and use the operating system as a place to understand what is happening underneath an application.',
      'That habit has practical value. It makes me more comfortable reading logs, checking processes, learning command-line tools, and treating the environment as something I can inspect instead of something that should remain invisible.',
      'I do not want a setup that only looks customized. I want a workbench that helps me investigate quickly and gives me a place to learn the boring operational details that make backend work dependable.'
    ]
  },
  {
    id: 'learning-go-and-testing-together',
    category: 'Learning',
    date: '2026-07-05',
    dateLabel: '05 Jul 2026',
    title: 'I am learning Go and testing at the same time',
    art: ['LEARN GO', 'TEST MORE'],
    excerpt:
      'Learning a new language is also a chance to change how I design small pieces of software and how I decide they are reliable.',
    tags: ['Go', 'Testing', 'Learning'],
    body: [
      'I am currently learning Go and learning how to write tests with it. I like that these two topics arrived together. A new language already forces me to slow down and understand the shape of a small program; tests force me to explain what that program should do.',
      'That combination is useful because I do not want to copy patterns without understanding them. I want to practice making boundaries clear, keeping functions understandable, and checking behavior with examples instead of relying on a successful manual run.',
      'I am still early in the process, so the goal is not to present a finished Go philosophy. The goal is to keep a visible learning loop: build something small, test it, notice what I misunderstood, and try again.'
    ]
  },
  {
    id: 'working-with-physical-systems',
    category: 'Experience',
    date: '2026-06-28',
    dateLabel: '28 Jun 2026',
    title: 'The server room made software feel physical again',
    art: ['SOFTWARE', 'HAS WEIGHT'],
    excerpt:
      'My Information Technologies internship included equipment, Ethernet cables, and access points, not only screens and source code.',
    tags: ['Internship', 'Servers', 'Networks'],
    body: [
      'During my internship at the university Information Technologies Vocational School, I supported server-side and network setup tasks. I helped with department equipment, created Ethernet Cat 5 cables, and deployed access points to improve wireless coverage.',
      'Those tasks gave me a different kind of feedback from software development. A cable either works or it does not. An access point changes the experience of a real space. Equipment makes the relationship between a system and its environment difficult to ignore.',
      'I want to keep that perspective when I work on applications. Server-side code is not floating in isolation. It runs on infrastructure, depends on networks, and eventually has to make someone else\'s work easier.'
    ]
  },
  {
    id: 'graduating-with-a-working-notebook',
    category: 'Career',
    date: '2026-06-14',
    dateLabel: '14 Jun 2026',
    title: 'I graduated with a working notebook, not a finished identity',
    art: ['NEW GRAD', 'STILL BUILDING'],
    excerpt:
      'Finishing Computer Science at ATU gave me a foundation, but the projects around it show where I want to keep going.',
    tags: ['Career', 'Computer Engineering', 'Learning'],
    body: [
      'I finished my Computer Science degree at Adana Alparslan Turkes Science and Technology University in February 2026. Graduation is a clear date, but it did not make my direction feel complete. It gave me a foundation and a better view of the questions I want to keep working on.',
      'My projects move between search, backend systems, machine learning, small desktop tools, and data workflows. They are not all the same kind of application, but they share a curiosity about how an idea becomes a reliable workflow for someone else.',
      'I am treating this stage as a working notebook. I want to keep building, write down what I learn, and become more precise about the kind of engineer I am becoming instead of forcing a final label too early.'
    ]
  },
  {
    id: 'clean-architecture-is-a-practice',
    category: 'Architecture',
    date: '2026-05-31',
    dateLabel: '31 May 2026',
    title: 'Clean architecture is a practice, not a diagram',
    art: ['BOUNDARIES', 'BEFORE BOXES'],
    excerpt:
      'My interest in clean architecture comes from trying to keep projects understandable as their parts begin to connect.',
    tags: ['Architecture', 'Backend', 'Design'],
    body: [
      'I am interested in clean architecture because my projects keep crossing boundaries: a model and an API, a database and a search index, a scraper and a CSV file, a desktop interface and a local store. The diagram is useful, but the real test is whether each part has a responsibility that can be explained.',
      'When a boundary is unclear, changes spread. A small adjustment to a response format can affect a UI, a model wrapper, and a test that was quietly depending on an implementation detail. Naming the responsibility early makes those relationships less surprising.',
      'I do not see architecture as a way to predict every future change. I see it as a way to keep the next change understandable. That is a more practical standard for the small systems I am building now.'
    ]
  },
];

export const categories = ['All', ...new Set(posts.map((post) => post.category))];
