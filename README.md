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
devfetch                 # full dashboard
devfetch --minimal       # one compact line
devfetch --json          # machine-readable output
devfetch --no-ascii      # hide the logo
devfetch --theme nord    # default | dracula | nord (validation only for now)
devfetch --project       # project info as JSON
devfetch --security      # security info as JSON
```

The full dashboard reports:

- **System** - OS, shell, terminal, uptime, CPU model, and memory usage.
- **Tools** - detected versions of Node, Bun, npm, pnpm, Yarn, Git, Docker,
  Python, Go, and Rust. Missing tools are skipped.
- **Project** - name, framework, package manager, and dependency counts from
  `package.json`.
- **Git** - branch, uncommitted file count, ahead/behind upstream, and last
  commit.
- **Security** - presence of `.env` / `.env.example`, whether `.env` is Git
  ignored, lockfile, pinned Node version, and a count of possible secrets.

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
- `--theme` currently validates the value but does not change colors.

## License

MIT
