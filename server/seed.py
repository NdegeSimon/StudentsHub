# seed.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from models import db, User, AcademicYear, Semester, Department, Classroom, Course, Enrollment
from models import Assignment, Grade, Attendance, Announcement, Library, Book, LibraryTransaction
from models import Invoice, Payment, ParentStudent, CourseMaterial, Discussion, Message, AssignmentSubmission
from werkzeug.security import generate_password_hash
from datetime import datetime, date, timedelta
import random
from faker import Faker
from sqlalchemy.exc import IntegrityError
import click

fake = Faker()

def create_app():
    """Create Flask application for seeding"""
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///studenthub.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'dev-secret-key-for-seeding'
    
    db.init_app(app)
    
    return app

def clear_database():
    """Clear all existing data from database"""
    print("Clearing existing data...")
    
    # Clear in reverse dependency order
    tables_to_clear = [
        AssignmentSubmission, Message, Discussion, CourseMaterial,
        ParentStudent, Payment, Invoice, LibraryTransaction, Book, Library,
        Announcement, Attendance, Grade, Assignment, Enrollment,
        Course, Classroom, Semester, AcademicYear, Department, User
    ]
    
    for table in tables_to_clear:
        try:
            db.session.query(table).delete()
            print(f"  Cleared {table.__tablename__}")
        except Exception as e:
            db.session.rollback()
            print(f"  Error clearing {table.__tablename__}: {e}")
    
    db.session.commit()
    print("Database cleared successfully!\n")

def create_academic_years():
    """Create academic years"""
    print("Creating Academic Years...")
    
    academic_years = [
        {
            'name': '2023-2024',
            'start_date': date(2023, 9, 1),
            'end_date': date(2024, 6, 30),
            'is_current': False
        },
        {
            'name': '2024-2025',
            'start_date': date(2024, 9, 1),
            'end_date': date(2025, 6, 30),
            'is_current': True
        },
        {
            'name': '2025-2026',
            'start_date': date(2025, 9, 1),
            'end_date': date(2026, 6, 30),
            'is_current': False
        }
    ]
    
    created_years = []
    for year_data in academic_years:
        year = AcademicYear(**year_data)
        db.session.add(year)
        created_years.append(year)
        print(f"  Created Academic Year: {year.name}")
    
    db.session.commit()
    return created_years

def create_semesters(academic_years):
    """Create semesters"""
    print("\nCreating Semesters...")
    
    current_year = next((y for y in academic_years if y.is_current), academic_years[0])
    
    semesters = [
        {
            'name': 'Fall 2024',
            'start_date': date(2024, 9, 1),
            'end_date': date(2024, 12, 20),
            'academic_year_id': current_year.id
        },
        {
            'name': 'Spring 2025',
            'start_date': date(2025, 1, 15),
            'end_date': date(2025, 5, 30),
            'academic_year_id': current_year.id
        },
        {
            'name': 'Summer 2025',
            'start_date': date(2025, 6, 1),
            'end_date': date(2025, 7, 31),
            'academic_year_id': current_year.id
        }
    ]
    
    created_semesters = []
    for semester_data in semesters:
        semester = Semester(**semester_data)
        db.session.add(semester)
        created_semesters.append(semester)
        print(f"  Created Semester: {semester.name}")
    
    db.session.commit()
    return created_semesters

def create_departments():
    """Create departments"""
    print("\nCreating Departments...")
    
    departments_data = [
        {'name': 'Computer Science', 'code': 'CS', 'head_title': 'Chairperson'},
        {'name': 'Mathematics', 'code': 'MATH', 'head_title': 'Department Head'},
        {'name': 'Physics', 'code': 'PHY', 'head_title': 'Director'},
        {'name': 'English', 'code': 'ENG', 'head_title': 'Chair'},
        {'name': 'Business', 'code': 'BUS', 'head_title': 'Dean'},
        {'name': 'Biology', 'code': 'BIO', 'head_title': 'Head'},
        {'name': 'History', 'code': 'HIS', 'head_title': 'Chairperson'},
        {'name': 'Psychology', 'code': 'PSY', 'head_title': 'Director'}
    ]
    
    created_departments = []
    for dept_data in departments_data:
        department = Department(
            name=dept_data['name'],
            code=dept_data['code'],
            description=f"{dept_data['name']} Department offering various courses and programs"
        )
        db.session.add(department)
        created_departments.append((department, dept_data['head_title']))
        print(f"  Created Department: {department.name}")
    
    db.session.commit()
    return created_departments

