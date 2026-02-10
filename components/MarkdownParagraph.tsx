'use client'

interface MarkdownParagraphProps {
  text: string
}

export default function MarkdownParagraph({ text }: MarkdownParagraphProps) {
  if (!text) return null

  // Parse markdown formatting
  const parseMarkdown = (content: string) => {
    let html = content

    // Convert **bold** to <strong> with styling
    html = html.replace(/\*\*([^*]+?)\*\*/g, '<strong class="font-semibold text-amber-900 dark:text-amber-100">$1</strong>')
    
    // Preserve line breaks
    html = html.replace(/\n/g, '<br />')

    return html
  }

  return (
    <div 
      className="leading-relaxed"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }}
    />
  )
}
