# API Documentation

This document describes the API requests used in the project. All requests are migrated from TypeScript to JavaScript.

## Base URL
- Local API (proxied): `/api`
- External API: `BASE_API_URL` (defined in `constants.js`)

## Auth API (`auth.js`)
- `startDeviceAuth()`: Starts the device authentication process.
- `pollDeviceAuth(deviceCode)`: Polls for the device authentication status.
- `getAuthStatus()`: Returns the current authentication status by checking local storage and refreshing the token.
- `logout()`: Clears local storage and logs out the user.
- `getUserProfile()`: Returns the user profile from local storage.
- `authenticatedFetch(url, options)`: Wrapper for `fetch` that adds the authorization header.
- `refreshToken(currentToken)`: Refreshes the access token.

## Billing API (`billing.js`)
- `getBalance()`: Fetches the user's current balance.

## Canvas API (`canvas.js`)
- `listCanvases()`: Lists all canvases.
- `createCanvas(data)`: Creates a new canvas.
- `getCanvas(id)`: Fetches a specific canvas by ID.
- `saveCanvas(id, payload)`: Saves canvas data and thumbnail.
- `renameCanvas(id, name)`: Renames a canvas.
- `deleteCanvas(id)`: Deletes a canvas.

## Chat API (`chat.js`)
- `getChatSession(sessionId)`: Fetches messages for a specific session.
- `sendMessages(payload)`: Sends messages to the chat API.
- `cancelChat(sessionId)`: Cancels an ongoing chat request.

## Config API (`config.js`)
- `getConfigExists()`: Checks if the config exists.
- `getConfig()`: Fetches the current LLM configuration.
- `updateConfig(config)`: Updates the LLM configuration.
- `updateJaazApiKey(token)`: Updates the Jaaz provider API key.
- `clearJaazApiKey()`: Clears the Jaaz provider API key.

## Knowledge API (`knowledge.js`)
- `createKnowledge(data)`: Creates a new knowledge base.
- `updateKnowledge(id, data)`: Updates an existing knowledge base.
- `deleteKnowledge(id)`: Deletes a knowledge base.
- `saveEnabledKnowledgeDataToSettings(knowledgeData)`: Saves enabled knowledge data to local settings.

## Magic API (`magic.js`)
- `sendMagicGenerate(payload)`: Sends a request for magic generation.
- `cancelMagicGenerate(sessionId)`: Cancels an ongoing magic generation request.

## Model API (`model.js`)
- `listModels()`: Fetches available LLM and tools.

## Settings API (`settings.js`)
- `getSettingsFileExists()`: Checks if settings file exists.
- `getSettings()`: Fetches all settings.
- `updateSettings(settings)`: Updates settings.
- `getProxySettings()`: Fetches proxy settings.
- `updateProxySettings(proxyConfig)`: Updates proxy settings.
- `browseFolderApi(path)`: Browses the file system.
- `getMediaFilesApi(path)`: Fetches media files from a path.
- `openFolderInExplorer(path)`: Opens a folder in the file explorer.
- `getFileThumbnailApi(filePath)`: Fetches a thumbnail for a file.
- `getFileServiceUrl(filePath)`: Returns the URL for serving a file.
- `getFileInfoApi(filePath)`: Fetches detailed information about a file.
- `getMyAssetsDirPath()`: Fetches the user's assets directory path.

## Upload API (`upload.js`)
- `uploadImage(file)`: Uploads an image after compressing it.
