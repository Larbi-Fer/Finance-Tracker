'use client'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../ui/DataTable"
import { differenceInDays, formatDate, formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { getExpenses, removeExpense } from "@/actions/expenses.actions"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { EXPENSES_FOR_EACH_PAGE } from "@/lib/constantes"
import { Trash2Icon } from "lucide-react"
import ConfirmDialog from "../ui/ConfirmDialog"
import { useAppSelector } from "@/lib/hooks"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet"
import { Button } from "../ui/button"
import CreateTransaction from "../Create/CreateTransaction"
import UpdateTransaction from "../Update/UpdateTransaction"

const columns: ColumnDef<ExpenseProps>[] = [
  {
    accessorKey: 'icon',
    header: '',
  },
  {
    accessorKey: "title",
    header: "Transaction title",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({row}) => {
      const date = new Date(row.getValue('date'))
      const daysDiff = differenceInDays(new Date(), date);

      if (daysDiff > 3) return formatDate(date, 'dd MMM yyyy')
      return formatDistanceToNow(row.getValue('date'), {addSuffix: true})
    }
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({row}) => {
      const c: any = row.getValue('category')
      return <code className="bg-[#25f3] rounded-2xl py-[1px] px-2 border ">{c.title}</code>
    }
  },
  {
    accessorKey: "wallet",
    header: "Wallet",
    cell: ({row}) => {
      const w = row.getValue('wallet')
      if (typeof(w) == 'string') return w
      // @ts-ignore
      return w.name
    }
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({row}) => <b>{row.getValue('amount')}</b>
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const userId = useAppSelector(state => state.user?.id)!
      const router = useRouter()
      const expense = row.original
      
      return (
        <ConfirmDialog
          description="Once confirmed, this action cannot be undone. The payment will be permanently removed from our servers"
          onConfirm={async() => {
            console.log('delete', expense.id);
            const res = await removeExpense(userId, expense.id)
            console.log(res);
            router.refresh()
            
          }}
          continueText="Delete"
        >
          <div className="cursor-pointer text-red-700"><Trash2Icon size={20} /></div>
        </ConfirmDialog>
      )
    },
  },
]

const Transactions = ({expenses, loadMoreExpenses}: {expenses: ExpenseProps[], loadMoreExpenses?: boolean}) => {
  const id = useSelector((state: RootState) => state.user?.id)!
  const [page, setPage] = useState(1)
  const [data, setData] = useState(expenses)
  const [editable, setEditable] = useState<ExpenseProps>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    console.log('regenerate expenses');
    
    setData(expenses)
  }, [expenses])
  

  if (!loadMoreExpenses) return <DataTable columns={columns} data={data} onRowClick={row => {
      const data: any = row.original
      router.push('/expenses/' + data.id)
    }} />

  const loadMore = async () => {
    setLoading(true)

    const result = await getExpenses(id, EXPENSES_FOR_EACH_PAGE, page*EXPENSES_FOR_EACH_PAGE)
    if (result.type == 'ERROR') {
      setLoading(false)
      console.log('error', result);
    }
    setPage(prev => ++prev)
    setData(prev => prev.concat(result.payload.map(e => ({...e, amount: (e.wallet as WalletInsideExpenseProps)?.currnecy?.format.replace('{}', String(e.amount))!}))))

    setLoading(false)
  }

  return (
    <>
      <DataTable columns={columns} data={data} onLoadMore={loadMore} loading={loading}
        onRowClick={row => {
          const data: any = row.original
          delete data.category
          delete data.wallet
          setEditable({...data, amount: parseInt(data.amount.replace(/\D/g, ''))})
        }}
      />
      <Sheet open={!!editable} onOpenChange={o => setEditable(undefined)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </SheetDescription>
          </SheetHeader>
          <UpdateTransaction fields={editable!} collapse={() => {
            setEditable(undefined)
            router.refresh()
          }} />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Transactions