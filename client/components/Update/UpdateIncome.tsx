'use client'
import { useForm } from "@/lib/customHooks"
import Dropdown from "../ui/Dropdown"
import IconPicker from "../ui/IconPicker"
import { useEffect, useState } from "react"
import { getSources } from "@/actions/sources.actions"
import { useAppSelector } from "@/lib/hooks"
import { getWallets } from "@/actions/wallets.actions"
import { Spinner } from "../ui/spinner"
import { Input } from "../ui/input"
import { SheetClose, SheetFooter } from "../ui/sheet"
import { Button } from "../ui/button"
import { updateIncome } from "@/actions/incomes.actions"
import { format } from "date-fns"

type UpdateIncomeProps = {
  fields: IncomeProps
  collapse: () => void
}

const UpdateIncome = ({fields, collapse}: UpdateIncomeProps) => {
  const userId = useAppSelector(state => state.user?.id)!
  const {flds, handleChange, loading, handleSubmit, setFlds} = useForm(fields, async(done, data) => {
    const result = await updateIncome(userId, {...data, amount: parseInt(data.amount as string)})
    
    if (result.type == 'ERROR') console.error(result);
    collapse()
    done()
  })
  const [sources, setSources] = useState<SourceProps[]>([])
  const [wallets, setWallets] = useState<WalletMainProps[]>([])

  useEffect(() => {
    (async() => {
      const sources = await getSources(userId)
      
      setSources(sources.payload)
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
          icon={flds.icon!}
        />
        {sources.length ?
        <Dropdown
          placeholder="Choose a source"
          list={sources}
          suffix={(item: SourceProps) => item.currency.format.replace('{}', '')}
          val={flds.sourceId}
          handleChange={val => setFlds(prev => ({...prev, sourceId: val, walletId: ''}))}
          /> : <div className="flex-center py-2"><Spinner className="size-6" /></div>}
      </div>

      {sources.find(s => s.id == flds.sourceId)?.title == 'Other' &&
        <Input className="w-full" type="text" placeholder="Title" name="title" onChange={handleChange} value={flds.title} />
      }
      {wallets.length ?
        <Dropdown
          placeholder="Choose a wallet"
          list={wallets.filter(w => w.currnecy.format == sources.find(s => s.id == flds.sourceId)?.currency.format)?.map(w => ({...w, title: w.name}))}
          suffix={wallet => wallet.currnecy.format.replace('{}', wallet.balance)}
          val={flds.walletId}
          handleChange={val => setFlds(prev => ({...prev, walletId: val}))}
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

export default UpdateIncome