import json
import random
from datetime import datetime, timedelta
from faker import Faker
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

fake = Faker()

# Kenyan companies
KENYAN_COMPANIES = [
    "Safaricom PLC",
    "Kenya Commercial Bank (KCB)",
    "Equity Bank",
    "Co-operative Bank",
    "Nation Media Group",
    "Kenyatta National Hospital",
    "Kenya Airways",
    "East African Breweries Limited",
    "Bamburi Cement",
    "Kenya Power",
    "Kenya Revenue Authority",
    "Telkom Kenya",
    "Airtel Kenya",
    "Naivas Supermarket",
    "Uchumi Supermarket",
    "Kenya Pipeline Company",
    "Kenya Railways",
    "National Bank of Kenya",
    "Kenya Ports Authority",
    "Kenya Wildlife Service",
    "M-Pesa Africa",
    "Twiga Foods",
    "Sendy",
    "Cellulant",
    "Andela Kenya",
    "Africa's Talking",
    "Copia Kenya",
    "Zumi Kenya",
    "Sky.Garden",
    "Marketforce"
]

# Kenyan universities/colleges
INSTITUTIONS = [
    "University of Nairobi",
    "Kenyatta University",
    "Strathmore University",
    "Jomo Kenyatta University of Agriculture and Technology",
    "Moi University",
    "Technical University of Kenya",
    "KCA University",
    "United States International University Africa",
    "Mount Kenya University",
    "Egerton University",
    "Maseno University",
    "Daystar University",
    "Zetech University",
    "Multimedia University of Kenya",
    "Riara University",
    "Karatina University",
    "Kisii University",
    "Meru University of Science and Technology",
    "Laikipia University",
    "Chuka University"
]

# Kenyan cities and towns
LOCATIONS = [
    "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", 
    "Thika", "Malindi", "Kitale", "Garissa", "Kakamega",
    "Nyeri", "Meru", "Kisii", "Naivasha", "Nanyuki",
    "Remote", "Hybrid", "On-site"
]

# Job titles with Kenyan context
JOB_TITLES = [
    # Tech roles
    "Software Developer", "Backend Engineer", "Frontend Developer", "Full Stack Developer",
    "Mobile App Developer", "DevOps Engineer", "Data Scientist", "Data Analyst",
    "Machine Learning Engineer", "AI Specialist", "Cybersecurity Analyst", "Network Engineer",
    "IT Support Specialist", "Systems Administrator", "Database Administrator",
    "Cloud Engineer", "UI/UX Designer", "Product Manager", "Scrum Master",
    
    # Business roles
    "Business Analyst", "Marketing Manager", "Digital Marketing Specialist",
    "Sales Executive", "Account Manager", "Customer Success Manager",
    "Human Resources Manager", "Recruitment Officer", "Operations Manager",
    "Finance Manager", "Accountant", "Auditor", "Supply Chain Manager",
    
    # Internship roles
    "Software Engineering Intern", "Data Science Intern", "Marketing Intern",
    "Finance Intern", "Human Resources Intern", "Sales Intern",
    "Operations Intern", "Research Intern", "Graphic Design Intern",
    
    # Entry-level roles
    "Junior Software Developer", "Graduate Trainee", "Customer Service Representative",
    "Administrative Assistant", "Social Media Coordinator", "Content Writer"
]

# Skills and technologies
TECH_SKILLS = [
    "Python", "JavaScript", "Java", "C#", "PHP", "Ruby", "Go", "Kotlin", "Swift",
    "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "Spring Boot", "Laravel",
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle",
    "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "CI/CD",
    "Git", "GitHub", "GitLab", "Jenkins", "Ansible", "Terraform",
    "REST APIs", "GraphQL", "Microservices", "Agile", "Scrum", "DevOps"
]

BUSINESS_SKILLS = [
    "Project Management", "Strategic Planning", "Market Research", "Data Analysis",
    "Financial Analysis", "Budgeting", "Negotiation", "Leadership", "Team Management",
    "Communication", "Presentation", "Sales", "Marketing", "Customer Service",
    "Problem Solving", "Critical Thinking", "Time Management", "Adaptability"
]

