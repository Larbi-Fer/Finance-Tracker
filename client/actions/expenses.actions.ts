'use server'

import { EXPENSES_FOR_EACH_PAGE } from "@/lib/constantes";
import api from "./api";

const path = '/expenses/'

type expensesActionProps = {
  type: 'SUCCESS' | 'ERROR'
  payload: ExpenseProps[] | ExpenseProps
}

export const getExpenses = async (id: string, limit?: number, offset?: number) : Promise<expensesActionProps> => {
  try {
    const data = await api.get(`${id}${path}?limit=${limit || EXPENSES_FOR_EACH_PAGE}&offset=${offset || 0}`)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data as ExpenseProps[] }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}

export const createExpense = async (userId: string, expenseData: any) : Promise<expensesActionProps> => {
  try {
    const data = await api.post(`${userId}${path}`, expenseData)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data as ExpenseProps }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}

export const removeExpense = async (userId: string, expenseId: any) : Promise<expensesActionProps> => {
  try {
    const data = await api.delete(`${userId}${path}${expenseId}`)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data as ExpenseProps }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}