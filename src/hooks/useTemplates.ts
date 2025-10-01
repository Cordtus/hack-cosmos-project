/**
 * React hook for managing proposal templates.
 * Provides easy access to template CRUD operations.
 */

import { useCallback, useMemo } from 'react';
import { useTemplateStore, type ProposalTemplate, type TemplateCategory } from '@/store/template';
import { defaultTemplates } from '@/lib/governance/defaultTemplates';

export function useTemplates() {
  const {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    getTemplatesByCategory,
    incrementUsage,
    exportTemplates,
    importTemplates,
    clearTemplates,
  } = useTemplateStore();

  /**
   * Get all templates (user templates + default templates).
   * Merges user templates with defaults.
   */
  const allTemplates = useMemo(() => {
    // Convert defaults to full templates with generated IDs
    const defaultsWithIds: ProposalTemplate[] = defaultTemplates.map((template, idx) => ({
      ...template,
      id: `default_${idx}`,
      createdAt: 0,
      updatedAt: 0,
      usageCount: 0,
    }));

    // User templates take precedence
    return [...templates, ...defaultsWithIds];
  }, [templates]);

  /**
   * Get templates by category (includes defaults).
   */
  const getTemplatesByCategoryWithDefaults = useCallback(
    (category: TemplateCategory): ProposalTemplate[] => {
      const userTemplates = getTemplatesByCategory(category);
      const defaultsInCategory = defaultTemplates
        .filter((t) => t.category === category)
        .map((template, idx) => ({
          ...template,
          id: `default_${category}_${idx}`,
          createdAt: 0,
          updatedAt: 0,
          usageCount: 0,
        }));

      return [...userTemplates, ...defaultsInCategory];
    },
    [getTemplatesByCategory]
  );

  /**
   * Create template from proposal configuration.
   * Extracts and stores all relevant proposal data.
   */
  const createTemplate = useCallback(
    (
      name: string,
      category: TemplateCategory,
      config: Record<string, any>,
      description?: string
    ) => {
      return addTemplate({
        name,
        category,
        config,
        description,
      });
    },
    [addTemplate]
  );

  /**
   * Load template into form.
   * Increments usage count and returns template config.
   */
  const loadTemplate = useCallback(
    (id: string): Record<string, any> | null => {
      const template = getTemplate(id) || allTemplates.find((t) => t.id === id);

      if (!template) {
        return null;
      }

      // Only increment usage for user templates (not defaults)
      if (!id.startsWith('default_')) {
        incrementUsage(id);
      }

      return template.config;
    },
    [getTemplate, allTemplates, incrementUsage]
  );

  /**
   * Duplicate a template (create copy with new ID).
   */
  const duplicateTemplate = useCallback(
    (id: string): ProposalTemplate | null => {
      const template = getTemplate(id) || allTemplates.find((t) => t.id === id);

      if (!template) {
        return null;
      }

      return addTemplate({
        name: `${template.name} (Copy)`,
        category: template.category,
        config: template.config,
        description: template.description,
      });
    },
    [getTemplate, allTemplates, addTemplate]
  );

  return {
    // All templates (user + defaults)
    allTemplates,

    // User templates only
    userTemplates: templates,

    // CRUD operations
    createTemplate,
    updateTemplate,
    deleteTemplate,
    loadTemplate,
    duplicateTemplate,

    // Query operations
    getTemplate,
    getTemplatesByCategory: getTemplatesByCategoryWithDefaults,

    // Bulk operations
    exportTemplates,
    importTemplates,
    clearTemplates,
  };
}