# Company descriptions
COMPANY_DESCRIPTIONS = {
    "Safaricom PLC": "Leading telecommunications company in Kenya, pioneer of M-Pesa mobile money service.",
    "Kenya Commercial Bank (KCB)": "One of the largest commercial banks in East Africa.",
    "Equity Bank": "Financial services institution serving over 14 million customers across Africa.",
    "Co-operative Bank": "A commercial bank in Kenya with strong cooperative roots.",
    "Nation Media Group": "Largest independent media house in East and Central Africa.",
    "Kenyatta National Hospital": "National referral and teaching hospital in Nairobi.",
    "Kenya Airways": "National carrier of Kenya, operating across Africa and internationally.",
    "East African Breweries Limited": "Leading beverage company in East Africa.",
    "Twiga Foods": "Technology-driven food distribution company connecting farmers to vendors.",
    "Andela Kenya": "Global talent network connecting companies with remote software developers.",
    "Africa's Talking": "African-focused communications and payments API company.",
    "Sendy": "Technology company that connects customers to transport and logistics services."
}

def generate_job_description(job_title, company):
    """Generate realistic job descriptions"""
    descriptions = [
        f"We are looking for a talented {job_title} to join our {company} team. "
        f"You will work on cutting-edge projects that impact millions of Kenyans.",
        
        f"Join {company} as a {job_title} and be part of our mission to transform "
        f"the digital landscape in Kenya and beyond.",
        
        f"{company} is seeking an enthusiastic {job_title} to contribute to our "
        f"growing technology department. This is an exciting opportunity to work "
        f"on innovative solutions.",
        
        f"As a {job_title} at {company}, you'll collaborate with cross-functional "
        f"teams to deliver high-quality products and services to our customers.",
        
        f"We're hiring a {job_title} to help us build scalable solutions that "
        f"address real-world challenges in the Kenyan market."
    ]
    
    requirements = [
        "Bachelor's degree in Computer Science, IT, or related field",
        "Strong problem-solving skills and attention to detail",
        "Excellent communication and teamwork abilities",
        "Ability to work in a fast-paced environment",
        "Passion for technology and continuous learning",
        f"Experience with relevant technologies and frameworks",
        "Understanding of software development best practices",
        "Portfolio of previous projects (for technical roles)"
    ]
    
    benefits = [
        "Competitive salary package",
        "Comprehensive health insurance",
        "Professional development opportunities",
        "Flexible working hours",
        "Remote work options",
        "Team-building activities",
        "Annual leave allowance",
        "Performance bonuses"
    ]
    
    description = random.choice(descriptions)
    description += "\n\nRequirements:\n• " + "\n• ".join(random.sample(requirements, 4))
    description += f"\n\nBenefits:\n• " + "\n• ".join(random.sample(benefits, 4))
    
    return description

