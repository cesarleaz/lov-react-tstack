# Routing Documentation

The project uses a file-based routing system.

## Routes
- `/`: Home page with the list of canvases and the initial chat textarea.
- `/canvas/$id`: Canvas page with the editor and chat interface.
- `/knowledge`: Knowledge base management.
- `/agent_studio`: Agent studio interface.
- `/assets`: Assets management.

## Migration Note
- Tanstack Router has been removed in favor of `react-router-dom` to simplify the project and avoid TypeScript-heavy dependencies.
- URL parameters (`id`) and search parameters (`sessionId`) are now handled via `react-router-dom` hooks like `useParams` and `useSearchParams`.
