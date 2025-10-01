'use client'

import { useForm } from "@/lib/customHooks"
import { useState } from "react"
import { Input } from "../ui/input"
import {format} from 'date-fns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { createExpense } from "@/actions/expenses.actions"
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"
import { cn } from "@/lib/utils"
import { createIncome } from "@/actions/incomes.actions"

const fields = {title: '', icon: '', amount: '', date: format(new Date(), 'yyyy-MM-dd'), categoryId: '', walletId: '', sourceId: ''}

type DropdownListProps = {id: string, title: string, [key: string]: any}[]

type CreateTransactionProps = {
  userId: string
  categories: DropdownListProps,
  wallets: WalletMainProps[],
  sources: SourceProps[]
}

const CreateTransaction = ({userId, categories, wallets, sources}: CreateTransactionProps) => {

  const [type, setType] = useState<'Income' | 'Expense'>('Expense')
  const {flds, handleChange, loading, handleSubmit, setFlds} = useForm(fields, async(done, data) => {
    let result;
    if (type == 'Expense') result = await createExpense(userId, {...data, amount: parseInt(data.amount)})
    else result = await createIncome(userId, {...data, amount: parseInt(data.amount)})

    if (result.type == 'ERROR') console.error(result);
    done()
  })

  return (
    <form onSubmit={handleSubmit} className="max-w-[500px] m-auto mt-7">

      <div>
        <button
          onClick={() => setType(prev => 'Income')}
          type="button"
          className={'rounded-e-[0] border w-1/2' + (type == 'Income' ? '' : ' bg-transparent text-muted-foreground')}
        >Income</button>
        <button
          onClick={() => setType(prev => 'Expense')}
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

const Dropdown = ({ list, val, handleChange, suffix, placeholder }: {list: DropdownListProps, val: string, handleChange: (val: string) => void, suffix?: (item: any) => string, placeholder: string}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={"w-full my-2 text-start" + (val ? '' : ' text-muted-foreground')}>{val ? list.find(v => v.id == val)?.title : placeholder}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
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

const IconPicker = ({icon, className, onEmojiClick}: {icon: string, className?: string, onEmojiClick: (props: EmojiClickData) => void}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("p-1 my-2 text-center", className)}>{icon || 'Icon'}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <div>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CreateTransaction