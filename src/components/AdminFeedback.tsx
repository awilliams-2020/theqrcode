'use client'

import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Filter,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Calendar,
  Star,
  Tag
} from 'lucide-react'

interface Feedback {
  id: string
  type: string
  category: string
  rating: number
  subject: string
  message: string
  page: string
  status: string
  priority: string
  adminNotes: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetchFeedback()
  }, [statusFilter, typeFilter])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      
      const response = await fetch(`/api/admin/feedback?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setFeedback(data.feedback)
      } else {
        throw new Error(data.error || 'Failed to load feedback')
      }
    } catch (err) {
      console.error('Error fetching feedback:', err)
      setError(err instanceof Error ? err.message : 'Failed to load feedback')
    } finally {
      setLoading(false)
    }
  }

  const updateFeedbackStatus = async (feedbackId: string, status: string) => {
    try {
      setUpdatingId(feedbackId)
      
      const response = await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update feedback')
      }
      
      // Refresh feedback list
      await fetchFeedback()
    } catch (err) {
      console.error('Error updating feedback:', err)
      setError('Failed to update feedback status')
    } finally {
      setUpdatingId(null)
    }
  }

  const updateFeedbackPriority = async (feedbackId: string, priority: string) => {
    try {
      setUpdatingId(feedbackId)
      
      const response = await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update feedback')
      }
      
      // Refresh feedback list
      await fetchFeedback()
    } catch (err) {
      console.error('Error updating feedback:', err)
      setError('Failed to update feedback priority')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800'
      case 'planned':
        return 'bg-purple-100 text-purple-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'declined':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'normal':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return '🐛'
      case 'feature':
        return '✨'
      case 'improvement':
        return '🚀'
      case 'general':
        return '💬'
      default:
        return '📝'
    }
  }

  const stats = {
    total: feedback.length,
    new: feedback.filter(f => f.status === 'new').length,
    reviewing: feedback.filter(f => f.status === 'reviewing').length,
    completed: feedback.filter(f => f.status === 'completed').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Feedback</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchFeedback}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New</p>
              <p className="text-2xl font-bold text-blue-900">{stats.new}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reviewing</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.reviewing}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-900">Filters:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="planned">Planned</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="improvement">Improvement</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {feedback.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Feedback Found</h3>
            <p className="text-gray-600">
              No feedback matches your current filters.
            </p>
          </div>
        ) : (
          feedback.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Feedback Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-3xl">{getTypeIcon(item.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.subject}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          <span className="capitalize">{item.type}</span>
                        </div>
                        {item.category && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            <span className="capitalize">{item.category}</span>
                          </div>
                        )}
                        {item.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{item.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedId === item.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{item.user.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{item.user.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Message Preview */}
                <p className="text-gray-700 line-clamp-2">{item.message}</p>

                {/* Expanded Content */}
                {expandedId === item.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Full Message</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{item.message}</p>
                      </div>

                      {item.page && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Page</h4>
                          <p className="text-sm text-gray-600">{item.page}</p>
                        </div>
                      )}

                      {item.adminNotes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Admin Notes</h4>
                          <p className="text-sm text-gray-600">{item.adminNotes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">Status:</label>
                          <select
                            value={item.status}
                            onChange={(e) => updateFeedbackStatus(item.id, e.target.value)}
                            disabled={updatingId === item.id}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                          >
                            <option value="new">New</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="planned">Planned</option>
                            <option value="completed">Completed</option>
                            <option value="declined">Declined</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">Priority:</label>
                          <select
                            value={item.priority}
                            onChange={(e) => updateFeedbackPriority(item.id, e.target.value)}
                            disabled={updatingId === item.id}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                          >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                          </select>
                        </div>

                        {updatingId === item.id && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Updating...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

