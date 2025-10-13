import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getUserNotifications } from '@/lib/engagement/notifications'
import NotificationsList from '@/components/NotificationsList'

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Get all notifications (not just unread)
  const notifications = await getUserNotifications(session.user.id, false)
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">
            Stay updated with your QR code activity and account information
          </p>
        </div>

        <NotificationsList initialNotifications={notifications} />
      </div>
    </div>
  )
}

