# seed.py
import os
import sys
from datetime import datetime, timedelta
import random
import json
from faker import Faker
from werkzeug.security import generate_password_hash

# Add the server directory to the Python path
server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'server'))
sys.path.append(server_dir)

from app import create_app
from extensions import db
from models.models import (
    User, Profile, Student, Company, Job, Application, SavedJob, Notification,
    Interview, SavedCandidate, CompanyReview, Message, Conversation, Participant,
    Share, SavedSearch, DashboardStats
)

# Initialize Faker
fake = Faker()

# Constants
NUM_STUDENTS = 50
NUM_EMPLOYERS = 10
NUM_JOBS_PER_COMPANY = 5
MAX_APPLICATIONS_PER_STUDENT = 20
MAX_SAVED_JOBS_PER_STUDENT = 10
MAX_SAVED_CANDIDATES_PER_COMPANY = 15
MAX_REVIEWS_PER_COMPANY = 8

# Common data
JOB_TITLES = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Data Analyst',
    'Product Manager', 'UX/UI Designer', 'Product Designer', 'Cloud Architect',
    'Solutions Architect', 'Security Engineer', 'Network Engineer', 'Mobile Developer',
    'iOS Developer', 'Android Developer', 'QA Engineer', 'Technical Program Manager',
    'Engineering Manager', 'Director of Engineering', 'Business Analyst',
    'Marketing Manager', 'Sales Engineer', 'Customer Success Manager'
]

COMPANY_NAMES = [
    'TechCorp', 'InnoTech', 'DataSystems', 'WebSolutions', 'CloudNine', 'ByteDance',
    'CodeCraft', 'NexusLabs', 'QuantumLeap', 'AlphaByte', 'BetaSystems', 'GammaTech',
    'DeltaSoft', 'EpsilonData', 'ZetaWeb', 'EtaLabs', 'ThetaSystems', 'IotaTech',
    'KappaSoft', 'LambdaLabs'
]

INDUSTRIES = [
    'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Entertainment',
    'Automotive', 'Aerospace', 'Consulting', 'Retail', 'Manufacturing',
    'Education', 'Real Estate', 'Energy', 'Telecommunications', 'Biotechnology'
]

SKILLS = [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Swift',
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Git',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase', 'Elasticsearch',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Analysis',
    'Tableau', 'Power BI', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
    'Agile', 'Scrum', 'DevOps', 'CI/CD', 'Microservices', 'REST API', 'GraphQL'
]

UNIVERSITIES = [
    'Stanford University', 'MIT', 'Harvard University', 'UC Berkeley', 'Carnegie Mellon',
    'University of Washington', 'Georgia Tech', 'University of Texas', 'UIUC', 'UMich',
    'Cornell University', 'Princeton University', 'Columbia University', 'Yale University',
    'Brown University', 'Duke University', 'Northwestern University', 'Johns Hopkins',
    'University of Pennsylvania', 'University of Chicago', 'USC', 'UCLA', 'NYU'
]

MAJORS = [
    'Computer Science', 'Computer Engineering', 'Data Science', 'Software Engineering',
    'Information Systems', 'Electrical Engineering', 'Mechanical Engineering',
    'Business Administration', 'Economics', 'Mathematics', 'Statistics',
    'Biology', 'Chemistry', 'Physics', 'Psychology', 'English', 'History'
]

JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary']
WORK_MODES = ['Remote', 'Hybrid', 'On-site']
EXPERIENCE_LEVELS = ['Entry', 'Mid', 'Senior', 'Lead', 'Executive']
DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations']

BENEFITS = [
    'Health insurance', 'Dental insurance', 'Vision insurance', '401(k) matching',
    'Paid time off', 'Flexible schedule', 'Remote work options', 'Parental leave',
    'Professional development', 'Stock options', 'Gym membership', 'Free lunch',
    'Commuter benefits', 'Tuition reimbursement', 'Wellness program'
]

CULTURE_VALUES = [
    'Work-life balance', 'Diversity and inclusion', 'Innovation', 'Collaboration',
    'Transparency', 'Ownership', 'Customer focus', 'Continuous learning',
    'Agile methodology', 'Data-driven', 'Open communication', 'Work hard, play hard',
    'Sustainability', 'Social responsibility', 'Teamwork'
]

