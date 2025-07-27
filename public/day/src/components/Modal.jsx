// Pop up overlay to view the workout components.

// Importing React and ReactDom for creating the modal portal
import React from 'react';
import ReactDom from 'react-dom';

// Modal component definition
export default function Modal(props) 
{

    // Destructuring props to get the modal state and close handler
    const { showExerciseDescription, handleCloseModal } = props
    // Extracting name and description from the exercise object, or defaulting to empty object
    const { name, description } = showExerciseDescription || {};
    
    // Rendering the modal using React Portal to the 'portal' DOM node
    return ReactDom.createPortal((
        <div className='modal-container'>
            {/* Underlay button to close the modal when clicked outside the content */}
            <button className='modal-underlay' onClick={handleCloseModal}/>
            <div className='modal-content'>
                <div>
                    {/* Displaying the exercise name, replacing hyphens with spaces for readability */}
                    <h6>Name</h6>
                    <h2 className='skill-name'>{name.replaceAll('-', ' ')}</h2>
                </div>
                <div>
                    {/* Displaying the exercise description */}
                    <h6>Description</h6>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    ), document.getElementById('portal'))
} // Mounts the modal to the portal element in