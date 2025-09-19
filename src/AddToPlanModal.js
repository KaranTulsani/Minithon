// src/AddToPlanModal.js

import React from 'react';

const AddToPlanModal = ({ isOpen, onClose, onAddToPlan, recipe }) => {
    if (!isOpen) return null;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add to Meal Plan</h2>
                <p>Select a day for <strong>{recipe.title}</strong>:</p>
                <div className="modal-days">
                    {days.map(day => (
                        <button key={day} onClick={() => onAddToPlan(day)}>
                            {day}
                        </button>
                    ))}
                </div>
                <button className="modal-close-btn" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default AddToPlanModal;