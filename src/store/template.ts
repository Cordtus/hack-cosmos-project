/**
 * Template store for saving and reusing governance proposal configurations.
 * Allows users to create reusable templates from proposal forms.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TemplateCategory = 'parameter_change' | 'community_spend' | 'software_upgrade' | 'ibc_client' | 'custom';

/**
 * Governance proposal template structure.
 * Stores all configuration data needed to recreate a proposal.
 */
export interface ProposalTemplate {
  /** Unique template identifier */
  id: string;
  /** Template name for display */
  name: string;
  /** Optional template description */
  description?: string;
  /** Template category for organization */
  category: TemplateCategory;
  /** Proposal configuration data (JSON-serializable) */
  config: Record<string, any>;
  /** Creation timestamp */
  createdAt: number;
  /** Last update timestamp */
  updatedAt: number;
  /** Number of times template has been used */
  usageCount: number;
}

interface TemplateState {
  /** All saved templates */
  templates: ProposalTemplate[];

  /** Add new template */
  addTemplate: (template: Omit<ProposalTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => ProposalTemplate;

  /** Update existing template */
  updateTemplate: (id: string, updates: Partial<Omit<ProposalTemplate, 'id' | 'createdAt'>>) => void;

  /** Delete template */
  deleteTemplate: (id: string) => void;

  /** Get template by ID */
  getTemplate: (id: string) => ProposalTemplate | undefined;

  /** Get templates by category */
  getTemplatesByCategory: (category: TemplateCategory) => ProposalTemplate[];

  /** Increment usage count when template is used */
  incrementUsage: (id: string) => void;

  /** Export templates as JSON */
  exportTemplates: () => string;

  /** Import templates from JSON */
  importTemplates: (json: string) => void;

  /** Clear all templates */
  clearTemplates: () => void;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],

      addTemplate: (template) => {
        const now = Date.now();
        const newTemplate: ProposalTemplate = {
          ...template,
          id: `template_${now}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
        };

        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));

        return newTemplate;
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? { ...template, ...updates, updatedAt: Date.now() }
              : template
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }));
      },

      getTemplate: (id) => {
        return get().templates.find((template) => template.id === id);
      },

      getTemplatesByCategory: (category) => {
        return get().templates.filter((template) => template.category === category);
      },

      incrementUsage: (id) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? { ...template, usageCount: template.usageCount + 1, updatedAt: Date.now() }
              : template
          ),
        }));
      },

      exportTemplates: () => {
        return JSON.stringify(get().templates, null, 2);
      },

      importTemplates: (json) => {
        try {
          const imported = JSON.parse(json) as ProposalTemplate[];

          // Validate structure
          if (!Array.isArray(imported)) {
            throw new Error('Invalid template data: expected array');
          }

          // Filter out duplicates by ID
          const { templates } = get();
          const existingIds = new Set(templates.map((t) => t.id));
          const newTemplates = imported.filter((t) => !existingIds.has(t.id));

          set((state) => ({
            templates: [...state.templates, ...newTemplates],
          }));
        } catch (error) {
          throw new Error(
            `Failed to import templates: ${error instanceof Error ? error.message : 'Invalid JSON'}`
          );
        }
      },

      clearTemplates: () => {
        set({ templates: [] });
      },
    }),
    {
      name: 'proposal-templates',
      version: 1,
    }
  )
);
