import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchModuleContent, 
  saveModuleChanges, 
  saveNodeChanges,
  deleteModule,
  deleteNode,
  deleteLesson,
  clearContentEditState,
  saveLessonContent,
  findNodeById
} from '../../../store/contentEditSlice';
import EditHeader from './components/EditHeader';
import ContentTree from './components/ContentTree';
import ModuleTab from './components/ModuleTab';
import FolderTab from './components/FolderTab';
import LessonTab from './components/LessonTab';
import UnsavedChangesDialog from './components/UnsavedChangesDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';

const LearnEdit = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const { contentTree, loading, error, currentModule } = useSelector(state => state.contentEdit);
  
  // State for managing tabs
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState({});
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigationPath, setPendingNavigationPath] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  useEffect(() => {
    dispatch(fetchModuleContent(moduleId));
  }, [dispatch, moduleId]);

  useEffect(() => {
    // When content tree is loaded, open the module tab by default
    if (currentModule && contentTree && contentTree.item && !tabs.length) {
      openTab({
        id: `module-${contentTree.item.id}`,
        type: 'module',
        itemId: contentTree.item.id,
        title: currentModule?.title
      });
    }
  }, [contentTree, tabs.length, currentModule]);

  const openTab = (newTab) => {
    // Check if tab already exists
    if (tabs.some(tab => tab.id === newTab.id)) {
      setActiveTabId(newTab.id);
      return;
    }
    
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId) => {
    if (unsavedChanges[tabId]) {
      // Show confirmation dialog
      setShowUnsavedDialog(true);
      setPendingNavigationPath(null);
      return;
    }
    
    // Close the tab and select another one
    setTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
    
    // If we're closing the active tab, select another tab
    if (activeTabId === tabId) {
      setActiveTabId(tabs.length > 1 ? tabs[tabs.length - 2].id : null);
    }
  };

  const handleSaveAll = async () => {
    const savePromises = Object.keys(unsavedChanges).map(tabId => handleSaveTab(tabId));
    await Promise.all(savePromises);
    
    // Clear unsaved changes after saving
    setUnsavedChanges({});
  };

  const handleSaveTab = async (tabId) => {
    // Extract just the changes for this tab
    const tabChanges = unsavedChanges[tabId] ;
    const tab = tabs.find(t => t.id === tabId);

    let result;
    switch (tab.type) {
      case 'module':
        result = await dispatch(saveModuleChanges({ moduleId, changes: tabChanges }));
        break;
      case 'folder':
        result = await dispatch(saveNodeChanges({ nodeId: tab.itemId, changes: tabChanges }));
        break;
      case 'lesson':
        result = await dispatch(saveLessonContent({ nodeId: tab.itemId, changes: tabChanges }));
        break;
    }
    
    if (result.meta.requestStatus === 'fulfilled') {
      setUnsavedChanges(prev => {
        const newUnsaved = { ...prev };
        delete newUnsaved[tabId];
        return newUnsaved;
      });
    }
  };

  const handleDeleteRequest = (item) => {
    setItemToDelete(item);
    setShowDeleteDialog(true);
    setActiveTabId(null);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      let result;
      switch (itemToDelete.type) {
        case 'module':
          result = await dispatch(deleteModule(currentModule.id));
          if (result.meta.requestStatus === 'fulfilled') {
            navigate('/learn');
          }
          break;
        case 'folder':
          result = await dispatch(deleteNode(itemToDelete.itemId));
          break;
        case 'lesson':
          const node = findNodeById(contentTree, itemToDelete.itemId);
          result = await dispatch(deleteLesson(node.item.lesson.id));
          break;
      }
      
      // Close the dialog regardless of whether the delete succeeded
      setShowDeleteDialog(false);
      setItemToDelete(null);
      
      // Close the tab if the delete succeeded
      if (result?.meta?.requestStatus === 'fulfilled') {
        setTabs(prevTabs => prevTabs.filter(tab => tab.id !== itemToDelete.id));
        if (activeTabId === itemToDelete.id) {
          setActiveTabId(tabs.length > 1 ? tabs[0].id : null);
        }
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleContentChange = (tabId, changes) => {
    setUnsavedChanges(prev => ({
      ...prev,
      [tabId]: {
        ...(prev[tabId] || {}),
        ...changes
      }
    }));
  };

  const handleExitEditor = () => {
    const hasUnsaved = Object.keys(unsavedChanges).length > 0;
    
    if (hasUnsaved) {
      setShowUnsavedDialog(true);
      setPendingNavigationPath('/learn');
    } else {
      setTabs([]);
      setActiveTabId(null);
      dispatch(clearContentEditState());
      navigate('/learn');
    }
  };

  const confirmNavigation = () => {
    setShowUnsavedDialog(false);
    if (pendingNavigationPath) {
      navigate(pendingNavigationPath);
    } else {
      // Close the current tab without saving
      const tabToClose = activeTabId;
      setUnsavedChanges(prev => {
        const newUnsaved = { ...prev };
        delete newUnsaved[tabToClose];
        return newUnsaved;
      });
      setTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabToClose));
      setActiveTabId(tabs.length > 1 ? tabs[tabs.length - 2].id : null);
    }
  };

  const cancelNavigation = () => {
    setShowUnsavedDialog(false);
    setPendingNavigationPath(null);
  };

  const renderTabContent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTabId);
    
    if (!currentTab) return null;

    switch (currentTab.type) {
      case 'module':
        return (
          <ModuleTab 
            moduleId={currentTab.itemId} 
            onChange={(changes) => handleContentChange(currentTab.id, changes)}
            unsavedChanges={unsavedChanges[currentTab.id]}
            onSave={() => handleSaveTab(currentTab.id)}
            onDelete={() => handleDeleteRequest({
              id: currentTab.id,
              itemId: currentTab.itemId,
              type: currentTab.type,
              title: currentTab.title
            })}
          />
        );
      case 'folder':
        return (
          <FolderTab 
            folderId={currentTab.itemId} 
            onChange={(changes) => handleContentChange(currentTab.id, changes)}
            unsavedChanges={unsavedChanges[currentTab.id]}
            onSave={() => handleSaveTab(currentTab.id)}
            onDelete={() => handleDeleteRequest({
              id: currentTab.id,
              itemId: currentTab.itemId,
              type: currentTab.type,
              title: currentTab.title
            })}
          />
        );
      case 'lesson':
        return (
          <LessonTab 
            nodeId={currentTab.itemId}
            onChange={(changes) => handleContentChange(currentTab.id, changes)}
            unsavedChanges={unsavedChanges[currentTab.id]}
            onSave={() => handleSaveTab(currentTab.id)}
            onDelete={() => handleDeleteRequest({
              id: currentTab.id,
              itemId: currentTab.itemId,
              type: currentTab.type,
              title: currentTab.title
            })}
          />
        );
      default:
        return null;
    }
  };

  if (loading && !contentTree) {
    return (
      <div className="flex flex-col min-h-screen">
        <EditHeader 
          title="Loading..."
          onSave={handleSaveAll}
          onExit={handleExitEditor}
          hasUnsavedChanges={false}
          disabled={true}
        />
        <div className="flex flex-grow justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <EditHeader 
          title="Error"
          onSave={handleSaveAll}
          onExit={handleExitEditor}
          hasUnsavedChanges={false}
          disabled={true}
        />
        <div className="flex flex-grow justify-center items-center">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  const moduleName = currentModule?.title || 'module Editor';
  const hasUnsavedChanges = Object.keys(unsavedChanges).length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <EditHeader 
        title={moduleName}
        onSave={handleSaveAll}
        onExit={handleExitEditor}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      <div className="flex flex-grow overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-75 min-w-75 border-r bg-base-100 overflow-y-auto">
          <ContentTree 
            contentTree={contentTree} 
            onSelectItem={(item) => {
              let type = 'folder';
              if (!item.title) type = 'module';
              if (item.lesson) type = 'lesson';
              
              openTab({
                id: `${type}-${item.id}`,
                type,
                itemId: item.id,
                title: item.lesson?.title || item.title || currentModule?.title
              });
            }}
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto">
          {/* Tab Navigation */}
          <div className="tabs w-full border-b">
            {tabs.map(tab => (
              <div key={tab.id} className="flex items-center">
                <button 
                  className={`tab tab-bordered ${tab.id === activeTabId ? 'tab-active' : ''}`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  {unsavedChanges[tab.id] && (
                    <div className="indicator-item indicator-start badge badge-warning badge-xs mr-1"></div>
                  )}
                  {tab.title}
                </button>
                <button 
                  className="btn btn-ghost btn-xs"
                  onClick={() => closeTab(tab.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="p-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
      
      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
      
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        itemType={itemToDelete?.type}
        itemName={itemToDelete?.title}
      />
    </div>
  );
};

export default LearnEdit;
