import { getCategoriyDetails } from "@/actions/categories.actions"
import Transactions from "@/components/Home/Transactions"
import { cookies } from "next/headers"

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
        <div>Statistics</div>
      </div>
      <Transactions expenses={categ.payload.expenses.map(e => ({...e, category: { title: categ.payload.title, id }}))} />
    </div>
  )
}

export default CategoryDetailsPage