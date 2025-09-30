'use client'

import { useForm } from "@/lib/customHooks"
import { useState } from "react"
import { Input } from "../ui/input"
import {format} from 'date-fns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { createExpense } from "@/actions/expenses.actions"

const fields = {title: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'), categoryId: '', walletId: ''}

type DropdownListProps = {id: string, title: string, [key: string]: any}[]

const CreateTransaction = ({userId, categories, wallets}: {categories: DropdownListProps, wallets: WalletMainProps[], userId: string}) => {

  const [type, setType] = useState<'Income' | 'Expense'>('Expense')
  const {flds, handleChange, loading, handleSubmit, setFlds} = useForm(fields, async(done, data) => {
    const result = await createExpense(userId, {...data, amount: parseInt(data.amount)})
    if (result.type == 'ERROR') console.error(result);
    done()
  })

  return (
    <form onSubmit={handleSubmit} className="max-w-[500px] m-auto mt-7">
      <Input type="text" placeholder="Title" name="title" onChange={handleChange} value={flds.title} />

      <Dropdown
      placeholder="Choose a wallet"
        list={wallets.map(w => ({...w, title: w.name}))}
        suffix={wallet => wallet.currnecy.format.replace('{}', wallet.balance)}
        val={flds.walletId}
        handleChange={val => setFlds(prev => ({...prev, walletId: val}))}
      />
      <Dropdown
        placeholder="Choose a category"
        list={categories}
        val={flds.categoryId}
        handleChange={val => setFlds(prev => ({...prev, categoryId: val}))}
      />

      <div className="flex">
        <div className="w-1/6 flex-center">{ flds.walletId && wallets.find(w => w.id === flds.walletId)?.currnecy.format.replace('{}', '') }</div>
        <Input type="number" placeholder="Amount" name="amount" onChange={handleChange} value={flds.amount} />
      </div>
      <Input type="date" placeholder="Date" name="date" onChange={handleChange} value={flds.date} />


      <button>Create</button>
    </form>
  )
}

const Dropdown = ({ list, val, handleChange, suffix, placeholder }: {list: DropdownListProps, val: string, handleChange: (val: string) => void, suffix?: (item: any) => string, placeholder: string}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full my-2 text-start">{val ? list.find(v => v.id == val)?.title : placeholder}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={val} onValueChange={handleChange}>
          {list.map(item => (
            <DropdownMenuRadioItem key={item.id} value={item.id} className="flex justify-between">
              <div>{item.title}</div>
              {suffix && <div>{suffix(item)}</div>}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CreateTransaction