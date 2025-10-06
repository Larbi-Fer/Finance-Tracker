'use server'

import { EXPENSES_FOR_EACH_PAGE } from "@/lib/constantes";
import api from "./api";

export const getCurrencies = async () : Promise<{
  type: 'SUCCESS' | 'ERROR'
  payload: CurrencyProps[]
}> => {
  try {
    const data = await api.get('currencies')
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}

export const getUserCurrencies = async (userId: string) : Promise<{
  type: 'SUCCESS' | 'ERROR'
  payload: CurrencyProps[]
}> => {
  try {
    const data = await api.get('currencies/' + userId)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}