# seed.py - Comprehensive database seeder for StudentU Platform
import os
import sys
from datetime import datetime, timedelta
import random
import json
from faker import Faker
from werkzeug.security import generate_password_hash
from sqlalchemy.exc import IntegrityError
import uuid

# Add the server directory to the Python path
server_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'server'))
sys.path.append(server_dir)

from app import create_app
from extensions import db
from models.models import (
    User, Profile, Student, Company, Job, Application, 
    SavedJob, Notification, Interview, SavedCandidate, 
    CompanyReview, Message, Conversation, Participant, 
    Share, SavedSearch, DashboardStats, TokenBlocklist
)

# Initialize Flask app
app = create_app()
app.app_context().push()

# Initialize Faker
fake = Faker()

# Lists for realistic data
STUDENT_SKILLS = [
    'Python', 'JavaScript', 'React', 'Node.js', 'Django', 'Flask',
    'Java', 'C++', 'C#', 'Swift', 'Kotlin', 'PHP',
    'HTML/CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
    'Git', 'Machine Learning', 'Data Analysis', 'UI/UX Design',
    'Project Management', 'Agile/Scrum', 'Communication', 'Leadership'
]

COMPANY_INDUSTRIES = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'E-commerce',
    'Marketing', 'Consulting', 'Real Estate', 'Hospitality', 'Entertainment',
    'Manufacturing', 'Retail', 'Transportation', 'Energy', 'Telecommunications'
]

JOB_TITLES = {
    'Technology': [
        'Software Engineer', 'Frontend Developer', 'Backend Developer', 
        'Full Stack Developer', 'Data Scientist', 'Machine Learning Engineer',
        'DevOps Engineer', 'Cloud Architect', 'Mobile App Developer',
        'QA Engineer', 'Systems Administrator', 'Network Engineer'
    ],
    'Finance': [
        'Financial Analyst', 'Investment Banker', 'Accountant',
        'Risk Analyst', 'Auditor', 'Tax Consultant',
        'Financial Planner', 'Credit Analyst', 'Treasury Analyst'
    ],
    'Healthcare': [
        'Medical Doctor', 'Nurse', 'Pharmacist',
        'Medical Researcher', 'Healthcare Administrator',
        'Physiotherapist', 'Medical Technologist'
    ],
    'Marketing': [
        'Marketing Manager', 'Digital Marketing Specialist',
        'Content Strategist', 'SEO Specialist', 'Social Media Manager',
        'Brand Manager', 'Market Research Analyst'
    ]
}

JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
JOB_LOCATIONS = ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Remote', 'Hybrid']
EDUCATION_LEVELS = ['High School', 'Diploma', "Bachelor's", "Master's", 'PhD']
EXPERIENCE_LEVELS = ['Entry-level', 'Mid-level', 'Senior', 'Executive']

def create_admin():
    """Create an admin user"""
    try:
        # Check if admin already exists
        if User.query.filter_by(email='admin@studentu.com').first():
            print("✓ Admin user already exists")
            return User.query.filter_by(email='admin@studentu.com').first()

        admin = User(
            email='admin@studentu.com',
            first_name='Admin',
            last_name='System',
            role='admin',
            is_verified=True,
            is_active=True,
            verification_token=str(uuid.uuid4())
        )
        admin.set_password('Admin123!@#')
        db.session.add(admin)
        db.session.flush()

        # Create admin profile
        profile = Profile(
            user_id=admin.id,
            headline='System Administrator',
            bio='I manage the StudentU platform and ensure everything runs smoothly.',
            location='Nairobi, Kenya',
            phone='+254700000000',
            website='https://studentu.com',
            profile_picture='https://ui-avatars.com/api/?name=Admin+System&background=random'
        )
        db.session.add(profile)
        
        # Create dashboard stats for admin
        stats = DashboardStats(
            user_id=admin.id,
            date=datetime.utcnow().date(),
            profile_views=random.randint(50, 200)
        )
        db.session.add(stats)
        
        db.session.commit()

        print("✓ Admin user created successfully")
        return admin

    except Exception as e:
        db.session.rollback()
        print(f"✗ Error creating admin: {str(e)}")
        return None

