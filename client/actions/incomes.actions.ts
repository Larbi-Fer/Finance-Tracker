'use server'

import { INCOMES_FOR_EACH_PAGE } from "@/lib/constantes";
import api from "./api";

const path = '/incomes/'

type IncomesActionProps = {
  type: 'SUCCESS' | 'ERROR'
  payload: IncomeProps[] | IncomeProps
}

export const getIncomes = async (id: string, limit?: number, offset?: number) : Promise<IncomesActionProps> => {
  try {
    const data = await api.get(`${id}${path}?limit=${limit || INCOMES_FOR_EACH_PAGE}&offset=${offset || 0}`)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}

export const createIncome = async (userId: string, incomeData: any) : Promise<IncomesActionProps> => {
  try {
    const data = await api.post(`${userId}${path}`, incomeData)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data as IncomeProps }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}