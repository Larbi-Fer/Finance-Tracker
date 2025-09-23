const newfetch = async(path: string, method: string, data?: any) => {
  return await fetch(process.env.URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: data ? JSON.stringify(data) : null
  })
}

export default {
  get: async(path: string) => (await newfetch(path, 'GET')).json(),
  post: async (path: string, data?: any) => (await newfetch(path, 'POST', data)).json(),
  put: async (path: string, data?: any) => (await newfetch(path, 'PUT', data)).json(),
  patch: async (path: string, data?: any) => (await newfetch(path, 'PATCH', data)).json(),
  delete: async (path: string, data?: any) => (await newfetch(path, 'DELETE', data)).json()
}