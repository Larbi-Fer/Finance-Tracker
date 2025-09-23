'use client'
import { useEffect, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'
import { setUser } from '@/lib/features/user'
import { getUserFromCookies } from '@/actions/user.actions'
import { usePathname } from 'next/navigation'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  const path = usePathname()
  // const [makedStore, setMakedStore] = useState(false)
  if (!storeRef.current) {
    storeRef.current = makeStore()  
  }

  useEffect(() => {
    ( async() => {
      if (!storeRef.current) return;
      if (storeRef.current.getState().user) return;

      const user = await getUserFromCookies()
      console.log(user);
      
      if (!user) return
      storeRef.current.dispatch(setUser(user))
    } )()
  }, [storeRef.current, path])

  return <Provider store={storeRef.current}>{children}</Provider>
}