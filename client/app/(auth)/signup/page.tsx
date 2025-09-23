'use client'
import { signupAction } from "@/actions/user.actions";
import { Metadata } from "next";
import { ChangeEvent, FormEvent, useState } from "react";

const Signup = () => {
  const [flds, setFlds] = useState({username: '', email: '', password: ''})

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setFlds(p => ({ ...p, [e.target.name]: e.target.value }))
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const data = await signupAction(flds.username, flds.email, flds.password)
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit} className="m-6 p-6 w-fit absolute top-[50%] left-[50%] translate-[-50%] rounded-md border-1 border-gray-100" >

      <label>username</label>
      <input type="text" name="username" onChange={onChange} value={flds.username} />
      <br />

      <label>email</label>
      <input type="email" name="email" onChange={onChange} value={flds.email} />
      <br />

      <label>password</label>
      <input type="password" name="password" onChange={onChange} value={flds.password} />

      <br />

      <button type="submit" className="bg-blue-500 text-white py-1.5 w-full rounded-2xl my-2 cursor-pointer">Sign up</button>

    </form>
  )
}

export default Signup