import { getCategories } from "@/actions/categories.actions"
import { getExpenses } from "@/actions/expenses.actions"
import Transactions from "@/components/Home/Transactions"
import Categories from "@/components/Spending/Categories"
import { cookies } from "next/headers"
import Link from "next/link"

const SpendingPage = async () => {
  const userId = (await cookies()).get('userId')?.value!
  const categories = await getCategories(userId)
  
  const expenses = await getExpenses(userId)

  return (
    <div>
      <Categories categs={categories.payload} />
      <div className="p-2">
        <div className="p-1 flex justify-between items-center">
          <label className="text-lg font-bold">Transactions</label>
          <Link href='spending/create'>
            <button>+ Expense</button>
          </Link>
        </div>
        <Transactions expenses={expenses.payload.map(e => ({...e, amount: (e.wallet as WalletInsideExpenseProps)?.currnecy?.format.replace('{}', String(e.amount))!}))} loadMoreExpenses />
      </div>
    </div>
  )
}

export default SpendingPage