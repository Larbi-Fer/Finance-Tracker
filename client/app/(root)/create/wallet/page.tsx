import { getCurrencies } from "@/actions/other.actions"
import CreateWallet from "@/components/Create/CreateWallet"
import { cookies } from "next/headers"

const CreateWalletPage = async () => {
  const currencies = await getCurrencies()
  const id = (await cookies()).get('userId')?.value!
  console.log(currencies);
  

  return (
    <CreateWallet currencies={currencies.payload} userId={id} />
  )
}

export default CreateWalletPage