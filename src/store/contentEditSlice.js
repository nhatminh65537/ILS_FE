import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { modulesAPI } from '../apis/modules';
import { learnNodesAPI } from '../apis/learnNodes';
import { learnLessonsAPI } from '../apis/learnLessons';
import { myUserAPI } from '../apis/myUser';

// Initial state
const initialState = {
  contentTree: null,
  currentModule: null,
  loading: false,
  error: null,
  lessons: {},
  unsavedChanges: {},
  pendingItems: [],
  finishedLessonIds: [] // Add this to track finished lessons
};

// Async thunks
export const fetchModuleContent = createAsyncThunk(
  'contentEdit/fetchModuleContent',
  async (moduleId, { rejectWithValue, dispatch }) => {
    try {
      const response = await modulesAPI.getById(moduleId);
      await dispatch(fetchLearnTree(response.node.id)); // Fetch the learn tree for the module
      await dispatch(fetchFinishedLessonsForModule(moduleId)); // Fetch finished lessons
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch module content');
    }
  }
);

export const fetchLearnTree = createAsyncThunk(
  'contentEdit/fetchLearnTree',
  async (rootId, { rejectWithValue }) => {
    try {
      const response = await learnNodesAPI.getNodeTree(rootId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch learn tree');
    }
  }
);

export const fetchLessonContent = createAsyncThunk(
  'contentEdit/fetchLessonContent',
  async (lessonId, { rejectWithValue }) => {
    try {
      const response = await learnLessonsAPI.getById(lessonId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch lesson content');
    }
  }
);

export const saveModuleChanges = createAsyncThunk(
  'contentEdit/saveModuleChanges',
  async ({ moduleId, changes }, { rejectWithValue, dispatch, getState }) => {
    try {
      // Get the current module from state
      const { currentModule } = getState().contentEdit;
      
      if (!currentModule) {
        return rejectWithValue('No module data available to update');
      }

      // Apply changes to current module data
      const updatedModule = { 
        ...currentModule,
        categoryId: currentModule.category.id,
        lifecycleStateId: currentModule.lifecycleState.id,
        tagIds: [],
        ...changes
      };  
      
      const response = await modulesAPI.update(moduleId, updatedModule);
      
      // Refresh the module content after saving
      dispatch(fetchModuleContent(moduleId)); 
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save changes');
    }
  }
);

export const saveNodeChanges = createAsyncThunk(
  'contentEdit/saveNodeChanges',
  async ({ nodeId, changes }, { rejectWithValue, dispatch, getState }) => {
    try {
      const node = findNodeById(getState().contentEdit.contentTree, nodeId);
      if (!node) {
        return rejectWithValue('Node not found');
      }
      const updatedNode = { ...node.item, ...changes };
      const response = await learnNodesAPI.update(nodeId, updatedNode);

      dispatch(fetchLearnTree(getState().contentEdit.contentTree.item.id)); // Refresh the tree after saving
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save node changes');
    }
  }
);

export const saveLessonContent = createAsyncThunk(
  'contentEdit/saveLessonContent',
  async ({ nodeId, changes }, { rejectWithValue, dispatch, getState }) => {
    try {
      if (changes.content) {
        changes.content = changes.content.replace(/\\\\/g, '\\');
      }
      const state = getState();
      const { lessons, contentTree } = state.contentEdit;
      const node = findNodeById(contentTree, nodeId);
      if (!node) {
        return rejectWithValue('Node not found');
      }
      const lesson = lessons[node.item.lesson.id];
      await dispatch(saveNodeChanges({ nodeId, changes })); // Save node changes first
      const response = await learnLessonsAPI.update(lesson.id, {
        ...lesson,
        typeId: lesson.lessonType.id, 
        ...changes
      });
      await dispatch(fetchLessonContent(lesson.id));
      await dispatch(fetchModuleContent(getState().contentEdit.currentModule.id)); // Refresh module content after saving
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save lesson content');
    }
  }
);

export const addContentItem = createAsyncThunk(
  'contentEdit/addContentItem',
  async ({ parentId, type, newItem }, { rejectWithValue, dispatch }) => {
    try {
      let response;
      
      if (type === 'lesson') {
        // For lesson, use the createLesson API with correct format
        response = await learnLessonsAPI.create({
          title: newItem.title,
          parentNodeId: parentId,
          typeId: newItem.lesson?.lessonType?.id || 1, // Get typeId from the lesson object
          xp: newItem.lesson?.xp || 0,
          duration: newItem.lesson?.duration || 0,
          content: ''
        });
      } else {
        // For folder, use the learnNodes API
        response = await learnNodesAPI.create({
          title: newItem.title,
          description: newItem.description || "",
          parentNodeId: parentId,
          order: newItem.order || 0
        });
      }      
      return { response, parentId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add new item');
    }
  }
);

export const deleteModule = createAsyncThunk(
  'contentEdit/deleteModule',
  async (moduleId, { rejectWithValue }) => {
    try {
      const response = await modulesAPI.delete(moduleId);
      return { moduleId, response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete module');
    }
  }
);

export const deleteNode = createAsyncThunk(
  'contentEdit/deleteNode',
  async (nodeId, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await learnNodesAPI.delete(nodeId);
      
      // After deleting, refresh the tree if we still have a content tree
      const rootNodeId = getState().contentEdit.contentTree?.item?.id;
      if (rootNodeId) {
        await dispatch(fetchLearnTree(rootNodeId));
      }
      
      return { nodeId, response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete node');
    }
  }
);

export const deleteLesson = createAsyncThunk(
  'contentEdit/deleteLesson',
  async (lessonId, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await learnLessonsAPI.delete(lessonId);
      
      // After deleting, refresh the tree if we still have a content tree
      const rootNodeId = getState().contentEdit.contentTree?.item?.id;
      if (rootNodeId) {
        await dispatch(fetchLearnTree(rootNodeId));
      }
      
      return { lessonId, response };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete lesson');
    }
  }
);

// Add a thunk to fetch finished lessons
export const fetchFinishedLessonsForModule = createAsyncThunk(
  'contentEdit/fetchFinishedLessonsForModule',
  async (moduleId, { rejectWithValue }) => {
    try {
      const finishedLessons = await myUserAPI.getFinishedLessons(moduleId);
      return finishedLessons;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch finished lessons');
    }
  }
);

// Add a thunk for marking a lesson as finished
export const markLessonFinished = createAsyncThunk(
  'contentEdit/markLessonFinished',
  async ({ lessonId, moduleId }, { rejectWithValue, dispatch }) => {
    try {
      await myUserAPI.markLessonFinished(lessonId);
      // Refresh the list of finished lessons after marking one as finished
      dispatch(fetchFinishedLessonsForModule(moduleId));
      return lessonId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark lesson as finished');
    }
  }
);

// Helper functions for tree operations
export const findNodeById = (tree, id) => {
  if (!tree) return null;
  
  if (tree.item && tree.item.id === id) {
    return tree;
  }
  
  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  
  // Also check Children with capital C (API inconsistency)
  if (tree.Children && tree.Children.length > 0) {
    for (const child of tree.Children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  
  return null;
};

// Create the slice
const contentEditSlice = createSlice({
  name: 'contentEdit',
  initialState,
  reducers: {
    clearContentEditState: () => initialState,
    updateContentItem: (state, action) => {
      const { itemId, changes, itemType } = action.payload;
      const node = findNodeById(state.contentTree, itemId);
      
      if (node) {
        // Update the node with changes
        node.item = { ...node.item, ...changes };
        
        // Track unsaved changes with type information
        state.unsavedChanges[itemId] = {
          ...(state.unsavedChanges[itemId] || {}),
          ...changes,
          _type: itemType // Add type information to track what API to use
        };
      }
    },
    addPendingItem: (state, action) => {
      // Track a new item that needs to be saved
      const { parentId, newItem } = action.payload;
      state.pendingItems.push({
        parentId,
        item: newItem
      });
    },
    setLessonContent: (state, action) => {
      // Store lesson content in the state
      const { lessonId, content } = action.payload;
      state.lessons[lessonId] = content;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchModuleContent
      .addCase(fetchModuleContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModuleContent.fulfilled, (state, action) => {
        state.loading = false;
        state.currentModule = action.payload;
      })
      .addCase(fetchModuleContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch module content';
      })
      // Handle fetchLearnTree
      .addCase(fetchLearnTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLearnTree.fulfilled, (state, action) => {
        state.loading = false;
        state.contentTree = action.payload;
      })
      .addCase(fetchLearnTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch learn tree';
      })
      // Handle fetchLessonContent
      .addCase(fetchLessonContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonContent.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.content = action.payload.content.replace(/\\/g, '\\\\'); // Fix double backslashes
        state.lessons[action.payload.id] = action.payload;
      })
      .addCase(fetchLessonContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch lesson content';
      })
      
      // Handle saveModuleChanges
      .addCase(saveModuleChanges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveModuleChanges.fulfilled, (state) => {
        state.loading = false;
        // Clear unsaved changes after successful save
        state.unsavedChanges = {};
      })
      .addCase(saveModuleChanges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to save changes';
      })

      .addCase(saveNodeChanges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveNodeChanges.fulfilled, (state) => {
        state.loading = false;
        // Clear unsaved changes after successful save
        state.unsavedChanges = {};
      })
      .addCase(saveNodeChanges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to save node changes';
      })
      
      // Handle addContentItem
      .addCase(addContentItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContentItem.fulfilled, (state) => {
        state.loading = false;
        // The tree will be refreshed by the thunk, so no need to update it here
      })
      .addCase(addContentItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add new item';
      })
      
      // Handle deleteModule
      .addCase(deleteModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentModule?.id === action.payload.moduleId) {
          state.currentModule = null;
          state.contentTree = null;
        }
      })
      .addCase(deleteModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete module';
      })
      
      // Handle deleteNode
      .addCase(deleteNode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNode.fulfilled, (state) => {
        state.loading = false;
        // The tree will be refreshed by the thunk
      })
      .addCase(deleteNode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete node';
      })
      
      // Handle deleteLesson
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the lesson from the lessons object
        if (state.lessons[action.payload.lessonId]) {
          delete state.lessons[action.payload.lessonId];
        }
        // The tree will be refreshed by the thunk
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete lesson';
      })
      
      // Handle fetchFinishedLessonsForModule
      .addCase(fetchFinishedLessonsForModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinishedLessonsForModule.fulfilled, (state, action) => {
        state.loading = false;
        state.finishedLessonIds = action.payload;
      })
      .addCase(fetchFinishedLessonsForModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch finished lessons';
      })
      
      // Handle markLessonFinished
      .addCase(markLessonFinished.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markLessonFinished.fulfilled, (state, action) => {
        state.loading = false;
        const lessonId = action.payload;
        // Add to finishedLessonIds if not already included
        if (!state.finishedLessonIds.includes(lessonId)) {
          state.finishedLessonIds = [...state.finishedLessonIds, lessonId];
        }
      })
      .addCase(markLessonFinished.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to mark lesson as finished';
      });
  }
});

// Export the actions
export const { clearContentEditState, updateContentItem, addPendingItem, setLessonContent } = contentEditSlice.actions;

// Export the reducer
export default contentEditSlice.reducer;
