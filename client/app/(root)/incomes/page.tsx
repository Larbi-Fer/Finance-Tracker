import { getIncomes } from "@/actions/incomes.actions"
import { getSources } from "@/actions/sources.actions"
import IncomesTable from "@/components/Home/IncomesTable"
import Sources from "@/components/Incomes/Sources"
import { cookies } from "next/headers"
import Link from "next/link"

const IncomesPage = async () => {
  const id = (await cookies()).get('userId')?.value!
  const sources = await getSources(id)
  const incomes = await getIncomes(id)

  return (
    <div>
      <Sources data={sources.payload} />
      <div className="p-2">
        <div className="p-1 flex justify-between items-center">
          <label className="text-lg font-bold">Incomes</label>
          <Link href='create/transaction?type=income'>
            <button>+ Income</button>
          </Link>
        </div>
        <IncomesTable loadMoreIncomes data={incomes.payload.map(e => ({...e, amount: (e.wallet as WalletInsideExpenseProps)?.currnecy?.format.replace('{}', String(e.amount))!}))} />
      </div>
    </div>
  )
}

export default IncomesPage