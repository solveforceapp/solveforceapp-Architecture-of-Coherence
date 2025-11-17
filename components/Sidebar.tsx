import React from 'react';
import type { Section, Bookmark } from '../types';

interface SidebarProps {
  sections: Section[];
  activeSectionId: string;
  onSectionClick: (id: string) => void;
  bookmarks: Bookmark[];
  onToggleBookmark: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSectionId, onSectionClick, bookmarks, onToggleBookmark }) => {
  return (
    <aside className="w-full lg:w-1/4 lg:sticky top-24 self-start pb-8 lg:pb-0">
      <nav className="space-y-6">
        <div>
          <h3 className="px-3 text-xs font-semibold uppercase text-text-secondary tracking-wider">Contents</h3>
          <ul className="space-y-1 mt-2">
            {sections.map(section => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSectionClick(section.id);
                  }}
                  className={`
                    block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
                    ${activeSectionId === section.id 
                      ? 'bg-accent-blue/10 text-accent-blue' 
                      : 'text-text-secondary hover:bg-base-light hover:text-text-primary'
                    }
                  `}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {bookmarks.length > 0 && (
          <div>
            <h3 className="px-3 text-xs font-semibold uppercase text-text-secondary tracking-wider">Bookmarks</h3>
            <ul className="space-y-1 mt-2">
              {bookmarks.map(bookmark => (
                <li key={bookmark.id} className="group flex items-center justify-between">
                  <a
                    href={`#${bookmark.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSectionClick(bookmark.id);
                    }}
                    className="block flex-grow px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-base-light hover:text-text-primary"
                    title={bookmark.title}
                  >
                    <span className="truncate block">{bookmark.title}</span>
                  </a>
                  <button
                    onClick={() => onToggleBookmark(bookmark.id)}
                    title="Remove bookmark"
                    aria-label={`Remove bookmark for ${bookmark.title}`}
                    className="mr-2 p-1 rounded-full text-text-secondary opacity-0 group-hover:opacity-100 hover:bg-base-light hover:text-accent-blue focus:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;