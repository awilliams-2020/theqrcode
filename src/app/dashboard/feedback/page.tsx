import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default async function FeedbackPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  // Fetch user's feedback
  const feedback = await prisma.feedback.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />
      case 'reviewing': return <AlertCircle className="w-4 h-4" />
      case 'planned': return <AlertCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'declined': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'reviewing': return 'bg-yellow-100 text-yellow-800'
      case 'planned': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800'
      case 'feature': return 'bg-green-100 text-green-800'
      case 'improvement': return 'bg-blue-100 text-blue-800'
      case 'general': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number | null) => {
    if (!rating) return null
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Feedback</h1>
        <p className="mt-2 text-gray-600">
          View and track the status of your feedback submissions.
        </p>
      </div>

      {feedback.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback submitted yet</h3>
          <p className="text-gray-600 mb-4">
            You haven't submitted any feedback yet. Use the feedback button to share your thoughts, report bugs, or request features.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {feedback.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status}</span>
                    </span>
                    {item.rating && (
                      <div className="flex items-center">
                        {renderStars(item.rating)}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {item.subject}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                    {item.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Submitted on {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {item.page && (
                      <span className="text-blue-600">
                        From: {item.page}
                      </span>
                    )}
                  </div>
                  
                  {item.adminNotes && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Admin Response:</h4>
                      <p className="text-sm text-blue-800 whitespace-pre-wrap">
                        {item.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
