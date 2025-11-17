import React from 'react';
import type { Section, ContentItem } from '../types';

const formatText = (text: string = '', query: string = ''): React.ReactNode => {
    // Escape regex special characters in the query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

    const highlight = (str: string) => {
        if (!escapedQuery.trim() || !str) {
            return str;
        }
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        const subParts = str.split(regex);
        return subParts.map((subPart, i) =>
            subPart.toLowerCase() === query.toLowerCase()
                ? <mark key={i} className="bg-accent-blue/30 text-text-primary rounded px-0.5 py-0">{subPart}</mark>
                : subPart
        );
    };

    return parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index} className="bg-code-bg text-accent-blue px-1 py-0.5 rounded font-mono text-sm">{part.slice(1, -1)}</code>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-text-primary">{highlight(part.slice(2, -2))}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index} className="italic text-text-secondary">{highlight(part.slice(1, -1))}</em>;
        }
        return highlight(part);
    });
};

const ContentRenderer: React.FC<{ item: ContentItem, query: string }> = ({ item, query }) => {
  switch (item.type) {
    case 'heading':
      const Tag = `h${item.level || 3}` as React.ElementType;
      return <Tag className="text-xl font-semibold mt-6 mb-3 border-b border-border-color pb-2 text-accent-blue/80">{formatText(item.text, query)}</Tag>;
    case 'paragraph':
      return <p className="mb-4 text-text-primary leading-relaxed">{formatText(item.text, query)}</p>;
    case 'list':
      return (
        <ul className="list-disc list-inside mb-4 space-y-2 pl-4 text-text-primary">
          {item.items?.map((li, i) => <li key={i}>{formatText(li, query)}</li>)}
        </ul>
      );
    case 'code':
      // Not highlighting code content for clarity
      return <pre className="bg-code-bg p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm text-text-primary whitespace-pre-wrap">{item.text}</pre>;
    case 'equation':
      return <div className="bg-base-light border-l-4 border-accent-green p-4 rounded-r-lg my-4 font-mono text-accent-green/90 text-center text-md">{formatText(item.text, query)}</div>;
    case 'table':
      return (
        <div className="overflow-x-auto my-6 border border-border-color rounded-lg">
          <table className="min-w-full divide-y divide-border-color">
            <thead className="bg-base-light">
              <tr>
                {item.headers?.map((header, i) => (
                  <th key={i} scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${i === 0 ? 'text-accent-blue' : 'text-text-secondary'}`}>
                    {formatText(header, query)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-base-dark divide-y divide-border-color">
              {item.rows?.map((row, i) => (
                <tr key={i} className="hover:bg-base-light/50 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {formatText(String(cell), query)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
};


interface ContentAreaProps {
  sections: Section[];
  registerRef: (id: string, element: HTMLElement | null) => void;
  bookmarks: string[];
  onToggleBookmark: (sectionId: string, itemIndex?: number) => void;
  searchQuery: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ sections, registerRef, bookmarks, onToggleBookmark, searchQuery }) => {
    if (searchQuery && sections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-text-primary">No Results Found</h3>
                <p>Try adjusting your search terms.</p>
            </div>
        )
    }

  return (
    <div className="prose prose-invert max-w-none">
      {sections.map(section => {
        const isSectionBookmarked = bookmarks.includes(section.id);
        return (
          <section
            key={section.id}
            id={section.id}
            ref={el => registerRef(section.id, el)}
            className="mb-12 scroll-mt-24 group relative"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl font-bold mb-4 text-text-primary border-b-2 border-accent-blue pb-2 flex-grow">{formatText(section.title, searchQuery)}</h2>
              <button
                onClick={() => onToggleBookmark(section.id)}
                title={isSectionBookmarked ? "Remove bookmark" : "Add bookmark"}
                className={`p-2 rounded-full transition-all duration-200 mb-4 ${
                  isSectionBookmarked 
                    ? 'text-accent-blue opacity-100' 
                    : 'text-text-secondary opacity-0 group-hover:opacity-100 hover:bg-base-light focus:opacity-100'
                }`}
                aria-label={isSectionBookmarked ? `Remove bookmark for ${section.title}` : `Add bookmark for ${section.title}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isSectionBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
            {section.content.map((item, index) => {
              const itemId = `${section.id}:${index}`;
              const isItemBookmarked = bookmarks.includes(itemId);
              return (
                <div key={index} id={itemId} className="group/item relative scroll-mt-24">
                  <button
                    onClick={() => onToggleBookmark(section.id, index)}
                    title={isItemBookmarked ? "Remove bookmark" : "Add bookmark"}
                    aria-label={isItemBookmarked ? `Remove bookmark for this content` : `Add bookmark for this content`}
                    className={`absolute -left-10 top-1 p-1 rounded-full transition-all duration-200 hidden lg:flex items-center justify-center ${
                      isItemBookmarked
                        ? 'text-accent-blue/80 opacity-100'
                        : 'text-text-secondary opacity-0 group-hover/item:opacity-100 hover:bg-base-light focus:opacity-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isItemBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  </button>
                  <ContentRenderer item={item} query={searchQuery}/>
                </div>
              );
            })}
          </section>
        )
      })}
    </div>
  );
};

export default ContentArea;