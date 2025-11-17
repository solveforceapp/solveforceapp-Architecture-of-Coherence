import React from 'react';
import type { Section, Bookmark } from '../types';

interface SidebarProps {
  sections: Section[];
  activeSectionId: string;
  onSectionClick: (id: string) => void;
  bookmarks: Bookmark[];
  onToggleBookmark: (id: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <div className="relative mb-6">
    <input
      type="text"
      placeholder="Search document..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-base-light border border-border-color rounded-md py-2 pl-4 pr-10 text-sm text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none transition"
    />
    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
      {value ? (
        <button onClick={() => onChange('')} className="text-text-secondary hover:text-text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )}
    </div>
  </div>
);


const Sidebar: React.FC<SidebarProps> = ({ sections, activeSectionId, onSectionClick, bookmarks, onToggleBookmark, searchValue, onSearchChange }) => {
  return (
    <aside className="w-full lg:w-1/4 lg:sticky top-24 self-start pb-8 lg:pb-0">
      <SearchBar value={searchValue} onChange={onSearchChange} />
      <nav className="space-y-6">
        <div>
          <h3 className="px-3 text-xs font-semibold uppercase text-text-secondary tracking-wider">
            {searchValue ? `Results (${sections.length})` : 'Contents'}
          </h3>
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
        {bookmarks.length > 0 && !searchValue && (
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