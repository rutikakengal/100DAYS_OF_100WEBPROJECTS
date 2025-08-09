from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date # Added 'date' for handling date input
import os
from werkzeug.security import generate_password_hash, check_password_hash # New Import for password hashing

app = Flask(__name__)

# --- Database Configuration ---
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'vibe_study_groups.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'somerandomlongstringthatisverysecretandunique12345!@#$'

db = SQLAlchemy(app)

# --- Database Models ---
class User(db.Model):
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    memberships = db.relationship('GroupMember', back_populates='user', lazy=True)
    subjects = db.Column(db.String(255), nullable=True) 
    topics = db.Column(db.String(255), nullable=True)   # Allow empty initially
    goals = db.Column(db.Text, nullable=True)
    exam_timeline = db.Column(db.Date, nullable=True)
    sent_messages = db.relationship('Message', back_populates='sender', lazy=True)
    accountability_entries = db.relationship('DailyAccountability', back_populates='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class GroupMember(db.Model):
    __tablename__ = 'group_members' 
    __table_args__ = {'extend_existing': True}
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('study_group.id'), primary_key=True)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='memberships')
    group = db.relationship('StudyGroup', back_populates='members')

    def __repr__(self):
        return f'<GroupMember User:{self.user_id} Group:{self.group_id}>'
    
class StudyGroup(db.Model):
    __tablename__ = 'study_group'
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # Creator of the group
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Matching criteria for the group
    subjects = db.Column(db.String(255), nullable=True)
    topics = db.Column(db.String(255), nullable=True)
    goals = db.Column(db.Text, nullable=True)
    exam_timeline = db.Column(db.Date, nullable=True)
    messages = db.relationship('Message', back_populates='group', cascade='all, delete-orphan', lazy=True)
    daily_goals = db.relationship('DailyAccountability', back_populates='group', cascade='all, delete-orphan', lazy=True)


    # Define relationships
    creator = db.relationship('User', foreign_keys=[creator_id], backref='created_groups', lazy=True)
    members = db.relationship('GroupMember', back_populates='group', cascade='all, delete-orphan', lazy=True)
    # cascade='all, delete-orphan' ensures that when a group is deleted, its membership records are also deleted.

    def __repr__(self):
        return f'<StudyGroup {self.name}>'
    
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('study_group.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    group = db.relationship('StudyGroup', back_populates='messages')
    sender = db.relationship('User', back_populates='sent_messages')

    def __repr__(self):
        return f'<Message {self.id} from {self.sender_id} in group {self.group_id}>'
    
class DailyAccountability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('study_group.id'), nullable=False)
    record_date = db.Column(db.Date, nullable=False, default=date.today) # Date for the goal
    goal_text = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='In Progress') 
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) # Automatically update timestamp

    # Relationships
    user = db.relationship('User', back_populates='accountability_entries')
    group = db.relationship('StudyGroup', back_populates='daily_goals')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'group_id', 'record_date', name='_user_group_date_uc'), 
        {'extend_existing': True} 
    )

    def __repr__(self):
        return f'<DailyGoal User:{self.user_id} Group:{self.group_id} Date:{self.record_date} Status:{self.status}>'




# --- Routes ---

@app.route('/')
def index():
    return render_template('index.html')

# --- Login Route ---
@app.route('/login', methods=['GET', 'POST']) # Allow both GET and POST
def login():
    if request.method == 'POST':
        identifier = request.form.get('identifier') # Can be username or email
        password = request.form.get('password')

        user = User.query.filter_by(username=identifier).first()
        if not user: # If not found by username, try by email
            user = User.query.filter_by(email=identifier).first()
        

        # Check if user exists and password is correct
        if user and check_password_hash(user.password_hash, password):
            # Password correct, log user in!
            session['user_id'] = user.id # Store user ID in session
            session['username'] = user.username # Store username in session
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard')) # Redirect to user's dashboard
        else:
            flash('Invalid username/email or password.', 'error')
            return render_template('login.html', identifier=identifier) 

    # For GET request or failed POST attempts
    return render_template('login.html')

