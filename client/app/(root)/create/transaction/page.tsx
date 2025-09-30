import { getCategories } from "@/actions/categories.actions"
import { getWallets } from "@/actions/wallets.actions"
import CreateTransaction from "@/components/Create/CreateTransaction"
import { cookies } from "next/headers"

const CreateTransactionPage = async () => {
  const id = (await cookies()).get('userId')?.value!
  const categs = await getCategories(id)
  const wallets = await getWallets(id)

  return (
    <div>
      <CreateTransaction
        userId={id}
        categories={categs.payload.map(c => ({id: c.id, title: c.title}))}
        wallets={wallets.payload}
      />
    </div>
  )
}

export default CreateTransactionPage