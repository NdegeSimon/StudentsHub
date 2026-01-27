import requests
import json
import sys

BASE_URL = "http://localhost:5001/api/auth"

# Test data for student registration
student_data = {
    "email": "test_student@example.com",
    "password": "Test@1234",
    "first_name": "Test",
    "last_name": "Student",
    "role": "student"
}

# Test data for employer registration
employer_data = {
    "email": "test_employer@example.com",
    "password": "Test@1234",
    "first_name": "Test",
    "last_name": "Employer",
    "role": "employer",
    "company_name": "Test Company Inc"
}

def test_registration(data, user_type):
    print(f"\n{'='*50}")
    print(f"Testing {user_type} registration...")
    print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(f"{BASE_URL}/register", json=data)
        
        if response.status_code == 201:
            print(f"✅ {user_type.capitalize()} registration successful!")
            print("Response:", json.dumps(response.json(), indent=2))
            return True
        elif response.status_code == 409:
            print(f"⚠️ {user_type.capitalize()} already exists")
            print("Response:", json.dumps(response.json(), indent=2))
            return "exists"
        else:
            print(f"❌ {user_type.capitalize()} registration failed with status code:", response.status_code)
            print("Response:", response.text)
            return False
    except Exception as e:
        print(f"❌ Error during {user_type} registration:", str(e))
        return False

def test_login(email, password):
    print(f"\n{'='*50}")
    print(f"Testing login for {email}...")
    
    try:
        response = requests.post(
            f"{BASE_URL}/login",
            json={"email": email, "password": password}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful!")
            print(f"Access token: {data.get('access_token', 'Not provided')[:50]}...")
            print(f"User role: {data.get('user', {}).get('role', 'Not provided')}")
            return data.get('access_token')
        else:
            print(f"❌ Login failed with status code:", response.status_code)
            print("Response:", response.text)
            return None
    except Exception as e:
        print(f"❌ Error during login:", str(e))
        return None

if __name__ == "__main__":
    print("🚀 Starting registration tests...")
    
    # Test student registration
    student_success = test_registration(student_data, "student")
    
    # Test employer registration
    employer_success = test_registration(employer_data, "employer")
    
    # Test logins if registrations were successful
    if student_success or student_success == "exists":
        test_login(student_data["email"], student_data["password"])
    
    if employer_success or employer_success == "exists":
        test_login(employer_data["email"], employer_data["password"])
    
    print("\n🎉 Test completed!")
    print("\nSummary:")
    print(f"- Student registration: {'✅ Success' if student_success else '❌ Failed'}")
    print(f"- Employer registration: {'✅ Success' if employer_success else '❌ Failed'}")
    
    if not (student_success and employer_success):
        sys.exit(1)  # Exit with error code if any test failed
