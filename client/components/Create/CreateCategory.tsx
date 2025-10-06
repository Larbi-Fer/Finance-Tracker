'use client'

import { useForm } from "@/lib/customHooks"
import IconPicker from "../ui/IconPicker"
import { Input } from "../ui/input"
import { useEffect } from "react"
import { createCategory } from "@/actions/categories.actions"
import { useAppSelector } from "@/lib/hooks"

const fields = {title: '', icon: '💳', budget: []}

const CreateCategory = ({budget, exit}: {budget: BudgetProps[], exit: () => void}) => {
  const userId = useAppSelector(state => state.user?.id)!
  const {flds, handleChange, loading, handleSubmit, setFlds} = useForm({...fields, budget}, async(done, data) => {
    const res = await createCategory(userId, {...data, budget: data.budget.map(b => ({ currencyId: b.currencyId, amount: b.amount }))})
    if (res.type == 'ERROR') console.error(res);
    done()
  })

  return (
    <form onSubmit={handleSubmit} className="p-2">
      
      <div className="flex gap-1">
        <IconPicker onEmojiClick={props => {
            setFlds(prev => ({...prev, icon: props.emoji}))
          }}
          className="w-[60px]"
          icon={flds.icon}
        />
        <Input type="text" placeholder="Category name" name="title" onChange={handleChange} value={flds.title} autoFocus required />
      </div>

      {flds.budget.map((b, i) => (
        <div key={b.currencyId} className="flex">
          <div className="w-[60px] flex-center">{b.currency.format.replace('{}', '')}</div>
          <Input type="number" placeholder="Amount" onChange={e => {
            let amount = parseInt(e.target.value) || 0
            if (amount < 0) amount *= -1
            setFlds(prev => {
              const newBudget = [...prev.budget]
              newBudget[i] = { ...newBudget[i], amount }
              return { ...prev, budget: newBudget }
            })
          }} value={b.amount} />
        </div>
      ))}

      <div className="flex justify-end gap-4 pt-2">
        <button type="button" onClick={exit}>Cancel</button>
        <button type="submit">Create</button>
      </div>

    </form>
  )
}

export default CreateCategory