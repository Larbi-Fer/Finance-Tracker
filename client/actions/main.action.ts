'use server'
import api from "./api"

const path = 'home/'

type HomeActionProps = {
  type: 'SUCCESS' | 'ERROR'
  payload: WalletAndTotalDataProps
}


export const GetHomeDataAction = async (userId: string) : Promise<HomeActionProps> => {
  try {
    const data = await api.get(path + 'main-data/' + userId)
    if (data.error) {
      console.log('error');
      throw new Error(data.message)
    }

    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}