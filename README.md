**Preview in VS Code:** `Ctrl+Shift+V`

## Table of Contents
- <a href="#environment-setup">Environment Setup</a>
- <a href="#extensions-setup">Extensions setup</a>
- <a href="#project-start">Project Start</a>

<a id="environment-setup"></a>

## Environment Setup

1. NVM (https://github.com/nvm-sh/nvm#installing-and-updating)
   
   Node.js 22.22.0 (via nvm)
   ```bash
   nvm install 22.22.0
   nvm use 22.22.0
   ```

   Corepack (for pnpm)
   ```bash
   corepack enable
   ```

   pnpm 10.30.3
   ```bash
   corepack prepare pnpm@10.30.3 --activate
   ```

<a id="extensions-setup"></a>

## Extensions setup

### Required
- Biome ([IDE](vscode:extension/biomejs.biome) | [Marketplace](https://marketplace.visualstudio.com/items?itemName=biomejs.biome))
- Tailwind CSS IntelliSense ([IDE](vscode:extension/bradlc.vscode-tailwindcss) | [Marketplace](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss))

### Recommended
- Code Spell Checker ([IDE](vscode:extension/streetsidesoftware.code-spell-checker) | [Marketplace](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker))
- Color Highlight ([IDE](vscode:extension/naumovs.color-highlight) | [Marketplace](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight))
- GitLens - Git supercharged ([IDE](vscode:extension/eamodio.gitlens) | [Marketplace](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens))
- Path Intellisense ([IDE](vscode:extension/christian-kohler.path-intellisense) | [Marketplace](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense))

### Optional
- Material Icon Theme ([IDE](vscode:extension/PKief.material-icon-theme) | [Marketplace](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme))

<a id="project-start"></a>

## Project Start

### Run QA
1. In the project root, install dependencies:
   ```bash
   pnpm install
   ```
2. Go to `apps/web`:
   ```bash
   cd apps/web
   ```
3. Start the app in QA mode:
   ```bash
   pnpm run dev
   ```

### Run Local
1. In `apps/web`, copy `.env.local.sample` and rename it to `.env.local`.
2. Start the app in local mode:
   ```bash
   pnpm run dev:local
   ```
