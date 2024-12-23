import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart'

export const AutoStart = {
  enable: async () => {
    try {
      await enable()
      return true
    } catch (error) {
      console.error('Failed to enable auto start:', error)
      return false
    }
  },

  disable: async () => {
    try {
      await disable()
      return true
    } catch (error) {
      console.error('Failed to disable auto start:', error)
      return false
    }
  },

  isEnabled: async () => {
    try {
      return await isEnabled()
    } catch (error) {
      console.error('Failed to check auto start status:', error)
      return false
    }
  }
} 