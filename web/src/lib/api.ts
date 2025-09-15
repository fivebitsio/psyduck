type HTTPMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'
const BASE_URL = 'http://localhost:1323/'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

// error json data from api
interface APIError {
  error: string
  message: string
}

interface HTTPError extends Error {
  apiMessage: string
  type: 'http-error'
}

const newHttpError = (errData: APIError) => {
  const err = new Error(errData.error) as HTTPError
  err.apiMessage = errData.message
  err.type = 'http-error'
  return err
}

interface ApiOptions<T> {
  method?: HTTPMethod
  url: string
  body?: T
  additionalHeaders?: { [k: string]: string }
  internalApi?: boolean
}

const api = async <T, K>({
  method = 'POST',
  url,
  body,
  additionalHeaders,
  internalApi = true,
}: ApiOptions<T>) => {
  const headers = { ...defaultHeaders, ...(additionalHeaders || {}) } as {
    [k: string]: string
  }

  if (typeof document !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token && internalApi) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const apiUrl = internalApi ? BASE_URL + url : url

  const response = await fetch(apiUrl, {
    headers,
    method,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (response.status === 204) {
    // please ensure that K is undefined for this case
    return undefined as K
  } else if (response.status >= 400) {
    const errData = (await response.json()) as APIError
    const err = newHttpError(errData)
    throw err
  } else {
    // handle success
    return response.json() as K
  }
}

export default api
