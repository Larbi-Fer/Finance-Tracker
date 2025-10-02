'use client'

import { useForm } from "@/lib/customHooks"
import { Input } from "../ui/input"
import Dropdown, { DropdownListProps } from "../ui/Dropdown"
import IconPicker from "../ui/IconPicker"
import { useSearchParams } from "next/navigation"
import { createWallet } from "@/actions/wallets.actions"

const fields = {name: '', currencyId: '', icon: ''}

type CreateTransactionProps = {
  userId: string
  currencies: CurrencyProps[]
}

const CreateWallet = ({userId, currencies}: CreateTransactionProps) => {

  const params = useSearchParams()
  const {flds, handleChange, loading, handleSubmit, setFlds} = useForm(fields, async(done, data) => {
    const res = await createWallet(userId, data)
    if (res.type == 'ERROR') console.error(res);

    done()
  })

  return (
    <form onSubmit={handleSubmit} className="max-w-[500px] m-auto mt-7">
      <h1 className="text-3xl text-center mb-4">Create a wallet</h1>

      <div className="flex gap-1">
        <IconPicker onEmojiClick={props => {
            setFlds(prev => ({...prev, icon: props.emoji}))
          }}
          className="w-[60px]"
          icon={flds.icon}
        />
        <Input type="text" placeholder="Wallet name" name="name" onChange={handleChange} value={flds.name} />
      </div>

      <Dropdown
        placeholder="Choose a currency"
        list={currencies.map(c => ({id: c.id, title: c.name, format: c.format}))}
        suffix={(item: CurrencyProps) => item.format.replace('{}', '')}
        val={flds.currencyId}
        handleChange={val => setFlds(prev => ({...prev, currencyId: val}))}
      />

      <button className="w-full mt-4">Create</button>
    </form>
  )
}

export default CreateWallet