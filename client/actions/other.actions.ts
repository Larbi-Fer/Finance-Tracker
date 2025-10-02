'use server'

import { EXPENSES_FOR_EACH_PAGE } from "@/lib/constantes";
import api from "./api";

const path = 'currencies'

export const getCurrencies = async () : Promise<{
  type: 'SUCCESS' | 'ERROR'
  payload: CurrencyProps[]
}> => {
  try {
    const data = await api.get(path)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}