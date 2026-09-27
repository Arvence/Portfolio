# Portfolio foundation

A static portfolio skeleton with a shared layout, responsive navigation, a homepage, project collection and detail pages, and an about page. Personal content is intentionally neutral, and three clearly labeled placeholder projects demonstrate the data flow.

## Stack

React, strict TypeScript, Vite, React Router, Tailwind CSS (Vite plugin), Lucide React, ESLint, and Prettier. Node.js 24 LTS and npm are required.

## Local development

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Commands

| Command                | Purpose                                                      |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Start the development server                                 |
| `npm run build`        | Type check, build into `dist/`, and generate `dist/404.html` |
| `npm run preview`      | Serve the production build locally                           |
| `npm run typecheck`    | Check application and Vite configuration types               |
| `npm run lint`         | Run ESLint with zero warnings allowed                        |
| `npm run format`       | Format source and configuration files                        |
| `npm run format:check` | Check formatting without changing files                      |

## Structure

```text
src/
  components/   Header, Footer, Navigation, Container, Section, and ProjectGrid
  layouts/      Shared page shell, main outlet, and route focus management
  pages/        Home, Projects, ProjectDetails, About, and NotFound
  data/         Typed project collection and derived featured projects
  types/        Project model
  App.tsx       Route definitions
  main.tsx      React entry point and BrowserRouter
  index.css     Tailwind import and neutral dark global styles
scripts/        Build-time GitHub Pages fallback generation
.github/workflows/deploy.yml
```

Add `src/assets/` or `src/lib/` when actual assets or shared utilities are needed.

## Routing and project data

`BrowserRouter` uses normal URLs: `/`, `/projects`, `/projects/:slug`, and `/about`. Unmatched paths render `NotFound` within the shared layout. Navigation uses `NavLink` with an active state. The layout includes a keyboard skip link and visible focus styles; route changes reset scrolling and move focus to the main content. Navigation remains visible on small screens and wraps when needed.

Replace the entries in `src/data/projects.ts`, using the `Project` interface in `src/types/project.ts`. Give each project a unique, URL-friendly slug. Set `featured: true` to show it on the homepage, and remove `placeholder: true` when real content is ready. The homepage and collection use the same project cards; detail pages resolve the same data by slug. An empty collection and unknown slugs both have helpful fallback states.

Each project supports a name, summary, overview, technology list, and optional repository and demo URLs. Only supplied URLs render as links; use full trusted `https://` URLs. Placeholder entries have no invented technologies or external links. Personal introduction, biography, skills, and contact placeholders live in `src/pages/Home.tsx` and `src/pages/About.tsx`.

## Production and GitHub Pages

```sh
npm run format:check
npm run lint
npm run build
npm run preview
```

The build copies `dist/index.html` to `dist/404.html`. GitHub Pages serves that fallback for direct requests to nested routes, allowing React Router to render the original URL. Root-relative assets (`base: '/'` in `vite.config.ts`) also load from nested paths. GitHub Pages still returns an HTTP 404 status for fallback requests; this restores the browser experience but does not provide server-side rewrites or successful HTTP statuses for crawlers. Vite preview uses its own SPA fallback and does not emulate this status behavior.

For the intended root-domain deployment:

1. Push this project to the `main` branch of `Arvence/Arvence.github.io`.
2. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Push to `main` or run **Deploy to GitHub Pages** manually from Actions.

The workflow installs the lockfile with `npm ci`, checks formatting and linting, runs the type-checked build (including the fallback), uploads `dist`, and deploys with the `github-pages` environment and required Pages/OIDC permissions. Deployment must complete successfully before the public site is available. Generated output and dependencies are ignored by Git.

This configuration targets `https://arvence.github.io/`. A repository site under a subpath would require coordinated changes to Vite's `base` and `BrowserRouter`'s `basename`.
