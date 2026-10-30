# Portfolio

A software engineering portfolio with a dark shared layout, responsive navigation, and dedicated routes for WoWiki, TaskForge, and Flagbit. The homepage includes a startup loader, full-height hero and About sections, four scrolling technology lanes, a visual project showcase, and a shared footer. Project detail pages provide introductory metadata and empty content regions for case studies; the resume content region is also intentionally empty.

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
  components/   Shared layout, startup loader, homepage sections, and project cards
  layouts/      App shell, project detail shell, and route focus management
  pages/        Home, Projects, ProjectDetails, Resume, About, and NotFound
    projects/   Dedicated WoWiki, TaskForge, and Flagbit pages
  data/         Typed project collection, featured projects, and technology lanes
  types/        Project model
  App.tsx       Route definitions
  main.tsx      React entry point and BrowserRouter
  index.css     Tailwind import and dark global styles
scripts/        Build-time GitHub Pages fallback generation
.github/workflows/deploy.yml
```

Add `src/assets/` or `src/lib/` when actual assets or shared utilities are needed.

## Homepage behavior

The initial document load displays the monogram loader for at least two seconds. It releases keyboard access and scrolling when startup completes, with a retry message if startup fails. Internal navigation does not restart the loader.

The hero rotates through developer roles with a typing/deleting effect. Hero and About sections have a minimum height of one small viewport and grow with their content. Four CSS marquee lanes follow About, then the featured projects appear in two columns from the tablet breakpoint upward and one column on phones. Cards use decorative project artwork until a real cover is supplied. The shared footer contains the brand, GitHub link, and Home / Projects / Resume navigation.

Reduced-motion preferences disable typing, marquee movement, and the loader fade; technology lanes become wrapping lists without duplicate content. The homepage uses a wider container without changing the spacing of other routes. There is no scroll snapping.

## Routing and project data

`BrowserRouter` uses normal URLs: `/`, `/projects`, `/projects/wowiki`, `/projects/taskforge`, `/projects/flagbit`, and `/resume`. The existing `/about` route remains accessible directly. Additional project slugs resolve through `/projects/:slug`, with a project-specific fallback for unknown slugs. Other unmatched paths render `NotFound` within the shared layout. Navigation uses `NavLink` with an active state and compact icon-over-label links beside the monogram in a borderless top header. The header stays at the top while scrolling and gains a translucent dark background; scroll padding follows its height to keep navigation targets visible. The layout includes a keyboard skip link and visible focus styles; route changes reset scrolling and move focus to the main content. Navigation remains visible on small screens and wraps when needed.

Project listing metadata is centralized in `src/data/projects.ts`, using the `Project` interface in `src/types/project.ts`. The homepage and project collection use the same project cards; `featured: true` controls homepage inclusion. The dedicated pages in `src/pages/projects/` define their own introductory content and use `ProjectLayout` with an empty content region for future case studies. Keep their names, categories, and summaries consistent with the listing data. Entries without a dedicated route use `ProjectDetails`, which renders their metadata and description from the data collection.

An optional `coverImage` supplies `src` and descriptive `alt` text. Import local images from `src/assets/` so Vite emits URLs appropriate to its configured base. A missing or failed cover falls back to the decorative project artwork; no screenshots are implied by that artwork.

The project detail shell supports optional category metadata, summaries, technology tags, repository URLs, and live URLs. Only supplied URLs render as links; use full trusted `https://` URLs. Add case-study content as children of `ProjectLayout` and resume content in `src/pages/Resume.tsx` without changing the shared page structure.

## Production and GitHub Pages

```sh
npm ci
npm run typecheck
npm run format:check
npm run lint
npm run build
npm run preview
```

The build copies `dist/index.html` to `dist/404.html`. GitHub Pages can serve that fallback for direct requests to nested routes, allowing React Router to render the original URL when the asset base and router basename match the deployment. Pages still returns HTTP 404 for these fallback requests; rendering the route does not provide server-side rewrites or HTTP 200 responses for crawlers. Vite preview uses its own SPA fallback and does not emulate this status behavior.

### Hosting target must be confirmed

This checkout belongs to [`Arvence/Portfolio`](https://github.com/Arvence/Portfolio). During the October 28, 2026 audit, GitHub reported `has_pages: false`, no Actions runs, and no deployments. The Pages endpoint and both `https://arvence.github.io/Portfolio/` and `https://arvence.github.io/` returned HTTP 404. There is no confirmed hosting URL. The existing root configuration is retained until the intended target is established; it is not evidence of a live root-domain deployment.

Use the configuration matching the URL shown in this repository's **Settings → Pages**:

| Confirmed hosting URL                                                            | `vite.config.ts`                 | `src/main.tsx`                                                           |
| -------------------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| Project site at `https://arvence.github.io/Portfolio/`                           | Change `base` to `'/Portfolio/'` | Change the opening router tag to `<BrowserRouter basename="/Portfolio">` |
| A confirmed root site or custom domain serving this repository's artifact at `/` | Keep `base: '/'`                 | Keep `<BrowserRouter>` without a basename                                |

For a project site, make both changes together, rebuild, and open `/Portfolio/` in preview. Internal React Router paths remain `/projects`, `/resume`, and so on; the router supplies the prefix. Keep the capital `P` in `/Portfolio/`, and avoid hardcoded root-relative asset URLs such as `/assets/example.png`.

The next manual step is to confirm the intended URL and Pages source in **Arvence/Portfolio**, then apply the matching configuration before enabling or triggering deployment. This repository's workflow deploys its own `dist`; it does not publish to a separate `Arvence.github.io` repository. No account settings or other repositories need to be changed as part of local validation.

The workflow installs the lockfile with `npm ci`, checks formatting and linting, runs the type-checked build (including the fallback), uploads `dist`, and deploys using the `github-pages` environment and Pages/OIDC permissions. Once Pages is configured to use GitHub Actions, a push to `main` or a manual workflow run triggers deployment. Generated output and dependencies are ignored by Git.

After an authorized deployment, check the site root, `/projects`, each dedicated project route, `/resume`, and an unknown path under the confirmed base. Refresh nested routes, verify that JavaScript and CSS load from the correct base, and distinguish a rendered fallback page from its HTTP 404 status. A successful local build does not establish that Pages is configured or that deployment succeeded.
