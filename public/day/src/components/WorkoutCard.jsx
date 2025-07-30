// Logic for: When a user clicks on a workout and wants to see the details, 
// input the weights and all other details.
import { useState } from 'react';
import React from 'react';
import Modal from './Modal';
import { exerciseDescriptions } from '../utils';

export default function WorkoutCard(props) {

    // Thumb Rule: To tie a variable to user interaction, it should be 
    // declared in React Stateful Variable format rather than a traditional variable.

    // Destructuring props to get trainingPlan, workoutIndex, type, dayNum, and icon

    const { trainingPlan, workoutIndex, type, dayNum, icon, savedWorkouts,
        handleSave, handleComplete 
     } = props;

    const {warmup, workout} = trainingPlan || {};
    const [showExerciseDescription, setShowExerciseDescription] = useState(null);
    const [weights, setWeights] = useState(savedWorkouts || {});

    function handleAddWeight(title, weight) {
        (title, weight);
        const newObj = {
            ...weights, 
            [title]:weight
        }
        setWeights(newObj);
    }
    return (
        <div className='workout-container'>
            {/*Modal to show exercise details*/} 
            {showExerciseDescription && (
                <Modal showExerciseDescription={showExerciseDescription} 
                handleCloseModal={() => {
                    setShowExerciseDescription(null);
                }}/> 
            )}   
            <div className='workout-card card'>
                <div className='plan-card-header'> 
                    <p>Day {dayNum}</p>
                    {icon}
                </div>
                <div className='plan-card-header'>
                    <h2><b>{type} Workout</b></h2>
                </div>
            </div>


            <div className='workout-grid'>
                <div className='exercise-name'>
                    <h4>Warmup</h4>
                </div>
                <h6>Sets</h6>
                <h6>Reps</h6>
                <h6 className='weight-input'>Max Weight</h6>
                {warmup.map((warmupExercise, warmupIndex) => {
                    return (
                        <React.Fragment key={warmupIndex}>
                            <div className='exercise-name'>
                                <p>{warmupIndex + 1}. {warmupExercise.name}</p>
                                <button onClick={() => {
                                    setShowExerciseDescription({
                                        name: warmupExercise.name,
                                        description: exerciseDescriptions
                                        [warmupExercise.name]
                                    })
                                }} className='help-icon'>
                                    <i className='fa-regular fa-circle-question' />
                                </button>
                            </div>
                            <p className='exercise-info'>{warmupExercise.sets}</p>
                            <p className='exercise-info'>{warmupExercise.reps}</p>
                            <input className='weight-input' placeholder='N/A' disabled />
                            </React.Fragment>
                    );
                })}
            </div>

            <div className='workout-grid'>
                <div className='exercise-name'>
                    <h4>Workout</h4>
                </div>
                <h6>Sets</h6>
                <h6>Reps</h6>
                <h6 className='weight-input'>Max Weight</h6>
                {workout.map((workoutExercise, workoutIndex) => {
                    return (
                        <React.Fragment key={workoutIndex}>
                            <div className='exercise-name'>
                                <p>{workoutIndex + 1}, {workoutExercise.name}</p>
                                <button onClick={() => {
                                    setShowExerciseDescription({
                                        name: workoutExercise.name,
                                        description: exerciseDescriptions
                                        [workoutExercise.name]
                                    })
                                }} className='help-icon'>
                                    <i className='fa-regular fa-circle-question' />
                                </button>
                            </div>
                            <p className='exercise-info'>{workoutExercise.sets}</p>
                            <p className='exercise-info'>{workoutExercise.reps}</p>
                            <input value={weights[workoutExercise.name] || ''} 
                            onChange={(e) => {
                                handleAddWeight(workoutExercise.name, e.target.value)
                            }} 
                            className='weight-input' placeholder='14 ' />
                        </React.Fragment>
                    );
                    })}
            </div>

            <div className='workout-button'>
                <button onClick={() => {
                    handleSave(workoutIndex, {weights})
                }}>Save & Exit</button>
                <button onClick={() => {
                    handleComplete(workoutIndex, {weights})
                }} disabled={Object.keys(weights).length !== workout.length}>Complete</button>
            </div>

        </div>
    )
}