# Getting Started with Portfolio Buddy 2

**Last Updated:** October 30, 2025

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Setup](#environment-setup)
4. [Development](#development)
5. [Building](#building)
6. [Lovable Integration](#lovable-integration)
7. [Project Structure Tour](#project-structure-tour)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

**Node.js** (v18.0.0 or higher)
```bash
node --version  # Should be v18.0.0+
```

**Download:** https://nodejs.org/

---

**npm** (comes with Node.js)
```bash
npm --version  # Should be 9.0.0+
```

---

**Git** (for version control)
```bash
git --version
```

**Download:** https://git-scm.com/

---

### Recommended Tools

**VS Code** - Best IDE for this project
- Extension: ESLint
- Extension: Tailwind CSS IntelliSense
- Extension: TypeScript Vue Plugin (Volar)

**Supabase Account** (if using database features)
- Sign up: https://supabase.com/

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/5HinFutures/portfolio-buddy-2.git
cd portfolio-buddy-2
```

**Or if you already have it:**
```bash
cd "C:\Users\kg129\Desktop\5MF\Portfolio Buddy 2"
```

---

### 2. Install Dependencies

```bash
npm install
```

**What this does:**
- Downloads all packages from package.json
- Creates node_modules/ folder
- Generates package-lock.json

**Expected output:**
```
added 300+ packages in 30s
```

**Common Issues:**
- If errors occur, try: `rm -rf node_modules package-lock.json && npm install`
- Ensure you're using Node.js v18+

---

### 3. Verify Installation

```bash
npm run lint
```

**Expected output:**
```
✓ No linting errors
```

If you see TypeScript errors, don't worry - we'll fix them during development.

---

## Environment Setup

### Create .env File

Create a file named `.env` in the project root:

```bash
# Windows Command Prompt
copy NUL .env

# PowerShell
New-Item .env

# Git Bash / Linux / Mac
touch .env
```

---

### Add Environment Variables

Open `.env` and add:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**How to get these values:**

1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

### Verify Environment Variables

```typescript
// In browser console after starting dev server:
console.log(import.meta.env.VITE_SUPABASE_URL)
// Should output your Supabase URL
```

---

### .env.example (For Documentation)

Consider creating `.env.example` for other developers:

```env
# Copy this file to .env and fill in your values

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note:** `.env` is already in `.gitignore` - never commit secrets!

---

## Development

### Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v7.1.7  ready in 500 ms

➜  Local:   http://localhost:8080/
➜  Network: http://[::]:8080/
➜  press h to show help
```

**Open in browser:** http://localhost:8080/

---

### What Happens During Dev Mode

1. **Vite starts ultra-fast dev server** on port 8080
2. **Hot Module Replacement (HMR)** enabled - changes appear instantly
3. **lovable-tagger activates** - tags components for Lovable platform
4. **TypeScript type-checking** runs in background
5. **ESLint** provides real-time linting (if VS Code extension installed)

---

### Development Workflow

**Making Changes:**
1. Edit files in `src/`
2. Save the file (Ctrl+S / Cmd+S)
3. Browser auto-refreshes with changes (usually under 100ms)

**Example:**
```typescript
// Edit src/components/Header.tsx
export const Header = () => {
  return (
    <div>
      <h1>Portfolio Buddy 2</h1>  {/* Change this text */}
    </div>
  )
}
// Save - browser updates instantly!
```

---

### Using Path Aliases

The project has `@/` alias configured for `src/`:

```typescript
// Instead of:
import { calculateMetrics } from '../../../utils/dataUtils'

// Use:
import { calculateMetrics } from '@/utils/dataUtils'
```

**Benefits:**
- No more `../../../../../../` hell
- Easier refactoring
- Clearer imports

---

## Building

### Development Build

```bash
npm run build:dev
```

**What it does:**
- Builds with development optimizations
- Includes source maps for debugging
- Faster build time

**Output:** `dist/` folder

---

### Production Build

```bash
npm run build
```

**What it does:**
1. Runs TypeScript type checking (`tsc -b`)
2. Builds optimized bundle with Vite
3. Minifies JavaScript and CSS
4. Optimizes images and assets
5. Generates production-ready `dist/` folder

**Expected output:**
```
vite v7.1.7 building for production...
✓ built in 5.2s
dist/index.html                  0.45 kB
dist/assets/index-abc123.css    12.34 kB │ gzip: 3.45 kB
dist/assets/index-abc123.js    234.56 kB │ gzip: 78.90 kB
```

---

### Preview Production Build

```bash
npm run preview
```

**What it does:**
- Serves the production build locally
- Simulates production environment
- Tests before deployment

**Opens at:** http://localhost:4173/

---

### Build Issues

**TypeScript errors prevent build:**
```bash
npm run build
# Error: Type 'string' is not assignable to type 'number'
```

**Solution:** Fix TypeScript errors before building
```bash
npm run lint  # Find all issues
```

---

## Lovable Integration

### What is Lovable?

Lovable is an AI-powered development platform that:
- Generated the initial project structure
- Provides visual component editing
- Integrates with your Git repository
- Enables dual workflow (Lovable + local dev)

**Your Lovable Project:** https://lovable.dev/projects/68cf6fef-03c3-4f10-96e2-64490bd6308e

---

### How Integration Works

**In Development Mode:**
```typescript
// vite.config.ts
plugins: [
  react(),
  mode === 'development' && componentTagger(),  // ← Lovable integration
].filter(Boolean)
```

**Component Tagging:**
- Adds data attributes to components in the DOM
- Lovable platform can identify components visually
- Only active in development (not production)

**Example HTML output:**
```html
<div data-component="Header" data-file="src/components/Header.tsx">
  <!-- Component content -->
</div>
```

---

### Dual Workflow

**Option 1: Develop in Lovable**
1. Go to your Lovable project URL
2. Make changes visually or via AI prompts
3. Lovable auto-commits to GitHub
4. Pull changes locally: `git pull`

**Option 2: Develop Locally**
1. Make changes in your IDE (VS Code, etc.)
2. Commit and push to GitHub: `git push`
3. Changes sync to Lovable automatically

**Best Practice:** Use both!
- **Lovable:** Rapid prototyping, UI experiments
- **Local:** Complex logic, following your coding standards

---

## Project Structure Tour

### Key Directories

```
Portfolio Buddy 2/
├── src/                    # All source code
│   ├── components/         # React UI components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Pure utility functions
│   ├── assets/             # Images, icons
│   ├── App.tsx             # Main component
│   └── main.tsx            # Entry point
│
├── dev-docs/               # Development documentation (you are here!)
├── .claude/                # Claude AI workflow integration
├── public/                 # Static files (copied to dist/ as-is)
├── dist/                   # Build output (generated, not in Git)
├── node_modules/           # Dependencies (generated, not in Git)
│
├── .env                    # Environment variables (NOT in Git)
├── .gitignore              # Files to ignore in Git
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── README.md               # Project README
```

---

### Important Files to Know

**Configuration:**
- [package.json](../package.json) - Dependencies, scripts
- [vite.config.ts](../vite.config.ts) - Build tool config
- [tsconfig.json](../tsconfig.json) - TypeScript settings
- [tailwind.config.ts](../tailwind.config.ts) - Styling config

**Core Application:**
- [src/App.tsx](../src/App.tsx) - Main component (295 lines)
- [src/main.tsx](../src/main.tsx) - App entry point
- [src/supabaseClient.ts](../src/supabaseClient.ts) - Database client

**Business Logic:**
- [src/utils/dataUtils.ts](../src/utils/dataUtils.ts) - Calculations (520 lines)
- [src/utils/constants.ts](../src/utils/constants.ts) - Margin rates, configs
- [src/hooks/](../src/hooks/) - Custom hooks (4 files)

---

## Common Tasks

### Add a New Component

```bash
# Create file
touch src/components/MyNewComponent.tsx
```

```typescript
// src/components/MyNewComponent.tsx
interface MyNewComponentProps {
  title: string;
  value: number;
}

export const MyNewComponent = ({ title, value }: MyNewComponentProps) => {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">{value}</p>
    </div>
  )
}
```

**Use in App.tsx:**
```typescript
import { MyNewComponent } from '@/components/MyNewComponent'

<MyNewComponent title="Test" value={42} />
```

---

### Add a New Utility Function

```typescript
// src/utils/dataUtils.ts

/**
 * Calculates the average of an array of numbers
 * @param numbers - Array of numbers
 * @returns Average value or 0 if empty
 */
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0
  const sum = numbers.reduce((acc, num) => acc + num, 0)
  return sum / numbers.length
}
```

---

### Add a New Hook

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
```

**Usage:**
```typescript
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

---

### Install a New Package

```bash
# Production dependency
npm install package-name

# Development dependency
npm install -D package-name
```

**Example - Add a date picker:**
```bash
npm install react-datepicker
npm install -D @types/react-datepicker
```

---

### Run Linting

```bash
npm run lint
```

**Fix auto-fixable issues:**
```bash
npm run lint -- --fix
```

---

### View TypeScript Errors

```bash
npx tsc --noEmit
```

This runs type checking without building.

---

## Troubleshooting

### Port 8080 Already in Use

**Error:**
```
Port 8080 is in use, trying another one...
```

**Solutions:**

**Option 1: Kill process on port 8080**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8080 | xargs kill -9
```

**Option 2: Use different port**
```bash
npm run dev -- --port 3000
```

---

### Module Not Found

**Error:**
```
Error: Cannot find module '@/utils/dataUtils'
```

**Solutions:**
1. Check file exists: `ls src/utils/dataUtils.ts`
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Restart VS Code TypeScript server: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

---

### Environment Variables Not Working

**Error:**
```
supabaseUrl is undefined
```

**Solutions:**
1. Ensure `.env` file exists in project root
2. Variable names MUST start with `VITE_`
3. Restart dev server after changing `.env`
4. Check syntax (no quotes needed):
   ```env
   # Correct
   VITE_SUPABASE_URL=https://example.supabase.co

   # Incorrect
   VITE_SUPABASE_URL="https://example.supabase.co"
   ```

---

### Build Fails with TypeScript Errors

**Error:**
```
src/App.tsx:42:5 - error TS2322: Type 'string' is not assignable to type 'number'.
```

**Solutions:**
1. Fix TypeScript errors (they're there for a reason!)
2. Check tsconfig.json settings
3. Restart VS Code if types are out of sync

---

### Styles Not Applying

**Issue:** Tailwind classes not working

**Solutions:**
1. Check class names are valid: https://tailwindcss.com/docs
2. Ensure file is in `content` array in tailwind.config.ts
3. Restart dev server
4. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)

---

### Git Issues

**Push rejected:**
```bash
git push
# Error: Updates were rejected
```

**Solution:**
```bash
git pull --rebase origin main
git push
```

---

### Supabase Connection Issues

**Error:**
```
Supabase client error: Invalid API key
```

**Solutions:**
1. Verify `.env` variables are correct
2. Check Supabase project is active
3. Ensure anon key (not service_role key!)
4. Check network connection

---

### Performance Issues

**Symptoms:** Slow HMR, sluggish dev server

**Solutions:**
1. Close unused applications
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Clear node_modules: `rm -rf node_modules && npm install`
4. Check for infinite loops in useEffect
5. Use React DevTools Profiler

---

## Next Steps

### After Getting Started

1. **Read the docs:**
   - [project-overview.md](project-overview.md) - Understand the architecture
   - [tech-stack.md](tech-stack.md) - Deep dive into dependencies
   - [lovable-integration.md](lovable-integration.md) - Understand dual workflow

2. **Review master skills:**
   - `C:\Users\kg129\Desktop\5MF\claude-skills\general\coding-standards.md`
   - `C:\Users\kg129\Desktop\5MF\claude-skills\frontend\react-standards.md`

3. **Explore the codebase:**
   - Start with [src/App.tsx](../src/App.tsx)
   - Review [src/components/](../src/components/)
   - Understand [src/utils/dataUtils.ts](../src/utils/dataUtils.ts)

4. **Make a test change:**
   - Edit Header component
   - See HMR in action
   - Practice the workflow

5. **Plan your first feature:**
   - Review [migration-strategy.md](migration-strategy.md)
   - Use ICE scoring
   - Start small!

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server (port 8080)
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Git
git status               # Check status
git add .                # Stage all changes
git commit -m "message"  # Commit with message
git push                 # Push to GitHub
git pull                 # Pull from GitHub

# Troubleshooting
rm -rf node_modules package-lock.json && npm install  # Reset dependencies
npx tsc --noEmit         # Check TypeScript errors
```

---

## Getting Help

**Documentation:**
- This folder: [dev-docs/](.)
- Vite: https://vite.dev/
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/
- Tailwind: https://tailwindcss.com/
- Supabase: https://supabase.com/docs

**Issues:**
- Check [Troubleshooting](#troubleshooting) section above
- Review error messages carefully
- Search GitHub issues in similar projects
- Ask Claude AI (follow coding standards!)

**Community:**
- 5minfutures community
- React Discord
- Stack Overflow

---

**Document maintained by:** Development team
**Last updated:** October 30, 2025
**Next update:** After first successful setup by new developer