import React from 'react';
import type { Section, ContentItem, ContentItemType } from '../types';

const formatText = (text: string = ''): React.ReactNode => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-code-bg text-accent-blue px-1 py-0.5 rounded font-mono text-sm">{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-text-primary">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="italic text-text-secondary">{part.slice(1, -1)}</em>;
      }
      return part;
    });
};

const ContentRenderer: React.FC<{ item: ContentItem }> = ({ item }) => {
  switch (item.type) {
    case 'heading':
      // FIX: Use React.ElementType to avoid issues with JSX namespace and provide a valid type for a dynamic tag.
      const Tag = `h${item.level || 3}` as React.ElementType;
      return <Tag className="text-xl font-semibold mt-6 mb-3 border-b border-border-color pb-2 text-accent-blue/80">{formatText(item.text)}</Tag>;
    case 'paragraph':
      return <p className="mb-4 text-text-primary leading-relaxed">{formatText(item.text)}</p>;
    case 'list':
      return (
        <ul className="list-disc list-inside mb-4 space-y-2 pl-4 text-text-primary">
          {item.items?.map((li, i) => <li key={i}>{formatText(li)}</li>)}
        </ul>
      );
    case 'code':
      return <pre className="bg-code-bg p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm text-text-primary whitespace-pre-wrap">{item.text}</pre>;
    case 'equation':
      return <div className="bg-base-light border-l-4 border-accent-green p-4 rounded-r-lg my-4 font-mono text-accent-green/90 text-center text-md">{item.text}</div>;
    case 'table':
      return (
        <div className="overflow-x-auto my-6 border border-border-color rounded-lg">
          <table className="min-w-full divide-y divide-border-color">
            <thead className="bg-base-light">
              <tr>
                {item.headers?.map((header, i) => (
                  <th key={i} scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${i === 0 ? 'text-accent-blue' : 'text-text-secondary'}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-base-dark divide-y divide-border-color">
              {item.rows?.map((row, i) => (
                <tr key={i} className="hover:bg-base-light/50 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {cell}
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
}

const ContentArea: React.FC<ContentAreaProps> = ({ sections, registerRef }) => {
  return (
    <div className="prose prose-invert max-w-none">
      {sections.map(section => (
        <section
          key={section.id}
          id={section.id}
          ref={el => registerRef(section.id, el)}
          className="mb-12 scroll-mt-24"
        >
          <h2 className="text-3xl font-bold mb-4 text-text-primary border-b-2 border-accent-blue pb-2">{section.title}</h2>
          {section.content.map((item, index) => (
            <ContentRenderer key={index} item={item} />
          ))}
        </section>
      ))}
    </div>
  );
};

export default ContentArea;