import { getCategoriyDetails } from "@/actions/categories.actions"
import Transactions from "@/components/Home/Transactions"
import { ChartBarLabel } from "@/components/ui/ChartBarLabel"
import { cookies } from "next/headers"

const months = ["January", "February", "March", "April", "May", "June", "July", 'Augest', 'September', 'October', 'Novermber', 'December']

const CategoryDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id
  const userId = (await cookies()).get('userId')?.value!
  const categ = await getCategoriyDetails(userId, id)

  return (
    <div>
      <div className="flex justify-between mx-2 my-6">
        <div className="text-4xl">
          {categ.payload.icon + ' ' + categ.payload.title}
        </div>
        <div className="w-1/3">
          <ChartBarLabel lable="Budget for 12 months" year={2026} chartData={categ.payload.monthly.map(m => ({month: months[m.month-1], amount: m.total}))} />
        </div>
      </div>
      <Transactions expenses={categ.payload.expenses.map(e => ({...e, category: { title: categ.payload.title, id }}))} />
    </div>
  )
}

export default CategoryDetailsPage