def create_users(departments_info):
    """Create users (admins, teachers, students, parents)"""
    print("\nCreating Users...")
    
    default_password = generate_password_hash('password123')
    users = []
    
    # Create Admin Users
    print("\n  Creating Admin Users...")
    admin_users = [
        {
            'email': 'admin@studenthub.edu',
            'first_name': 'System',
            'last_name': 'Administrator',
            'role': 'admin',
            'phone': '+1 (555) 123-4567',
            'address': '123 Admin Street, Tech City',
            'date_of_birth': date(1980, 1, 15),
            'gender': 'male'
        },
        {
            'email': 'registrar@studenthub.edu',
            'first_name': 'Sarah',
            'last_name': 'Wilson',
            'role': 'admin',
            'phone': '+1 (555) 987-6543',
            'address': '456 Registrar Ave, Tech City',
            'date_of_birth': date(1975, 3, 22),
            'gender': 'female'
        }
    ]
    
    for admin_data in admin_users:
        admin = User(
            **admin_data,
            password_hash=default_password
        )
        db.session.add(admin)
        users.append(admin)
        print(f"    Created Admin: {admin.first_name} {admin.last_name}")
    
    # Create Department Heads
    print("\n  Creating Department Heads...")
    dept_heads = []
    dept_head_names = [
        ('Robert', 'Johnson'), ('Jennifer', 'Smith'), ('Michael', 'Brown'),
        ('Lisa', 'Davis'), ('David', 'Wilson'), ('Susan', 'Miller'),
        ('Thomas', 'Taylor'), ('Patricia', 'Anderson')
    ]
    
    for i, ((department, head_title), (first_name, last_name)) in enumerate(zip(departments_info, dept_head_names)):
        dept_head = User(
            email=f'depthead{i+1}@studenthub.edu',
            first_name=first_name,
            last_name=last_name,
            role='staff',
            phone=f'+1 (555) 111-000{i+1}',
            address=f'{i+1} University Blvd, Tech City',
            date_of_birth=date(1970 + i, (i % 12) + 1, 15),
            gender='male' if i % 2 == 0 else 'female',
            password_hash=default_password,
            department_id=department.id,
            title=head_title
        )
        db.session.add(dept_head)
        users.append(dept_head)
        dept_heads.append(dept_head)
        print(f"    Created Department Head: {first_name} {last_name} for {department.name}")
    
    # Create Teachers
    print("\n  Creating Teachers...")
    teachers_data = [
        # Computer Science Teachers
        {'first_name': 'John', 'last_name': 'Doe', 'department_idx': 0, 'title': 'Professor'},
        {'first_name': 'Alice', 'last_name': 'Smith', 'department_idx': 0, 'title': 'Associate Professor'},
        {'first_name': 'Brian', 'last_name': 'Wilson', 'department_idx': 0, 'title': 'Assistant Professor'},
        # Mathematics Teachers
        {'first_name': 'Richard', 'last_name': 'Johnson', 'department_idx': 1, 'title': 'Professor'},
        {'first_name': 'Emily', 'last_name': 'Chen', 'department_idx': 1, 'title': 'Lecturer'},
        # Physics Teachers
        {'first_name': 'David', 'last_name': 'Williams', 'department_idx': 2, 'title': 'Professor'},
        {'first_name': 'Karen', 'last_name': 'Martinez', 'department_idx': 2, 'title': 'Assistant Professor'},
        # English Teachers
        {'first_name': 'Thomas', 'last_name': 'Brown', 'department_idx': 3, 'title': 'Professor'},
        {'first_name': 'Jessica', 'last_name': 'Taylor', 'department_idx': 3, 'title': 'Associate Professor'},
        # Business Teachers
        {'first_name': 'Catherine', 'last_name': 'Miller', 'department_idx': 4, 'title': 'Professor'},
        {'first_name': 'James', 'last_name': 'Davis', 'department_idx': 4, 'title': 'Lecturer'},
        # Biology Teachers
        {'first_name': 'Robert', 'last_name': 'Garcia', 'department_idx': 5, 'title': 'Professor'},
        # History Teachers
        {'first_name': 'Elizabeth', 'last_name': 'Rodriguez', 'department_idx': 6, 'title': 'Professor'},
        # Psychology Teachers
        {'first_name': 'William', 'last_name': 'Martinez', 'department_idx': 7, 'title': 'Professor'}
    ]
    
    teachers = []
    for i, teacher_data in enumerate(teachers_data):
        teacher = User(
            email=f'teacher{i+1}@studenthub.edu',
            first_name=teacher_data['first_name'],
            last_name=teacher_data['last_name'],
            role='teacher',
            phone=f'+1 (555) 222-{1000 + i:04d}',
            address='Faculty Housing, University Campus',
            date_of_birth=date(1975 + (i % 20), (i % 12) + 1, (i % 28) + 1),
            gender='male' if i % 2 == 0 else 'female',
            password_hash=default_password,
            department_id=departments_info[teacher_data['department_idx']][0].id,
            title=teacher_data['title']
        )
        db.session.add(teacher)
        users.append(teacher)
        teachers.append(teacher)
        print(f"    Created Teacher: {teacher.first_name} {teacher.last_name}")
    
    # Create Students
    print("\n  Creating Students...")
    student_id_counter = 20240001
    year_levels = ['Freshman', 'Sophomore', 'Junior', 'Senior']
    majors = [
        'Computer Science', 'Mathematics', 'Physics', 'English Literature',
        'Business Administration', 'Computer Engineering', 'Data Science',
        'Economics', 'Psychology', 'Biology', 'History', 'Chemistry'
    ]
    
    students = []
    for i in range(100):  # Create 100 students
        student = User(
            email=f'student{student_id_counter}@studenthub.edu',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            role='student',
            phone=f'+1 (555) 333-{1000 + i:04d}',
            address=f'{i+1} Student Residence, University Campus',
            date_of_birth=date(2000 + (i % 6), (i % 12) + 1, (i % 28) + 1),
            gender='male' if i % 2 == 0 else 'female',
            password_hash=default_password,
            student_id=str(student_id_counter),
            year_level=year_levels[i % len(year_levels)],
            major=random.choice(majors),
            gpa=round(2.5 + (random.random() * 2.0), 2),  # GPA between 2.5 and 4.5
            enrollment_date=date(2024, 8, 15) - timedelta(days=random.randint(0, 365))
        )
        db.session.add(student)
        users.append(student)
        students.append(student)
        student_id_counter += 1
        
        if (i + 1) % 20 == 0:
            print(f"    Created {i + 1} students...")
    
    print(f"    Created {len(students)} students total")
    
    # Create Parents
    print("\n  Creating Parents...")
    parents = []
    for i in range(30):  # Create 30 parents
        parent = User(
            email=f'parent{i+1}@example.com',
            first_name=fake.first_name_male() if i % 2 == 0 else fake.first_name_female(),
            last_name=fake.last_name(),
            role='parent',
            phone=f'+1 (555) 777-{1000 + i:04d}',
            address=f'{i+1} Family Street, Hometown',
            date_of_birth=date(1970 + (i % 25), (i % 12) + 1, (i % 28) + 1),
            gender='male' if i % 2 == 0 else 'female',
            password_hash=default_password
        )
        db.session.add(parent)
        users.append(parent)
        parents.append(parent)
    
    print(f"    Created {len(parents)} parents")
    
    db.session.commit()
    return {
        'users': users,
        'admins': [u for u in users if u.role == 'admin'],
        'teachers': teachers,
        'students': students,
        'parents': parents,
        'dept_heads': dept_heads
    }

