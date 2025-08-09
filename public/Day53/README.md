# Vibe Study Groups

## 🎯 Problem Statement
Students want to study together but can’t easily find others with similar subjects or schedules.

## 🚀 Solution
Vibe Study Groups is a matching tool designed to help students form micro study groups based on shared subjects, topics, goals, and exam timelines. It includes a chat feature for group communication and daily accountability features to help members stay on track.

## ✨ Features

* **User Authentication:** Secure registration, login, and logout.
* **Personalized Profiles:** Users can update their subjects, topics, study goals, and exam timelines to enhance matching.
* **Study Group Creation:** Logged-in users can create new study groups with specific criteria (name, description, subjects, topics, goals, exam dates).
* **Smart Group Matching:** An intelligent (rule-based) algorithm suggests relevant study groups to users based on their profile data (subjects, topics, and exam proximity).
* **Group Management:**
    * **Join Group:** Users can join available study groups.
    * **Leave Group:** Members can leave groups they no longer wish to be part of.
    * **Delete Group:** Group creators can delete their groups, which also removes all associated memberships and chat messages.
* **Real-time Chat (Refresh-based):** Micro study groups include a dedicated chat interface for members to communicate, with messages displayed dynamically upon page refresh.
* **Daily Accountability:** Within each group, users can set and update their daily study goals and track their status ('In Progress', 'Completed', 'Stuck'). Other group members can view these updates.

## 🛠️ Technologies Used

* **Backend:** Python, Flask
* **Database:** SQLite (for simplicity)
* **ORM:** Flask-SQLAlchemy
* **Password Hashing:** Werkzeug Security
* **Frontend:** HTML5, CSS3, JavaScript (basic interactivity)

## ⚙️ Setup Instructions (For Local Development)

Follow these steps to get a copy of the project up and running on your local machine.

### Prerequisites

* Python 3.8+
* `pip` (Python package installer)

### Installation

1.  **Clone the repository:**

2.  **Create and activate a Python virtual environment:**
    * **Windows (Command Prompt):**
        ```bash
        python -m venv venv
        venv\Scripts\activate
        ```
    * **Windows (PowerShell):**
        ```powershell
        python -m venv venv
        .\venv\Scripts\Activate.ps1
        # If script execution is disabled, run PowerShell as Administrator and execute:
        ```
    * **macOS / Linux:**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```

3.  **Install the required Python packages:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Initialize the database:**
    This will create the `instance/vibe_study_groups.db` file and set up all the necessary tables.
    ```bash
    flask --app app init-db
    ```
    *Note: If you encounter an error like "Table is already defined...", ensure your server is stopped, delete `instance/vibe_study_groups.db`, and retry `flask --app app init-db`.*

5.  **Run the Flask application:**
    ```bash
    flask --app app run --no-reload --debug
    ```
    *The `--no-reload` flag is used to prevent issues during development with certain environments.*

The application should now be running at `http://127.0.0.1:5000/`.

## 🚀 How to Use / Demo Steps

1.  **Register:** Navigate to `/register` to create a new user account.
2.  **Login:** Use your new credentials to log in.
3.  **Complete Your Profile:** Go to "Profile" and update your subjects, topics, goals, and exam timelines. This is crucial for the matching algorithm!
4.  **Create a Group:** Go to "Create Group" and define a new study group. (You are automatically a member of groups you create).
5.  **Test Join (with a second user):**
    * Logout of your current user.
    * Register a second user.
    * Login as the second user.
    * Complete the second user's profile with overlapping subjects/topics to ensure a match.
    * Go to "Find Groups" and find the group created by the first user. You should see a "Join Group" button. Click it.
6.  **Explore Group Details:** From the Dashboard, click on a group name under "Your Study Groups".
    * **Chat:** Send messages and observe them. Log in as other members to see cross-user chat.
    * **Daily Accountability:** Set your daily goal and status. Observe other members' goals.
    * **Leave Group:** (As a non-creator member) click "Leave Group" and confirm.
    * **Delete Group:** (As the Group Creator) click "Delete Group" and confirm.
        * *Warning: This action is irreversible and deletes all group data, members, and messages.*




## 📄 License

This project is licensed under the MIT License - see the LICENSE.md file for details.