def create_students(count=20):
    """Create student users with profiles"""
    print(f"\nCreating {count} student accounts...")
    
    students_created = 0
    for i in range(count):
        try:
            # Generate student data
            first_name = fake.first_name()
            last_name = fake.last_name()
            email = f"student{i+1}@studentu.com"
            
            # Check if user already exists
            if User.query.filter_by(email=email).first():
                continue
            
            # Create user
            student_user = User(
                email=email,
                first_name=first_name,
                last_name=last_name,
                role='student',
                is_verified=True,
                is_active=True,
                verification_token=str(uuid.uuid4())
            )
            student_user.set_password('Student123!@#')
            db.session.add(student_user)
            db.session.flush()
            
            # Create student profile
            university = fake.company() + " University"
            course = fake.job()
            graduation_year = random.randint(2023, 2026)
            
            student_profile = Student(
                user_id=student_user.id,
                education={
                    'university': university,
                    'degree': 'BSc in ' + course,
                    'field_of_study': course,
                    'start_date': f"{graduation_year-4}-09-01",
                    'end_date': f"{graduation_year}-06-01",
                    'gpa': round(random.uniform(2.5, 4.0), 2)
                },
                skills=random.sample(STUDENT_SKILLS, random.randint(3, 8)),
                resume_url=f"https://studentu.com/resumes/{student_user.id}.pdf",
                github_url=f"https://github.com/{first_name.lower()}{last_name.lower()}",
                linkedin_url=f"https://linkedin.com/in/{first_name.lower()}-{last_name.lower()}"
            )
            db.session.add(student_profile)
            
            # Create user profile
            profile = Profile(
                user_id=student_user.id,
                headline=f"{course} Student at {university}",
                bio=fake.paragraph(nb_sentences=3),
                location=random.choice(JOB_LOCATIONS),
                phone=fake.phone_number(),
                website=fake.url(),
                profile_picture=f"https://ui-avatars.com/api/?name={first_name}+{last_name}&background=random"
            )
            db.session.add(profile)
            
            # Create dashboard stats
            stats = DashboardStats(
                user_id=student_user.id,
                date=datetime.utcnow().date(),
                total_applications=random.randint(0, 15),
                pending_applications=random.randint(0, 5),
                interview_applications=random.randint(0, 3),
                rejected_applications=random.randint(0, 5),
                saved_jobs=random.randint(0, 10),
                viewed_jobs=random.randint(5, 30),
                recommended_jobs=random.randint(0, 8),
                profile_views=random.randint(0, 50),
                profile_completion=random.randint(70, 100)
            )
            db.session.add(stats)
            
            students_created += 1
            
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error creating student {i+1}: {str(e)}")
            continue
    
    db.session.commit()
    print(f"✓ Created {students_created} student accounts")
    return students_created

