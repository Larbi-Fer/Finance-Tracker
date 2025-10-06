'use server'

import { EXPENSES_FOR_EACH_PAGE } from "@/lib/constantes";
import api from "./api";

const path = '/sources/'

type SourcesActionProps = {
  type: 'SUCCESS' | 'ERROR'
  payload: SourceProps[]
}

export const getSources = async (id: string) : Promise<SourcesActionProps> => {
  try {
    const data = await api.get(`${id}${path}`)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}

export const createSource = async (id: string, sourceData: any): Promise<{
  type: 'SUCCESS' | 'ERROR'
  payload: SourceProps
}> => {
  try {
    const data = await api.post(id + path, sourceData)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}