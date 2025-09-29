import { getCategories } from "@/actions/categories.actions"
import { getExpenses } from "@/actions/expenses.actions"
import Transactions from "@/components/Home/Transactions"
import Categories from "@/components/Spending/Categories"
import { cookies } from "next/headers"

const SpendingPage = async () => {
  const userId = (await cookies()).get('userId')?.value!
  const categories = await getCategories(userId)
  
  const expenses = await getExpenses(userId)

  return (
    <div>
      <Categories categs={categories.payload} />
      <div className="p-2">
        <Transactions expenses={expenses.payload.map(e => ({...e, amount: (e.wallet as WalletInsideExpenseProps)?.currnecy?.format.replace('{}', String(e.amount))!}))} loadMoreExpenses />
      </div>
    </div>
  )
}

export default SpendingPage