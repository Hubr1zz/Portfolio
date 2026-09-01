# Leon Zhou — Technical Designer Portfolio

A focused portfolio for Leon Zhou's technical design, gameplay systems, game projects, and design writing.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm test
```

The site is built with React, Next-compatible routing through vinext, and CSS animations with reduced-motion support.

## Deployment

The same source supports two deployment targets:

- OpenAI Sites uses the default Worker build.
- GitHub Pages uses a conditional static export and deploys through `.github/workflows/deploy-pages.yml` after every push to `main`.

To enable GitHub Pages for the first time, open the repository's **Settings → Pages**, set **Source** to **GitHub Actions**, and run the **Deploy GitHub Pages** workflow. The workflow derives its base path and public URL from the repository name.

With the current `MyLibrary` repository name, the default project URL is:

```text
https://hubr1zz.github.io/MyLibrary/
```

After renaming the repository to `portfolio`, the next workflow run automatically builds for:

```text
https://hubr1zz.github.io/portfolio/
```

No source-code path changes are required after that rename.