def create_admin():
    """Create an admin user"""
    admin = User(
        email='admin@studentu.com',
        first_name='Admin',
        last_name='System',
        role='admin',
        password_hash=generate_password_hash('admin123'),
        is_verified=True,
        created_at=datetime.utcnow()
    )
    db.session.add(admin)
    
    # Create admin profile
    profile = Profile(
        user=admin,
        headline='System Administrator',
        bio='I manage the StudentU platform and ensure everything runs smoothly.',
        location='San Francisco, CA',
        phone='+15551234567',
        website='https://studentu.com',
        profile_picture='https://ui-avatars.com/api/?name=Admin+System&background=random',
        created_at=datetime.utcnow()
    )
    db.session.add(profile)
    
    return admin

def create_employer(email, company_name, index):
    """Create an employer user with a company"""
    # Create employer user
    employer = User(
        email=email,
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        role='employer',
        password_hash=generate_password_hash('password123'),
        is_verified=True,
        created_at=datetime.utcnow() - timedelta(days=random.randint(30, 365)),
        is_online=random.choice([True, False])
    )
    db.session.add(employer)
    
    # Create profile for employer
    profile = Profile(
        user=employer,
        headline=f"HR at {company_name}",
        bio=fake.paragraph(nb_sentences=3),
        location=f"{fake.city()}, {fake.country_code()}",
        phone=fake.phone_number(),
        website=f"https://{company_name.lower().replace(' ', '')}.com",
        profile_picture=f"https://i.pravatar.cc/300?u={email}",
        title=f"{random.choice(['HR', 'Talent Acquisition', 'Recruiting'])} {random.choice(['Manager', 'Specialist', 'Director'])}",
        department=random.choice(['Human Resources', 'Talent Acquisition', 'Recruiting']),
        created_at=datetime.utcnow()
    )
    db.session.add(profile)
    
    # Create company - FIXED: description should be a string, not a list
    company = Company(
        user=employer,
        company_name=company_name,
        description=' '.join(fake.paragraphs(nb=3)),  # Join paragraphs into a single string
        industry=random.choice(INDUSTRIES),
        company_size=random.choice(['1-10', '11-50', '51-200', '201-500', '500+']),
        founded_year=random.randint(1990, 2020),
        website=f"https://{company_name.lower().replace(' ', '')}.com",
        phone=fake.phone_number(),
        location=f"{fake.city()}, {fake.country_code()}",
        address=fake.address().replace('\n', ', '),
        logo_url=f"https://ui-avatars.com/api/?name={company_name.replace(' ', '+')}&background=random",
        cover_image_url=f"https://picsum.photos/1200/300?random={index}",
        linkedin_url=f"https://linkedin.com/company/{company_name.lower().replace(' ', '')}",
        twitter_url=f"https://twitter.com/{company_name.lower().replace(' ', '')}",
        verification_status=random.choices(
            ['verified', 'unverified', 'pending'],
            weights=[0.7, 0.2, 0.1]
        )[0],
        benefits=json.dumps(random.sample(BENEFITS, k=random.randint(3, 8))),
        culture_values=json.dumps(random.sample(CULTURE_VALUES, k=random.randint(3, 5))),
        created_at=datetime.utcnow() - timedelta(days=random.randint(30, 365))
    )
    db.session.add(company)
    
    # Create dashboard stats for employer
    dashboard = DashboardStats(
        user=employer,
        date=datetime.utcnow().date(),
        posted_jobs=0,  # Will be updated later
        active_jobs=0,  # Will be updated later
        total_applicants=0,  # Will be updated later
        unread_messages=random.randint(0, 5),
        created_at=datetime.utcnow()
    )
    db.session.add(dashboard)
    
    return employer, company

