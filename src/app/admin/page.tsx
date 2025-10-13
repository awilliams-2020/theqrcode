import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminDashboard from '@/components/AdminDashboard'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true }
  })

  if (!user?.isAdmin) {
    redirect('/dashboard')
  }

  // Fetch admin statistics
  const [totalUsers, totalQRCodes, totalScans, recentUsers] = await Promise.all([
    prisma.user.count({
      where: { isDeleted: false }
    }),
    prisma.qrCode.count({
      where: { isDeleted: false } // Only count active QR codes
    }),
    prisma.scan.count(),
    prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        subscription: true,
        _count: {
          select: {
            qrCodes: true,
            apiKeys: true
          }
        }
      }
    })
  ])

  return (
    <AdminDashboard
      stats={{
        totalUsers,
        totalQRCodes,
        totalScans
      }}
      recentUsers={recentUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        plan: u.subscription?.plan || 'free',
        qrCodeCount: u._count.qrCodes,
        apiKeyCount: u._count.apiKeys,
        isAdmin: u.isAdmin
      }))}
    />
  )
}

