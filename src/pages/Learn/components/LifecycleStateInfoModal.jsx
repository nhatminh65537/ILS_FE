import React from 'react';

const LifecycleStateInfoModal = ({ 
  isOpen, 
  onClose, 
  lifecycleState 
}) => {
  return (
    <dialog id="lifecycle_state_info_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Lifecycle State Information</h3>
        <div className="py-4">
          <div className="mb-4">
            <h4 className="font-semibold">Name:</h4>
            <p>{lifecycleState?.name}</p>
          </div>
          
          <div>
            <h4 className="font-semibold">Description:</h4>
            <p>{lifecycleState?.description || 'No description available'}</p>
          </div>
        </div>
        
        <div className="modal-action">
          <button 
            className="btn" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default LifecycleStateInfoModal;
