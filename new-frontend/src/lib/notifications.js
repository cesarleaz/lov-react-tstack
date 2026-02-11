import { eventBus } from './event'

type NotificationType = 'canvas_update' | 'session_done' | 'error' | 'info'



class NotificationManager {
  private notifications: Notification[] = []
  private listeners: ((notifications) => void)[] = []
  private currentCanvasId: string | null = null

  constructor() {
    this.initializeEventListeners()
  }

  public setCurrentCanvasId(canvasId | null) {
    this.currentCanvasId = canvasId
  }

  private initializeEventListeners() {
    // Image Generated
    eventBus.on('Socket::Session::ImageGenerated', (data) => {
      this.addNotification({
        type: 'canvas_update',
        title: 'Image generated',
        message: 'Image added to canvas',
        canvasId: data.canvas_id,
        imageUrl: data.image_url,
      })
    })

    // Info
    eventBus.on('Socket::Session::Info', (data) => {
      this.addNotification({
        type: 'info',
        title: 'Info',
        message: data.info,
      })
    })
  }

  private addNotification(
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) {
    if (
      notification.type === 'canvas_update' &&
      notification.canvasId === this.currentCanvasId
    ) {
      return
    }

    const uniqueKey = `${notification.type}_${notification.title}_${notification.canvasId || ''}_${notification.sessionId || ''}`
    if (
      this.notifications.some(
        (n) =>
          `${n.type}_${n.title}_${n.canvasId || ''}_${n.sessionId || ''}` ===
          uniqueKey
      )
    ) {
      return
    }

    const newNotification = {
      ...notification,
      id.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    this.notifications.unshift(newNotification)

    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50)
    }

    this.notifyListeners()
  }

  public getNotifications() {
    return [...this.notifications]
  }

  public getUnreadCount() {
    return this.notifications.filter((n) => !n.read).length
  }

  public markAsRead(id) {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  public markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true))
    this.notifyListeners()
  }

  public clearNotifications() {
    this.notifications = []
    this.notifyListeners()
  }

  public subscribe(listener: (notifications) => void) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.notifications))
  }

  // Get canvas notifications
  public getCanvasNotifications(canvasId) {
    return this.notifications.filter((n) => n.canvasId === canvasId)
  }

  // Get session notifications
  public getSessionNotifications(sessionId) {
    return this.notifications.filter((n) => n.sessionId === sessionId)
  }
}

export const notificationManager = new NotificationManager()
