'use client'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../ui/DataTable"
import { differenceInDays, formatDate, formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

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

const Transactions = ({data}: {data: ExpenseProps[]}) => {
  const router = useRouter()

  return (
    <DataTable columns={columns} data={data} onRowClick={row => {
      const data: any = row.original
      router.push('/expenses/' + data.id)
    }} />
  )
}

export default Transactions