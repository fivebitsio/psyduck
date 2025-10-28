;(() => {
  let config
  let isInit = false
  let eventID = null
  let startTime = null
  let totalDuration = 0
  let hasBeaconSent = false

  function getEventID() {
    if (!eventID) {
      eventID = crypto.randomUUID()
    }
    return eventID
  }

  function getUtmParams() {
    const p = {}
    const u = new URLSearchParams(location.search)
    const utmParams = [
      'utm_id',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term'
    ]
    utmParams.forEach(k => {
      const v = u.get(k)
      if (v) p[k.replace('utm_', '')] = v
    })
    return p
  }

  function getBrowser() {
    const ua = navigator.userAgent
    if (ua.includes('Chrome')) return 'chrome'
    if (ua.includes('Firefox')) return 'firefox'
    if (ua.includes('Safari')) return 'safari'
    if (ua.includes('Edge')) return 'edge'
    return 'Unknown'
  }

  function getOs() {
    const ua = navigator.userAgent
    if (ua.includes('Windows')) return 'windows'
    if (ua.includes('Mac OS')) return 'mac'
    if (ua.includes('Linux')) return 'linux'
    if (ua.includes('Android')) return 'android'
    if (ua.includes('iOS')) return 'ios'
    return 'Unknown'
  }

  function getDeviceType() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isWideScreen = window.innerWidth >= 1024
    if (isTouch && !isWideScreen) return 'mobile'
    if (isTouch && isWideScreen) return 'tablet'
    return 'desktop'
  }

  function sendFinalBeacon() {
    if (hasBeaconSent) return
    hasBeaconSent = true

    if (startTime) {
      totalDuration += Date.now() - startTime
    }
    const payload = { duration: totalDuration }
    navigator.sendBeacon(`${config.domain}/events/${getEventID()}`, JSON.stringify(payload))
  }

  function track(type, data = {}) {
    if (!isInit) return false
    const utm = getUtmParams()
    const payload = {
      browser: getBrowser(),
      deviceType: getDeviceType(),
      eventType: type,
      hostname: location.hostname,
      os: getOs(),
      pathname: location.pathname,
      referrer: document.referrer,
      eventID: getEventID(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      utmID: utm.id || '',
      utmSource: utm.source || '',
      utmMedium: utm.medium || '',
      utmCampaign: utm.campaign || '',
      utmContent: utm.content || '',
      utmTerm: utm.term || ''
    }
    if (type !== 'page-view') {
      payload.customData = data.customData || {}
    }

    fetch(`${config.domain}/events`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  function init(cfg) {
    if (!cfg.domain || isInit) return
    config = cfg
    isInit = true
    startTime = Date.now()
    track('page-view')

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (startTime) {
          totalDuration += Date.now() - startTime
          startTime = null
        }
        sendFinalBeacon()
      } else if (document.visibilityState === 'visible') {
        startTime = Date.now()
      }
    })

    window.addEventListener('pagehide', sendFinalBeacon)
    window.addEventListener('beforeunload', sendFinalBeacon)

    document.addEventListener('unload', destroy)
  }

  function destroy() {
    isInit = false
    eventID = null
  }

  function autoInit() {
    const script = document.currentScript || document.querySelector('script[src*="track"]')
    if (script && script.dataset.domain) {
      init({ domain: script.dataset.domain })
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit)
  } else {
    autoInit()
  }

  window.Track = { init, track, destroy }
})()
