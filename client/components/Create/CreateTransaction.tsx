'use client'

import { useForm } from "@/lib/customHooks"
import { useState } from "react"
import { Input } from "../ui/input"
import {format} from 'date-fns'
import { createExpense } from "@/actions/expenses.actions"
import { createIncome } from "@/actions/incomes.actions"
import Dropdown, { DropdownListProps } from "../ui/Dropdown"
import IconPicker from "../ui/IconPicker"
import { useSearchParams } from "next/navigation"

const fields = {title: '', icon: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'), categoryId: '', walletId: '', sourceId: ''}

type CreateTransactionProps = {
  userId: string
  categories: DropdownListProps,
  wallets: WalletMainProps[],
  sources: SourceProps[]
}

const CreateTransaction = ({userId, categories, wallets, sources}: CreateTransactionProps) => {

  const params = useSearchParams()
  const [type, setType] = useState<'Income' | 'Expense'>(params.get('type') == 'income' ? 'Income' : 'Expense')
  const {flds, handleChange, loading, handleSubmit, setFlds} = useForm({...fields, icon: type == 'Expense' ? '⬇️' : '⬆️'}, async(done, data) => {
    let result;
    console.log(data);
    
    if (type == 'Expense') result = await createExpense(userId, {...data, amount: parseInt(data.amount)})
    else result = await createIncome(userId, {...data, amount: parseInt(data.amount)})

    if (result.type == 'ERROR') console.error(result);
    done()
  })

  return (
    <form onSubmit={handleSubmit} className="max-w-[500px] m-auto mt-7">

      <div className="mb-4">
        <button
          onClick={() => {
            setType(prev => 'Income')
            setFlds(prev => ({...prev, icon: '⬆️'}))
          }}
          type="button"
          className={'rounded-e-[0] border w-1/2' + (type == 'Income' ? '' : ' bg-transparent text-muted-foreground')}
        >Income</button>
        <button
          onClick={() => {
            setType(prev => 'Expense')
            setFlds(prev => ({...prev, icon: '⬇️'}))
          }}
          type="button"
          className={'rounded-s-[0] border w-1/2' + (type == 'Expense' ? '' : ' bg-transparent text-muted-foreground')}
        >Expense</button>
      </div>

      {type == 'Expense' ?
        <>
          {/* Create Expense */}
          <div className="flex gap-1">
            <IconPicker onEmojiClick={props => {
                setFlds(prev => ({...prev, icon: props.emoji}))
              }}
              className="w-[60px]"
              icon={flds.icon}
            />
            <Input className="w-full" type="text" placeholder="Title" name="title" onChange={handleChange} value={flds.title} />
          </div>

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
        </> :
        <>
          {/* Create Income */}
          <div className="flex gap-1">
            <IconPicker onEmojiClick={props => {
                setFlds(prev => ({...prev, icon: props.emoji}))
              }}
              className="w-[60px]"
              icon={flds.icon}
            />
            <Dropdown
              placeholder="Choose a source"
              list={sources}
              suffix={(item: SourceProps) => item.currency.format.replace('{}', '')}
              val={flds.sourceId}
              handleChange={val => setFlds(prev => ({...prev, sourceId: val, walletId: ''}))}
            />
          </div>

          {sources.find(s => s.id == flds.sourceId)?.title == 'Other' &&
            <Input className="w-full" type="text" placeholder="Title" name="title" onChange={handleChange} value={flds.title} />
          }
          <Dropdown
          placeholder="Choose a wallet"
            list={wallets.filter(w => w.currnecy.format == sources.find(s => s.id == flds.sourceId)?.currency.format).map(w => ({...w, title: w.name}))}
            suffix={wallet => wallet.currnecy.format.replace('{}', wallet.balance)}
            val={flds.walletId}
            handleChange={val => setFlds(prev => ({...prev, walletId: val}))}
          />
        </>
      }

      <div className="flex">
        <div className="w-[60px] flex-center">{ flds.walletId && wallets.find(w => w.id === flds.walletId)?.currnecy.format.replace('{}', '') }</div>
        <Input type="number" placeholder="Amount" name="amount" onChange={handleChange} value={flds.amount} />
      </div>
      <Input type="date" placeholder="Date" name="date" onChange={handleChange} value={flds.date} />

      <button>Create</button>
    </form>
  )
}

export default CreateTransaction