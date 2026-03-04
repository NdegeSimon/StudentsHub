#!/usr/bin/env python3
"""
Test script to verify job posting and application flow
"""
import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:5001/api"

def test_job_flow():
    print("=" * 60)
    print("TESTING JOB POSTING AND APPLICATION FLOW")
    print("=" * 60)
    
    # Test 1: Register as employer
    print("\n1. Registering employer...")
    employer_data = {
        "email": f"employer_{datetime.now().timestamp()}@test.com",
        "password": "Test@1234",
        "first_name": "John",
        "last_name": "Employer",
        "role": "employer"
    }
    
    resp = requests.post(f"{BASE_URL}/auth/register", json=employer_data)
    print(f"   Status: {resp.status_code}")
    
    if resp.status_code != 201:
        print(f"   Error: {resp.text}")
        return False
    
    employer_resp = resp.json()
    employer_token = employer_resp['access_token']
    employer_id = employer_resp['user']['id']
    print(f"   ✓ Employer registered (ID: {employer_id})")
    
    # Test 2: Create a job
    print("\n2. Creating job posting...")
    job_data = {
        "title": "Senior Python Developer",
        "description": "We are looking for an experienced Python developer",
        "requirements": "5+ years experience, Django expertise",
        "location": "San Francisco, CA",
        "job_type": "full-time",
        "work_mode": "hybrid",
        "experience_level": "senior",
        "salary_min": 120000,
        "salary_max": 160000,
        "salary_currency": "USD",
        "application_deadline": (datetime.utcnow() + timedelta(days=30)).isoformat()
    }
    
    headers = {"Authorization": f"Bearer {employer_token}"}
    resp = requests.post(f"{BASE_URL}/jobs", json=job_data, headers=headers)
    print(f"   Status: {resp.status_code}")
    
    if resp.status_code != 201:
        print(f"   Error: {resp.text}")
        return False
    
    job_resp = resp.json()
    job_id = job_resp['job_id']
    print(f"   ✓ Job created (ID: {job_id})")
    
    # Test 3: Register as student
    print("\n3. Registering student...")
    student_data = {
        "email": f"student_{datetime.now().timestamp()}@test.com",
        "password": "Test@1234",
        "first_name": "Jane",
        "last_name": "Student",
        "role": "student"
    }
    
    resp = requests.post(f"{BASE_URL}/auth/register", json=student_data)
    print(f"   Status: {resp.status_code}")
    
    if resp.status_code != 201:
        print(f"   Error: {resp.text}")
        return False
    
    student_resp = resp.json()
    student_token = student_resp['access_token']
    student_id = student_resp['user']['id']
    print(f"   ✓ Student registered (ID: {student_id})")
    
    # Test 4: Get job details
    print(f"\n4. Fetching job details (ID: {job_id})...")
    headers = {"Authorization": f"Bearer {student_token}"}
    resp = requests.get(f"{BASE_URL}/jobs/{job_id}", headers=headers)
    print(f"   Status: {resp.status_code}")
    
    if resp.status_code != 200:
        print(f"   Error: {resp.text}")
        return False
    
    job_details = resp.json()
    print(f"   ✓ Job details retrieved")
    print(f"   Title: {job_details['job']['title']}")
    print(f"   Company: {job_details['job']['company']}")
    
    # Test 5: Apply to job
    print(f"\n5. Applying to job (ID: {job_id})...")
    application_data = {
        "cover_letter": "I am very interested in this position!",
        "resume_url": "https://example.com/resume.pdf"
    }
    
    resp = requests.post(
        f"{BASE_URL}/jobs/{job_id}/apply",
        json=application_data,
        headers=headers
    )
    print(f"   Status: {resp.status_code}")
    
    if resp.status_code != 201:
        print(f"   Error: {resp.text}")
        return False
    
    application_resp = resp.json()
    application_id = application_resp['application_id']
    print(f"   ✓ Application submitted (ID: {application_id})")
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED!")
    print("=" * 60)
    return True

if __name__ == "__main__":
    try:
        success = test_job_flow()
        exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Test failed with exception: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
