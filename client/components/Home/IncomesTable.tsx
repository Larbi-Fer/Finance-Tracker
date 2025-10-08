'use client'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../ui/DataTable"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { RootState } from "@/lib/store"
import { getIncomes, removeIncome } from "@/actions/incomes.actions"
import { INCOMES_FOR_EACH_PAGE } from "@/lib/constantes"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import UpdateTransaction from "../Update/UpdateTransaction"
import UpdateIncome from "../Update/UpdateIncome"
import ConfirmDialog from "../ui/ConfirmDialog"
import { Trash2Icon } from "lucide-react"
import { useAppSelector } from "@/lib/hooks"

const columns: ColumnDef<IncomeProps>[] = [
  {
    accessorKey: 'icon',
    header: '',
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const inc = row.original
      return inc.source.title == 'Other' ? inc.title : inc.source.title
    }
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => formatDistanceToNow(row.getValue('date'), { addSuffix: true })
  },
  {
    accessorKey: "wallet",
    header: "Wallet",
    cell: ({ row }) => {
      const w = row.getValue('wallet')
      if (typeof (w) == 'string') return w
      // @ts-ignore
      return w.name
    }
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableColumnFilter: true,
    cell: ({ row }) => <b>{row.getValue('amount')}</b>
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const userId = useAppSelector(state => state.user?.id)!
      const router = useRouter()
      const income = row.original

      return (
        <ConfirmDialog
          description="Once confirmed, this action cannot be undone. The payment will be permanently removed from our servers"
          onConfirm={async() => {
            console.log('delete', income.id);
            const res = await removeIncome(userId, income.id)
            router.refresh()
          }}
          continueText="Delete"
        >
          <div className="cursor-pointer text-red-700"><Trash2Icon size={20} /></div>
        </ConfirmDialog>
      )
    },
  }
]

const IncomesTable = ({ data: incomes, loadMoreIncomes }: { data: IncomeProps[], loadMoreIncomes?: boolean }) => {
  const id = useSelector((state: RootState) => state.user?.id)!
  const [page, setPage] = useState(1)
  const [data, setData] = useState(incomes)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [editable, setEditable] = useState<IncomeProps>()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    setData(incomes)
  }, [incomes])

  if (!loadMoreIncomes) return <DataTable columns={columns} data={incomes} onRowClick={row => {
    const data: any = row.original
    router.push('/incomes/' + data.id)
  }} />

  if (!loadMoreIncomes) return <DataTable columns={columns} data={incomes} onRowClick={row => {
    const data: any = row.original
    router.push('/expenses/' + data.id)
  }} />

  const loadMore = async () => {
    setLoading(true)

    const result = await getIncomes(id, INCOMES_FOR_EACH_PAGE, page * INCOMES_FOR_EACH_PAGE)

    if (result.type == 'ERROR') {
      setLoading(false)
      console.log('error', result);
    }
    setPage(prev => ++prev)
    setData(prev => prev.concat(result.payload.map(e => ({ ...e, amount: (e.wallet as WalletInsideExpenseProps)?.currnecy?.format.replace('{}', String(e.amount))! }))))

    setLoading(false)
  }

  return (
    <>
      <DataTable columns={columns} data={data} onRowClick={row => {
        const data: any = {...row.original}
        delete data.source
        delete data.wallet
        setEditable({...data, amount: parseInt(data.amount.replace(/\D/g, ''))})
      }} onLoadMore={loadMore} loading={loading} />
      <Sheet open={!!editable} onOpenChange={o => setEditable(undefined)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </SheetDescription>
          </SheetHeader>
          <UpdateIncome fields={editable!} collapse={() => {
            setEditable(undefined)
            router.refresh()
          }} />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default IncomesTable