import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

const AuthLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const userId = (await cookies()).get('userId');
  if (userId) return redirect('/home');
  return (
    <div>
      {children}
    </div>
  )
}

export default AuthLayout