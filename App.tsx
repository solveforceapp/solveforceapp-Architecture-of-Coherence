import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DOCUMENT_CONTENT } from './constants';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import type { Section, Bookmark, ContentItem } from './types';

// Helper to generate a concise title for a bookmarked content item
const generateItemTitle = (item: ContentItem): string => {
    switch (item.type) {
      case 'heading':
        return item.text || 'Heading';
      case 'paragraph':
        return (item.text || 'Paragraph').substring(0, 40) + '...';
      case 'list':
        return `List: ${(item.items && item.items[0] || '...').substring(0, 30)}...`;
      case 'code':
        return `Code: ${(item.text || '').split('\n')[0].substring(0, 30)}...`;
      case 'equation':
        return `Eq: ${item.text || ''}`;
      case 'table':
        return `Table: ${item.headers?.join(', ') || ''}`;
      default:
        return 'Bookmarked Item';
    }
};

const App: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>(DOCUMENT_CONTENT[0]?.id || '');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  useEffect(() => {
    try {
        const savedBookmarks = localStorage.getItem('coherence-bookmarks');
        if (savedBookmarks) {
            setBookmarks(JSON.parse(savedBookmarks));
        }
    } catch (error) {
        console.error("Failed to load bookmarks from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('coherence-bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
        console.error("Failed to save bookmarks to localStorage", error);
    }
  }, [bookmarks]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInputValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInputValue]);
  
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return DOCUMENT_CONTENT;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return DOCUMENT_CONTENT.filter(section => {
      if (section.title.toLowerCase().includes(lowercasedQuery)) {
        return true;
      }
      return section.content.some(item => {
        if (item.text) return item.text.toLowerCase().includes(lowercasedQuery);
        if (item.items) return item.items.some(li => li.toLowerCase().includes(lowercasedQuery));
        if (item.rows) return item.rows.some(row => row.some(cell => String(cell).toLowerCase().includes(lowercasedQuery)));
        if (item.headers) return item.headers.some(header => header.toLowerCase().includes(lowercasedQuery));
        return false;
      });
    });
  }, [searchQuery]);


  const handleScroll = useCallback(() => {
    const scrollPosition = contentRef.current?.scrollTop || 0;
    const offset = 100;

    let currentSectionId = '';
    // Use filteredSections for determining active section based on what's visible
    for (const section of filteredSections) {
      const element = sectionRefs.current[section.id];
      if (element && element.offsetTop - offset <= scrollPosition) {
        currentSectionId = section.id;
      }
    }

    if (currentSectionId && currentSectionId !== activeSectionId) {
      setActiveSectionId(currentSectionId);
    }
  }, [activeSectionId, filteredSections]);
  
  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => {
        contentElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  const handleSectionClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    } else if (!id.includes(':')) {
        // Fallback for sections if getElementById fails, using refs
        const sectionElement = sectionRefs.current[id];
        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const sectionId = id.split(':')[0];
    if (sectionId) {
        setActiveSectionId(sectionId);
    }
  };
  
  const registerRef = (id: string, element: HTMLElement | null) => {
    if (element) {
        sectionRefs.current[id] = element;
    }
  };

  const toggleBookmark = (sectionId: string, itemIndex?: number) => {
    setBookmarks(prevBookmarks => {
        const bookmarkId = itemIndex !== undefined ? `${sectionId}:${itemIndex}` : sectionId;
        const existingBookmarkIndex = prevBookmarks.findIndex(b => b.id === bookmarkId);

        if (existingBookmarkIndex > -1) {
            return prevBookmarks.filter(b => b.id !== bookmarkId);
        } else {
            const section = DOCUMENT_CONTENT.find(s => s.id === sectionId);
            if (section) {
                let title = section.title;
                if (itemIndex !== undefined && section.content[itemIndex]) {
                    title = generateItemTitle(section.content[itemIndex]);
                }
                const newBookmark: Bookmark = { id: bookmarkId, title };
                return [...prevBookmarks, newBookmark].sort((a,b) => a.title.localeCompare(b.title));
            }
        }
        return prevBookmarks;
    });
  };

  return (
    <div className="min-h-screen bg-base-dark font-sans text-text-primary">
      <header className="fixed top-0 left-0 right-0 bg-base-light/80 backdrop-blur-md border-b border-border-color z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 text-center">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">The Architecture of Coherence</h1>
                <p className="text-sm text-text-secondary">Axionomic Lexicon & Meta‑Law Expansion (v2.6)</p>
            </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="flex flex-col lg:flex-row">
          <Sidebar 
            sections={filteredSections} 
            activeSectionId={activeSectionId} 
            onSectionClick={handleSectionClick}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
            searchValue={searchInputValue}
            onSearchChange={setSearchInputValue}
          />
          <main 
            ref={contentRef} 
            className="w-full lg:w-3/4 lg:pl-8 overflow-y-auto" 
            style={{ height: 'calc(100vh - 6rem)' }}
          >
            <ContentArea 
                sections={filteredSections} 
                registerRef={registerRef} 
                bookmarks={bookmarks.map(b => b.id)}
                onToggleBookmark={toggleBookmark}
                searchQuery={searchQuery}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;