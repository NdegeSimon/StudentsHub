from flask import render_template, current_app
from flask_mail import Message
from extensions import mail

def send_email_notification(to, subject, template, **context):
    """
    Send an email notification using the specified template
    
    Args:
        to: Recipient email address
        subject: Email subject
        template: Template filename (without extension)
        **context: Template variables
    """
    if not to:
        current_app.logger.warning("No recipient email provided, skipping email notification")
        return False
        
    try:
        # Render both HTML and plain text versions
        html_body = render_template(f'emails/{template}', **context)
        text_body = render_template(f'emails/{template}.txt', **context)
        
        msg = Message(
            subject=subject,
            recipients=[to],
            html=html_body,
            body=text_body,
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        
        mail.send(msg)
        current_app.logger.info(f"Email sent to {to} with subject: {subject}")
        return True
        
    except Exception as e:
        current_app.logger.error(f"Failed to send email to {to}: {str(e)}")
        return False

def send_application_confirmation(student, job, application):
    """Send confirmation email to student after applying"""
    return send_email_notification(
        to=student.user.email,
        subject=f"Application Submitted: {job.title}",
        template='application_confirmation.html',
        student=student,
        job=job,
        application=application
    )

def send_application_status_update(application, old_status, new_status):
    """Notify student about application status update"""
    if not application.student or not application.job:
        return False
        
    return send_email_notification(
        to=application.student.user.email,
        subject=f"Application Update: {application.job.title}",
        template='application_status_update.html',
        application=application,
        old_status=old_status,
        new_status=new_status
    )

def send_interview_invitation(application, interview_details):
    """Send interview invitation to student"""
    if not application.student or not application.job:
        return False
        
    return send_email_notification(
        to=application.student.user.email,
        subject=f"Interview Invitation: {application.job.title}",
        template='interview_invitation.html',
        application=application,
        interview=interview_details
    )
