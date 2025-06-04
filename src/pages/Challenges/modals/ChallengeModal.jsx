import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChallengeProblem, checkFlag } from '../../../store/challengeSlice';

const ChallengeModal = ({ challengeId, onClose }) => {
  const dispatch = useDispatch();
  const { currentProblem, loadingProblem } = useSelector(state => state.challenge);
  const [flagInput, setFlagInput] = useState('');
  const [submission, setSubmission] = useState(null);

  // useEffect(() => {
  //   if (challengeId) {
  //     dispatch(fetchChallengeProblem(challengeId));
  //   }
  // }, [challengeId, dispatch]);

  const handleSubmitFlag = async (e) => {
    e.preventDefault();
    if (!flagInput.trim()) return;
    try {
      const result = await dispatch(checkFlag({ challengeId: currentProblem.id, flag: flagInput })).unwrap();
      setSubmission({
        correct: !!result.isCorrect,
        message: result.isCorrect ? 'Correct flag! Challenge completed.' : 'Incorrect flag. Try again!'
      });
      setFlagInput('');
    } catch (err) {
      setSubmission({ correct: false, message: 'Error submitting flag.' });
    }
  };

  if (loadingProblem) {
    return (
      <dialog open className="modal modal-open">
        <div className="modal-box">
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </dialog>
    );
  }

  if (!currentProblem) {
    return (
      <dialog open className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Challenge not found</h3>
          <div className="modal-action">
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </dialog>
    );
  }

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-xl mb-2">{currentProblem.title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="badge badge-accent">{currentProblem.category?.name || 'Uncategorized'}</div>
          <div className="badge badge-secondary">XP: {currentProblem.xp}</div>
          <div className="badge badge-primary">{currentProblem.challengeState?.name || 'Unknown state'}</div>
          {currentProblem.tags?.map(tag => (
            <div key={tag.id} className="badge badge-outline">{tag.name}</div>
          ))}
          {currentProblem.isSolved && (
            <div className="badge badge-success ml-2">Solved</div>
          )}
        </div>
        
        <div className="prose max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: currentProblem.content }} />
        </div>
        
        {currentProblem.files?.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Files:</h4>
            <ul className="list-disc pl-5">
              {currentProblem.files.map(file => (
                <li key={file.id}>
                  <a 
                    href={file.filePath} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link link-primary"
                  >
                    {file.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {!currentProblem.isSolved && (
          <form onSubmit={handleSubmitFlag}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Submit flag:</span>
              </label>
              <div className="join w-full">
                <input 
                  type="text" 
                  placeholder="Enter flag here..." 
                  className="input input-bordered join-item w-full" 
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary join-item">
                  Submit
                </button>
              </div>
            </div>
          </form>
        )}
        
        {submission && (
          <div className={`alert ${submission.correct ? 'alert-success' : 'alert-error'} mt-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              {submission.correct ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <span>{submission.message}</span>
          </div>
        )}
        
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default ChallengeModal;
