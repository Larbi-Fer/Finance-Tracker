'use client'
import { useEffect, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'
import { usePathname } from 'next/navigation'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  const path = usePathname()
  if (!storeRef.current) {
    storeRef.current = makeStore()  
  }

  useEffect(() => {
    ( async() => {
      if (!storeRef.current) return;
      if (storeRef.current.getState().user) return;
    } )()

  }, [storeRef.current, path])

  return <Provider store={storeRef.current}>{children}</Provider>
}