def create_employers(count=10):
    """Create employer users with companies"""
    print(f"\nCreating {count} employer accounts...")
    
    employers_created = 0
    companies = []
    
    for i in range(count):
        try:
            # Generate company data
            company_name = fake.company()
            first_name = fake.first_name()
            last_name = fake.last_name()
            email = f"employer{i+1}@studentu.com"
            
            # Check if user already exists
            if User.query.filter_by(email=email).first():
                continue
            
            # Create user
            employer_user = User(
                email=email,
                first_name=first_name,
                last_name=last_name,
                role='employer',
                is_verified=True,
                is_active=True,
                verification_token=str(uuid.uuid4())
            )
            employer_user.set_password('Employer123!@#')
            db.session.add(employer_user)
            db.session.flush()
            
            # Create company
            industry = random.choice(COMPANY_INDUSTRIES)
            company = Company(
                user_id=employer_user.id,
                company_name=company_name,
                website=f"https://{company_name.lower().replace(' ', '')}.com",
                company_size=random.choice(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']),
                industry=industry,
                description=fake.paragraph(nb_sentences=5),
                logo_url=f"https://ui-avatars.com/api/?name={company_name.replace(' ', '+')}&background=random",
                verification_status='verified' if random.choice([True, False]) else 'unverified'
            )
            db.session.add(company)
            companies.append((employer_user.id, company_name, industry))
            
            # Create user profile
            profile = Profile(
                user_id=employer_user.id,
                headline=f"HR Manager at {company_name}",
                bio=f"I'm responsible for recruitment and talent acquisition at {company_name}. Looking for talented students and graduates to join our team!",
                location=random.choice(JOB_LOCATIONS),
                phone=fake.phone_number(),
                profile_picture=f"https://ui-avatars.com/api/?name={first_name}+{last_name}&background=random"
            )
            db.session.add(profile)
            
            # Create dashboard stats
            stats = DashboardStats(
                user_id=employer_user.id,
                date=datetime.utcnow().date(),
                posted_jobs=random.randint(0, 8),
                active_jobs=random.randint(0, 5),
                total_applicants=random.randint(0, 50),
                profile_views=random.randint(10, 100),
                profile_completion=random.randint(80, 100)
            )
            db.session.add(stats)
            
            employers_created += 1
            
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error creating employer {i+1}: {str(e)}")
            continue
    
    db.session.commit()
    print(f"✓ Created {employers_created} employer accounts")
    return companies

def create_jobs(companies, count_per_company=3):
    """Create jobs for companies"""
    print(f"\nCreating jobs for companies...")
    
    jobs_created = 0
    all_jobs = []
    
    for company in companies:
        employer_id, company_name, industry = company
        
        for i in range(count_per_company):
            try:
                # Get appropriate job titles for the industry
                job_titles = JOB_TITLES.get(industry, JOB_TITLES['Technology'])
                job_title = random.choice(job_titles)
                
                # Create job
                job = Job(
                    company_id=employer_id,
                    title=job_title,
                    description=fake.paragraph(nb_sentences=8),
                    requirements='\n'.join([f"• {req}" for req in fake.sentences(nb=random.randint(5, 10))]),
                    responsibilities='\n'.join([f"• {resp}" for resp in fake.sentences(nb=random.randint(5, 10))]),
                    location=random.choice(JOB_LOCATIONS),
                    job_type=random.choice(JOB_TYPES),
                    salary_min=random.randint(30000, 80000),
                    salary_max=random.randint(80000, 200000),
                    salary_currency='USD',
                    experience_level=random.choice(EXPERIENCE_LEVELS),
                    required_skills=random.sample(STUDENT_SKILLS, random.randint(3, 6)),
                    preferred_skills=random.sample(STUDENT_SKILLS, random.randint(0, 3)),
                    is_active=random.choice([True, True, True, False]),  # 75% active
                    is_featured=random.choice([True, False, False]),
                    application_deadline=datetime.utcnow() + timedelta(days=random.randint(7, 60)),
                    views=random.randint(10, 200),
                    applications_count=0
                )
                db.session.add(job)
                db.session.flush()
                
                all_jobs.append(job.id)
                jobs_created += 1
                
            except Exception as e:
                db.session.rollback()
                print(f"✗ Error creating job {i+1} for {company_name}: {str(e)}")
                continue
    
    db.session.commit()
    print(f"✓ Created {jobs_created} jobs")
    return all_jobs

def create_applications(student_ids, job_ids):
    """Create job applications"""
    print(f"\nCreating job applications...")
    
    applications_created = 0
    
    # Each student applies to 2-5 random jobs
    for student_id in student_ids:
        try:
            jobs_to_apply = random.sample(job_ids, min(random.randint(2, 5), len(job_ids)))
            
            for job_id in jobs_to_apply:
                # Get the job
                job = Job.query.get(job_id)
                if not job or not job.is_active:
                    continue
                
                # Random application status
                status = random.choices(
                    ['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'accepted'],
                    weights=[20, 20, 15, 15, 20, 10]
                )[0]
                
                # Create application
                application = Application(
                    job_id=job_id,
                    student_id=student_id,
                    cover_letter=fake.paragraph(nb_sentences=5),
                    status=status,
                    applied_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
                )
                db.session.add(application)
                
                # Update job applications count
                job.applications_count = Application.query.filter_by(job_id=job_id).count() + 1
                
                # If application is accepted, update dashboard stats
                if status == 'accepted':
                    stats = DashboardStats.query.filter_by(user_id=student_id).first()
                    if stats:
                        stats.accepted_applications += 1
                
                applications_created += 1
                
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error creating applications for student {student_id}: {str(e)}")
            continue
    
    db.session.commit()
    print(f"✓ Created {applications_created} applications")
    return applications_created

def create_saved_jobs(student_ids, job_ids):
    """Create saved jobs for students"""
    print(f"\nCreating saved jobs...")
    
    saved_count = 0
    
    for student_id in student_ids:
        try:
            # Each student saves 1-3 random jobs
            jobs_to_save = random.sample(job_ids, min(random.randint(1, 3), len(job_ids)))
            
            for job_id in jobs_to_save:
                # Check if already saved
                if SavedJob.query.filter_by(student_id=student_id, job_id=job_id).first():
                    continue
                
                saved_job = SavedJob(
                    student_id=student_id,
                    job_id=job_id,
                    saved_at=datetime.utcnow() - timedelta(days=random.randint(0, 60))
                )
                db.session.add(saved_job)
                
                # Update dashboard stats
                stats = DashboardStats.query.filter_by(user_id=student_id).first()
                if stats:
                    stats.saved_jobs += 1
                
                saved_count += 1
                
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error saving jobs for student {student_id}: {str(e)}")
            continue
    
    db.session.commit()
    print(f"✓ Created {saved_count} saved jobs")
    return saved_count

def create_interviews(student_ids, job_ids):
    """Create interview records"""
    print(f"\nCreating interviews...")
    
    interviews_created = 0
    
    # Get some applications that are in 'interview' status
    applications = Application.query.filter_by(status='interview').limit(10).all()
    
    for app in applications:
        try:
            interview = Interview(
                application_id=app.id,
                scheduled_date=datetime.utcnow() + timedelta(days=random.randint(1, 14)),
                interview_type=random.choice(['phone', 'video', 'in-person']),
                interview_platform=random.choice(['Zoom', 'Google Meet', 'Microsoft Teams', 'On-site']),
                status=random.choice(['scheduled', 'completed', 'cancelled']),
                feedback=fake.paragraph(nb_sentences=3) if random.choice([True, False]) else None,
                rating=random.randint(1, 5) if random.choice([True, False]) else None
            )
            db.session.add(interview)
            interviews_created += 1
            
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error creating interview: {str(e)}")
            continue
    
    db.session.commit()
    print(f"✓ Created {interviews_created} interviews")
    return interviews_created

def create_notifications(user_ids):
    """Create notifications for users"""
    print(f"\nCreating notifications...")
    
    notifications_created = 0
    notification_types = [
        'job_match', 'application_update', 'message', 
        'profile_view', 'job_posted', 'deadline_reminder'
    ]
    
    for user_id in user_ids:
        try:
            # Create 2-5 notifications per user
            for _ in range(random.randint(2, 5)):
                notification = Notification(
                    user_id=user_id,
                    title=fake.sentence(nb_words=6),
                    message=fake.sentence(nb_words=12),
                    notification_type=random.choice(notification_types),
                    is_read=random.choice([True, False]),
                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
                )
                db.session.add(notification)
                notifications_created += 1
                
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error creating notification for user {user_id}: {str(e)}")
            continue
    
    db.session.commit()
    print(f"✓ Created {notifications_created} notifications")
    return notifications_created

def create_messages(user_ids):
    """Create sample conversations and messages"""
    print(f"\nCreating messages...")
    
    messages_created = 0
    
    # Create some conversations between random users
    for _ in range(10):
        try:
            # Pick two random users
            user1_id, user2_id = random.sample(user_ids, 2)
            
            # Create conversation
            conversation = Conversation(
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 60))
            )
            db.session.add(conversation)
            db.session.flush()
            
            # Add participants with user_type
            participant1 = Participant(
                conversation_id=conversation.id,
                user_id=user1_id,
                user_type='student' if user1_id < 20 else 'employer',  # Assuming first 20 users are students
                unread_count=0,
                is_muted=False,
                joined_at=datetime.utcnow()
            )
            participant2 = Participant(
                conversation_id=conversation.id,
                user_id=user2_id,
                user_type='student' if user2_id < 20 else 'employer',  # Assuming first 20 users are students
                unread_count=0,
                is_muted=False,
                joined_at=datetime.utcnow()
            )
            db.session.add_all([participant1, participant2])
            
            # Create 2-5 messages in the conversation
            for msg_num in range(random.randint(2, 5)):
                sender_id = user1_id if msg_num % 2 == 0 else user2_id
                # Create message with read_by status
                read_by = [user1_id, user2_id] if msg_num > 0 else [sender_id]
                message = Message(
                    conversation_id=conversation.id,
                    sender_id=sender_id,
                    content=fake.sentence(nb_words=random.randint(5, 20)),
                    message_type='text',
                    read_by=read_by,
                    status='sent',
                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
                )
                db.session.add(message)
                messages_created += 1
                
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error creating conversation: {str(e)}")
            continue
    
    db.session.commit()
    print(f"✓ Created {messages_created} messages in 10 conversations")
    return messages_created

