import { GetHomeDataAction } from "@/actions/main.action"
import IncomesTable from "@/components/Home/IncomesTable";
import Transactions from "@/components/Home/Transactions";
import WalletsSection from "@/components/Home/WalletsSection";
import { compareDesc } from "date-fns";
import { cookies } from "next/headers";

const HomePage = async() => {
  const id = (await cookies()).get('userId')?.value!
  const data = await GetHomeDataAction(id)

  if (data.type == 'ERROR') return <div>Something wrong</div>

  const wallets: any = data.payload.wallets
  delete wallets.incomes
  delete wallets.expenses

  const expenses = data.payload.wallets.reduce((acc, w) => {
    acc.push(...w.expenses.map(e => ({...e, amount: w.currnecy.format.replace('{}', String(e.amount)), wallet: w.name})))
    return acc
  }, new Array<ExpenseProps & {wallet: string}>())
  
  expenses.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  const incomes = data.payload.wallets.reduce((acc, w) => {
    acc.push(...w.incomes.map(inc => ({...inc, amount: w.currnecy.format.replace('{}', String(inc.amount)), wallet: w.name})))
    return acc
  }, new Array<IncomeProps & {wallet: string}>())
  
  incomes.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <div>
      <WalletsSection wallets={wallets} total={data.payload.balance} />
      <div className="flex">
        <div className="w-7/12 p-2">
          <div className="text-xl pb-1">Last expenses</div>
          <Transactions data={expenses} />
        </div>
        
        <div className="w-5/12 p-2 border-s">
          <div className="text-xl pb-1">Last Incomes</div>
          <IncomesTable data={incomes} />
        </div>
      </div>
      Home
    </div>
  )
}

export default HomePage