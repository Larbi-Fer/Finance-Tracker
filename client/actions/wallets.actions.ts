'use server'

import api from "./api";

const path = '/wallets/'

type WalletsActionProps = {
  type: 'SUCCESS' | 'ERROR'
  payload: WalletMainProps[]
}

export const getWallets = async (id: string) : Promise<WalletsActionProps> => {
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

export const createWallet = async (id: string, walletData: any): Promise<{
  type: 'SUCCESS' | 'ERROR'
  payload: WalletMainProps
}> => {
  try {
    const data = await api.post(id + path, walletData)
    if (data.error) {
      throw new Error(data.message)
    }
    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}