const isClient = typeof window !== 'undefined'

const stringStorage = {
  getItem: (key: string) => {
    if (isClient && window.localStorage) {
      return localStorage.getItem(key) || ''
    }
    // For SSR, you might want to return a default value or check for data attributes
    // that were potentially sent from the server
    return ''
  },
  setItem: (key: string, value: string) => {
    if (isClient && window.localStorage) {
      localStorage.setItem(key, value)
    }
  },
  removeItem: (key: string) => {
    if (isClient && window.localStorage) {
      localStorage.removeItem(key)
    }
  }
}

export { stringStorage }
