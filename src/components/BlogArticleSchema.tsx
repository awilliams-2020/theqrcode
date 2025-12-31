import StructuredData from './StructuredData'

interface BlogArticleSchemaProps {
  title: string
  description: string
  author?: string
  datePublished: string
  dateModified?: string
  image?: string
  url: string
  wordCount?: number
  timeRequired?: string
  proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Advanced'
}

export default function BlogArticleSchema({
  title,
  description,
  author = 'TheQRCode.io Team',
  datePublished,
  dateModified,
  image = 'https://theqrcode.io/og',
  url,
  wordCount,
  timeRequired = 'PT5M',
  proficiencyLevel = 'Beginner'
}: BlogArticleSchemaProps) {
  return (
    <StructuredData
      type="TechArticle"
      data={{
        headline: title,
        description,
        author,
        datePublished,
        dateModified: dateModified || datePublished,
        image,
        url: url.startsWith('http') ? url : `https://theqrcode.io${url}`,
        wordCount,
        timeRequired,
        proficiencyLevel
      }}
    />
  )
}