def create_classrooms():
    """Create classrooms"""
    print("\nCreating Classrooms...")
    
    buildings = ['Science', 'Humanities', 'Business', 'Engineering', 'Library', 'Arts']
    classrooms = []
    
    for i in range(20):  # Create 20 classrooms
        building = buildings[i % len(buildings)]
        classroom = Classroom(
            room_number=f'{building[0].upper()}{100 + i}',
            building=building,
            capacity=random.choice([25, 30, 35, 40, 45, 50]),
            floor=(i % 4) + 1,
            has_projector=random.choice([True, False]),
            has_computers=random.choice([True, False]),
            is_active=True
        )
        db.session.add(classroom)
        classrooms.append(classroom)
    
    db.session.commit()
    print(f"  Created {len(classrooms)} classrooms")
    return classrooms

def create_courses(departments_info, teachers):
    """Create courses"""
    print("\nCreating Courses...")
    
    courses_data = [
        # Computer Science Courses
        {'code': 'CS101', 'name': 'Introduction to Computer Science', 'credits': 3, 'dept_idx': 0, 'level': 'Undergraduate', 'fee': 1200.00},
        {'code': 'CS102', 'name': 'Programming Fundamentals', 'credits': 4, 'dept_idx': 0, 'level': 'Undergraduate', 'fee': 1300.00},
        {'code': 'CS201', 'name': 'Data Structures and Algorithms', 'credits': 4, 'dept_idx': 0, 'level': 'Undergraduate', 'fee': 1500.00},
        {'code': 'CS301', 'name': 'Database Systems', 'credits': 3, 'dept_idx': 0, 'level': 'Undergraduate', 'fee': 1400.00},
        {'code': 'CS302', 'name': 'Software Engineering', 'credits': 3, 'dept_idx': 0, 'level': 'Undergraduate', 'fee': 1450.00},
        {'code': 'CS401', 'name': 'Artificial Intelligence', 'credits': 3, 'dept_idx': 0, 'level': 'Graduate', 'fee': 1600.00},
        {'code': 'CS402', 'name': 'Machine Learning', 'credits': 3, 'dept_idx': 0, 'level': 'Graduate', 'fee': 1650.00},
        
        # Mathematics Courses
        {'code': 'MATH101', 'name': 'Calculus I', 'credits': 4, 'dept_idx': 1, 'level': 'Undergraduate', 'fee': 1100.00},
        {'code': 'MATH102', 'name': 'Calculus II', 'credits': 4, 'dept_idx': 1, 'level': 'Undergraduate', 'fee': 1150.00},
        {'code': 'MATH201', 'name': 'Linear Algebra', 'credits': 3, 'dept_idx': 1, 'level': 'Undergraduate', 'fee': 1300.00},
        {'code': 'MATH301', 'name': 'Differential Equations', 'credits': 3, 'dept_idx': 1, 'level': 'Undergraduate', 'fee': 1350.00},
        
        # Physics Courses
        {'code': 'PHY101', 'name': 'General Physics I', 'credits': 4, 'dept_idx': 2, 'level': 'Undergraduate', 'fee': 1250.00},
        {'code': 'PHY102', 'name': 'General Physics II', 'credits': 4, 'dept_idx': 2, 'level': 'Undergraduate', 'fee': 1300.00},
        {'code': 'PHY201', 'name': 'Modern Physics', 'credits': 3, 'dept_idx': 2, 'level': 'Undergraduate', 'fee': 1400.00},
        
        # English Courses
        {'code': 'ENG101', 'name': 'Composition and Rhetoric', 'credits': 3, 'dept_idx': 3, 'level': 'Undergraduate', 'fee': 1000.00},
        {'code': 'ENG102', 'name': 'Introduction to Literature', 'credits': 3, 'dept_idx': 3, 'level': 'Undergraduate', 'fee': 1050.00},
        {'code': 'ENG201', 'name': 'British Literature', 'credits': 3, 'dept_idx': 3, 'level': 'Undergraduate', 'fee': 1150.00},
        
        # Business Courses
        {'code': 'BUS101', 'name': 'Introduction to Business', 'credits': 3, 'dept_idx': 4, 'level': 'Undergraduate', 'fee': 1150.00},
        {'code': 'BUS201', 'name': 'Financial Accounting', 'credits': 4, 'dept_idx': 4, 'level': 'Undergraduate', 'fee': 1400.00},
        {'code': 'BUS301', 'name': 'Marketing Management', 'credits': 3, 'dept_idx': 4, 'level': 'Undergraduate', 'fee': 1350.00},
        {'code': 'BUS401', 'name': 'Strategic Management', 'credits': 3, 'dept_idx': 4, 'level': 'Graduate', 'fee': 1550.00},
        
        # Biology Courses
        {'code': 'BIO101', 'name': 'General Biology I', 'credits': 4, 'dept_idx': 5, 'level': 'Undergraduate', 'fee': 1200.00},
        {'code': 'BIO102', 'name': 'General Biology II', 'credits': 4, 'dept_idx': 5, 'level': 'Undergraduate', 'fee': 1250.00},
        
        # History Courses
        {'code': 'HIS101', 'name': 'World History I', 'credits': 3, 'dept_idx': 6, 'level': 'Undergraduate', 'fee': 1050.00},
        {'code': 'HIS201', 'name': 'American History', 'credits': 3, 'dept_idx': 6, 'level': 'Undergraduate', 'fee': 1100.00},
        
        # Psychology Courses
        {'code': 'PSY101', 'name': 'Introduction to Psychology', 'credits': 3, 'dept_idx': 7, 'level': 'Undergraduate', 'fee': 1100.00},
        {'code': 'PSY201', 'name': 'Developmental Psychology', 'credits': 3, 'dept_idx': 7, 'level': 'Undergraduate', 'fee': 1200.00}
    ]
    
    courses = []
    for course_data in courses_data:
        description = f"This course covers fundamental concepts in {course_data['name'].split(' ', 1)[1].lower()}. Students will learn essential principles and applications."
        
        course = Course(
            code=course_data['code'],
            name=course_data['name'],
            description=description,
            credits=course_data['credits'],
            department_id=departments_info[course_data['dept_idx']][0].id,
            level=course_data['level'],
            prerequisites='',
            fee=course_data['fee']
        )
        db.session.add(course)
        courses.append(course)
        print(f"  Created Course: {course.code} - {course.name}")
    
    db.session.commit()
    return courses

