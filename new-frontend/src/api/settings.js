export async function getSettingsFileExists() {
  const response = await fetch('/api/settings/exists')
  return await response.json()
}

export async function getSettings() {
  const response = await fetch('/api/settings')
  return await response.json()
}

export async function updateSettings(settings) {
  const response = await fetch('/api/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  })
  return await response.json()
}

export async function getProxySettings() {
  const response = await fetch('/api/settings/proxy')
  return await response.json()
}

export async function updateProxySettings(proxyConfig) {
  const response = await fetch('/api/settings/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(proxyConfig),
  })
  return await response.json()
}

export const browseFolderApi = async (path = '') => {
  const response = await fetch(
    `/api/browse_filesystem?path=${encodeURIComponent(path)}`
  )
  if (!response.ok) {
    throw new Error('Failed to browse folder')
  }
  return response.json()
}

export const getMediaFilesApi = async (path) => {
  const response = await fetch(
    `/api/get_media_files?path=${encodeURIComponent(path)}`
  )
  if (!response.ok) {
    throw new Error('Failed to get media files')
  }
  return response.json()
}

export const openFolderInExplorer = async (path) => {
  const response = await fetch('/api/open_folder_in_explorer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path }),
  })
  if (!response.ok) {
    throw new Error('Failed to open folder in explorer')
  }
  return response.json()
}

export const getFileThumbnailApi = async (filePath) => {
  const response = await fetch(
    `/api/get_file_thumbnail?file_path=${encodeURIComponent(filePath)}`
  )
  if (!response.ok) {
    throw new Error('Failed to get file thumbnail')
  }
  return response.json()
}

export const getFileServiceUrl = (filePath) => {
  return `/api/serve_file?file_path=${encodeURIComponent(filePath)}`
}

export const getFileInfoApi = async (filePath) => {
  const response = await fetch(
    `/api/get_file_info?file_path=${encodeURIComponent(filePath)}`
  )
  if (!response.ok) {
    throw new Error('Failed to get file info')
  }
  return response.json()
}

export const getMyAssetsDirPath = async () => {
  const response = await fetch('/api/settings/my_assets_dir_path')
  const result = await response.json()
  return result
}
