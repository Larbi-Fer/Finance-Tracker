'use client'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../ui/DataTable"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { useState } from "react"
import { RootState } from "@/lib/store"
import { getIncomes } from "@/actions/incomes.actions"
import { INCOMES_FOR_EACH_PAGE } from "@/lib/constantes"

const columns: ColumnDef<IncomeProps>[] = [
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
]

const IncomesTable = ({ data: incomes, loadMoreIncomes }: { data: IncomeProps[], loadMoreIncomes?: boolean }) => {
    const id = useSelector((state: RootState) => state.user?.id)!
  const [page, setPage] = useState(1)
  const [data, setData] = useState(incomes)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

    const result = await getIncomes(id, INCOMES_FOR_EACH_PAGE, page*INCOMES_FOR_EACH_PAGE)
    console.log(result);
    
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
        router.push('/incomes/' + data.id)
      }} onLoadMore={loadMore} loading={loading} />
  )
}

export default IncomesTable