def create_enrollments(students, teachers, courses, classrooms, semesters):
    """Create enrollments"""
    print("\nCreating Enrollments...")
    
    current_semester = next((s for s in semesters if s.name == 'Spring 2025'), semesters[0])
    enrollments = []
    
    # Create sections for each course
    sections = []
    for course in courses:
        # Each course has 1-3 sections
        section_count = random.randint(1, 3)
        
        for section_num in range(1, section_count + 1):
            teacher = random.choice(teachers)
            classroom = random.choice(classrooms)
            
            sections.append({
                'course': course,
                'teacher': teacher,
                'classroom': classroom,
                'section_num': section_num,
                'max_students': classroom.capacity - 5  # Leave some seats empty
            })
    
    # Enroll students in sections
    enrollment_count = 0
    for section in sections:
        # Determine how many students to enroll (50-90% of capacity)
        num_students = min(
            random.randint(int(section['max_students'] * 0.5), int(section['max_students'] * 0.9)),
            len(students)
        )
        
        # Select random students
        students_to_enroll = random.sample(students, num_students)
        
        for student in students_to_enroll:
            section_code = f"{section['course'].code}-{section['section_num']:02d}"
            
            enrollment = Enrollment(
                user_id=student.id,
                course_id=section['course'].id,
                teacher_id=section['teacher'].id,
                classroom_id=section['classroom'].id,
                semester_id=current_semester.id,
                section_code=section_code,
                enrollment_date=current_semester.start_date + timedelta(days=random.randint(0, 14)),
                status='active'
            )
            db.session.add(enrollment)
            enrollments.append(enrollment)
            enrollment_count += 1
    
    db.session.commit()
    print(f"  Created {enrollment_count} enrollments")
    return enrollments

