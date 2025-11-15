
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DOCUMENT_CONTENT } from './constants';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import type { Section } from './types';

const App: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>(DOCUMENT_CONTENT[0]?.id || '');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  const handleScroll = useCallback(() => {
    const scrollPosition = contentRef.current?.scrollTop || 0;
    const offset = 100;

    let currentSectionId = '';
    for (const section of DOCUMENT_CONTENT) {
      const element = sectionRefs.current[section.id];
      if (element && element.offsetTop - offset <= scrollPosition) {
        currentSectionId = section.id;
      }
    }

    if (currentSectionId && currentSectionId !== activeSectionId) {
      setActiveSectionId(currentSectionId);
    }
  }, [activeSectionId]);
  
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
    const element = sectionRefs.current[id];
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSectionId(id);
  };
  
  const registerRef = (id: string, element: HTMLElement | null) => {
    if (element) {
        sectionRefs.current[id] = element;
    }
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
            sections={DOCUMENT_CONTENT} 
            activeSectionId={activeSectionId} 
            onSectionClick={handleSectionClick} 
          />
          <main 
            ref={contentRef} 
            className="w-full lg:w-3/4 lg:pl-8 overflow-y-auto" 
            style={{ height: 'calc(100vh - 6rem)' }}
          >
            <ContentArea sections={DOCUMENT_CONTENT} registerRef={registerRef} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
