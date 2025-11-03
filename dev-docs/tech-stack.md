# Portfolio Buddy 2 - Tech Stack Deep Dive

**Last Updated:** October 30, 2025

## Table of Contents
1. [Core Framework & Build Tools](#core-framework--build-tools)
2. [Styling & UI](#styling--ui)
3. [Data Visualization](#data-visualization)
4. [Backend & Database](#backend--database)
5. [Utilities](#utilities)
6. [Development Tools](#development-tools)
7. [Configuration Files](#configuration-files)
8. [NPM Scripts](#npm-scripts)

---

## Core Framework & Build Tools

### React 19.1.1
**Purpose:** Core UI library

**Why React 19:**
- Latest stable version with performance improvements
- New concurrent features
- Improved TypeScript support
- Better developer experience

**Key Features Used:**
- Functional components
- Hooks (useState, useEffect, useMemo, useCallback, useRef)
- React 19's improved batching

**Documentation:** https://react.dev/

---

### React DOM 19.1.1
**Purpose:** React renderer for web browsers

**Integration:**
```typescript
// src/main.tsx
import { createRoot } from 'react-dom/client'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

### TypeScript 5.9.3
**Purpose:** Type safety and improved developer experience

**Configuration:** Strict mode enabled
```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

**Why TypeScript:**
- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Safer refactoring

**Usage in Project:**
- All components have typed props
- Interfaces defined for data structures
- Custom hook return types
- Utility function signatures

**Documentation:** https://www.typescriptlang.org/

---

### Vite 7.1.7
**Purpose:** Ultra-fast build tool and dev server

**Why Vite:**
- Instant server start
- Lightning-fast HMR (Hot Module Replacement)
- Optimized production builds
- Native ESM support
- Better than Create React App

**Configuration:** [vite.config.ts](../vite.config.ts)
```typescript
{
  server: {
    host: "::",      // IPv6 (all interfaces)
    port: 8080,      // Development port
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // @/ shorthand
    },
  },
}
```

**Features:**
- Path alias: `@/` maps to `src/`
- Component tagging for Lovable integration (dev mode only)
- React Fast Refresh enabled

**Documentation:** https://vite.dev/

---

## Styling & UI

### Tailwind CSS 4.1.14
**Purpose:** Utility-first CSS framework

**Why Tailwind v4:**
- Latest version with native CSS variables
- Faster compilation
- Smaller bundle size
- Better IntelliSense

**Configuration:** [tailwind.config.ts](../tailwind.config.ts)

**Custom Theme:**
```typescript
theme: {
  extend: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {...},
      secondary: {...},
      destructive: {...},
      muted: {...},
      accent: {...},
      popover: {...},
      card: {...},
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
  },
}
```

**Dark Mode:** Configured via class strategy
```typescript
darkMode: ["class"]
```

**Usage in Project:**
- Responsive design: `text-xs sm:text-sm md:text-base`
- Grid layouts: `grid grid-cols-2 sm:grid-cols-3`
- Flexbox: `flex flex-col sm:flex-row`
- Spacing: `p-4 gap-2 space-y-4`
- Colors: `bg-primary text-foreground`

**Documentation:** https://tailwindcss.com/

---

### @tailwindcss/postcss 4.1.14
**Purpose:** PostCSS integration for Tailwind v4

**Why Needed:**
- Processes Tailwind directives
- Optimizes CSS output
- Enables JIT (Just-In-Time) compilation

---

### Autoprefixer 10.4.21
**Purpose:** Automatically add vendor prefixes to CSS

**Example:**
```css
/* Input */
user-select: none;

/* Output */
-webkit-user-select: none;
-moz-user-select: none;
user-select: none;
```

---

### PostCSS 8.5.6
**Purpose:** CSS transformation tool

**Used For:**
- Processing Tailwind directives
- Running autoprefixer
- Minifying production CSS

---

### shadcn-ui (Color System Only)
**Purpose:** Design system color tokens

**What is shadcn-ui:**
shadcn-ui is NOT a component library like Material-UI or Ant Design. It's a collection of:
- Re-usable components you copy into your project
- Built on Radix UI primitives
- Fully customizable
- Not installed as a dependency

**How It's Used in This Project:**
- Color system configured in [tailwind.config.ts](../tailwind.config.ts)
- CSS variables defined in [src/index.css](../src/index.css)
- **NO shadcn-ui components are actually installed**
- Could add components later by copying from shadcn-ui docs

**CSS Variables Defined:**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --secondary: 0 0% 96.1%;
  /* ... etc */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... dark mode colors */
}
```

**If You Want to Add shadcn Components:**
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

**Documentation:** https://ui.shadcn.com/

---

### Lucide React 0.545.0
**Purpose:** Beautiful, consistent icon library

**Why Lucide:**
- Over 1,000+ icons
- Tree-shakeable (only imports icons you use)
- Consistent design
- TypeScript support

**Usage in Project:**
```typescript
import { Upload, Download, Trash2, Info } from 'lucide-react'

<Upload className="w-4 h-4" />
<Download className="w-5 h-5 text-primary" />
```

**Icons Used:**
- Upload: File upload button
- Download: Export functionality
- Trash2: Delete files
- Info: Information tooltips
- ChevronUp/Down: Sort indicators

**Documentation:** https://lucide.dev/

---

## Data Visualization

### Chart.js 4.5.1
**Purpose:** Core charting library for canvas-based charts

**Why Chart.js:**
- Highly performant (canvas rendering)
- Extensive customization
- Responsive out of the box
- Active community
- TypeScript support

**Chart Types Used:**
- Line charts (equity curves)
- Area charts (drawdown visualization)
- Mixed chart types (overlay multiple datasets)

**Documentation:** https://www.chartjs.org/

---

### react-chartjs-2 5.3.0
**Purpose:** React wrapper for Chart.js

**Integration:**
```typescript
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js'

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
)
```

**Used in:** [src/components/PortfolioSection.tsx](../src/components/PortfolioSection.tsx)

**Documentation:** https://react-chartjs-2.js.org/

---

### chartjs-adapter-date-fns 3.0.0
**Purpose:** Time-series support for Chart.js using date-fns

**Why Needed:**
- Enables time scale on x-axis
- Automatic date formatting
- Timezone support

**Configuration:**
```typescript
scales: {
  x: {
    type: 'time',
    time: {
      unit: 'day',
      displayFormats: {
        day: 'MMM d, yyyy'
      }
    }
  }
}
```

**Documentation:** https://www.chartjs.org/docs/latest/axes/cartesian/time.html

---

### chartjs-plugin-zoom 2.2.0
**Purpose:** Interactive zoom and pan for Chart.js

**Features:**
- Mouse wheel zoom
- Drag to pan
- Pinch zoom (touch devices)
- Programmatic zoom controls

**Configuration in Project:**
```typescript
zoom: {
  zoom: {
    wheel: { enabled: true },
    pinch: { enabled: true },
    mode: 'x',  // Only zoom x-axis
  },
  pan: {
    enabled: true,
    mode: 'x',  // Only pan x-axis
  }
}
```

**Documentation:** https://www.chartjs.org/chartjs-plugin-zoom/

---

### chartjs-plugin-annotation 3.1.0
**Purpose:** Add annotations to charts (lines, boxes, labels)

**Used For:**
- Max drawdown markers
- Important date markers
- Threshold lines

**Example Usage:**
```typescript
plugins: {
  annotation: {
    annotations: {
      maxDD: {
        type: 'line',
        yMin: maxDrawdownValue,
        yMax: maxDrawdownValue,
        borderColor: 'red',
        borderWidth: 2,
        label: {
          content: 'Max Drawdown',
          enabled: true
        }
      }
    }
  }
}
```

**Documentation:** https://www.chartjs.org/chartjs-plugin-annotation/

---

### Recharts 3.2.1 (UNUSED)
**Purpose:** React charting library

**Status:** Listed in package.json but NOT imported anywhere in codebase

**Action:** Could be removed to reduce bundle size
```bash
npm uninstall recharts
```

---

## Backend & Database

### @supabase/supabase-js 2.75.0
**Purpose:** Client library for Supabase (PostgreSQL cloud database)

**What is Supabase:**
- Open-source Firebase alternative
- PostgreSQL database
- Real-time subscriptions
- Authentication
- Storage
- Auto-generated REST API

**Integration:** [src/supabaseClient.ts](../src/supabaseClient.ts)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Database Schema (Inferred):**
```sql
-- Table: csv_files
CREATE TABLE csv_files (
  filename TEXT,
  file_content TEXT
);
```

**Features Used:**
- Fetch CSV files from database
- Store CSV files for sharing across sessions

**Features NOT Used (Yet):**
- Authentication
- Real-time subscriptions
- Row Level Security (should be enabled!)
- Storage buckets

**Environment Variables Required:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Documentation:** https://supabase.com/docs

---

### supabase 2.51.0
**Purpose:** Supabase CLI tools

**Used For:**
- Local development
- Database migrations
- Type generation
- Project management

**Commands:**
```bash
supabase init        # Initialize project
supabase start       # Start local Supabase
supabase db push     # Push migrations
supabase gen types   # Generate TypeScript types
```

**Documentation:** https://supabase.com/docs/guides/cli

---

## Utilities

### date-fns 4.1.0
**Purpose:** Modern date utility library

**Why date-fns:**
- Lightweight (tree-shakeable)
- Immutable
- TypeScript support
- Simple API
- Better than moment.js

**Used For:**
- Date parsing from CSV files
- Date formatting in charts
- Date range calculations
- Trading period calculations

**Common Functions Used:**
```typescript
import { parseISO, format, differenceInDays, addDays } from 'date-fns'

// Parse ISO date strings
const date = parseISO('2024-01-15')

// Format for display
format(date, 'MMM d, yyyy')  // "Jan 15, 2024"

// Calculate differences
differenceInDays(endDate, startDate)
```

**Documentation:** https://date-fns.org/

---

## Development Tools

### @vitejs/plugin-react 5.0.4
**Purpose:** Official Vite plugin for React

**Features:**
- Fast Refresh
- JSX transformation
- React DevTools support

---

### ESLint 9.36.0
**Purpose:** JavaScript/TypeScript linter

**Configuration:** [eslint.config.js](../eslint.config.js)

**Rules Enabled:**
- React hooks rules
- React refresh rules
- TypeScript rules
- Unused variable warnings

**Run Linting:**
```bash
npm run lint
```

---

### eslint-plugin-react-hooks 5.2.0
**Purpose:** Enforce React Hooks rules

**Rules:**
- `rules-of-hooks`: Ensures hooks are called correctly
- `exhaustive-deps`: Warns about missing dependencies

---

### eslint-plugin-react-refresh 0.4.22
**Purpose:** Validate Fast Refresh constraints

**Ensures:**
- Components are exported correctly
- No invalid exports that break Fast Refresh

---

### typescript-eslint 8.45.0
**Purpose:** TypeScript support for ESLint

**Features:**
- Type-aware linting
- TypeScript-specific rules
- Integration with tsconfig.json

---

### lovable-tagger 1.1.11
**Purpose:** Lovable platform integration for component tagging

**What It Does:**
- Tags React components in the DOM during development
- Enables visual editing in Lovable platform
- Only active in development mode (not production)

**Integration:**
```typescript
// vite.config.ts
import { componentTagger } from "lovable-tagger"

plugins: [
  react(),
  mode === 'development' && componentTagger(),  // Dev only
].filter(Boolean)
```

**How It Works:**
- Adds data attributes to React components
- Lovable platform can identify components visually
- Enables AI-assisted editing

---

## Configuration Files

### vite.config.ts
**Purpose:** Vite build tool configuration

**Key Settings:**
```typescript
{
  server: {
    host: "::",       // Bind to all interfaces (IPv6)
    port: 8080,       // Development server port
  },
  plugins: [
    react(),          // React Fast Refresh
    componentTagger() // Lovable integration (dev only)
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // @/ shorthand
    },
  },
}
```

**Reference:** [vite.config.ts](../vite.config.ts)

---

### tsconfig.json & tsconfig.app.json
**Purpose:** TypeScript compiler configuration

**Key Settings:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "jsx": "react-jsx",         // Modern JSX transform
    "strict": true,              // All strict checks enabled
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]         // Path alias support
    }
  }
}
```

**Reference:**
- [tsconfig.json](../tsconfig.json)
- [tsconfig.app.json](../tsconfig.app.json)

---

### tailwind.config.ts
**Purpose:** Tailwind CSS configuration

**Key Settings:**
- Dark mode via class strategy
- shadcn-ui color system
- Custom border radius variables
- Content paths for class detection

**Reference:** [tailwind.config.ts](../tailwind.config.ts)

---

### eslint.config.js
**Purpose:** ESLint linting rules

**Plugins:**
- react-hooks
- react-refresh
- typescript-eslint

**Reference:** [eslint.config.js](../eslint.config.js)

---

### postcss.config.js
**Purpose:** PostCSS configuration

**Plugins:**
- @tailwindcss/postcss (Tailwind v4 processor)
- autoprefixer (vendor prefixes)

---

## NPM Scripts

### Development

```bash
npm run dev
```
**What it does:**
- Starts Vite dev server on http://localhost:8080
- Enables Hot Module Replacement (HMR)
- Activates component tagging (Lovable integration)

**When to use:** Daily development work

---

### Production Build

```bash
npm run build
```
**What it does:**
1. Runs TypeScript compiler (`tsc -b`)
2. Builds with Vite for production
3. Outputs to `dist/` folder
4. Minifies and optimizes code

**When to use:** Before deployment

---

### Development Build

```bash
npm run build:dev
```
**What it does:**
- Builds with development optimizations
- Faster than production build
- Includes source maps

**When to use:** Testing build process without full optimization

---

### Linting

```bash
npm run lint
```
**What it does:**
- Runs ESLint on all TypeScript/JavaScript files
- Checks for code quality issues
- Enforces React hooks rules

**When to use:** Before committing code

---

### Preview Production Build

```bash
npm run preview
```
**What it does:**
- Serves the production build locally
- Tests production bundle before deployment

**When to use:** After `npm run build` to verify production behavior

---

## Dependency Summary

### Production Dependencies (17)
```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "@supabase/supabase-js": "^2.75.0",
  "supabase": "^2.51.0",
  "chart.js": "^4.5.1",
  "react-chartjs-2": "^5.3.0",
  "chartjs-adapter-date-fns": "^3.0.0",
  "chartjs-plugin-annotation": "^3.1.0",
  "chartjs-plugin-zoom": "^2.2.0",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.545.0",
  "recharts": "^3.2.1",          // ⚠️ UNUSED
  "autoprefixer": "^10.4.21",
  "postcss": "^8.5.6",
  "tailwindcss": "^4.1.14",
  "@tailwindcss/postcss": "^4.1.14"
}
```

### Development Dependencies (7)
```json
{
  "@vitejs/plugin-react": "^5.0.4",
  "vite": "^7.1.7",
  "typescript": "~5.9.3",
  "eslint": "^9.36.0",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.22",
  "typescript-eslint": "^8.45.0",
  "lovable-tagger": "^1.1.11"
}
```

### Total Package Count: 24 packages

---

## Recommendations

### Immediate Actions
1. **Remove unused dependency:**
   ```bash
   npm uninstall recharts
   ```

2. **Add testing libraries:**
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom
   ```

### Future Considerations
1. **Add actual shadcn-ui components** (if needed)
2. **Add form validation** (zod + react-hook-form)
3. **Add state management** (zustand or Context API)
4. **Add error monitoring** (Sentry)
5. **Add analytics** (PostHog or similar)

---

**Document maintained by:** Development team
**Last updated:** October 30, 2025