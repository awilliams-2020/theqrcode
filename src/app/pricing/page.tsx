import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import PricingPage from '@/components/PricingPage'

export default async function Pricing() {
  const session = await getServerSession(authOptions)
  
  // If not logged in, show pricing page
  // If logged in, also show pricing page (they can upgrade)
  
  return <PricingPage session={session} />
}