def create_assignments(courses):
    """Create assignments"""
    print("\nCreating Assignments...")
    
    assignments = []
    assignment_types = ['Homework', 'Quiz', 'Project', 'Midterm', 'Final Exam']
    
    for course in courses:
        # Create 3-6 assignments per course
        num_assignments = random.randint(3, 6)
        
        for i in range(num_assignments):
            due_date = date.today() + timedelta(days=7 * (i + 1))
            assignment_type = assignment_types[i % len(assignment_types)]
            
            assignment = Assignment(
                course_id=course.id,
                title=f"{course.code} {assignment_type} {i + 1}",
                description=f"This {assignment_type.lower()} covers topics from weeks {(i * 2) + 1}-{(i * 2) + 2} of the course.",
                due_date=due_date,
                max_score=random.choice([100, 50, 75, 150, 200]),
                assignment_type=assignment_type,
                submission_type=random.choice(['file', 'text', 'both']),
                is_published=True
            )
            db.session.add(assignment)
            assignments.append(assignment)
        
        print(f"  Created {num_assignments} assignments for {course.code}")
    
    db.session.commit()
    return assignments

def create_grades(enrollments, assignments, teachers):
    """Create grades"""
    print("\nCreating Grades...")
    
    grades = []
    
    for assignment in assignments:
        # Get enrollments for this assignment's course
        course_enrollments = [e for e in enrollments if e.course_id == assignment.course_id]
        
        if not course_enrollments:
            continue
        
        # Grade 60-80% of enrollments
        num_to_grade = random.randint(
            int(len(course_enrollments) * 0.6),
            int(len(course_enrollments) * 0.8)
        )
        
        graded_enrollments = random.sample(course_enrollments, num_to_grade)
        
        for enrollment in graded_enrollments:
            score = random.randint(0, assignment.max_score)
            percentage = (score / assignment.max_score) * 100
            
            # Determine letter grade
            if percentage >= 90:
                letter_grade = 'A'
            elif percentage >= 80:
                letter_grade = 'B'
            elif percentage >= 70:
                letter_grade = 'C'
            elif percentage >= 60:
                letter_grade = 'D'
            else:
                letter_grade = 'F'
            
            feedback_options = [
                'Excellent work!',
                'Good job overall.',
                'Needs improvement in some areas.',
                'Please review the material and resubmit.',
                'Well done!',
                'Good understanding of concepts.',
                'Could use more detail.',
                'Excellent analysis.'
            ]
            
            grade = Grade(
                enrollment_id=enrollment.id,
                assignment_id=assignment.id,
                score=score,
                max_score=assignment.max_score,
                percentage=round(percentage, 2),
                letter_grade=letter_grade,
                feedback=random.choice(feedback_options),
                graded_by_id=random.choice(teachers).id,
                graded_at=assignment.due_date + timedelta(days=random.randint(1, 7))
            )
            db.session.add(grade)
            grades.append(grade)
        
        print(f"  Created grades for {len(graded_enrollments)} students in {assignment.title}")
    
    db.session.commit()
    return grades

def create_attendance(enrollments, teachers):
    """Create attendance records"""
    print("\nCreating Attendance Records...")
    
    attendance_records = []
    
    # Create attendance for past 30 days
    for day_offset in range(30):
        current_date = date.today() - timedelta(days=day_offset)
        
        # Skip weekends
        if current_date.weekday() >= 5:  # 5 = Saturday, 6 = Sunday
            continue
        
        # Select 20-40 enrollments to mark attendance for
        num_attendances = random.randint(20, 40)
        enrollments_for_day = random.sample(enrollments, min(num_attendances, len(enrollments)))
        
        for enrollment in enrollments_for_day:
            # 85% present, 10% absent, 5% late
            rand_val = random.random()
            if rand_val < 0.85:
                status = 'present'
                notes = None
            elif rand_val < 0.95:
                status = 'absent'
                notes = random.choice(['Sick', 'Family emergency', 'Doctor appointment', 'Personal reasons'])
            else:
                status = 'late'
                notes = 'Arrived late to class'
            
            attendance = Attendance(
                enrollment_id=enrollment.id,
                date=current_date,
                status=status,
                notes=notes,
                recorded_by_id=enrollment.teacher_id
            )
            db.session.add(attendance)
            attendance_records.append(attendance)
    
    db.session.commit()
    print(f"  Created {len(attendance_records)} attendance records")
    return attendance_records