def create_student(index):
    """Create a student user with profile and related data"""
    # Create user
    email = f'student{index}@studentu.com'
    first_name = fake.first_name()
    last_name = fake.last_name()
    
    user = User(
        email=email,
        first_name=first_name,
        last_name=last_name,
        role='student',
        password_hash=generate_password_hash('password123'),
        is_verified=True,
        created_at=datetime.utcnow() - timedelta(days=random.randint(30, 365)),
        is_online=random.choice([True, False]),
        last_seen=datetime.utcnow() - timedelta(hours=random.randint(1, 72))
    )
    db.session.add(user)
    
    # Create profile
    university = random.choice(UNIVERSITIES)
    major = random.choice(MAJORS)
    graduation_year = random.randint(2023, 2026)
    
    profile = Profile(
        user=user,
        headline=f"{major} Student at {university}",
        bio='\n\n'.join(fake.paragraphs(nb=2)),
        location=f"{fake.city()}, {fake.country_code()}",
        phone=fake.phone_number(),
        website=f"https://{first_name.lower()}{last_name.lower()}.com",
        profile_picture=f"https://i.pravatar.cc/300?u={email}",
        cover_picture=f"https://picsum.photos/1200/400?random={1000+index}",
        github=f"https://github.com/{first_name.lower()}{last_name.lower()}",
        linkedin=f"https://linkedin.com/in/{first_name.lower()}-{last_name.lower()}",
        portfolio=f"https://{first_name.lower()}{last_name.lower()}.com/portfolio",
        university=university,
        major=major,
        graduation_year=graduation_year,
        gpa=round(random.uniform(2.5, 4.0), 2),
        degree_type=random.choice(["Bachelor's", "Master's", "PhD"]),
        looking_for_job=random.choice([True, False]),
        open_to_relocation=random.choice([True, False]),
        open_to_remote=random.choice([True, False]),
        preferred_locations=json.dumps([fake.city() for _ in range(random.randint(1, 3))]),
        preferred_roles=json.dumps(random.sample(JOB_TITLES, k=random.randint(1, 3))),
        expected_salary=f"${random.randint(50, 100)}k",
        job_types=json.dumps(random.sample(JOB_TYPES, k=random.randint(1, 3))),
        availability=random.choice(['immediate', '2weeks', '1month', '3months']),
        show_profile=True,
        show_contact_info=random.choice([True, False]),
        show_education=True,
        show_experience=True,
        show_skills=True,
        email_notifications=True,
        job_alerts=random.choice([True, False]),
        connection_requests=True,
        message_notifications=True,
        created_at=datetime.utcnow() - timedelta(days=random.randint(30, 365))
    )
    db.session.add(profile)
    
    # Create student record - FIXED: JSON fields should be JSON strings
    student = Student(
        user=user,
        phone=profile.phone,
        location=profile.location,
        bio=profile.bio,
        education=json.dumps([{
            "school": university,
            "degree": major,
            "field_of_study": major,
            "start_year": graduation_year - 4,
            "end_year": graduation_year,
            "gpa": profile.gpa,
            "description": "Relevant coursework and academic achievements."
        }]),
        work_experience=json.dumps([{
            "company": fake.company(),
            "position": fake.job(),
            "start_date": f"{graduation_year - random.randint(1, 3)}-{random.randint(1, 12):02d}",
            "end_date": "Present" if random.choice([True, False]) else f"{graduation_year - 1}-{random.randint(1, 12):02d}",
            "description": fake.paragraph()
        } for _ in range(random.randint(0, 3))]),
        skills=json.dumps(random.sample(SKILLS, k=random.randint(5, 15))),
        years_of_experience=random.randint(0, 5),
        resume_url=f"https://{first_name.lower()}{last_name.lower()}.com/resume.pdf",
        profile_picture=profile.profile_picture,
        linkedin_url=profile.linkedin,
        github_url=profile.github,
        created_at=profile.created_at
    )
    db.session.add(student)
    
    # Create dashboard stats for student
    dashboard = DashboardStats(
        user=user,
        date=datetime.utcnow().date(),
        total_applications=0,  # Will be updated later
        pending_applications=0,  # Will be updated later
        interview_applications=0,  # Will be updated later
        rejected_applications=0,  # Will be updated later
        accepted_applications=0,  # Will be updated later
        saved_jobs=0,  # Will be updated later
        viewed_jobs=random.randint(5, 50),
        recommended_jobs=random.randint(5, 20),
        profile_views=random.randint(0, 50),
        profile_completion=random.randint(60, 100),
        unread_messages=random.randint(0, 5),
        created_at=datetime.utcnow()
    )
    db.session.add(dashboard)
    
    return user, student

