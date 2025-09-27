import { GetHomeDataAction } from "@/actions/main.action"
import WalletsSection from "@/components/Home/WalletsSection";
import { cookies } from "next/headers";

const HomePage = async() => {
  const id = (await cookies()).get('userId')?.value!
  const data = await GetHomeDataAction(id)

  if (data.type == 'ERROR') return <div>Something wrong</div>

  const wallets: any = data.payload.wallets
  delete wallets.incomes
  delete wallets.expenses

  return (
    <div>
      <WalletsSection wallets={wallets} total={data.payload.balance} />
      Home
    </div>
  )
}

export default HomePage