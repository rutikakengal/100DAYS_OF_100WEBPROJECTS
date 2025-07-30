        // DOM Elements
        const welcomeModal = document.getElementById('welcome-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const studentNameInput = document.getElementById('student-name-input');
        const studentNameDisplay = document.getElementById('student-name-display');
        const subjectsContainer = document.getElementById('subjects-container');
        const addSubjectBtn = document.getElementById('add-subject-btn');
        const calculateGradesBtn = document.getElementById('calculate-grades-btn');
        const gradeCardSection = document.getElementById('grade-card-section');
        const gradeCardDetailsBody = document.querySelector('#grade-card-details tbody'); // Targeting tbody
        const totalMarksDisplay = document.getElementById('total-marks-display'); // Targeting total marks display
        const motivationMessageDiv = document.getElementById('motivation-message');

        let subjectCount = 0; // To keep track of subjects for unique IDs
        let studentName = ''; // To store the student's name

        // --- Utility Functions ---

        /**
         * Displays a custom message box instead of alert().
         * @param {string} message - The message to display.
         * @param {string} type - 'success', 'error', 'info' for styling.
         */
        function showMessageBox(message, type = 'info') {
            let bgColor = 'bg-blue-500';
            if (type === 'success') bgColor = 'bg-green-500';
            else if (type === 'error') bgColor = 'bg-red-500';

            const messageBox = document.createElement('div');
            messageBox.className = `fixed bottom-5 right-5 p-4 rounded-lg text-white shadow-lg ${bgColor} z-50 transition-all duration-300 ease-in-out transform translate-y-full opacity-0`;
            messageBox.textContent = message;
            document.body.appendChild(messageBox);

            setTimeout(() => {
                messageBox.classList.remove('translate-y-full', 'opacity-0');
                messageBox.classList.add('translate-y-0', 'opacity-100');
            }, 50); // Small delay for animation

            setTimeout(() => {
                messageBox.classList.remove('translate-y-0', 'opacity-100');
                messageBox.classList.add('translate-y-full', 'opacity-0');
                messageBox.addEventListener('transitionend', () => messageBox.remove());
            }, 3000); // Hide after 3 seconds
        }

        /**
         * Calculates the grade based on marks.
         * @param {number} marks - The marks obtained.
         * @returns {string} The corresponding grade.
         */
        function calculateGrade(marks) {
            if (marks >= 90) return 'A+';
            if (marks >= 80) return 'A';
            if (marks >= 70) return 'B';
            if (marks >= 60) return 'C';
            if (marks >= 50) return 'D';
            return 'F';
        }

        /**
         * Returns a motivational message based on the average percentage.
         * @param {number} averagePercentage - The average percentage of all subjects.
         * @returns {string} A motivational quote or message.
         */
        function getMotivationMessage(averagePercentage) {
            const messages = {
                excellent: [
                    "Outstanding work! Your dedication truly shines through. Keep aiming high!",
                    "Fantastic results! You're a true academic star. Celebrate your success!",
                    "Brilliant! Your hard work has paid off. Continue to inspire!",
                    "Exceptional performance! The future is bright with your talent."
                ],
                good: [
                    "Great job! You're on a strong path to success. Keep up the excellent effort!",
                    "Well done! Your consistent effort is commendable. Keep pushing forward!",
                    "Solid performance! You're building a strong foundation. Keep learning and growing.",
                    "Impressive results! Your commitment is clear. Stay focused on your goals."
                ],
                average: [
                    "Good effort! There's always room for growth. Keep learning and improving!",
                    "You're doing well! A little extra effort can make a big difference. Believe in yourself!",
                    "Steady progress! Every step forward counts. Keep working towards your best.",
                    "You've got this! Focus on your strengths and work on your challenges. You can do it!"
                ],
                needsImprovement: [
                    "Don't give up! Every challenge is an opportunity to learn and grow. You have the potential!",
                    "It's okay to struggle, but it's not okay to quit. Keep pushing, you'll get there!",
                    "Learning is a journey, not a destination. Identify areas for improvement and keep trying!",
                    "Your effort today builds your success tomorrow. Seek help, practice, and persevere!"
                ]
            };

            let category;
            if (averagePercentage >= 85) {
                category = 'excellent';
            } else if (averagePercentage >= 70) {
                category = 'good';
            } else if (averagePercentage >= 50) {
                category = 'average';
            } else {
                category = 'needsImprovement';
            }

            const categoryMessages = messages[category];
            return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
        }


        // --- Event Handlers ---

        /**
         * Handles the click event for the "Add Subject" button.
         * Dynamically adds new subject input fields.
         */
        function addSubjectInput() {
            subjectCount++;

            const subjectDiv = document.createElement('div');
            subjectDiv.className = 'flex flex-col sm:flex-row gap-3 items-center bg-gray-50 p-4 rounded-lg shadow-sm subject-row-enter';
            subjectDiv.id = `subject-${subjectCount}`;

            subjectDiv.innerHTML = `
                <div class="flex-1 w-full">
                    <label for="subject-name-${subjectCount}" class="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                    <input type="text" id="subject-name-${subjectCount}" placeholder="e.g., Mathematics" class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="w-full sm:w-auto">
                    <label for="subject-marks-${subjectCount}" class="block text-sm font-medium text-gray-700 mb-1">Marks (0-100)</label>
                    <input type="number" id="subject-marks-${subjectCount}" placeholder="e.g., 85" min="0" max="100" class="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                </div>
                <button type="button" data-subject-id="${subjectCount}" class="remove-subject-btn mt-4 sm:mt-0 px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 active:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75">
                    Remove
                </button>
            `;

            subjectsContainer.appendChild(subjectDiv);
            // Trigger animation
            setTimeout(() => {
                subjectDiv.classList.remove('subject-row-enter');
                subjectDiv.classList.add('subject-row-enter-active');
            }, 10); // Small delay to allow CSS to register initial state
            showMessageBox('Subject added!', 'success');
        }

        /**
         * Handles the click event for the "Remove" button on a subject.
         * Removes the corresponding subject input fields.
         * @param {Event} event - The click event.
         */
        function removeSubjectInput(event) {
            const button = event.target;
            if (button.classList.contains('remove-subject-btn')) {
                const subjectId = button.dataset.subjectId;
                const subjectDiv = document.getElementById(`subject-${subjectId}`);
                if (subjectDiv) {
                    subjectDiv.classList.remove('subject-row-enter-active');
                    subjectDiv.classList.add('subject-row-exit-active');
                    subjectDiv.addEventListener('transitionend', () => {
                        subjectDiv.remove();
                        showMessageBox('Subject removed!', 'info');
                    }, { once: true });
                }
            }
        }

        /**
         * Handles the click event for the "Check Marks" button.
         * Gathers data, calculates grades, and displays the grade card.
         */
        function calculateAndDisplayGrades() {
            const subjectInputs = subjectsContainer.querySelectorAll('.flex-col.sm\\:flex-row.gap-3');
            const grades = [];
            let totalMarks = 0;
            let totalPossibleMarks = 0;
            let isValid = true;

            // Reset input error states
            subjectInputs.forEach(subjectDiv => {
                subjectDiv.querySelector('input[type="text"]').classList.remove('input-error');
                subjectDiv.querySelector('input[type="number"]').classList.remove('input-error');
            });


            if (subjectInputs.length === 0) {
                showMessageBox('Please add at least one subject.', 'error');
                gradeCardSection.classList.add('hidden'); // Hide grade card if no subjects
                return;
            }

            subjectInputs.forEach((subjectDiv, index) => {
                const subjectNameInput = subjectDiv.querySelector('input[type="text"]');
                const subjectMarksInput = subjectDiv.querySelector('input[type="number"]');

                const name = subjectNameInput.value.trim();
                const marks = parseFloat(subjectMarksInput.value);

                if (!name) {
                    subjectNameInput.classList.add('input-error');
                    showMessageBox(`Subject name for row ${index + 1} cannot be empty.`, 'error');
                    isValid = false;
                }
                if (isNaN(marks) || marks < 0 || marks > 100) {
                    subjectMarksInput.classList.add('input-error');
                    showMessageBox(`Marks for ${name || 'Subject ' + (index + 1)} must be between 0 and 100.`, 'error');
                    isValid = false;
                }

                if (isValid) { // Only push if valid to avoid partial data
                    grades.push({
                        name: name,
                        marks: marks,
                        grade: calculateGrade(marks)
                    });
                    totalMarks += marks;
                    totalPossibleMarks += 100; // Each subject is out of 100
                }
            });

            if (!isValid) {
                gradeCardSection.classList.add('hidden');
                return;
            }

            // Display Student Name
            studentNameDisplay.textContent = studentName ? `Student: ${studentName}` : 'Student: N/A';

            // Display Grade Card
            gradeCardDetailsBody.innerHTML = ''; // Clear previous content in tbody

            grades.forEach(subject => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="text-gray-700 font-medium">${subject.name}</td>
                    <td class="text-gray-600">${subject.marks}/100</td>
                    <td class="font-semibold ${subject.grade === 'F' ? 'text-red-500' : 'text-blue-600'}">${subject.grade}</td>
                `;
                gradeCardDetailsBody.appendChild(row);
            });

            // Update total marks in the tfoot
            totalMarksDisplay.textContent = `${totalMarks} / ${totalPossibleMarks}`;

            // Calculate average percentage for motivation
            const averagePercentage = totalPossibleMarks > 0 ? (totalMarks / totalPossibleMarks) * 100 : 0;
            motivationMessageDiv.textContent = getMotivationMessage(averagePercentage);
            motivationMessageDiv.classList.remove('hidden');

            gradeCardSection.classList.remove('hidden');
            showMessageBox('Grades calculated successfully!', 'success');

            // Scroll to the grade card section
            gradeCardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }


        // --- Initial Setup and Event Listeners ---

        // Show welcome modal on page load
        window.onload = () => {
            welcomeModal.classList.remove('hidden');
            setTimeout(() => {
                welcomeModal.classList.add('show');
                studentNameInput.focus(); // Focus on name input
            }, 50); // Small delay to trigger transition
            addSubjectInput(); // Add one subject input by default
        };

        // Close welcome modal
        closeModalBtn.addEventListener('click', () => {
            studentName = studentNameInput.value.trim(); // Store the student's name
            if (!studentName) {
                showMessageBox('Please enter your name to continue.', 'error');
                studentNameInput.focus();
                return;
            }

            welcomeModal.classList.remove('show');
            welcomeModal.addEventListener('transitionend', () => {
                welcomeModal.classList.add('hidden');
            }, { once: true }); // Remove hidden class only after transition
        });

        // Add subject button click
        addSubjectBtn.addEventListener('click', addSubjectInput);

        // Event delegation for removing subjects
        subjectsContainer.addEventListener('click', removeSubjectInput);

        // Calculate grades button click
        calculateGradesBtn.addEventListener('click', calculateAndDisplayGrades);