def create_job(company, employer, index):
    """Create a job posting"""
    title = random.choice(JOB_TITLES)
    job_type = random.choice(JOB_TYPES)
    experience_level = random.choice(EXPERIENCE_LEVELS)
    
    # Set salary based on experience level
    if experience_level == 'Entry':
        salary_min = random.randint(50000, 80000)
        salary_max = salary_min + random.randint(10000, 20000)
    elif experience_level == 'Mid':
        salary_min = random.randint(80000, 120000)
        salary_max = salary_min + random.randint(15000, 30000)
    elif experience_level == 'Senior':
        salary_min = random.randint(120000, 180000)
        salary_max = salary_min + random.randint(20000, 40000)
    else:  # Lead/Executive
        salary_min = random.randint(150000, 250000)
        salary_max = salary_min + random.randint(50000, 100000)
    
    # Adjust salary based on job type
    if job_type == 'Part-time':
        salary_min = int(salary_min * 0.6)
        salary_max = int(salary_max * 0.6)
    elif job_type == 'Internship':
        salary_min = random.randint(20, 50) * 1000  # Annualized
        salary_max = salary_min + 10000
    
    job = Job(
        company=company,
        employer=employer,
        title=title,
        description='\n\n'.join(
            [f"<h3>{s}</h3>\n<p>{' '.join(fake.paragraphs(nb=2))}</p>" 
             for s in ['About the Role', 'Key Responsibilities', 'What We\'re Looking For']] +
            [f"<h3>About {company.company_name}</h3>\n<p>{' '.join(fake.paragraphs(nb=2))}</p>"]
        ),
        requirements='\n'.join(
            [f"<li>{s}</li>" for s in [
                f"Bachelor's degree in {random.choice(MAJORS)} or related field",
                f"{random.randint(1, 10)}+ years of experience in a similar role",
                f"Strong knowledge of {random.choice(SKILLS)} and {random.choice(SKILLS)}",
                f"Experience with {random.choice(['Agile', 'Scrum', 'Kanban'])} methodologies",
                f"Excellent communication and teamwork skills"
            ]] + 
            [f"<li>{s}</li>" for s in fake.sentences(nb=random.randint(2, 5))]
        ),
        responsibilities='\n'.join(
            [f"<li>{s}</li>" for s in [
                f"Design, develop, and maintain {random.choice(['web applications', 'APIs', 'data pipelines'])}",
                f"Collaborate with {random.choice(['product managers', 'designers', 'other engineers'])} to define and implement features",
                "Write clean, maintainable, and efficient code",
                "Participate in code reviews and provide constructive feedback",
                "Troubleshoot, debug and upgrade existing systems"
            ]] +
            [f"<li>{s}</li>" for s in fake.sentences(nb=random.randint(2, 5))]
        ),
        location=company.location if random.choice([True, False]) else f"{fake.city()}, {fake.country_code()}",
        job_type=job_type,
        work_mode=random.choice(WORK_MODES),
        department=random.choice(DEPARTMENTS),
        experience_level=experience_level,
        salary_min=salary_min,
        salary_max=salary_max,
        salary_currency='USD',
        required_skills=json.dumps(random.sample(SKILLS, k=random.randint(3, 7))),
        preferred_skills=json.dumps(random.sample(SKILLS, k=random.randint(2, 5))),
        benefits=json.dumps(random.sample(BENEFITS, k=random.randint(3, 8))),
        application_deadline=datetime.utcnow() + timedelta(days=random.randint(7, 90)),
        positions_available=random.randint(1, 5),
        is_active=random.choices([True, False], weights=[0.8, 0.2])[0],
        is_featured=random.choices([True, False], weights=[0.3, 0.7])[0],
        views_count=random.randint(0, 500),
        created_at=datetime.utcnow() - timedelta(days=random.randint(0, 60))
    )
    db.session.add(job)
    # Flush to get the job ID before creating analytics
    db.session.flush()
    
    # Create job analytics
    for i in range(30):  # Last 30 days of data
        date = datetime.utcnow().date() - timedelta(days=29 - i)
        # Use SQLAlchemy to insert job analytics
        from models.models import JobAnalytics
        analytics = JobAnalytics(
            job_id=job.id,
            date=date,
            views=random.randint(0, 50),
            applications=random.randint(0, 10) if i > 7 else 0,  # No applications in the first week
            clicks=random.randint(0, 20),
            unique_visitors=random.randint(0, 30)
        )
        db.session.add(analytics)
    
    return job