def create_company_reviews(student_ids, company_ids):
    """Create company reviews"""
    print(f"\nCreating company reviews...")
    
    reviews_created = 0
    
    # Each company gets 1-3 reviews
    for company_id in company_ids:
        try:
            reviewers = random.sample(student_ids, min(random.randint(1, 3), len(student_ids)))
            
            for student_id in reviewers:
                review = CompanyReview(
                    company_id=company_id,
                    student_id=student_id,
                    overall_rating=random.randint(3, 5),
                    work_life_balance_rating=random.randint(3, 5),
                    culture_rating=random.randint(3, 5),
                    benefits_rating=random.randint(3, 5),
                    management_rating=random.randint(3, 5),
                    review_text=fake.paragraph(nb_sentences=3),
                    is_approved=random.choice([True, False, True]),  # 2/3 approved
                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 180))
                )
                db.session.add(review)
                reviews_created += 1
                
        except Exception as e:
            db.session.rollback()
            print(f"✗ Error creating review for company {company_id}: {str(e)}")
            continue
    
    db.session.commit()
    print(f"✓ Created {reviews_created} company reviews")
    return reviews_created

def update_dashboard_stats():
    """Update dashboard stats with actual data"""
    print(f"\nUpdating dashboard stats...")
    
    try:
        # Update all dashboard stats
        for stats in DashboardStats.query.all():
            user = User.query.get(stats.user_id)
            
            if user.role == 'student':
                # Update student stats
                stats.total_applications = Application.query.filter_by(student_id=user.id).count()
                stats.pending_applications = Application.query.filter_by(student_id=user.id, status='pending').count()
                stats.interview_applications = Application.query.filter_by(student_id=user.id, status='interview').count()
                stats.rejected_applications = Application.query.filter_by(student_id=user.id, status='rejected').count()
                stats.accepted_applications = Application.query.filter_by(student_id=user.id, status='accepted').count()
                stats.saved_jobs = SavedJob.query.filter_by(student_id=user.id).count()
                
            elif user.role == 'employer':
                # Update employer stats
                stats.posted_jobs = Job.query.filter_by(company_id=user.id).count()
                stats.active_jobs = Job.query.filter_by(company_id=user.id, is_active=True).count()
                stats.total_applicants = Application.query.filter_by(job_id=Job.query.filter_by(company_id=user.id).all()).count()
        
        db.session.commit()
        print("✓ Updated dashboard stats with real data")
        
    except Exception as e:
        db.session.rollback()
        print(f"✗ Error updating dashboard stats: {str(e)}")