def create_announcements(admins, teachers):
    """Create announcements"""
    print("\nCreating Announcements...")
    
    announcements_data = [
        {
            'title': 'Important Academic Calendar Update',
            'content': 'Please note that the spring break has been extended by one week. Check the updated calendar on the portal.',
            'priority': 'high',
            'target_audience': 'all'
        },
        {
            'title': 'Upcoming Final Examinations Schedule',
            'content': 'Final exams will be held from May 12th to May 20th. The detailed schedule is available on the portal.',
            'priority': 'high',
            'target_audience': 'students'
        },
        {
            'title': 'New Library Resources Available',
            'content': 'The library has added new online journals and databases. Access them through the library portal.',
            'priority': 'medium',
            'target_audience': 'all'
        },
        {
            'title': 'Campus Maintenance Notice',
            'content': 'The Science building will be undergoing maintenance this weekend. Some classrooms may be unavailable.',
            'priority': 'medium',
            'target_audience': 'all'
        },
        {
            'title': 'Student Club Activities This Week',
            'content': 'Various student clubs are hosting events this week. Check the student activities board for details.',
            'priority': 'low',
            'target_audience': 'students'
        },
        {
            'title': 'Scholarship Application Deadline',
            'content': 'The deadline for spring semester scholarship applications is March 15th. Apply now!',
            'priority': 'high',
            'target_audience': 'students'
        },
        {
            'title': 'Career Fair Announcement',
            'content': 'Annual career fair will be held on April 10th. Over 50 companies will be participating.',
            'priority': 'medium',
            'target_audience': 'students'
        },
        {
            'title': 'Faculty Meeting Schedule',
            'content': 'Monthly faculty meeting will be held this Friday at 3 PM in the conference room.',
            'priority': 'medium',
            'target_audience': 'teachers'
        }
    ]
    
    announcements = []
    for i, ann_data in enumerate(announcements_data):
        # Alternate between admins and teachers as publishers
        publisher = admins[0] if i % 2 == 0 else random.choice(teachers)
        
        announcement = Announcement(
            title=ann_data['title'],
            content=ann_data['content'],
            published_by_id=publisher.id,
            publish_date=date.today() - timedelta(days=random.randint(0, 10)),
            expiry_date=date.today() + timedelta(days=random.randint(30, 60)),
            priority=ann_data['priority'],
            target_audience=ann_data['target_audience']
        )
        db.session.add(announcement)
        announcements.append(announcement)
    
    db.session.commit()
    print(f"  Created {len(announcements)} announcements")
    return announcements

def create_library_system():
    """Create library system"""
    print("\nSetting up Library System...")
    
    # Create Library
    library = Library(
        name='University Main Library',
        location='Central Campus Building A',
        opening_hours='Mon-Fri: 8:00 AM - 10:00 PM, Sat: 9:00 AM - 6:00 PM, Sun: 12:00 PM - 8:00 PM',
        contact_phone='+1 (555) 444-1234',
        email='library@studenthub.edu'
    )
    db.session.add(library)
    db.session.commit()
    print(f"  Created Library: {library.name}")
    
    # Create Books
    print("\n  Creating Books...")
    book_categories = ['Computer Science', 'Mathematics', 'Physics', 'Literature', 'Business', 
                      'History', 'Biology', 'Engineering', 'Psychology', 'Economics']
    
    books = []
    for i in range(150):  # Create 150 books
        category = random.choice(book_categories)
        total_copies = random.randint(1, 5)
        available_copies = random.randint(0, total_copies)
        
        book = Book(
            library_id=library.id,
            title=f'{category} Volume {i+1}: {fake.catch_phrase()}',
            author=fake.name(),
            isbn=fake.isbn13(),
            category=category,
            publication_year=random.randint(2000, 2024),
            publisher=random.choice(['Pearson', 'McGraw-Hill', 'Wiley', 'Springer', 'Elsevier', 'Oxford', 'Cambridge']),
            total_copies=total_copies,
            available_copies=available_copies,
            location=f'Shelf {random.randint(1, 50)}, Row {random.randint(1, 10)}'
        )
        db.session.add(book)
        books.append(book)
    
    db.session.commit()
    print(f"    Created {len(books)} books")
    
    return library, books

def create_financial_system(students, courses):
    """Create financial system (invoices and payments)"""
    print("\nSetting up Financial System...")
    
    invoices = []
    payments = []
    
    for student in students:
        # Each student has 1-4 invoices
        num_invoices = random.randint(1, 4)
        
        for i in range(num_invoices):
            invoice_date = date.today() - timedelta(days=random.randint(30, 120))
            due_date = invoice_date + timedelta(days=30)
            is_paid = random.random() > 0.4  # 60% paid
            
            # Get courses for this student to calculate amount
            student_courses = random.sample(courses, min(3, len(courses)))
            total_amount = sum(course.fee for course in student_courses)
            
            invoice = Invoice(
                user_id=student.id,
                invoice_number=f'INV-{student.student_id}-{i+1:03d}',
                invoice_date=invoice_date,
                due_date=due_date,
                status='paid' if is_paid else 'pending',
                total_amount=round(total_amount + random.uniform(-100, 100), 2),
                description=f'Tuition and fees for {random.choice(["Fall", "Spring", "Summer"])} semester'
            )
            db.session.add(invoice)
            invoices.append(invoice)
            
            # Create payment if invoice is paid
            if is_paid:
                payment_date = invoice_date + timedelta(days=random.randint(1, 30))
                
                payment = Payment(
                    invoice_id=invoice.id,
                    amount=invoice.total_amount,
                    payment_date=payment_date,
                    payment_method=random.choice(['credit_card', 'bank_transfer', 'check', 'cash']),
                    transaction_id=f'TXN{random.randint(1000000, 9999999)}',
                    status='completed'
                )
                db.session.add(payment)
                payments.append(payment)
    
    db.session.commit()
    print(f"  Created {len(invoices)} invoices and {len(payments)} payments")
    return invoices, payments

