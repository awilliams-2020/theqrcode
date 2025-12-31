'use client'

import { useState } from 'react'

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

interface BlogFiltersProps {
  blogPosts: BlogPost[]
  categories: string[]
  onFilteredPosts: (posts: BlogPost[], featured: BlogPost[]) => void
}

export default function BlogFilters({ blogPosts, categories, onFilteredPosts }: BlogFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTag, setSelectedTag] = useState('All')

  // Get all unique tags from blog posts
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)))

  // Filter posts based on selected category and tag
  const filteredPosts = blogPosts.filter(post => {
    const categoryMatch = selectedCategory === 'All' || post.category === selectedCategory
    const tagMatch = selectedTag === 'All' || post.tags.includes(selectedTag)
    return categoryMatch && tagMatch
  })

  const featuredPosts = filteredPosts.filter(post => post.featured)

  // Notify parent component of filtered posts
  useState(() => {
    onFilteredPosts(filteredPosts, featuredPosts)
  })

  return {
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    allTags,
    filteredPosts,
    featuredPosts,
    categories
  }
}

