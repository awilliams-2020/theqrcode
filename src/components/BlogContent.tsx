'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
  readTime: string
  category: string
  tags: string[]
  featured: boolean
}

interface BlogContentProps {
  blogPosts: BlogPost[]
  categories: string[]
  allTags: string[]
}

export default function BlogContent({ blogPosts, categories, allTags }: BlogContentProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTag, setSelectedTag] = useState('All')

  // Filter posts based on selected category and tag
  const filteredPosts = blogPosts.filter(post => {
    const categoryMatch = selectedCategory === 'All' || post.category === selectedCategory
    const tagMatch = selectedTag === 'All' || post.tags.includes(selectedTag)
    return categoryMatch && tagMatch
  })

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const allPosts = filteredPosts

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              QR Code Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn everything about QR codes with our comprehensive blog. Get tips, tutorials, 
              and best practices for QR code marketing and analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Filter Articles
            </h2>
            <p className="text-gray-600">
              Find articles by category or topic
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setSelectedTag('All') // Reset tag when category changes
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('All')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === 'All' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                All Topics
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'All' || selectedTag !== 'All') && (
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedTag !== 'All' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Topic: {selectedTag}
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedTag('All')
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.length > 0 ? featuredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    <Link href={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-6">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/blog/${post.id}`}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read More
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            )) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500 text-lg">No featured articles match your current filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Articles
            </h2>
            <p className="text-xl text-gray-600">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.length > 0 ? allPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <Link href={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/blog/${post.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No articles match your current filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All')
                    setSelectedTag('All')
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Own QR Codes?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start generating professional QR codes with analytics today. Free trial available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?plan=pro"
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/qr-code-generator"
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