def create_parent_relationships(students, parents):
    """Create parent-student relationships"""
    print("\nCreating Parent-Student Relationships...")
    
    relationships = ['Mother', 'Father', 'Guardian', 'Grandparent']
    parent_students = []
    
    # Each student has 0-2 parents
    for student in students:
        num_parents = random.randint(0, 2)
        
        if num_parents > 0 and parents:  # Ensure we have parents to assign
            selected_parents = random.sample(parents, min(num_parents, len(parents)))
            
            for i, parent in enumerate(selected_parents):
                parent_student = ParentStudent(
                    parent_id=parent.id,
                    student_id=student.id,
                    relationship=relationships[i] if i < len(relationships) else 'Guardian',
                    is_primary=(i == 0)
                )
                db.session.add(parent_student)
                parent_students.append(parent_student)
    
    db.session.commit()
    print(f"  Created {len(parent_students)} parent-student relationships")
    return parent_students

def create_course_materials(courses, teachers):
    """Create course materials"""
    print("\nCreating Course Materials...")
    
    material_types = ['syllabus', 'lecture_notes', 'reading', 'assignment', 'exam', 'slides', 'video']
    materials = []
    
    for course in courses:
        # Create 2-5 materials per course
        num_materials = random.randint(2, 5)
        
        for i in range(num_materials):
            material_type = random.choice(material_types)
            
            material = CourseMaterial(
                course_id=course.id,
                title=f'{course.code} {material_type.replace("_", " ").title()} {i+1}',
                description=f'{material_type.replace("_", " ")} material for {course.name}',
                material_type=material_type,
                file_url=f'/materials/{course.code.lower()}_{material_type}_{i+1}.pdf',
                uploaded_by_id=random.choice(teachers).id,
                upload_date=date.today() - timedelta(days=random.randint(1, 60)),
                is_public=random.choice([True, False])
            )
            db.session.add(material)
            materials.append(material)
        
        print(f"  Created {num_materials} materials for {course.code}")
    
    db.session.commit()
    return materials

def create_discussions_and_messages(courses, students, teachers):
    """Create discussions and messages"""
    print("\nCreating Discussions and Messages...")
    
    discussions = []
    messages = []
    
    for course in courses:
        # Create 1-2 discussions per course
        num_discussions = random.randint(1, 2)
        
        for i in range(num_discussions):
            discussion_topics = [
                f'{course.code} General Discussion',
                f'{course.code} Assignment Help',
                f'{course.code} Exam Preparation',
                f'{course.code} Project Discussion'
            ]
            
            discussion = Discussion(
                title=random.choice(discussion_topics),
                description=f'Discuss course topics, assignments, and questions for {course.code} here.',
                course_id=course.id,
                created_by_id=random.choice(teachers).id,
                is_pinned=(i == 0)  # First discussion is pinned
            )
            db.session.add(discussion)
            discussions.append(discussion)
            
            # Create 3-10 messages per discussion
            num_messages = random.randint(3, 10)
            
            for j in range(num_messages):
                # Alternate between teachers and students
                if j == 0:
                    author = discussion.created_by
                else:
                    author = random.choice(students) if j % 2 == 0 else random.choice(teachers)
                
                message_content = [
                    f'This is an important point about {course.code}.',
                    f'Can someone explain the concept from chapter {j+1}?',
                    f'I found this resource helpful for the assignment.',
                    f'When is the deadline for the next assignment?',
                    f'Great discussion everyone!',
                    f'I have a question about the material from last week.',
                    f'Here are my thoughts on the topic.',
                    f'Does anyone want to form a study group?'
                ]
                
                message = Message(
                    discussion_id=discussion.id,
                    user_id=author.id,
                    content=random.choice(message_content),
                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 7))
                )
                db.session.add(message)
                messages.append(message)
    
    db.session.commit()
    print(f"  Created {len(discussions)} discussions and {len(messages)} messages")
    return discussions, messages

def create_assignment_submissions(assignments, students):
    """Create assignment submissions"""
    print("\nCreating Assignment Submissions...")
    
    submissions = []
    
    for assignment in assignments:
        # Get students for this assignment's course
        course_students = [s for s in students if any(
            e.course_id == assignment.course_id for e in s.enrollments
        )]
        
        if not course_students:
            continue
        
        # 50-80% of students submit the assignment
        num_submissions = random.randint(
            int(len(course_students) * 0.5),
            int(len(course_students) * 0.8)
        )
        
        submitting_students = random.sample(course_students, num_submissions)
        
        for student in submitting_students:
            submitted_at = assignment.due_date - timedelta(days=random.randint(0, 2))
            is_late = submitted_at > assignment.due_date
            
            submission = AssignmentSubmission(
                assignment_id=assignment.id,
                user_id=student.id,
                submission_text=f'This is my submission for {assignment.title}. I have completed all requirements.',
                submission_file_url=None if is_late else f'/submissions/{student.id}_{assignment.id}.pdf',
                submitted_at=submitted_at,
                status='submitted',
                is_late=is_late
            )
            db.session.add(submission)
            submissions.append(submission)
        
        print(f"  Created {len(submitting_students)} submissions for {assignment.title}")
    
    db.session.commit()
    return submissions