def create_application(student, job, status=None):
    """Create a job application"""
    if not status:
        status = random.choices(
            ['pending', 'reviewing', 'interview_scheduled', 'rejected', 'hired'],
            weights=[0.4, 0.3, 0.15, 0.1, 0.05]
        )[0]
    
    applied_at = job.created_at + timedelta(days=random.randint(0, (datetime.utcnow() - job.created_at).days))
    
    application = Application(
        job=job,
        student=student,
        cover_letter=f"""
        Dear Hiring Manager,
        
        I am excited to apply for the {job.title} position at {job.company.company_name}. 
        {' '.join(fake.paragraphs(nb=2))}
        
        Best regards,
        {student.user.first_name} {student.user.last_name}
        """,
        resume_url=student.resume_url,
        status=status,
        match_percentage=random.randint(60, 95),
        applied_at=applied_at,
        created_at=applied_at
    )
    
    if status in ['interview_scheduled', 'hired']:
        interview_date = applied_at + timedelta(days=random.randint(3, 14))
        
        # Create interview record
        interview = Interview(
            application=application,
            interview_type=random.choice(['phone', 'video', 'in-person']),
            scheduled_at=interview_date,
            duration_minutes=random.choice([30, 45, 60]),
            location_or_link=(
                f"Zoom: https://zoom.us/j/{fake.uuid4()}" 
                if random.choice([True, False]) 
                else f"{job.company.company_name} HQ, {job.location}"
            ),
            interviewer_name=fake.name(),
            interviewer_email=fake.email(),
            status='scheduled',
            notes=fake.paragraph() if random.choice([True, False]) else None,
            created_at=datetime.utcnow()
        )
        db.session.add(interview)
        
        # Create notification for student
        notification = Notification(
            user=student.user,
            notification_type='interview_scheduled',
            title=f"Interview Scheduled for {job.title}",
            message=f"You have an interview scheduled for {job.title} at {job.company.company_name} on {interview_date.strftime('%B %d, %Y at %I:%M %p')}",
            link_url=f"/applications/{application.id}",
            notification_metadata=json.dumps({
                'job_id': job.id,
                'job_title': job.title,
                'company_name': job.company.company_name,
                'interview_date': interview_date.isoformat(),
                'interview_type': interview.interview_type
            }),
            created_at=datetime.utcnow()
        )
        db.session.add(notification)
    
    db.session.add(application)
    
    # Create notification for employer
    notification = Notification(
        user=job.employer,
        notification_type='new_application',
        title=f"New Application for {job.title}",
        message=f"{student.user.first_name} {student.user.last_name} has applied for {job.title}",
        link_url=f"/company/jobs/{job.id}/applications/{application.id}",
        notification_metadata=json.dumps({
            'job_id': job.id,
            'job_title': job.title,
            'student_id': student.id,
            'student_name': f"{student.user.first_name} {student.user.last_name}",
            'application_id': application.id
        }),
        created_at=applied_at
    )
    db.session.add(notification)
    
    # Update dashboard stats
    student_dashboard = DashboardStats.query.filter_by(user_id=student.user_id).first()
    if student_dashboard:
        student_dashboard.total_applications += 1
        if status == 'pending':
            student_dashboard.pending_applications += 1
        elif status == 'interview_scheduled':
            student_dashboard.interview_applications += 1
        elif status == 'rejected':
            student_dashboard.rejected_applications += 1
        elif status == 'hired':
            student_dashboard.accepted_applications += 1
    
    employer_dashboard = DashboardStats.query.filter_by(user_id=job.employer_id).first()
    if employer_dashboard:
        employer_dashboard.total_applicants += 1
    
    return application

