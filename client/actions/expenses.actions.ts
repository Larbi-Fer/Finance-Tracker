'use server'

import api from "./api";

const path = '/expenses/'

type expensesActionProps = {
  type: 'SUCCESS' | 'ERROR'
  payload: ExpenseProps[]
}

export const getExpenses = async (id: string) : Promise<expensesActionProps> => {
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