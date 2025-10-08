'use client'

import { useForm } from "@/lib/customHooks"
import { Input } from "../ui/input"
import {format} from 'date-fns'
import Dropdown, { DropdownListProps } from "../ui/Dropdown"
import IconPicker from "../ui/IconPicker"
import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/hooks"
import { getWallets } from "@/actions/wallets.actions"
import { getCategories } from "@/actions/categories.actions"
import { Spinner } from "../ui/spinner"
import { SheetClose, SheetFooter } from "../ui/sheet"
import { Button } from "../ui/button"
import { updateExpense } from "@/actions/expenses.actions"

type UpdateTransactionProps = {
  fields: ExpenseProps
  collapse: () => void
}

const UpdateTransaction = ({fields, collapse}: UpdateTransactionProps) => {
  const userId = useAppSelector(state => state.user?.id)!
  const [categories, setCategories] = useState<DropdownListProps>([])
  const [wallets, setWallets] = useState<WalletMainProps[]>([])

  const {flds, handleChange, loading, handleSubmit, setFlds} = useForm({...fields, icon: '⬇️'}, async(done, data) => {
    const result = await updateExpense(userId, {...data, amount: parseInt(data.amount as string)})

    if (result.type == 'ERROR') console.error(result);
    collapse()
    done()
  })

  useEffect(() => {
    (async() => {
      const categs = await getCategories(userId)
      setCategories(categs.payload.map(c => ({id: c.id, title: c.title})))
    })();

    (async() => {
      const wallets = await getWallets(userId)
      setWallets(wallets.payload)
    })();
  }, [])
  

  return (
    <form onSubmit={handleSubmit} className="h-[100%] flex flex-col">

      <div className="mx-4">
        <div className="flex gap-1">
          <IconPicker onEmojiClick={props => {
              setFlds(prev => ({...prev, icon: props.emoji}))
            }}
            className="w-[60px]"
            icon={flds.icon}
          />
          <Input className="w-full" type="text" placeholder="Title" name="title" onChange={handleChange} value={flds.title} />
        </div>

        {wallets.length ? <Dropdown
        placeholder="Choose a wallet"
          list={wallets.map(w => ({...w, title: w.name}))}
          suffix={wallet => wallet.currnecy.format.replace('{}', wallet.balance)}
          val={flds.walletId!}
          handleChange={val => setFlds(prev => ({...prev, walletId: val}))}
        /> : <div className="flex-center py-2"><Spinner className="size-6" /></div>}

        {categories.length ? <Dropdown
          placeholder="Choose a category"
          list={categories}
          val={flds.categoryId!}
          handleChange={val => setFlds(prev => ({...prev, categoryId: val}))}
        /> : <div className="flex-center py-2"><Spinner className="size-6" /></div>}

        <div className="flex">
          <div className="w-[60px] flex-center">{ flds.walletId && wallets.find(w => w.id === flds.walletId)?.currnecy.format.replace('{}', '') }</div>
          <Input type="number" placeholder="Amount" name="amount" onChange={handleChange} value={flds.amount} />
        </div>
        <Input type="date" placeholder="Date" name="date" onChange={handleChange} value={format(flds.date, 'yyyy-MM-dd')} />
      </div>

      <SheetFooter>
        <Button type="submit">Save changes</Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </form>
  )
}

export default UpdateTransaction