export function useApi() {
  const { data, error, pending, refresh } = useFetch

  async function get(url, params) {
    try {
      const result = await $fetch(`/api${url}`, { method: 'GET', params })
      return result
    } catch (err) {
      throw err
    }
  }

  async function post(url, body) {
    try {
      const result = await $fetch(`/api${url}`, { method: 'POST', body })
      return result
    } catch (err) {
      throw err
    }
  }

  return { get, post }
}

export function useAdminApi() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : ''

  async function request(url, options = {}) {
    const headers = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    try {
      return await $fetch(`/api/admin${url}`, {
        ...options,
        headers: { ...headers, ...options.headers }
      })
    } catch (err) {
      if (err.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token')
          localStorage.removeItem('admin_username')
          navigateTo('/admin/login')
        }
      }
      throw err
    }
  }

  return {
    get: (url, params) => request(url, { method: 'GET', params }),
    post: (url, body) => request(url, { method: 'POST', body }),
    put: (url, body) => request(url, { method: 'PUT', body }),
    del: (url) => request(url, { method: 'DELETE' })
  }
}