def generate_job(id):
    """Generate a single job listing"""
    job_type = random.choice(["Full-time", "Part-time", "Contract", "Internship"])
    company = random.choice(KENYAN_COMPANIES)
    job_title = random.choice(JOB_TITLES)
    
    # Determine experience level based on job type and title
    if job_type == "Internship":
        experience_level = "Entry Level"
        min_exp = 0
        max_exp = 1
    elif "Junior" in job_title or "Graduate" in job_title:
        experience_level = "Entry Level"
        min_exp = 0
        max_exp = 2
    else:
        experience_level = random.choice(["Entry Level", "Mid Level", "Senior"])
        min_exp = random.randint(1, 5) if experience_level == "Mid Level" else random.randint(3, 10)
        max_exp = min_exp + random.randint(1, 3)
    
    # Generate salary based on role and experience
    base_salary = 30000  # Base in KSh
    if "Senior" in experience_level:
        base_salary = random.randint(180000, 350000)
    elif "Mid" in experience_level:
        base_salary = random.randint(80000, 180000)
    elif "Internship" in job_type:
        base_salary = random.randint(15000, 35000)
    else:  # Entry level
        base_salary = random.randint(35000, 80000)
    
    salary = f"KSh {base_salary:,}/month"
    if job_type == "Contract":
        salary = f"KSh {base_salary * 12:,}/year (Contract)"
    
    # Generate tags based on job type
    if "Developer" in job_title or "Engineer" in job_title:
        tags = random.sample(TECH_SKILLS, random.randint(3, 6))
    elif "Analyst" in job_title:
        tags = random.sample(TECH_SKILLS + BUSINESS_SKILLS, random.randint(3, 5))
    else:
        tags = random.sample(BUSINESS_SKILLS, random.randint(2, 4))
    
    # Add job type as tag
    tags.append(job_type)
    
    # Generate posted date (within last 30 days)
    days_ago = random.randint(0, 30)
    posted_date = datetime.now() - timedelta(days=days_ago)
    
    posted_date_str = ""
    if days_ago == 0:
        posted_date_str = "Today"
    elif days_ago == 1:
        posted_date_str = "Yesterday"
    elif days_ago < 7:
        posted_date_str = f"{days_ago} days ago"
    elif days_ago < 14:
        posted_date_str = "1 week ago"
    else:
        posted_date_str = f"{days_ago // 7} weeks ago"
    
    return {
        "id": id,
        "title": job_title,
        "company": company,
        "location": random.choice(LOCATIONS),
        "type": job_type,
        "salary": salary,
        "description": generate_job_description(job_title, company),
        "requirements": [
            f"{random.randint(1, 5)}+ years of relevant experience",
            f"Bachelor's degree in related field",
            "Strong communication skills",
            "Ability to work in a team environment"
        ],
        "benefits": [
            "Health insurance",
            "Professional development",
            "Flexible hours",
            "Remote work options"
        ],
        "postedDate": posted_date_str,
        "postedTimestamp": posted_date.isoformat(),
        "tags": tags,
        "experienceLevel": experience_level,
        "applicationDeadline": (posted_date + timedelta(days=random.randint(14, 60))).strftime("%Y-%m-%d"),
        "remote": random.choice([True, False]) if random.choice(LOCATIONS) == "Remote" else False,
        "companyDescription": COMPANY_DESCRIPTIONS.get(company, f"A leading company in Kenya's {random.choice(['technology', 'finance', 'healthcare', 'retail', 'telecommunications'])} sector."),
        "minExperience": min_exp,
        "maxExperience": max_exp,
        "applicationCount": random.randint(0, 150),
        "views": random.randint(50, 1000),
        "isActive": True,
        "createdAt": posted_date.isoformat(),
        "updatedAt": posted_date.isoformat()
    }

def generate_user(id):
    """Generate a user (job seeker or employer)"""
    is_employer = random.choice([True, False])
    
    if is_employer:
        company = random.choice(KENYAN_COMPANIES)
        return {
            "id": id,
            "name": fake.name(),
            "email": fake.email(),
            "role": "employer",
            "company": company,
            "position": random.choice(["HR Manager", "Recruitment Officer", "Team Lead", "Department Head"]),
            "phone": fake.phone_number(),
            "location": random.choice(LOCATIONS),
            "bio": f"I'm a {random.choice(['HR professional', 'technical recruiter', 'hiring manager'])} at {company}, looking for talented individuals to join our team.",
            "createdAt": datetime.now().isoformat(),
            "profileCompleted": random.randint(70, 100)
        }
    else:
        institution = random.choice(INSTITUTIONS)
        graduation_year = random.randint(2018, 2024)
        return {
            "id": id,
            "name": fake.name(),
            "email": fake.email(),
            "role": "jobseeker",
            "phone": fake.phone_number(),
            "location": random.choice(LOCATIONS),
            "education": {
                "institution": institution,
                "degree": random.choice(["Bachelor of Science", "Bachelor of Arts", "Bachelor of Commerce"]),
                "field": random.choice(["Computer Science", "Business Administration", "Engineering", "Marketing", "Finance"]),
                "graduationYear": graduation_year,
                "gpa": round(random.uniform(2.5, 4.0), 2)
            },
            "skills": random.sample(TECH_SKILLS + BUSINESS_SKILLS, random.randint(5, 10)),
            "experience": [
                {
                    "title": random.choice(JOB_TITLES),
                    "company": random.choice(KENYAN_COMPANIES),
                    "duration": f"{random.randint(1, 3)} years",
                    "description": f"Worked on {random.choice(['web development', 'data analysis', 'marketing campaigns', 'customer support'])}"
                }
                for _ in range(random.randint(0, 3))
            ],
            "bio": f"Recent graduate from {institution} ({graduation_year}) looking for opportunities in {random.choice(['software development', 'data science', 'digital marketing', 'finance'])}.",
            "resumeUrl": f"/resumes/user_{id}.pdf",
            "profilePicture": f"https://api.dicebear.com/7.x/avataaars/svg?seed={id}",
            "createdAt": datetime.now().isoformat(),
            "profileCompleted": random.randint(40, 90),
            "savedJobs": random.sample(range(1, 101), random.randint(0, 5)),
            "applications": random.sample(range(1, 101), random.randint(0, 10))
        }

