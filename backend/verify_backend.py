import requests

def verify_backend():
    url = "http://localhost:8000/query"
    data = {
        "question": "Say hello world in 3 emojis",
        "history": []
    }
    
    print(f"Sending request to {url}...")
    try:
        response = requests.post(url, json=data, timeout=30)
        if response.status_code == 200:
            print("✅ Backend Query: SUCCESS")
            print(f"Response: {response.json().get('answer')}")
        else:
            print(f"❌ Backend Query: FAILED ({response.status_code})")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    verify_backend()
