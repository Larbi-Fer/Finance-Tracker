'use client'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../ui/DataTable"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

const columns: ColumnDef<IncomeProps & {wallet: string}>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({row}) => {
      const inc = row.original
      return inc.source.title == 'Other' ? inc.title : inc.source.title
    }
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({row}) => formatDistanceToNow(row.getValue('date'), {addSuffix: true})
  },
  {
    accessorKey: "wallet",
    header: "Wallet",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableColumnFilter: true,
    cell: ({row}) => <b>{row.getValue('amount')}</b>
  },
]

const IncomesTable = ({data}: {data: (IncomeProps & {wallet: string})[]}) => {
  const router = useRouter()

  return (
    <div>
      <DataTable columns={columns} data={data} onRowClick={row => {
        const data: any = row.original
        router.push('/incomes/' + data.id)
      }} />
    </div>
  )
}

export default IncomesTable