def create_saved_job(student, job):
    """Save a job for a student"""
    saved_job = SavedJob(
        student=student,
        job=job,
        notes=random.choice([None, fake.sentence(), "Looks interesting!", "Apply soon"]),
        saved_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
    )
    db.session.add(saved_job)
    
    # Update dashboard stats
    dashboard = DashboardStats.query.filter_by(user_id=student.user_id).first()
    if dashboard:
        dashboard.saved_jobs += 1
    
    return saved_job

def create_saved_candidate(company, student):
    """Save a candidate for a company"""
    saved_candidate = SavedCandidate(
        company=company,
        student=student,
        notes=random.choice([
            None, 
            "Great fit for our engineering team", 
            "Strong background in data science",
            "Potential candidate for future roles"
        ]),
        saved_at=datetime.utcnow() - timedelta(days=random.randint(0, 90))
    )
    db.session.add(saved_candidate)
    return saved_candidate

def create_company_review(company, student):
    """Create a company review from a student"""
    overall_rating = random.randint(3, 5)  # Mostly positive reviews
    
    review = CompanyReview(
        company=company,
        student=student,
        overall_rating=overall_rating,
        work_life_balance_rating=random.randint(3, 5),
        culture_rating=random.randint(3, 5),
        benefits_rating=random.randint(3, 5),
        management_rating=random.randint(3, 5),
        review_title=fake.sentence(),
        review_text='\n\n'.join(fake.paragraphs(nb=2)),
        pros='\n'.join([f"• {s}" for s in fake.paragraphs(nb=random.randint(2, 4))]),
        cons='\n'.join([f"• {s}" for s in fake.paragraphs(nb=random.randint(1, 3))]),
        is_current_employee=random.choice([True, False]),
        employment_status=random.choice(['current', 'former', 'intern']),
        is_anonymous=random.choice([True, False]),
        is_approved=True,
        helpful_count=random.randint(0, 50),
        created_at=datetime.utcnow() - timedelta(days=random.randint(0, 365))
    )
    db.session.add(review)
    return review

def create_notification(user, notification_type, title, message, link_url, metadata=None):
    """Create a notification for a user"""
    notification = Notification(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        link_url=link_url,
        is_read=random.choice([True, False]),
        notification_metadata=json.dumps(metadata or {}),
        created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
        read_at=datetime.utcnow() - timedelta(days=random.randint(0, 7)) if random.choice([True, False]) else None
    )
    db.session.add(notification)
    return notification

def create_saved_search(user, search_query, filters=None):
    """Create a saved search for a user"""
    saved_search = SavedSearch(
        user=user,
        search_query=search_query,
        filters=json.dumps(filters or {}),
        search_count=random.randint(1, 50),
        last_searched=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
        created_at=datetime.utcnow() - timedelta(days=random.randint(1, 90))
    )
    db.session.add(saved_search)
    return saved_search

