'use client'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../ui/DataTable"
import { differenceInDays, formatDate, formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { getExpenses } from "@/actions/expenses.actions"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { EXPENSES_FOR_EACH_PAGE } from "@/lib/constantes"

const columns: ColumnDef<ExpenseProps>[] = [
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
]

const Transactions = ({expenses, loadMoreExpenses}: {expenses: ExpenseProps[], loadMoreExpenses?: boolean}) => {
  const id = useSelector((state: RootState) => state.user?.id)!
  const [page, setPage] = useState(1)
  const [data, setData] = useState(expenses)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
    <DataTable columns={columns} data={data} onRowClick={row => {
      const data: any = row.original
      router.push('/expenses/' + data.id)
    }} onLoadMore={loadMore} loading={loading} />
  )
}

export default Transactions