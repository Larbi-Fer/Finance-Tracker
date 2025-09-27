'use client'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../ui/DataTable"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

const columns: ColumnDef<ExpenseProps & {wallet: string}>[] = [
  {
    accessorKey: "title",
    header: "Transaction title",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({row}) => formatDistanceToNow(row.getValue('date'), {addSuffix: true})
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
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({row}) => <b>{row.getValue('amount')}</b>
  },
]

const Transactions = ({data}: {data: (ExpenseProps & {wallet: string})[]}) => {
  const router = useRouter()

  return (
    <div>
      <DataTable columns={columns} data={data} onRowClick={row => {
        const data: any = row.original
        router.push('/expenses/' + data.id)
      }} />
    </div>
  )
}

export default Transactions