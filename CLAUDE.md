# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # TypeScript check + Vite build
npm run preview  # Preview production build
```

## Tech Stack

- Vue 3.5.24 (Composition API with `<script setup>`)
- TypeScript 5.9.3
- Vite 7.2.2
- Naive UI 2.43.2 (component library)
- `@vicons/ionicons5` (icon library - only allowed icons)
- Axios, dayjs, echarts, docxtemplater, openai, pizzip, file-saver, dingtalk-jsapi

## Architecture

```
src/
├── router/index.ts          # Vue Router with hash history (/void-frontend/)
├── views/pages/             # PC page components
├── views/mobile-pages/      # Mobile page components
├── components/              # Shared components (empty - HelloWorld only)
├── modules/                # Feature modules (per-category structure)
│   └── bidding/
│       ├── public-bidding/  # 公开招标 (Public Bidding)
│       │   ├── components/  # Step components + AI/History UI
│       │   ├── services/     # API, AI, draft, export, mock
│       │   ├── types/       # TypeScript interfaces
│       │   ├── constants/    # Mappings
│       │   ├── utils/       # Formatters, validators
│       │   └── views/       # PublicBiddingView.vue
│       ├── service-bidding/ # 服务招标 (empty shell)
│       ├── construction-bidding/  # 施工招标 (empty shell)
│       ├── negotiation/      # 谈判文件 (empty shell)
│       └── inquiry-procurement/  # 询比采购 (empty shell)
├── composables/            # Composables (currently empty)
├── utils/                 # Global utilities (date, format, validate, dingtalk)
└── assets/                # Static assets
```

### Bidding Module

Each procurement category is a self-contained module under `modules/bidding/`:
- **public-bidding**: 公开招标 - main feature with 3-step wizard form
- **service-bidding/construction-bidding/negotiation/inquiry-procurement**: shells for future categories

**Public Bidding View Structure** (`public-bidding/views/PublicBiddingView.vue`):
- Main orchestrator (~400 lines) - header, step navigation, state management
- **Step components**: `BasicInfoStep`, `BidderInstructionsStep`, `ScoringStep`
- **Shared UI**: `AIFillDialog`, `HistoryFloatButton`, `HistoryProjectDrawer`
- **Services**: `api.ts` (submit), `ai.ts` (OpenAI), `draft.ts` (localStorage), `export.ts` (Word), `mock.ts` (dev data)

## Key Conventions

### Icons
- **Only `@vicons/ionicons5`** - no other icon libraries, no inline SVG
- Use `<n-icon><IconName /></n-icon>` pattern
- Import from `@vicons/ionicons5`

### Styling
- Native CSS only with `scoped`
- BEM naming convention (`.block__element--modifier`)
- CSS variables for theming
- No CSS preprocessors (Sass, Less, Stylus)

### Components
- `<template>` → `<script setup>` → `<style scoped>` order
- TypeScript interfaces for Props/Emits
- Single file as isolation boundary (no global state unless necessary)
- Component files: PascalCase (e.g., `UserProfile.vue`)

### TypeScript
- Avoid `any`, use `unknown` or specific types
- Use `interface` for objects, `type` for unions
- Props/Emits via `defineProps<Props>()` and `defineEmits<Emits>()`

### Auto-imports
- Vue APIs (ref, reactive, computed, etc.) auto-imported
- Naive UI hooks: `useDialog`, `useMessage`, `useNotification`, `useLoadingBar`
- Naive UI components: `n-button`, `n-input`, etc.

## Development Guidelines

See `vue3-ai-prompt.md` for AI-assisted coding standards:
- Functionality-first: HTML structure → JavaScript logic → CSS styling
- Local state with `ref`, global state only when truly needed
- No prop mutation - emit events instead
- Lazy load routes and heavy components

## Environment Variables

- `.env.example` for reference
- `.env.development` for dev, `.env.production` for prod

### API Proxies (vite.config.ts)

| Path | Target | Purpose |
|------|--------|---------|
| `/open` | `localhost:12000` | Primary API |
| `/proxy` | `edb.cie-cn.com:8066` | External service |
| `/old` | `yus.cie-cn.com:7080` | Legacy system |
| `/v1` | `api.dify.ai` | AI/Dify API |
| `/napi` | `192.168.48.132:7777` | Flask backend |

## Route Structure

- Hash-based routing: `/void-frontend/#/path`
- PC routes: directly under `/`
- Mobile routes: under `/mobile/` nested structure
- Bidding routes: `/bidding/public-bid`, `/bidding/service-bid`, etc.
- 404 catches `/:pathMatch(.*)*`
