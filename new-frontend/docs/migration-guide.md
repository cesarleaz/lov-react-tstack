# Migration Guide: TypeScript + Tanstack Query to JavaScript + Zustand

This guide outlines the steps taken to migrate the project.

## Key Changes

### 1. Language Change
- All `.ts` files converted to `.js`.
- All `.tsx` files converted to `.jsx`.
- Removed all type definitions, interfaces, and type annotations.
- Replaced `interface` and `type` with JSDoc comments where helpful.

### 2. State Management Migration
- **Removed Tanstack Query**: Replaced `useQuery` and `useMutation` with standard `useEffect` fetching and Zustand actions.
- **Consolidated Stores**: Combined React Contexts and previous Zustand stores into simplified Zustand stores.
- **Manual Cache Management**: Removed `PersistQueryClientProvider` and IndexedDB caching. Local state is managed via Zustand.

### 3. Routing Migration
- **Removed Tanstack Router**: Replaced with `react-router-dom`.
- Updated navigation calls from `navigate({ to: ... })` to `navigate(...)`.
- Updated parameter access from `useParams({ from: ... })` to `useParams()`.

### 4. Build System
- Kept Vite as the build tool.
- Updated `vite.config.js` to remove TypeScript-related plugins and configurations.
- Updated `package.json` to remove TypeScript dependencies and add/update necessary JS libraries.

## Component Migration Checklist
- [ ] Convert `.tsx` to `.jsx`.
- [ ] Remove type imports and annotations.
- [ ] Replace `useQuery`/`useMutation` with local state or Zustand actions.
- [ ] Replace Tanstack Router hooks with `react-router-dom` equivalents.
- [ ] Ensure all styles (Tailwind CSS) remain intact.
- [ ] Verify that Electron APIs (if used) are still correctly called via `window.electronAPI`.
