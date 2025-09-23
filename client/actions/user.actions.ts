'use server'
import { cookies } from "next/headers"
import api from "./api"

const path = 'auth/'

type AuthActionProps = {
  type: 'SUCCESS' | 'ERROR'
  payload: UserProps
}

export const loginAction = async (email: string, password: string) : Promise<AuthActionProps> => {
  try {
    const data = await api.post(path + 'login', { email, password })
    if (data.error) {
      console.log('error');
      throw new Error(data.message)
      // throw new Error(CODES.AUTH[data.message as AuthCodeProps])
    }

    await setUserCookie(data)
    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}

export const signupAction = async (username: string, email: string, password: string) : Promise<AuthActionProps> => {
  try {
    const data = await api.post(path + 'signup', { username, email, password })
    console.log(data);
    if (data.error) {
      console.log('error');
      // throw new Error(CODES.AUTH[data.message as AuthCodeProps])
    }
    return { type: 'SUCCESS', payload: data }
  } catch (error: any) {
    return { type: 'ERROR', payload: error.message}
  }
}

export async function setUserCookie(user: UserProps) {
  'use server'
  const c = await cookies()
  
  c.set('user', JSON.stringify(user))
  c.set('userId', user.id)
}

export async function getUserFromCookies() {
  const user = (await cookies()).get('user')?.value
  
  if(!user) return

  return JSON.parse(user) as UserProps
}