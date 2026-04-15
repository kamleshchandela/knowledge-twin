import requests


def verify_backend():
    url = "http://127.0.0.1:8000/query"
    data = {
        "question": "Say hello world in three words",
        "history": [],
    }

    print(f"Sending request to {url}...")
    try:
        response = requests.post(url, json=data, timeout=30)
        if response.status_code == 200:
            answer = response.json().get("answer", "")
            safe_answer = answer.encode("ascii", errors="backslashreplace").decode("ascii")
            print("Backend Query: SUCCESS")
            print(f"Response: {safe_answer}")
        else:
            print(f"Backend Query: FAILED ({response.status_code})")
            print(f"Error: {response.text}")
    except Exception as error:
        print(f"Connection Error: {error}")


if __name__ == "__main__":
    verify_backend()
