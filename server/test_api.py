# test_api.py
import requests

BASE = "http://localhost:5001/api"

def test_endpoint(endpoint):
    try:
        print(f"\nTesting {endpoint}...")
        response = requests.get(f"{BASE}/{endpoint}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.json()}")
        else:
            print(f"Error: {response.text[:100]}")
    except Exception as e:
        print(f"Exception: {e}")

# Test endpoints
test_endpoint("test")
test_endpoint("health")
test_endpoint("jobs")
test_endpoint("dashboard/stats")