def generate_application(job_id, user_id):
    """Generate a job application"""
    statuses = ["Submitted", "Under Review", "Shortlisted", "Interview Scheduled", "Offer Extended", "Rejected"]
    status_weights = [0.4, 0.3, 0.15, 0.08, 0.05, 0.02]
    
    status = random.choices(statuses, weights=status_weights)[0]
    
    application_date = datetime.now() - timedelta(days=random.randint(1, 30))
    
    return {
        "id": f"{job_id}_{user_id}",
        "jobId": job_id,
        "userId": user_id,
        "status": status,
        "appliedDate": application_date.isoformat(),
        "lastUpdated": (application_date + timedelta(days=random.randint(1, 10))).isoformat(),
        "coverLetter": f"I am writing to express my interest in the position. I believe my skills and experience make me a strong candidate for this role.",
        "resumeUrl": f"/resumes/user_{user_id}.pdf",
        "notes": random.choice([
            "Candidate has relevant experience",
            "Strong technical skills",
            "Good cultural fit",
            "Needs more experience",
            "Excellent communication skills"
        ])
    }

def generate_course(id):
    """Generate an online course"""
    course_titles = [
        "Web Development Bootcamp",
        "Data Science Fundamentals",
        "Digital Marketing Mastery",
        "Python for Beginners",
        "React Native Mobile Development",
        "AWS Cloud Practitioner",
        "UI/UX Design Principles",
        "Project Management Professional (PMP)",
        "Financial Analysis Essentials",
        "Machine Learning with Python"
    ]
    
    providers = [
        "Coursera", "Udemy", "edX", "Pluralsight", "LinkedIn Learning",
        "Google Digital Garage", "Microsoft Learn", "IBM SkillsBuild",
        "Andela Learning Community", "Moringa School", "Udacity"
    ]
    
    return {
        "id": id,
        "title": random.choice(course_titles),
        "provider": random.choice(providers),
        "description": f"Learn {random.choice(['web development', 'data science', 'digital marketing', 'cloud computing'])} through this comprehensive course.",
        "duration": f"{random.randint(4, 12)} weeks",
        "level": random.choice(["Beginner", "Intermediate", "Advanced"]),
        "price": random.choice(["Free", "KSh 5,000", "KSh 15,000", "KSh 30,000"]),
        "rating": round(random.uniform(3.5, 5.0), 1),
        "enrolled": random.randint(100, 10000),
        "certificate": random.choice([True, False]),
        "tags": random.sample(TECH_SKILLS + BUSINESS_SKILLS, random.randint(3, 6))
    }