def main():
    """Main function to seed the database"""
    print("Starting database seeding...")
    
    app = create_app()
    with app.app_context():
        # Clear existing data
        print("Dropping all tables...")
        db.drop_all()
        db.create_all()
        
        # Create admin
        print("Creating admin user...")
        admin = create_admin()
        
        # Create employers and companies
        print("Creating employers and companies...")
        employers = []
        companies = []
        for i in range(NUM_EMPLOYERS):
            email = f'employer{i+1}@studentu.com'
            company_name = COMPANY_NAMES[i % len(COMPANY_NAMES)]
            employer, company = create_employer(email, company_name, i)
            employers.append(employer)
            companies.append(company)
        
        # Create students
        print("Creating students...")
        students = []
        for i in range(1, NUM_STUDENTS + 1):
            user, student = create_student(i)
            students.append(student)
        
        # Create jobs for each company
        print("Creating jobs...")
        all_jobs = []
        for company, employer in zip(companies, employers):
            for _ in range(NUM_JOBS_PER_COMPANY):
                job = create_job(company, employer, len(all_jobs))
                if job:
                    all_jobs.append(job)
        
        db.session.commit()  # Commit all created data
        
        # Create applications
        print("Creating job applications...")
        for student in students:
            max_apps = min(MAX_APPLICATIONS_PER_STUDENT, len(all_jobs))
            jobs_to_apply = random.sample(all_jobs, k=random.randint(0, max_apps))
            
            for job in jobs_to_apply:
                create_application(student, job)
        
        # Save jobs for students
        print("Creating saved jobs...")
        for student in students:
            max_saves = min(MAX_SAVED_JOBS_PER_STUDENT, len(all_jobs))
            jobs_to_save = random.sample(all_jobs, k=random.randint(0, max_saves))
            
            for job in jobs_to_save:
                create_saved_job(student, job)
        
        # Save candidates for companies
        print("Creating saved candidates...")
        for company in companies:
            max_candidates = min(MAX_SAVED_CANDIDATES_PER_COMPANY, len(students))
            candidates_to_save = random.sample(students, k=random.randint(0, max_candidates))
            
            for student in candidates_to_save:
                create_saved_candidate(company, student)
        
        # Create company reviews
        print("Creating company reviews...")
        for company in companies:
            max_reviews = min(MAX_REVIEWS_PER_COMPANY, len(students))
            reviewers = random.sample(students, k=random.randint(0, max_reviews))
            
            for student in reviewers:
                create_company_review(company, student)
        
        # Create some notifications
        print("Creating notifications...")
        for student in students:
            # Job match notifications
            if random.random() > 0.5:
                create_notification(
                    student.user,
                    'job_match',
                    'New Job Match!',
                    f"We found {random.randint(1, 5)} new jobs that match your profile",
                    '/jobs/recommended',
                    {'match_count': random.randint(1, 5)}
                )
            
            # Profile view notifications
            if random.random() > 0.7:
                create_notification(
                    student.user,
                    'profile_viewed',
                    'Your profile was viewed',
                    f"{fake.company()} viewed your profile",
                    '/profile/analytics',
                    {'company_name': fake.company()}
                )
        
        # Create saved searches
        print("Creating saved searches...")
        for student in students:
            for search in random.sample(JOB_TITLES, k=random.randint(1, 3)):
                create_saved_search(
                    student.user,
                    search,
                    {'location': student.location, 'job_type': 'Full-time'}
                )
        
        # Update dashboard stats for employers
        print("Updating dashboard stats...")
        for company, employer in zip(companies, employers):
            dashboard = DashboardStats.query.filter_by(user_id=employer.id).first()
            if dashboard:
                company_jobs = [j for j in all_jobs if j.company_id == company.id]
                dashboard.posted_jobs = len(company_jobs)
                dashboard.active_jobs = len([j for j in company_jobs if j.is_active])
                
                # Count applicants for this company's jobs
                total_applicants = 0
                for job in company_jobs:
                    total_applicants += Application.query.filter_by(job_id=job.id).count()
                dashboard.total_applicants = total_applicants
        
        # Final commit
        db.session.commit()
        
        print("\n" + "="*50)
        print("Database seeded successfully!")
        print("="*50)
        print("\nLogin Credentials:")
        print("-"*30)
        print("Admin:")
        print(f"  Email: admin@studentu.com")
        print(f"  Password: admin123")
        
        print("\nEmployers:")
        for i, employer in enumerate(employers[:3], 1):
            print(f"  Email: employer{i}@studentu.com")
            print(f"  Password: password123")
        
        print("\nStudents:")
        for i, student in enumerate(students[:5], 1):
            print(f"  Email: student{i}@studentu.com")
            print(f"  Password: password123")
        
        print("\nStatistics:")
        print("-"*30)
        print(f"  Total Users: {User.query.count()}")
        print(f"  Total Students: {Student.query.count()}")
        print(f"  Total Employers: {len(employers)}")
        print(f"  Total Companies: {Company.query.count()}")
        print(f"  Total Jobs: {Job.query.count()}")
        print(f"  Total Applications: {Application.query.count()}")
        print(f"  Total Saved Jobs: {SavedJob.query.count()}")
        print(f"  Total Notifications: {Notification.query.count()}")
        print("="*50)

if __name__ == '__main__':
    main()