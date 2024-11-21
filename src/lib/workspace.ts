import { db } from './db';

interface Workspace {
  id: string;
  userId: string;
  name: string;
  pages: number[];
  createdAt: Date;
  updatedAt: Date;
}

interface WorkspaceContent {
  id: string;
  workspaceId: string;
  content: string;
  pageNumber: number;
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  textAlign: string;
  textStyle: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface PageStyles {
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  textAlign: string;
  textStyle: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
}

interface PageData {
  pageNumber: number;
  content: string;
  styles?: {
    fontFamily: string;
    fontSize: string;
    fontColor: string;
    textAlign: string;
    textStyle: {
      bold: boolean;
      italic: boolean;
      underline: boolean;
    };
  };
}

interface PageContent {
  pageNumber: number;
  content: string;
  styles?: {
    fontFamily: string;
    fontSize: string;
    fontColor: string;
    textAlign: string;
    textStyle: {
      bold: boolean;
      italic: boolean;
      underline: boolean;
    };
  };
}

export const workspaceManager = {
  // Create a new workspace for a user
  async createWorkspace(userId: string, name: string): Promise<Workspace> {
    const workspace = {
      id: crypto.randomUUID(),
      userId,
      name,
      pages: [1], // Start with page 1
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.workspaces.add(workspace);
    return workspace;
  },

  // Get all workspaces for a user
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    return await db.workspaces
      .where('userId')
      .equals(userId)
      .toArray();
  },

  // Get a workspace by ID
  async getWorkspace(id: string): Promise<Workspace | undefined> {
    return await db.workspaces.get(id);
  },

  // Update a workspace
  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<void> {
    await db.workspaces.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  // Save content to a workspace
  async saveContent(workspaceId: string, content: Partial<WorkspaceContent>): Promise<void> {
    const contentId = content.id || crypto.randomUUID();
    const now = new Date();

    await db.workspaceContents.put({
      ...content,
      id: contentId,
      workspaceId,
      updatedAt: now,
      createdAt: content.createdAt || now,
    });
  },

  // Get all content for a workspace
  async getWorkspaceContent(workspaceId: string): Promise<WorkspaceContent[]> {
    return await db.workspaceContents
      .where('workspaceId')
      .equals(workspaceId)
      .toArray();
  },

  // Delete a workspace and all its content
  async deleteWorkspace(workspaceId: string): Promise<void> {
    await db.transaction('rw', db.workspaces, db.workspaceContents, async () => {
      await db.workspaceContents
        .where('workspaceId')
        .equals(workspaceId)
        .delete();
      await db.workspaces
        .where('id')
        .equals(workspaceId)
        .delete();
    });
  },

  // Export workspace content
  async exportWorkspace(workspaceId: string): Promise<string> {
    const contents = await this.getWorkspaceContent(workspaceId);
    return JSON.stringify(contents, null, 2);
  },

  // Import workspace content
  async importWorkspace(userId: string, name: string, contentJson: string): Promise<void> {
    const contents = JSON.parse(contentJson) as WorkspaceContent[];
    const workspace = await this.createWorkspace(userId, name);

    await db.transaction('rw', db.workspaceContents, async () => {
      for (const content of contents) {
        await this.saveContent(workspace.id, {
          ...content,
          id: crypto.randomUUID(), // Generate new IDs for imported content
        });
      }
    });
  },

  // Get page content with strict page number verification
  async getPageContent(workspaceId: string, pageNumber: number): Promise<PageContent | null> {
    try {
      const content = await db.workspaceContents
        .where(['workspaceId', 'pageNumber'])
        .equals([workspaceId, pageNumber])
        .first();

      if (!content) return null;

      return {
        pageNumber: content.pageNumber,
        content: content.content,
        styles: {
          fontFamily: content.fontFamily,
          fontSize: content.fontSize,
          fontColor: content.fontColor,
          textAlign: content.textAlign,
          textStyle: content.textStyle
        }
      };
    } catch (error) {
      console.error('Error getting page content:', error);
      return null;
    }
  },

  // Save page content with strict verification
  async savePageContent(workspaceId: string, pageNumber: number, data: PageContent): Promise<void> {
    try {
      const workspace = await db.workspaces.get(workspaceId);
      if (!workspace) {
        throw new Error('Workspace not found');
      }

      // Ensure the page exists in the workspace
      if (!workspace.pages.includes(pageNumber)) {
        workspace.pages.push(pageNumber);
        workspace.pages.sort((a, b) => a - b);
        await db.workspaces.put(workspace);
      }

      // Check for existing content
      const existingContent = await db.workspaceContents
        .where(['workspaceId', 'pageNumber'])
        .equals([workspaceId, pageNumber])
        .first();

      const contentData = {
        workspaceId,
        pageNumber,
        content: data.content,
        fontFamily: data.styles?.fontFamily || 'Crimson Text',
        fontSize: data.styles?.fontSize || '16px',
        fontColor: data.styles?.fontColor || '#000000',
        textAlign: data.styles?.textAlign || 'left',
        textStyle: data.styles?.textStyle || { bold: false, italic: false, underline: false },
        updatedAt: new Date()
      };

      if (existingContent) {
        // Update existing content
        await db.workspaceContents.put({
          ...existingContent,
          ...contentData
        });
      } else {
        // Create new content
        await db.workspaceContents.put({
          ...contentData,
          id: crypto.randomUUID(),
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error saving page content:', error);
      throw error;
    }
  },

  // Get both content and styles for a page
  async getPageData(workspaceId: string, pageNumber: number): Promise<PageData> {
    try {
      const pageData = await db.workspaceContents
        .where(['workspaceId', 'pageNumber'])
        .equals([workspaceId, pageNumber])
        .first();
      
      if (!pageData || pageData.pageNumber !== pageNumber) {
        return {
          pageNumber,
          content: '',
          styles: {
            fontFamily: 'Crimson Text',
            fontSize: '16px',
            fontColor: '#000000',
            textAlign: 'left',
            textStyle: { bold: false, italic: false, underline: false }
          }
        };
      }
      
      return {
        pageNumber: pageData.pageNumber,
        content: pageData.content || '',
        styles: {
          fontFamily: pageData.fontFamily,
          fontSize: pageData.fontSize,
          fontColor: pageData.fontColor,
          textAlign: pageData.textAlign,
          textStyle: pageData.textStyle
        }
      };
    } catch (error) {
      console.error('Error getting page data:', error);
      return {
        pageNumber,
        content: '',
        styles: {
          fontFamily: 'Crimson Text',
          fontSize: '16px',
          fontColor: '#000000',
          textAlign: 'left',
          textStyle: { bold: false, italic: false, underline: false }
        }
      };
    }
  },

  // Save both content and styles for a page
  async savePageData(workspaceId: string, pageNumber: number, data: PageData): Promise<void> {
    // Verify the page number matches
    if (data.pageNumber !== pageNumber) {
      throw new Error('Page number mismatch');
    }

    try {
      const existingContent = await db.workspaceContents
        .where(['workspaceId', 'pageNumber'])
        .equals([workspaceId, pageNumber])
        .first();

      const updatedData = {
        workspaceId,
        pageNumber,
        content: data.content,
        fontFamily: data.styles?.fontFamily || 'Crimson Text',
        fontSize: data.styles?.fontSize || '16px',
        fontColor: data.styles?.fontColor || '#000000',
        textAlign: data.styles?.textAlign || 'left',
        textStyle: data.styles?.textStyle || { bold: false, italic: false, underline: false },
        updatedAt: new Date()
      };

      if (existingContent) {
        // Verify we're updating the correct page
        if (existingContent.pageNumber !== pageNumber) {
          throw new Error('Existing page number mismatch');
        }
        await db.workspaceContents.update(existingContent.id!, updatedData);
      } else {
        await db.workspaceContents.add({
          ...updatedData,
          id: crypto.randomUUID(),
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error saving page data:', error);
      throw error;
    }
  },

  // Get total pages
  async getTotalPages(workspaceId: string): Promise<number> {
    try {
      const workspace = await db.workspaces.get(workspaceId);
      if (!workspace) {
        throw new Error('Workspace not found');
      }
      return workspace.pages.length > 0 ? Math.max(...workspace.pages) : 1;
    } catch (error) {
      console.error('Error getting total pages:', error);
      return 1;
    }
  },

  // Create new page
  async createNewPage(workspaceId: string): Promise<number> {
    try {
      const workspace = await db.workspaces.get(workspaceId);
      if (!workspace) {
        throw new Error('Workspace not found');
      }

      // Get current max page number
      const currentMaxPage = workspace.pages.length > 0 ? Math.max(...workspace.pages) : 0;
      const newPageNumber = currentMaxPage + 1;

      // Update workspace with new page
      workspace.pages.push(newPageNumber);
      workspace.pages.sort((a, b) => a - b);
      workspace.updatedAt = new Date();
      
      // Save workspace update
      await db.workspaces.put(workspace);

      // Initialize new page content
      await this.savePageContent(workspaceId, newPageNumber, {
        pageNumber: newPageNumber,
        content: '',
        styles: {
          fontFamily: 'Crimson Text',
          fontSize: '16px',
          fontColor: '#000000',
          textAlign: 'left',
          textStyle: { bold: false, italic: false, underline: false }
        }
      });

      return newPageNumber;
    } catch (error) {
      console.error('Error creating new page:', error);
      throw error;
    }
  },

  // Verify page content
  async verifyPageContent(workspaceId: string, pageNumber: number): Promise<boolean> {
    try {
      const content = await this.getPageContent(workspaceId, pageNumber);
      return !!(content && content.pageNumber === pageNumber && content.workspaceId === workspaceId);
    } catch (error) {
      console.error('Error verifying page content:', error);
      return false;
    }
  },

  // Delete page content
  async deletePageContent(workspaceId: string, pageNumber: number): Promise<void> {
    try {
      await db.workspaceContents
        .where(['workspaceId', 'pageNumber'])
        .equals([workspaceId, pageNumber])
        .delete();
    } catch (error) {
      console.error('Error deleting page content:', error);
      throw error;
    }
  },
};