def seed_database():
    """Generate all seed data"""
    print("🌱 Generating seed data for StudentHub...")
    
    # Generate jobs
    print("📝 Generating job listings...")
    jobs = [generate_job(i) for i in range(1, 101)]  # 100 jobs
    
    # Generate users
    print("👥 Generating users...")
    users = [generate_user(i) for i in range(1, 51)]  # 50 users
    
    # Generate applications
    print("📄 Generating job applications...")
    applications = []
    for job in random.sample(jobs, 30):  # 30 jobs have applications
        num_applications = random.randint(1, 10)
        for user in random.sample(users, num_applications):
            if user["role"] == "jobseeker":
                applications.append(generate_application(job["id"], user["id"]))
    
    # Generate courses
    print("🎓 Generating courses...")
    courses = [generate_course(i) for i in range(1, 21)]  # 20 courses
    
    # Save to JSON files
    data_dir = "data"
    os.makedirs(data_dir, exist_ok=True)
    
    with open(f"{data_dir}/jobs.json", "w", encoding="utf-8") as f:
        json.dump({"jobs": jobs, "count": len(jobs)}, f, indent=2)
    
    with open(f"{data_dir}/users.json", "w", encoding="utf-8") as f:
        json.dump({"users": users, "count": len(users)}, f, indent=2)
    
    with open(f"{data_dir}/applications.json", "w", encoding="utf-8") as f:
        json.dump({"applications": applications, "count": len(applications)}, f, indent=2)
    
    with open(f"{data_dir}/courses.json", "w", encoding="utf-8") as f:
        json.dump({"courses": courses, "count": len(courses)}, f, indent=2)
    
    # Generate a seed summary
    summary = {
        "totalJobs": len(jobs),
        "totalUsers": len(users),
        "totalApplications": len(applications),
        "totalCourses": len(courses),
        "jobTypes": list({job["type"] for job in jobs}),
        "locations": list({job["location"] for job in jobs}),
        "companies": list({job["company"] for job in jobs}),
        "generatedAt": datetime.now().isoformat()
    }
    
    with open(f"{data_dir}/seed_summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    
    print("✅ Seed data generation complete!")
    print(f"📊 Summary:")
    print(f"   Jobs: {len(jobs)}")
    print(f"   Users: {len(users)}")
    print(f"   Applications: {len(applications)}")
    print(f"   Courses: {len(courses)}")
    print(f"📁 Data saved to '{data_dir}/' directory")
    
    return summary

def create_mock_api_server():
    """Create a simple mock API server for testing"""
    from flask import Flask, jsonify
    import json
    
    app = Flask(__name__)
    
    # Load seed data
    with open("data/jobs.json", "r") as f:
        jobs_data = json.load(f)
    
    with open("data/users.json", "r") as f:
        users_data = json.load(f)
    
    # API Routes
    @app.route('/api/jobs', methods=['GET'])
    def get_jobs():
        return jsonify(jobs_data)
    
    @app.route('/api/jobs/<int:job_id>', methods=['GET'])
    def get_job(job_id):
        job = next((j for j in jobs_data["jobs"] if j["id"] == job_id), None)
        if job:
            return jsonify({"success": True, "data": job})
        return jsonify({"success": False, "error": "Job not found"}), 404
    
    @app.route('/api/users', methods=['GET'])
    def get_users():
        return jsonify(users_data)
    
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({"status": "OK", "message": "Mock API Server is running"})
    
    print("🚀 Starting mock API server on http://localhost:5001")
    print("🔗 Available endpoints:")
    print("   GET http://localhost:5001/api/jobs")
    print("   GET http://localhost:5001/api/jobs/1")
    print("   GET http://localhost:5001/api/users")
    print("   GET http://localhost:5001/api/health")
    
    return app

if __name__ == "__main__":
    # Install required packages first: pip install faker flask
    
    # Check if Faker is installed
    try:
        import faker
    except ImportError:
        print("❌ Faker package not found. Installing...")
        os.system("pip install faker flask")
        print("✅ Packages installed. Please run the script again.")
        sys.exit(1)
    
    # Generate seed data
    summary = seed_database()
    
    # Ask if user wants to start mock server
    print("\n🌐 Do you want to start a mock API server for testing? (y/n)")
    choice = input().strip().lower()
    
    if choice == 'y':
        try:
            from flask import Flask, jsonify
            app = create_mock_api_server()
            app.run(host='0.0.0.0', port=5001, debug=False)
        except ImportError:
            print("❌ Flask not installed. Run: pip install flask")
    else:
        print("\n📚 Next steps:")
        print("1. Use the generated JSON files in your backend")
        print("2. Import the data into your database")
        print("3. Test your frontend with realistic Kenyan data")
        print("\n💡 Tip: Run 'python seed.py' again to regenerate data")