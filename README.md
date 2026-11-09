# Portfolio

A software engineering portfolio with a centered hero, featured projects, contact links, and a persistent animated space background. TaskForge and Flagbit have dedicated walkthrough routes with introductory metadata and empty content regions for future case studies.

## Stack

React, strict TypeScript, Vite, React Router, Tailwind CSS (Vite plugin), Lucide React, ESLint, and Prettier. Node.js 24 LTS and npm are required.

## Local development

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

## Commands

| Command                | Purpose                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`          | Start the development server                                                         |
| `npm run build`        | Type check, build into `dist/`, and generate static route entries and a 404 fallback |
| `npm run preview`      | Serve the production build locally                                                   |
| `npm run typecheck`    | Check application and Vite configuration types                                       |
| `npm run lint`         | Run ESLint with zero warnings allowed                                                |
| `npm run format`       | Format source and configuration files                                                |
| `npm run format:check` | Check formatting without changing files                                              |

## Structure

```text
src/
  components/   Shared layout, startup loader, homepage sections, and project cards
  layouts/      App shell, project detail shell, and route focus management
  pages/        Home, NotFound, and retained page components
    projects/   Project pages; TaskForge and Flagbit are currently routed
  data/         Typed project collection, featured projects, and technology lanes
  types/        Project model
  App.tsx       Route definitions
  main.tsx      React entry point and BrowserRouter
  index.css     Tailwind import and dark global styles
scripts/        Build-time static route and GitHub Pages fallback generation
.github/workflows/deploy.yml
```

Solar System texture assets live in `src/assets/solar-system/`. Their source, license, adaptations, and scientific references are listed in [image credits](public/solar-system-credits.txt), which is also linked from the footer and included in the built site.

## Homepage behavior

The persistent space background includes Earth in the foreground and its orbiting Moon. Reference texture maps load independently of startup. The shared animation clock drives rotation, parallax and a 180-second lunar orbit; reduced motion freezes the scene and hidden tabs pause it. Earth's detailed day, cloud and city-light shading runs on the GPU, with a smaller CPU fallback. Lunar shading uses cached geometry and a capped update rate. An unrendered solar light source determines both bodies' illumination and the Moon's phases. Moon size and orbital eccentricity follow the cited references; distance, time and exposure are adjusted for presentation as described in the image credits.

The monogram loader appears only if the initial application startup is still pending after 200 milliseconds. Fast visits show the portfolio immediately, with no minimum loading time. Startup requires the application script, the main stylesheet, and React's first page commit. Keyboard access and scrolling are then released immediately; an already-visible loader fades out over 180 milliseconds, or disappears immediately with reduced motion. Optional fonts and project images do not delay startup. A failed application script or stylesheet, or a startup exceeding ten seconds, shows a retry message; a late successful startup still releases the page. Internal navigation does not restart the loader.

The hero rotates through developer roles with a typing/deleting effect. Featured projects follow in one column on phones, two on tablets, and three on wide screens. Cards link to repositories and show image placeholders until a real cover is supplied. A contact section and compact shared footer complete the page.

Reduced-motion preferences disable typing, entrance animations, background motion, and the loader fade. The homepage uses a wider container without changing the spacing of other routes. There is no scroll snapping.

## Routing and project data

`BrowserRouter` uses `/`, `/projects/taskforge`, and `/projects/flagbit`, with its basename taken from Vite's `BASE_URL`. Unmatched paths render `NotFound` within the shared layout. The sticky header links to the homepage's Home, Projects, and Contact sections, including when accessed from a walkthrough. Internal route changes preserve the background, move focus to the main content, and scroll to the requested section or the top. The layout includes a keyboard skip link and visible focus styles.

Project listing metadata is centralized in `src/data/projects.ts`, using the `Project` interface in `src/types/project.ts`. `featured: true` controls homepage inclusion. Set `walkthrough: true` only when a corresponding route is registered in `src/App.tsx`. The dedicated pages define their own introductory content and use `ProjectLayout`; keep their names, categories, and summaries consistent with the listing data.

An optional `coverImage` supplies `src` and descriptive `alt` text. Import local images from `src/assets/` so Vite emits URLs appropriate to its configured base. A missing or failed cover falls back to an image placeholder.

The project detail shell supports optional category metadata, summaries, technology tags, repository URLs, and live URLs. Only supplied URLs render as links; use full trusted `https://` URLs. Add case-study content as children of `ProjectLayout`.

## Production and GitHub Pages

```sh
npm ci
npm run typecheck
npm run format:check
npm run lint
npm run build
npm run preview
```

The intended project site is [https://arvence.github.io/Portfolio/](https://arvence.github.io/Portfolio/), based on this checkout's `Arvence/Portfolio` remote. This is a static Vite application: it does not require Next.js, SSR, server actions, API routes, or server-side image optimization.

### Automatic deployment

In **Repository → Settings → Pages → Build and deployment**, select **GitHub Actions** once. The workflow in `.github/workflows/deploy.yml` runs on every push to `main` and supports manual runs from the Actions tab. It uses GitHub's official `configure-pages`, `upload-pages-artifact`, and `deploy-pages` actions and a `github-pages` environment. The build can read Pages metadata; Pages write and OIDC permissions are restricted to the deployment job.

`configure-pages` supplies the site's `base_path` to the build as `PAGES_BASE_PATH`. Vite uses this prefix for JavaScript, CSS, and imported texture URLs; `BrowserRouter` uses the same value through `import.meta.env.BASE_URL`. This supports ordinary project sites such as `/Portfolio/` and root sites or custom domains without changing application routes. Public asset links use `BASE_URL` as well. Keep the capital `P` in this repository's URL.

The workflow installs the lockfile with `npm ci`, checks formatting and linting, runs the type-checked build, uploads `dist`, and deploys it. No personal access token or other custom secret is required in the workflow. Generated output and dependencies remain ignored by Git.

### Local production preview

Normal development and builds default to `/`. To reproduce the project-site prefix in PowerShell:

```powershell
$env:PAGES_BASE_PATH = '/Portfolio'
npm.cmd run build
npm.cmd run preview
```

Open `http://localhost:4173/Portfolio/` (or the port Vite prints). Keep the variable set for this preview, then use `Remove-Item Env:PAGES_BASE_PATH` before returning to ordinary local development. In a POSIX shell, prefix each command with `PAGES_BASE_PATH=/Portfolio`.

### Direct routes and verification

The build copies the application shell to `dist/projects/taskforge/index.html` and `dist/projects/flagbit/index.html`. GitHub Pages serves these known routes directly, including reloads, with a trailing slash and HTTP 200. Add a matching entry in `scripts/create-spa-fallback.mjs` whenever another walkthrough route is enabled.

The build also creates `dist/404.html`. Unknown paths under the deployment prefix render the application's `NotFound` page, with an HTTP 404 response. Vite preview has its own SPA fallback and does not reproduce that status behavior.

After deployment, check the homepage, both walkthroughs, header and back links, and an unknown path. Verify CSS, JavaScript, all four Earth/Moon texture files, and the footer's image-credits link under the correct prefix. A local build alone does not establish deployment success; confirm the Actions run and the live URL.

References: [Vite's GitHub Pages guide](https://vite.dev/guide/static-deploy.html#github-pages) and [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