def main():
    """Main function to seed the database"""
    try:
        print("=" * 60)
        print("STARTING DATABASE SEEDING FOR STUDENTU PLATFORM")
        print("=" * 60)
        
        # Create tables if they don't exist
        print("\nCreating database tables...")
        db.create_all()
        
        # Create admin user
        admin = create_admin()
        if not admin:
            print("✗ Failed to create admin user. Exiting...")
            return
        
        # Create students
        students_created = create_students(15)
        student_users = User.query.filter_by(role='student').all()
        student_ids = [user.id for user in student_users]
        
        # Create employers and companies
        companies = create_employers(8)
        employer_ids = [company[0] for company in companies]
        company_ids = employer_ids  # In your schema, company_id = user_id for employers
        
        # Get all user IDs
        all_user_ids = [admin.id] + student_ids + employer_ids
        
        # Create jobs
        job_ids = create_jobs(companies, count_per_company=random.randint(2, 4))
        
        # Create applications
        create_applications(student_ids, job_ids)
        
        # Create saved jobs
        create_saved_jobs(student_ids, job_ids)
        
        # Create interviews
        create_interviews(student_ids, job_ids)
        
        # Create notifications
        create_notifications(all_user_ids)
        
        # Create messages
        create_messages(all_user_ids)
        
        # Create company reviews
        create_company_reviews(student_ids, company_ids)
        
        # Update dashboard stats with actual data
        update_dashboard_stats()
        
        print("\n" + "=" * 60)
        print("DATABASE SEEDING COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        
        # Print summary
        print("\nSUMMARY:")
        print(f"• Admin accounts: 1")
        print(f"• Student accounts: {len(student_ids)}")
        print(f"• Employer accounts: {len(employer_ids)}")
        print(f"• Total jobs: {len(job_ids)}")
        print(f"• Total applications: {Application.query.count()}")
        print(f"• Total saved jobs: {SavedJob.query.count()}")
        print(f"• Total interviews: {Interview.query.count()}")
        print(f"• Total notifications: {Notification.query.count()}")
        print(f"• Total messages: {Message.query.count()}")
        print(f"• Total reviews: {CompanyReview.query.count()}")
        
        print("\nTEST CREDENTIALS:")
        print("Admin: admin@studentu.com / Admin123!@#")
        print("Student 1: student1@studentu.com / Student123!@#")
        print("Employer 1: employer1@studentu.com / Employer123!@#")
        print("\nAll students: student1-15@studentu.com")
        print("All employers: employer1-8@studentu.com")
        print("(Use same passwords as above)")
        
    except Exception as e:
        print(f"\n✗ Error during database seeding: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
    finally:
        db.session.close()

if __name__ == '__main__':
    main()