def create_library_transactions(books, students):
    """Create library transactions"""
    print("\nCreating Library Transactions...")
    
    transactions = []
    
    for _ in range(50):  # Create 50 transactions
        # Find a book with available copies
        available_books = [b for b in books if b.available_copies > 0]
        
        if not available_books:
            break
        
        book = random.choice(available_books)
        student = random.choice(students)
        
        checkout_date = date.today() - timedelta(days=random.randint(1, 30))
        due_date = checkout_date + timedelta(days=14)
        returned = random.random() > 0.3  # 70% returned
        
        if returned:
            return_date = checkout_date + timedelta(days=random.randint(1, 20))
            late_fee = max(0, (return_date - due_date).days) * 0.5  # $0.50 per day late
            status = 'returned'
        else:
            return_date = None
            late_fee = 0
            status = 'checked_out'
        
        transaction = LibraryTransaction(
            book_id=book.id,
            user_id=student.id,
            checkout_date=checkout_date,
            due_date=due_date,
            return_date=return_date,
            status=status,
            late_fee=late_fee
        )
        db.session.add(transaction)
        transactions.append(transaction)
        
        # Update book availability
        if returned:
            book.available_copies += 1
    
    db.session.commit()
    print(f"  Created {len(transactions)} library transactions")
    return transactions

def print_summary():
    """Print summary of created data"""
    print("\n" + "="*60)
    print("SEED DATA GENERATION COMPLETE!")
    print("="*60)
    print("\nSummary of Created Data:")
    print("-"*60)
    
    models = [
        ('Academic Years', AcademicYear),
        ('Semesters', Semester),
        ('Departments', Department),
        ('Users', User),
        ('Classrooms', Classroom),
        ('Courses', Course),
        ('Enrollments', Enrollment),
        ('Assignments', Assignment),
        ('Grades', Grade),
        ('Attendance Records', Attendance),
        ('Announcements', Announcement),
        ('Library Books', Book),
        ('Library Transactions', LibraryTransaction),
        ('Invoices', Invoice),
        ('Payments', Payment),
        ('Parent-Student Relationships', ParentStudent),
        ('Course Materials', CourseMaterial),
        ('Discussions', Discussion),
        ('Messages', Message),
        ('Assignment Submissions', AssignmentSubmission)
    ]
    
    for name, model in models:
        count = model.query.count()
        print(f"{name}: {count}")
    
    print("-"*60)
    
    # User breakdown
    admin_count = User.query.filter_by(role='admin').count()
    teacher_count = User.query.filter_by(role='teacher').count()
    student_count = User.query.filter_by(role='student').count()
    parent_count = User.query.filter_by(role='parent').count()
    staff_count = User.query.filter_by(role='staff').count()
    
    print(f"\nUser Breakdown:")
    print(f"  Admins: {admin_count}")
    print(f"  Teachers: {teacher_count}")
    print(f"  Students: {student_count}")
    print(f"  Parents: {parent_count}")
    print(f"  Staff: {staff_count}")
    
    print("\nDefault Login Credentials:")
    print("-"*60)
    print("Admin: admin@studenthub.edu / password123")
    print("Teacher: teacher1@studenthub.edu / password123")
    print("Student: student20240001@studenthub.edu / password123")
    print("Parent: parent1@example.com / password123")
    print("-"*60)
    
    print("\nNote: All passwords are 'password123' for development purposes.")
    print("Remember to change passwords in production!")

@click.command()
@click.option('--clear', is_flag=True, help='Clear existing data before seeding')
def seed_database(clear):
    """Seed the database with comprehensive StudentHub data"""
    app = create_app()
    
    with app.app_context():
        # Create all tables if they don't exist
        db.create_all()
        
        if clear:
            clear_database()
        
        print("Starting StudentHub seed data generation...")
        print("="*60)
        
        try:
            # Step 1: Create academic structure
            academic_years = create_academic_years()
            semesters = create_semesters(academic_years)
            departments_info = create_departments()
            
            # Step 2: Create users
            users_data = create_users(departments_info)
            
            # Step 3: Create infrastructure
            classrooms = create_classrooms()
            courses = create_courses(departments_info, users_data['teachers'])
            
            # Step 4: Create academic data
            enrollments = create_enrollments(
                users_data['students'], 
                users_data['teachers'], 
                courses, 
                classrooms, 
                semesters
            )
            assignments = create_assignments(courses)
            grades = create_grades(enrollments, assignments, users_data['teachers'])
            attendance = create_attendance(enrollments, users_data['teachers'])
            announcements = create_announcements(users_data['admins'], users_data['teachers'])
            
            # Step 5: Create library system
            library, books = create_library_system()
            
            # Step 6: Create financial system
            invoices, payments = create_financial_system(users_data['students'], courses)
            
            # Step 7: Create parent relationships
            parent_students = create_parent_relationships(users_data['students'], users_data['parents'])
            
            # Step 8: Create course materials
            materials = create_course_materials(courses, users_data['teachers'])
            
            # Step 9: Create discussions and messages
            discussions, messages = create_discussions_and_messages(
                courses, 
                users_data['students'], 
                users_data['teachers']
            )
            
            # Step 10: Create assignment submissions
            submissions = create_assignment_submissions(assignments, users_data['students'])
            
            # Step 11: Create library transactions
            transactions = create_library_transactions(books, users_data['students'])
            
            # Final summary
            print_summary()
            
        except Exception as e:
            db.session.rollback()
            print(f"\nError during seeding: {str(e)}")
            import traceback
            traceback.print_exc()
            sys.exit(1)

if __name__ == '__main__':
    seed_database()