# --- Registration Route ---
@app.route('/register', methods=['GET', 'POST']) # Allow both GET and POST requests
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        # --- Basic Server-Side Validation ---
        if not username or not email or not password or not confirm_password:
            flash('All fields are required.', 'error')
            return render_template('register.html', username=username, email=email)

        if password != confirm_password:
            flash('Passwords do not match.', 'error')
            return render_template('register.html', username=username, email=email)

        # Check if username or email already exists
        existing_user_username = User.query.filter_by(username=username).first()
        existing_user_email = User.query.filter_by(email=email).first()

        if existing_user_username:
            flash('Username already taken. Please choose a different one.', 'error')
            return render_template('register.html', username=username, email=email)
        if existing_user_email:
            flash('Email already registered. Please use a different email or login.', 'error')
            return render_template('register.html', username=username, email=email)

        # --- Hash the password ---
        hashed_password = generate_password_hash(password)

        # --- Create a new User object ---
        new_user = User(
            username=username,
            email=email,
            password_hash=hashed_password
        )

        # --- Add to database and commit ---
        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Registration successful! You can now log in.', 'success')
            return redirect(url_for('login')) # Redirect to login page after successful registration
        except Exception as e:
            db.session.rollback() # Rollback changes if an error occurs
            flash(f'An error occurred during registration: {e}', 'error')


    # For GET request or if POST request fails validation
    return render_template('register.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' in session:
        user_id = session['user_id'] # Get the user_id from session
        user = User.query.get(user_id) # Fetch the user object

        if user: # Make sure 'user' is not None before passing it
            return render_template('dashboard.html', username=session['username'], user=user)
        else:
            # If user ID is in session but user not found in DB (e.g., DB reset)
            session.pop('user_id', None) # Clear invalid session
            session.pop('username', None)
            flash('Your session is invalid. Please log in again.', 'error')
            return redirect(url_for('login'))
    else:
        flash('Please log in to access the dashboard.', 'error')
        return redirect(url_for('login'))

# --- Profile Edit Route ---
@app.route('/profile/edit', methods=['GET', 'POST'])
def profile_edit():
    if 'user_id' not in session: # Ensure user is logged in
        flash('Please log in to edit your profile.', 'error')
        return redirect(url_for('login'))

    user = User.query.get(session['user_id']) # Get the current user from the database

    if request.method == 'POST':
        # Get data from the form
        user.subjects = request.form.get('subjects')
        user.topics = request.form.get('topics')
        user.goals = request.form.get('goals')

        exam_date_str = request.form.get('exam_timeline')
        if exam_date_str: # Convert string date from form to Python date object
            try:
                user.exam_timeline = datetime.strptime(exam_date_str, '%Y-%m-%d').date()
            except ValueError:
                flash('Invalid exam date format. Please use YYYY-MM-DD.', 'error')
                return render_template('profile_edit.html', user=user)
        else:
            user.exam_timeline = None # Allow clearing the date

        try:
            db.session.commit() # Save changes to the database
            flash('Profile updated successfully!', 'success')
            return redirect(url_for('dashboard')) # Redirect to dashboard after update
        except Exception as e:
            db.session.rollback()
            flash(f'An error occurred while updating profile: {e}', 'error')

    # Pass the user object to the template to pre-fill the form
    return render_template('profile_edit.html', user=user)

# --- Logout Route ---
@app.route('/logout')
def logout():
    session.pop('user_id', None) # Remove user_id from session
    session.pop('username', None) # Remove username from session
    flash('You have been logged out.', 'info') 
    return redirect(url_for('index'))

# --- Create Group Route ---
@app.route('/create_group', methods=['GET', 'POST'])
def create_group():
    if 'user_id' not in session:
        flash('Please log in to create a study group.', 'error')
        return redirect(url_for('login'))

    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        subjects = request.form.get('subjects')
        topics = request.form.get('topics')
        goals = request.form.get('goals')
        exam_date_str = request.form.get('exam_timeline')

        # Basic Validation
        if not name:
            flash('Group name is required.', 'error')
            return render_template('create_group.html',
                                   name=name, description=description,
                                   subjects=subjects, topics=topics,
                                   goals=goals, exam_timeline=exam_date_str)

        # Check if group name already exists
        existing_group = StudyGroup.query.filter_by(name=name).first()
        if existing_group:
            flash('A group with this name already exists. Please choose a different name.', 'error')
            return render_template('create_group.html',
                                   name=name, description=description,
                                   subjects=subjects, topics=topics,
                                   goals=goals, exam_timeline=exam_date_str)

        # Handle exam date conversion
        exam_timeline_date = None
        if exam_date_str:
            try:
                exam_timeline_date = datetime.strptime(exam_date_str, '%Y-%m-%d').date()
            except ValueError:
                flash('Invalid exam date format. Please use YYYY-MM-DD.', 'error')
                return render_template('create_group.html',
                                       name=name, description=description,
                                       subjects=subjects, topics=topics,
                                       goals=goals, exam_timeline=exam_date_str)

        # Create new group
        new_group = StudyGroup(
            name=name,
            description=description,
            subjects=subjects,
            topics=topics,
            goals=goals,
            exam_timeline=exam_timeline_date,
            creator_id=session['user_id'] # Set the creator to the logged-in user
        )

        try:
            db.session.add(new_group)
            db.session.commit()

            # Automatically add the creator as a member of the group
            group_member = GroupMember(user_id=session['user_id'], group_id=new_group.id)
            db.session.add(group_member)
            db.session.commit()

            flash(f'Study Group "{name}" created successfully! You are now a member.', 'success')
            return redirect(url_for('dashboard')) # Or redirect to a group detail page
        except Exception as e:
            db.session.rollback()
            flash(f'An error occurred while creating the group: {e}', 'error')
            print(f"Error creating group: {e}") # For debugging

    # For GET request
    return render_template('create_group.html')


# --- Join Group Route ---
@app.route('/join_group/<int:group_id>')
def join_group(group_id):
    if 'user_id' not in session:
        flash('Please log in to join a study group.', 'error')
        return redirect(url_for('login'))

    user_id = session['user_id']
    group = StudyGroup.query.get(group_id)
    user = User.query.get(user_id)

    if not group:
        flash('Study group not found.', 'error')
        return redirect(url_for('find_groups')) # Redirect back to find groups

    if not user: 
        session.pop('user_id', None)
        session.pop('username', None)
        flash('Your session is invalid. Please log in again.', 'error')
        return redirect(url_for('login'))

    # Check if user is already a member
    existing_membership = GroupMember.query.filter_by(user_id=user_id, group_id=group_id).first()
    if existing_membership:
        flash(f'You are already a member of "{group.name}".', 'info')
        return redirect(url_for('dashboard')) # Or redirect to group details page

    # Create new membership
    new_membership = GroupMember(user_id=user_id, group_id=group.id)
    try:
        db.session.add(new_membership)
        db.session.commit()
        flash(f'Successfully joined group "{group.name}"!', 'success')
        return redirect(url_for('dashboard')) # Redirect to dashboard after joining
    except Exception as e:
        db.session.rollback()
        flash(f'An error occurred while trying to join the group: {e}', 'error')
        print(f"Error joining group: {e}") # For debugging
        return redirect(url_for('find_groups'))

# --- Group Details and Chat Route ---
@app.route('/group_details/<int:group_id>', methods=['GET', 'POST'])
def group_details(group_id):
    if 'user_id' not in session:
        flash('Please log in to view group details.', 'error')
        return redirect(url_for('login'))

    current_user = User.query.get(session['user_id'])
    if not current_user:
        session.pop('user_id', None)
        session.pop('username', None)
        flash('Your session is invalid. Please log in again.', 'error')
        return redirect(url_for('login'))

    group = StudyGroup.query.get(group_id)
    if not group:
        flash('Study group not found.', 'error')
        return redirect(url_for('dashboard')) # Or find_groups

    # Crucial security check: Is the logged-in user a member of this group?
    is_member = GroupMember.query.filter_by(user_id=current_user.id, group_id=group.id).first()
    if not is_member and group.creator_id != current_user.id:
        flash('You are not a member of this group.', 'error')
        return redirect(url_for('dashboard')) # Or redirect to find_groups

    # Handle submitting daily accountability goal (POST request)
    if request.method == 'POST':
        # Check if it's a message submission or a goal submission
        if 'message_content' in request.form:
            message_content = request.form.get('message_content')
            if message_content and message_content.strip():
                new_message = Message(
                    group_id=group.id,
                    sender_id=current_user.id,
                    content=message_content.strip()
                )
                try:
                    db.session.add(new_message)
                    db.session.commit()
                    return redirect(url_for('group_details', group_id=group.id))
                except Exception as e:
                    db.session.rollback()
                    flash(f'Error sending message: {e}', 'error')
                    print(f"Error sending message: {e}")
            else:
                flash('Message cannot be empty.', 'error')

        elif 'daily_goal_text' in request.form: # This handles goal submission
            goal_text = request.form.get('daily_goal_text')
            status = request.form.get('status_update', 'In Progress') # Default status

            if not goal_text or not goal_text.strip():
                flash('Daily goal cannot be empty.', 'error')
            else:
                # Check if an entry for today already exists for this user in this group
                existing_goal = DailyAccountability.query.filter_by(
                    user_id=current_user.id,
                    group_id=group.id,
                    record_date=date.today()
                ).first()

                if existing_goal:
                    existing_goal.goal_text = goal_text.strip()
                    existing_goal.status = status
                else:
                    new_goal = DailyAccountability(
                        user_id=current_user.id,
                        group_id=group.id,
                        goal_text=goal_text.strip(),
                        status=status
                    )
                    db.session.add(new_goal)

                try:
                    db.session.commit()
                    flash('Daily goal updated successfully!', 'success')
                    return redirect(url_for('group_details', group_id=group.id))
                except Exception as e:
                    db.session.rollback()
                    flash(f'Error saving daily goal: {e}', 'error')
                    print(f"Error saving daily goal: {e}")

    messages = Message.query.filter_by(group_id=group.id).order_by(Message.timestamp).all()
    group_members = [gm.user for gm in group.members]

    # Fetch today's goals for ALL members of this group
    today_goals = DailyAccountability.query.filter_by(
        group_id=group.id,
        record_date=date.today()
    ).all()

    # Create a dictionary for easy lookup in the template: {user_id: goal_object}
    today_goals_map = {goal.user_id: goal for goal in today_goals}
    user_group_ids = [m.group_id for m in current_user.memberships]
    return render_template('group_details.html',
                           group=group,
                           messages=messages,
                           current_user=current_user,
                           group_members=group_members,
                           today_goals_map=today_goals_map,
                           user_group_ids=user_group_ids)

# --- Leave Group Route ---
@app.route('/leave_group/<int:group_id>', methods=['POST'])
def leave_group(group_id):
    if 'user_id' not in session:
        flash('Please log in to leave a study group.', 'error')
        return redirect(url_for('login'))

    user_id = session['user_id']
    group = StudyGroup.query.get(group_id)

    if not group:
        flash('Study group not found.', 'error')
        return redirect(url_for('dashboard')) # Redirect if group doesn't exist

    # Find the specific membership record for the current user in this group
    membership = GroupMember.query.filter_by(user_id=user_id, group_id=group_id).first()

    if not membership:
        flash('You are not a member of this group.', 'info')
        return redirect(url_for('dashboard'))

    try:
        db.session.delete(membership) # Delete the membership record
        db.session.commit()
        flash(f'You have left the group "{group.name}".', 'success')
        return redirect(url_for('dashboard')) # Redirect to dashboard
    except Exception as e:
        db.session.rollback()
        flash(f'An error occurred while leaving the group: {e}', 'error')
        print(f"Error leaving group: {e}")
        return redirect(url_for('group_details', group_id=group.id))


# --- Delete Group Route (Creator Only) ---
@app.route('/delete_group/<int:group_id>', methods=['POST'])
def delete_group(group_id):
    if 'user_id' not in session:
        flash('Please log in to delete a study group.', 'error')
        return redirect(url_for('login'))

    user_id = session['user_id']
    group = StudyGroup.query.get(group_id)

    if not group:
        flash('Study group not found.', 'error')
        return redirect(url_for('dashboard'))

    # CRITICAL SECURITY CHECK: Only the creator can delete the group
    if group.creator_id != user_id:
        flash('You are not authorized to delete this group.', 'error')
        return redirect(url_for('group_details', group_id=group.id))

    try:
        db.session.delete(group) # Delete the group itself
        db.session.commit()
        flash(f'The group "{group.name}" has been deleted.', 'success')
        return redirect(url_for('dashboard')) # Redirect to dashboard after deletion
    except Exception as e:
        db.session.rollback()
        flash(f'An error occurred while deleting the group: {e}', 'error')
        print(f"Error deleting group: {e}")
        return redirect(url_for('group_details', group_id=group.id))


# --- Find Groups Route ---
@app.route('/find_groups')
def find_groups():
    if 'user_id' not in session:
        flash('Please log in to find study groups.', 'error')
        return redirect(url_for('login'))

    current_user = User.query.get(session['user_id'])
    if not current_user:
        # Handle case where user_id is in session but user doesn't exist (e.g., DB cleared)
        session.pop('user_id', None)
        session.pop('username', None)
        flash('Your session is invalid. Please log in again.', 'error')
        return redirect(url_for('login'))

    # --- Simple Matching Logic ---
    # Get user's subjects and topics, convert to lists for easier comparison
    user_subjects = [s.strip().lower() for s in current_user.subjects.split(',') if s.strip()] if current_user.subjects else []
    user_topics = [t.strip().lower() for t in current_user.topics.split(',') if t.strip()] if current_user.topics else []
    user_goals = current_user.goals.lower() if current_user.goals else ''
    user_exam_timeline = current_user.exam_timeline

    # Get IDs of groups the user is already a member of
    user_group_ids = [m.group_id for m in current_user.memberships]

    # Query all study groups, excluding ones the user is already a member of
    # ordered by creation date (newest first)
    all_groups = StudyGroup.query.order_by(StudyGroup.created_at.desc()).all()

    matching_groups = []
    for group in all_groups:
        score = 0
        # Convert group's subjects and topics to lists
        group_subjects = [s.strip().lower() for s in group.subjects.split(',') if s.strip()] if group.subjects else []
        group_topics = [t.strip().lower() for t in group.topics.split(',') if t.strip()] if group.topics else []
        group_goals = group.goals.lower() if group.goals else ''

        # Subject Match 
        if any(s in group_subjects for s in user_subjects) or any(s in user_subjects for s in group_subjects):
            score += 10

        # Topic Match 
        if any(t in group_topics for t in user_topics) or any(t in user_topics for t in group_topics):
            score += 5

        # Goal keyword match
        if user_goals and group_goals:
            if any(keyword in group_goals for keyword in user_goals.split()): 
                score += 2
            if any(keyword in user_goals for keyword in group_goals.split()):
                 score += 2

        # Exam Timeline proximity 
        if user_exam_timeline and group.exam_timeline:
            time_difference = abs((user_exam_timeline - group.exam_timeline).days)
            if time_difference <= 30: # Within 30 days
                score += 3
            elif time_difference <= 90: # Within 90 days
                score += 1

        if score > 0: # Only add groups that have some level of match
            matching_groups.append({'group': group, 'score': score})

    # Sort matching groups by score (highest first)
    matching_groups.sort(key=lambda x: x['score'], reverse=True)

    return render_template('find_groups.html',
                       user=current_user,
                       matching_groups=matching_groups,
                       user_group_ids=user_group_ids)

# --- Flask CLI Commands ---
@app.cli.command("init-db") 
def init_db_command():
    """Clear existing data and create new tables."""
    with app.app_context():
        db.drop_all() 
        db.create_all()
    print("Database initialized (all tables created).")

if __name__ == '__main__':
    app.run(debug=True)