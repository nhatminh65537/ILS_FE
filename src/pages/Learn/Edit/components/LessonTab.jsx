import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLessonContent, findNodeById } from '../../../../store/contentEditSlice';
import MyEditor from '../../../../ckeditor';

// import { MDXEditor, toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles } from '@mdxeditor/editor'
// import { headingsPlugin } from '@mdxeditor/editor'

// import '@mdxeditor/editor/style.css'

const LessonTab = ({ nodeId, onChange, unsavedChanges = {}, onSave, onDelete }) => {
  const { lessons, contentTree } = useSelector(state => ({
    lessons: state.contentEdit.lessons || {},
    contentTree: state.contentEdit.contentTree || {}
  }));
  
  const node = findNodeById(contentTree, nodeId);
  const lessonId = node?.item?.lesson?.id;

  const dispatch = useDispatch();
  useEffect(() => {
    if (!lessons[lessonId]) {
      dispatch(fetchLessonContent(lessonId));  // Fetch lesson data if not already present
    }
  }, [lessonId, lessons, dispatch]);

  const lessonData = lessons[node.item.lesson.id] || {};
  const [isEditingContent, setIsEditingContent] = useState(true);
  
  const handleChange = (field, value) => {
    onChange({ [field]: value }, 'lesson');  // Add 'lesson' type
  };
  
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    if (data === lessonData.content) {
      return;  
    }
    onChange({ content: data }, 'lesson');  // Add 'lesson' type
  };
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Lesson: {lessonData.title || "Untitled"}
        </h2>

        <label className="swap swap-flip">
          <input
            type="checkbox"
            checked={isEditingContent}
            onChange={() => setIsEditingContent(!isEditingContent)}
          />
          <div className="swap-on btn btn-sm">Edit Info</div>
          <div className="swap-off btn btn-sm">Edit Content</div>
        </label>
      </div>

      {isEditingContent ? (
        <div className="prose-sm border rounded-lg p-4 mr-20 ml-20 bg-base-100">
          <MyEditor
            id={`lesson-content-editor-${lessonId}`}
            data={
              (unsavedChanges.content !== undefined
                ? unsavedChanges.content
                : lessonData.content) || ""
            }
            onChange={handleEditorChange}
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label block">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={
                  (unsavedChanges.title !== undefined
                    ? unsavedChanges.title
                    : lessonData.title) || ""
                }
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label block">
                <span className="label-text">Order</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-32"
                value={
                  (unsavedChanges.order !== undefined
                    ? unsavedChanges.order
                    : node.item.order) || ""
                }
                onChange={(e) =>
                  handleChange("order", parseInt(e.target.value))
                }
              />
            </div>

            <div className="form-control">
              <label className="label block">
                <span className="label-text">XP</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-32"
                value={
                  (unsavedChanges.xp !== undefined
                    ? unsavedChanges.xp
                    : lessonData.xp) || ""
                }
                onChange={(e) => handleChange("xp", parseInt(e.target.value))}
              />
            </div>

            <div className="form-control">
              <label className="label block">
                <span className="label-text">Duration (minutes)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-32"
                value={
                  (unsavedChanges.duration !== undefined
                    ? unsavedChanges.duration
                    : lessonData.duration) || ""
                }
                onChange={(e) =>
                  handleChange("duration", parseInt(e.target.value))
                }
              />
            </div>
          </div>

          <div className="form-control mt-6">
            <label className="label block">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              value={
                (unsavedChanges.description !== undefined
                  ? unsavedChanges.description
                  : node.item.description) || ""
              }
              onChange={(e) => handleChange("description", e.target.value)}
            ></textarea>
          </div>
        </div>
      )}

      <div className="mt-8 border-t pt-4">
        <button className="btn btn-error" onClick={onDelete}>
          Delete Lesson
        </button>
      </div>

      {/* Floating save button */}
      {Object.keys(unsavedChanges || {}).length > 0 && (
        <div className="fixed bottom-6 right-6">
          <button className="btn btn-primary" onClick={onSave}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonTab;
