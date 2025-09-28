'use server'

import api from "./api";

const path = '/categories/'

type CategoriesActionProps = {
  type: 'SUCCESS' | 'ERROR'
  payload: CategoryProps[]
}

export const getCategories = async (id: string) : Promise<CategoriesActionProps> => {
  try {
    const data = await api.get(id + path)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}