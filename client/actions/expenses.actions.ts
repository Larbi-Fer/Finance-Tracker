'use server'

import { EXPENSES_FOR_EACH_PAGE } from "@/lib/constantes";
import api from "./api";

const path = '/expenses/'

type expensesActionProps = {
  type: 'SUCCESS' | 'ERROR'
  payload: ExpenseProps[]
}

export const getExpenses = async (id: string, limit?: number, offset?: number) : Promise<expensesActionProps> => {
  try {
    console.log(id, limit, offset);
    
    const data = await api.get(`${id}${path}?limit=${limit || EXPENSES_FOR_EACH_PAGE}&offset=${offset || 0}`)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}