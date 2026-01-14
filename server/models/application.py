from datetime import datetime
import uuid
from ..extensions import db

class Application(db.Model):
    __tablename__ = 'applications'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id', ondelete='CASCADE'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    cover_letter = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending', 
                      nullable=False, index=True)  # pending, reviewing, shortlisted, rejected, hired
    
    # Timeline tracking
    applied_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, 
                          onupdate=datetime.utcnow, nullable=False)
    
    # Additional metadata
    resume_url = db.Column(db.String(255))
    portfolio_url = db.Column(db.String(255))
    
    # Interview details (if applicable)
    interview_scheduled = db.Column(db.Boolean, default=False)
    interview_date = db.Column(db.DateTime, nullable=True)
    interview_notes = db.Column(db.Text)
    
    # Relationships
    job = db.relationship('Job', backref=db.backref('applications', lazy='dynamic'))
    student = db.relationship('Student', backref=db.backref('job_applications', lazy='dynamic'))
    
    # Ensure one application per job per student
    __table_args__ = (
        db.UniqueConstraint('student_id', 'job_id', name='unique_application'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'job_id': self.job_id,
            'student_id': self.student_id,
            'status': self.status,
            'applied_at': self.applied_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'cover_letter': self.cover_letter,
            'resume_url': self.resume_url,
            'portfolio_url': self.portfolio_url,
            'interview_scheduled': self.interview_scheduled,
            'interview_date': self.interview_date.isoformat() if self.interview_date else None,
            'job': self.job.to_dict() if self.job else None
        }
