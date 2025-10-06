'use client'

import { useForm } from "@/lib/customHooks"
import { useAppSelector } from "@/lib/hooks"
import IconPicker from "../ui/IconPicker"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { getUserCurrencies } from "@/actions/other.actions"
import Dropdown from "../ui/Dropdown"
import { Spinner } from "../ui/spinner"
import { createSource } from "@/actions/sources.actions"

const fields = {title: '', icon: '💸', currencyId: ''}

const CreateSource = ({exit}: {exit: () => void}) => {
  const userId = useAppSelector(state => state.user?.id)!
  const {flds, handleChange, loading, handleSubmit, setFlds} = useForm(fields, async(done, data) => {
    const res = await createSource(userId, data)
    console.log(res);
    if (res.type == 'ERROR') console.error(res);
    done()
  })

  const [currencies, setCurrencies] = useState<CurrencyProps[]>([])

  useEffect(() => {
    (async() => {
      const curs = await getUserCurrencies(userId)
      setCurrencies(curs.payload)
    })()
  }, [])
  

  return (
    <form className="p-2" onSubmit={handleSubmit}>
      <div className="flex gap-1">
        <IconPicker onEmojiClick={props => {
            setFlds(prev => ({...prev, icon: props.emoji}))
          }}
          className="w-[60px]"
          icon={flds.icon}
        />
        <Input type="text" placeholder="Source name" name="title" onChange={handleChange} value={flds.title} autoFocus required />
      </div>

      {currencies.length ? <Dropdown
        placeholder="Choose a currency"
        list={currencies.map(c => ({id: c.id, title: c.name, format: c.format}))}
        suffix={(item: CurrencyProps) => item.format.replace('{}', '')}
        val={flds.currencyId}
        handleChange={val => setFlds(prev => ({...prev, currencyId: val}))}
      /> : <div className="flex-center py-2"><Spinner className="size-6" /></div>}

      <div className="flex justify-end gap-4 pt-3">
        <button type="button" onClick={exit}>Cancel</button>
        <button type="submit">Create</button>
      </div>

    </form>
  )
}

export default CreateSource