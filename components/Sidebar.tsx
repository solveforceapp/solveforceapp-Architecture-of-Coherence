
import React from 'react';
import type { Section } from '../types';

interface SidebarProps {
  sections: Section[];
  activeSectionId: string;
  onSectionClick: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSectionId, onSectionClick }) => {
  return (
    <aside className="w-full lg:w-1/4 lg:sticky top-24 self-start pb-8 lg:pb-0">
      <nav className="space-y-2">
        <h3 className="px-3 text-xs font-semibold uppercase text-text-secondary tracking-wider">Contents</h3>
        <ul className="space-y-1">
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
      </nav>
    </aside>
  );
};

export default Sidebar;
