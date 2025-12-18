from flask import request
from sqlalchemy import or_
from models.models import Job, Student, Company, db
from .base_controller import BaseController

class SearchController(BaseController):
    """Controller for search functionality"""
    
    @classmethod
    def search_jobs(cls):
        """Search for jobs with filters"""
        query = request.args.get('q', '')
        filters = {
            'job_type': request.args.get('job_type'),
            'location': request.args.get('location'),
            'is_remote': request.args.get('is_remote') == 'true',
            'min_salary': request.args.get('min_salary', type=float),
            'max_salary': request.args.get('max_salary', type=float),
            'company_id': request.args.get('company_id')
        }
        
        # Base query
        jobs_query = Job.query.filter_by(is_active=True)
        
        # Apply text search
        if query:
            search = f"%{query}%"
            jobs_query = jobs_query.filter(
                or_(
                    Job.title.ilike(search),
                    Job.description.ilike(search),
                    Job.requirements.ilike(search),
                    Job.responsibilities.ilike(search)
                )
            )
        
        # Apply filters
        if filters['job_type']:
            jobs_query = jobs_query.filter_by(job_type=filters['job_type'])
            
        if filters['location']:
            jobs_query = jobs_query.filter(Job.location.ilike(f"%{filters['location']}%"))
            
        if filters['is_remote']:
            jobs_query = jobs_query.filter_by(is_remote=True)
            
        if filters['min_salary']:
            jobs_query = jobs_query.filter(Job.salary_range_min >= filters['min_salary'])
            
        if filters['max_salary']:
            jobs_query = jobs_query.filter(Job.salary_range_max <= filters['max_salary'])
            
        if filters['company_id']:
            jobs_query = jobs_query.filter_by(company_id=filters['company_id'])
        
        # Execute query
        jobs = jobs_query.all()
        
        return BaseController.success_response(
            data={'jobs': [job.to_dict() for job in jobs]},
            message='Jobs retrieved successfully'
        )
    
    @classmethod
    def search_students(cls):
        """Search for students with filters"""
        query = request.args.get('q', '')
        filters = {
            'education_level': request.args.get('education_level'),
            'skills': request.args.getlist('skills'),
            'institution': request.args.get('institution'),
            'field_of_study': request.args.get('field_of_study')
        }
        
        # Base query
        students_query = Student.query.join(User)
        
        # Apply text search
        if query:
            search = f"%{query}%"
            students_query = students_query.filter(
                or_(
                    User.first_name.ilike(search),
                    User.last_name.ilike(search),
                    Student.institution.ilike(search),
                    Student.field_of_study.ilike(search),
                    Student.skills.any(search)
                )
            )
        
        # Apply filters
        if filters['education_level']:
            students_query = students_query.filter_by(education_level=filters['education_level'])
            
        if filters['institution']:
            students_query = students_query.filter(Student.institution.ilike(f"%{filters['institution']}%"))
            
        if filters['field_of_study']:
            students_query = students_query.filter(Student.field_of_study.ilike(f"%{filters['field_of_study']}%"))
            
        if filters['skills']:
            for skill in filters['skills']:
                students_query = students_query.filter(Student.skills.any(skill))
        
        # Execute query
        students = students_query.all()
        
        return BaseController.success_response(
            data={'students': [{
                'id': s.id,
                'user_id': s.user_id,
                'first_name': s.user.first_name,
                'last_name': s.user.last_name,
                'email': s.user.email,
                'institution': s.institution,
                'field_of_study': s.field_of_study,
                'skills': s.skills,
                'resume_url': s.resume_url
            } for s in students]},
            message='Students retrieved successfully'
        )
    
    @classmethod
    def search_companies(cls):
        """Search for companies"""
        query = request.args.get('q', '')
        filters = {
            'industry': request.args.get('industry'),
            'location': request.args.get('location')
        }
        
        # Base query
        companies_query = Company.query
        
        # Apply text search
        if query:
            search = f"%{query}%"
            companies_query = companies_query.filter(
                or_(
                    Company.company_name.ilike(search),
                    Company.industry.ilike(search),
                    Company.description.ilike(search)
                )
            )
        
        # Apply filters
        if filters['industry']:
            companies_query = companies_query.filter(Company.industry.ilike(f"%{filters['industry']}%"))
            
        if filters['location']:
            companies_query = companies_query.filter(
                or_(
                    Company.city.ilike(f"%{filters['location']}%"),
                    Company.country.ilike(f"%{filters['location']}%")
                )
            )
        
        # Execute query
        companies = companies_query.all()
        
        return BaseController.success_response(
            data={'companies': [{
                'id': c.id,
                'company_name': c.company_name,
                'industry': c.industry,
                'website': c.website,
                'logo_url': c.logo_url,
                'description': c.description,
                'city': c.city,
                'country': c.country
            } for c in companies]},
            message='Companies retrieved successfully'
        )
