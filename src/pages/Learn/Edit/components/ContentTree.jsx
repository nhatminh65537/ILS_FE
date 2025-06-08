import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addContentItem, fetchModuleContent } from "../../../../store/contentEditSlice";
import { fetchLessonTypes, selectLessonTypes } from "../../../../store/lessonTypesSlice";

const ContentTree = ({ contentTree, onSelectItem }) => {
  const dispatch = useDispatch();
  const lessonTypes= useSelector(selectLessonTypes);
  const { currentModule } = useSelector(state => state.contentEdit);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [newItemData, setNewItemData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchLessonTypes());
  }, [dispatch]);

  const toggleFolder = (folderId, event) => {
    event?.stopPropagation();
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const showNewItemDialog = (parentId) => {
    setNewItemData({
      parentId,
      type: "folder",
      title: "",
      description: "",
      lessonTypeId: "",
      xp: 0,
      duration: 0,
      errors: {},
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!newItemData.title.trim()) {
      errors.title = "Title is required";
    }

    if (newItemData.type === "lesson") {
      if (!newItemData.lessonTypeId) {
        errors.lessonTypeId = "Lesson type is required";
      }
    }

    setNewItemData({
      ...newItemData,
      errors,
    });

    return Object.keys(errors).length === 0;
  };

  const handleAddItem = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const newItem = {
        title: newItemData.title.trim(),
        description: newItemData.description.trim() || null,
        order: 0,
      };

      if (newItemData.type === "lesson") {
        newItem.lesson = {
          title: newItem.title,
          lessonType: { id: parseInt(newItemData.lessonTypeId) },
          xp: parseInt(newItemData.xp) || 0,
          duration: parseInt(newItemData.duration) || 0,
        };
      }

      let targetNode = findNodeById(contentTree, newItemData.parentId);
      if (targetNode) {
        if (!targetNode.children) {
          targetNode.children = [];
        }

        // Set expanded folder state
        setExpandedFolders((prev) => ({
          ...prev,
          [newItemData.parentId]: true,
        }));
        
        // Dispatch with updated parameters
        await dispatch(addContentItem({ 
          parentId: newItemData.parentId, 
          type: newItemData.type,
          newItem 
        }));
        await dispatch(fetchModuleContent(currentModule.id)); // Refresh the module content
      }
    } catch (error) {
      console.error("Failed to add item:", error);
    } finally {
      setNewItemData(null);
      setIsLoading(false);
    }
  };

  const findNodeById = (tree, id) => {
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

    return null;
  };

  const renderTreeItem = (node) => {
    if (!node?.item) return null;

    const item = node.item;
    const isLesson = !!item.lesson;
    const isModule = !item.title && !isLesson;
    const isFolder = !isModule && !isLesson;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedFolders[item.id];

    return (
      <div key={item.id} className="pl-4 border-l border-base-300">
        <div className="flex items-center py-1 hover:bg-base-200 rounded-md px-2 cursor-pointer">
          <div
            className="flex-grow flex items-center"
            onClick={() => onSelectItem(item)}
          >
            {hasChildren && (
              <button
                className="btn btn-xs btn-ghost mr-1"
                onClick={(e) => toggleFolder(item.id, e)}
              >
                {isExpanded ? "−" : "+"}
              </button>
            )}
            {!hasChildren && <span className="w-5 mr-1"></span>}

            {isModule && <span className="mr-2">📘</span>}
            {isLesson && <span className="mr-2">📝</span>}
            {isFolder && <span className="mr-2">📁</span>}
            <span>
              {item.module?.title || item.lesson?.title || item.title}
            </span>
          </div>

          {isFolder && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-xs btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36"
              >
                <li>
                  <a onClick={() => showNewItemDialog(item.id)}>Add Item</a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2">
            {node.children.map((child) => renderTreeItem(child))}
          </div>
        )}
      </div>
    );
  };

  const renderNewItemDialog = () => {
    if (!newItemData) return null;

    return (
      <dialog open className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Item</h3>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Item Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={newItemData.type}
              onChange={(e) =>
                setNewItemData({ ...newItemData, type: e.target.value })
              }
            >
              <option value="folder">Folder</option>
              <option value="lesson">Lesson</option>
            </select>
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">
                Title <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter title"
              className={`input input-bordered w-full ${
                newItemData.errors?.title ? "input-error" : ""
              }`}
              value={newItemData.title}
              onChange={(e) =>
                setNewItemData({
                  ...newItemData,
                  title: e.target.value,
                  errors: { ...newItemData.errors, title: null },
                })
              }
            />
            {newItemData.errors?.title && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {newItemData.errors.title}
                </span>
              </label>
            )}
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Enter description"
              className="textarea textarea-bordered w-full"
              value={newItemData.description}
              onChange={(e) =>
                setNewItemData({ ...newItemData, description: e.target.value })
              }
            ></textarea>
          </div>

          {newItemData.type === "lesson" && (
            <>
              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text">
                    Lesson Type <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  className={`select select-bordered w-full ${
                    newItemData.errors?.lessonTypeId ? "select-error" : ""
                  }`}
                  value={newItemData.lessonTypeId}
                  onChange={(e) =>
                    setNewItemData({
                      ...newItemData,
                      lessonTypeId: e.target.value,
                      errors: { ...newItemData.errors, lessonTypeId: null },
                    })
                  }
                >
                  <option value="">Select lesson type</option>
                  {lessonTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {newItemData.errors?.lessonTypeId && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {newItemData.errors.lessonTypeId}
                    </span>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">XP</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input input-bordered w-full"
                    value={newItemData.xp}
                    onChange={(e) =>
                      setNewItemData({ ...newItemData, xp: e.target.value })
                    }
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Duration (minutes)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input input-bordered w-full"
                    value={newItemData.duration}
                    onChange={(e) =>
                      setNewItemData({
                        ...newItemData,
                        duration: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </>
          )}

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => setNewItemData(null)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAddItem}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </dialog>
    );
  };

  return (
    <div className="p-4">
      <div className="font-bold mb-2 p-2 bg-base-200 rounded">
        Content Structure
      </div>

      {contentTree && (
        <div
          className="cursor-pointer flex items-center p-2 hover:bg-base-200 rounded-md mb-4"
          onClick={() => onSelectItem(contentTree.item)}
        >
          <span className="mr-2">📘</span>
          <span className="font-semibold">{currentModule?.title}</span>
        </div>
      )}

      <div className="overflow-y-auto">
        {contentTree?.children?.map((node) => renderTreeItem(node))}

        {contentTree && (
          <div className="pl-4 border-l border-base-300">
            <div
              className="flex items-center py-1 hover:bg-base-200 rounded-md px-2 cursor-pointer text-primary"
              onClick={() => showNewItemDialog(contentTree.item.id)}
            >
              <span className="w-5 mr-1"></span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span>Add New Item</span>
            </div>
          </div>
        )}
      </div>

      {renderNewItemDialog()}
    </div>
  );
};

export default ContentTree;
