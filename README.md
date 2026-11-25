# devfetch

A fast local overview of your developer environment, project, Git state, and
basic security hygiene. Built with Bun, runs on Node, and ships as a single CLI.

## Install

```bash
bun add -g devfetch
# or
npm install -g devfetch
```

Run it without installing:

```bash
bunx devfetch
# or
npx devfetch
```

## Usage

```bash
devfetch                 # default terminal report
devfetch --dashboard     # interactive Ink + React dashboard
devfetch --minimal       # one compact line
devfetch --json          # machine-readable output
devfetch --no-ascii      # hide the logo
devfetch --theme nord    # default | dracula | nord
devfetch --project       # project info as JSON
devfetch --security      # security info as JSON
```

The default report includes:

- **System** - OS, shell, terminal, uptime, CPU model, and memory usage.
- **Tools** - detected versions of Node, Bun, npm, pnpm, Yarn, Git, Docker,
  Python, Go, and Rust. Missing tools are skipped.
- **Project** - name, framework, package manager, and dependency counts from
  `package.json`.
- **Git** - branch, uncommitted file count, ahead/behind upstream, and last
  commit.
- **Security** - presence of `.env` / `.env.example`, whether `.env` is Git
  ignored, lockfile, pinned Node version, and a count of possible secrets.

## Dashboard

`devfetch --dashboard` renders an optional Ink + React dashboard using the same
locally collected `DevFetchData` as the default report.

- **Reusable components**: `Panel`, `SystemPanel`, `ProjectPanel`,
  `ToolsPanel`, `GitPanel`, `SecurityPanel`, `Dashboard`.
- **Responsive layout**: two-column horizontal layout on terminals at least 100
  columns wide; panels stack vertically on narrower terminals.
- **Styling**: bordered panels, theme colors, padding, and responsive widths.
- **Themes**: supports `default`, `dracula`, and `nord` via `--theme`.
- **Missing data**: unavailable modules and empty states are rendered with
  graceful fallback messages.

```bash
devfetch --dashboard
devfetch --dashboard --theme dracula
devfetch --dashboard --theme nord
```

## Development

```bash
bun install
bun run dev              # bun run src/cli.ts
bun test
bun run build            # dist/cli.js (runs on Node 18+)
node dist/cli.js
bun run compile          # optional standalone devfetch executable
bun link                 # optional global link for local development
```

## Verification

```bash
bun install
bun run typecheck
bun test
bun run build
node dist/cli.js --help
node dist/cli.js --dashboard
node dist/cli.js --dashboard --theme dracula
node dist/cli.js --json
node dist/cli.js --minimal
node dist/cli.js --project
node dist/cli.js --security
```

## Privacy

Everything runs locally. No data is uploaded and no network requests are made.
The security scan only reports filenames and generic categories (for example,
"possible API key"); it never prints or stores a matched secret value.

## Limitations

- The secret scan is a heuristic over top-level text files only; it can produce
  false positives and is not a replacement for a dedicated secret scanner.
- Ahead/behind counts require a configured Git upstream.
- On Windows, npm/pnpm/Yarn shims are launched through `cmd.exe` and allowed
  four seconds because npm startup is slow there. Every other external command
  has a two-second timeout; all checks run in parallel. These are upper bounds,
  not delays - successful checks finish as soon as the command does.
- `--theme` applies to the Ink dashboard. The default terminal report keeps its existing output and does not change colors.

## License

MIT
