;(function () {
  let K,
    G = !1,
    H = null,
    q = null,
    J = 0,
    M = !1
  function N() {
    if (!H) H = crypto.randomUUID()
    return H
  }
  function X() {
    let j = {},
      x = new URLSearchParams(location.search)
    return (
      [
        'utm_id',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
      ].forEach((C) => {
        let V = x.get(C)
        if (V) j[C.replace('utm_', '')] = V
      }),
      j
    )
  }
  function Y() {
    let j = navigator.userAgent
    if (j.includes('Chrome')) return 'chrome'
    if (j.includes('Firefox')) return 'firefox'
    if (j.includes('Safari')) return 'safari'
    if (j.includes('Edge')) return 'edge'
    return 'Unknown'
  }
  function Z() {
    let j = navigator.userAgent
    if (j.includes('Windows')) return 'windows'
    if (j.includes('Mac OS')) return 'mac'
    if (j.includes('Linux')) return 'linux'
    if (j.includes('Android')) return 'android'
    if (j.includes('iOS')) return 'ios'
    return 'Unknown'
  }
  function _() {
    let j = 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      x = window.innerWidth >= 1024
    if (j && !x) return 'mobile'
    if (j && x) return 'tablet'
    return 'desktop'
  }
  function L() {
    if (M) return
    if (((M = !0), q)) J += Date.now() - q
    let j = { duration: J }
    navigator.sendBeacon(`${K.domain}/events/${N()}`, JSON.stringify(j))
  }
  function Q(j, x = {}) {
    if (!G) return !1
    let z = X(),
      C = {
        browser: Y(),
        deviceType: _(),
        eventType: j,
        hostname: location.hostname,
        os: Z(),
        pathname: location.pathname,
        referrer: document.referrer,
        eventID: N(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        utmID: z.id || '',
        utmSource: z.source || '',
        utmMedium: z.medium || '',
        utmCampaign: z.campaign || '',
        utmContent: z.content || '',
        utmTerm: z.term || '',
      }
    if (j === 'page-view');
    else C.customData = x.customData || {}
    fetch(`${K.domain}/events`, { method: 'POST', body: JSON.stringify(C) })
  }
  function $(j) {
    if (!j.domain || G) return
    ;(K = j),
      (G = !0),
      (q = Date.now()),
      Q('page-view'),
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          if (q) (J += Date.now() - q), (q = null)
          let x = { duration: J }
          L()
        } else if (document.visibilityState === 'visible') q = Date.now()
      }),
      window.addEventListener('pagehide', L),
      window.addEventListener('beforeunload', L),
      document.addEventListener('unload', R)
  }
  function R() {
    ;(G = !1), (H = null)
  }
  window.Track = { init: $, track: Q, destroy: R }
})()
