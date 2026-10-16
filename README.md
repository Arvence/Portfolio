# Portfolio foundation

A minimal software engineering portfolio with a shared layout, responsive navigation, a homepage, a project index, and dedicated project pages for WoWiki, TaskForge, and Flagbit. The project pages provide introductory metadata and empty content regions for detailed case studies. A resume page provides an empty content region for future resume content.

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
  layouts/      App shell, project detail shell, and route focus management
  pages/        Home, Projects, ProjectDetails, Resume, About, and NotFound
    projects/   Dedicated WoWiki, TaskForge, and Flagbit pages
  data/         Typed project collection and derived featured projects
  types/        Project model
  App.tsx       Route definitions
  main.tsx      React entry point and BrowserRouter
  index.css     Tailwind import and dark global styles
scripts/        Build-time GitHub Pages fallback generation
.github/workflows/deploy.yml
```

Add `src/assets/` or `src/lib/` when actual assets or shared utilities are needed.

## Routing and project data

`BrowserRouter` uses normal URLs: `/`, `/projects`, `/projects/wowiki`, `/projects/taskforge`, `/projects/flagbit`, and `/resume`. The existing `/about` route remains accessible directly. Additional project slugs resolve through `/projects/:slug`, with a project-specific fallback for unknown slugs. Other unmatched paths render `NotFound` within the shared layout. Navigation uses `NavLink` with an active state and compact icon-over-label links beneath the monogram in a borderless desktop sidebar. The layout includes a keyboard skip link and visible focus styles; route changes reset scrolling and move focus to the main content. Navigation remains visible on small screens and wraps when needed.

Project listing metadata is centralized in `src/data/projects.ts`, using the `Project` interface in `src/types/project.ts`. The homepage and project collection use the same project cards; `featured: true` controls homepage inclusion. The dedicated pages in `src/pages/projects/` define their own introductory content and use `ProjectLayout` with an empty content region for future case studies. Keep their names, categories, and summaries consistent with the listing data. Entries without a dedicated route use `ProjectDetails`, which renders their metadata and description from the data collection.

The project detail shell supports optional category metadata, summaries, technology tags, repository URLs, and live URLs. Only supplied URLs render as links; use full trusted `https://` URLs. Add case-study content as children of `ProjectLayout` and resume content in `src/pages/Resume.tsx` without changing the shared page structure.

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
