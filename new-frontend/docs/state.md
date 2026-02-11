# State Management Documentation

The project has been migrated from a combination of React Context, Tanstack Query, and Zustand to a centralized Zustand-based state management system.

## Zustand Stores

### Configs Store (`useConfigsStore`)
Replaces `src/stores/configs.ts` and `src/contexts/configs.tsx`.
- `textModels`: List of available text models.
- `selectedTools`: List of currently selected tools.
- `textModel`: The currently selected text model.
- `allTools`: List of all available tools.
- `providers`: LLM provider configurations.
- Actions: `setTextModels`, `setSelectedTools`, `setTextModel`, `setAllTools`, `setProviders`, etc.
- **Migration Note**: Data fetching logic from `ConfigsProvider` has been moved to this store or a dedicated hook.

### Canvas Store (`useCanvasStore`)
Replaces `src/stores/canvas.ts` and `src/contexts/canvas.tsx`.
- Manages canvas-specific state, potentially including active sessions, local modifications, and UI state.

### Auth Store (`useAuthStore`)
Replaces `src/contexts/AuthContext.tsx`.
- `authStatus`: Current authentication status (`logged_in`, `logged_out`, `pending`).
- `isLoading`: Loading state for authentication checks.
- `user_info`: User information.
- Actions: `refreshAuth`, `login`, `logout`.

## Persistence
- Authentication data (token, user info) is persisted in `localStorage`.
- Settings and some config preferences are also persisted in `localStorage`.
- React Query's IndexedDB persistence has been removed. Any necessary caching should be implemented manually or through Zustand's persistence middleware if needed.

## Tanstack Query Replacement
All `useQuery` and `useMutation` hooks have been replaced with:
1. `useEffect` for data fetching on component mount or dependency change.
2. `useState` for managing local loading and error states.
3. Zustand store actions for global data fetching and state updates.
