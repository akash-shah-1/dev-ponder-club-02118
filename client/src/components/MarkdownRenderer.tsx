// Enhanced markdown renderer for AI responses with proper formatting

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const renderContent = (text: string) => {
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Code block
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        const language = match?.[1] || '';
        const code = match?.[2] || part.replace(/```/g, '');
        
        return (
          <div key={index} className="my-4">
            {language && (
              <div className="bg-slate-800 text-slate-300 px-4 py-1 text-xs font-mono rounded-t-lg">
                {language}
              </div>
            )}
            <pre className={`bg-slate-900 text-slate-100 p-4 overflow-x-auto ${language ? 'rounded-b-lg' : 'rounded-lg'}`}>
              <code className="text-sm font-mono">{code}</code>
            </pre>
          </div>
        );
      }
      
      // Regular text - split by paragraphs
      return (
        <div key={index}>
          {part.split('\n\n').map((paragraph, pIndex) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            
            // H1 Headers
            if (trimmed.startsWith('# ')) {
              return (
                <h1 key={pIndex} className="text-2xl md:text-3xl font-bold mt-6 mb-4 text-foreground">
                  {trimmed.replace('# ', '')}
                </h1>
              );
            }
            
            // H2 Headers
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={pIndex} className="text-xl md:text-2xl font-bold mt-6 mb-3 text-foreground border-b pb-2">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }
            
            // H3 Headers
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={pIndex} className="text-lg md:text-xl font-semibold mt-4 mb-2 text-foreground">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            
            // H4 Headers
            if (trimmed.startsWith('#### ')) {
              return (
                <h4 key={pIndex} className="text-base md:text-lg font-semibold mt-3 mb-2 text-foreground">
                  {trimmed.replace('#### ', '')}
                </h4>
              );
            }
            
            // Bullet Lists
            if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
              const items = trimmed.split('\n').filter(line => line.trim().startsWith('- '));
              return (
                <ul key={pIndex} className="list-disc list-inside space-y-2 my-4 ml-4">
                  {items.map((item, iIndex) => {
                    const content = item.replace(/^- /, '');
                    return (
                      <li key={iIndex} className="text-foreground leading-relaxed">
                        {formatInlineMarkdown(content)}
                      </li>
                    );
                  })}
                </ul>
              );
            }
            
            // Numbered Lists
            if (trimmed.match(/^\d+\. /)) {
              const items = trimmed.split('\n').filter(line => line.trim().match(/^\d+\. /));
              return (
                <ol key={pIndex} className="list-decimal list-inside space-y-2 my-4 ml-4">
                  {items.map((item, iIndex) => {
                    const content = item.replace(/^\d+\. /, '');
                    return (
                      <li key={iIndex} className="text-foreground leading-relaxed">
                        {formatInlineMarkdown(content)}
                      </li>
                    );
                  })}
                </ol>
              );
            }
            
            // Blockquotes
            if (trimmed.startsWith('> ')) {
              return (
                <blockquote key={pIndex} className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground bg-muted/30 rounded-r">
                  {formatInlineMarkdown(trimmed.replace(/^> /, ''))}
                </blockquote>
              );
            }
            
            // Horizontal Rule
            if (trimmed === '---' || trimmed === '***') {
              return <hr key={pIndex} className="my-6 border-border" />;
            }
            
            // Regular paragraph
            return (
              <p key={pIndex} className="leading-relaxed my-3 text-foreground">
                {formatInlineMarkdown(trimmed)}
              </p>
            );
          })}
        </div>
      );
    });
  };
  
  // Format inline markdown (bold, italic, inline code, links)
  const formatInlineMarkdown = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let currentIndex = 0;
    
    // Regex patterns for inline formatting
    const patterns = [
      { regex: /`([^`]+)`/g, type: 'code' },
      { regex: /\*\*([^*]+)\*\*/g, type: 'bold' },
      { regex: /\*([^*]+)\*/g, type: 'italic' },
      { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' },
    ];
    
    let workingText = text;
    const matches: Array<{ index: number; length: number; element: JSX.Element }> = [];
    
    // Find all matches
    patterns.forEach(({ regex, type }) => {
      let match;
      const tempRegex = new RegExp(regex.source, regex.flags);
      while ((match = tempRegex.exec(text)) !== null) {
        let element: JSX.Element;
        const key = `${type}-${match.index}`;
        
        switch (type) {
          case 'code':
            element = (
              <code key={key} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">
                {match[1]}
              </code>
            );
            break;
          case 'bold':
            element = <strong key={key} className="font-bold">{match[1]}</strong>;
            break;
          case 'italic':
            element = <em key={key} className="italic">{match[1]}</em>;
            break;
          case 'link':
            element = (
              <a key={key} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {match[1]}
              </a>
            );
            break;
          default:
            element = <span key={key}>{match[0]}</span>;
        }
        
        matches.push({
          index: match.index,
          length: match[0].length,
          element,
        });
      }
    });
    
    // Sort matches by index
    matches.sort((a, b) => a.index - b.index);
    
    // Build the result
    if (matches.length === 0) {
      return text;
    }
    
    matches.forEach((match, idx) => {
      // Add text before this match
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index));
      }
      // Add the formatted element
      parts.push(match.element);
      currentIndex = match.index + match.length;
    });
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }
    
    return <>{parts}</>;
  };
  
  return (
    <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
      {renderContent(content)}
    </div>
  );
};
