import requests

TARGET = "http://10.102.70.81"

def read_data():
    print("\n[+] Reading ESP32 Sensor Data...")
    r = requests.get(TARGET)
    print(r.text)

def find_endpoints():
    print("\n[+] Finding Hidden Endpoints...")
    endpoints = ["/data", "/api", "/sensor",
                 "/config", "/update", "/reset",
                 "/admin", "/status", "/info"]
    for ep in endpoints:
        try:
            r = requests.get(TARGET + ep, timeout=2)
            print(f"[{r.status_code}] {TARGET}{ep}")
        except:
            pass

def send_fake_data():
    print("\n[+] Sending Fake Sensor Data...")
    fake = {"temperature": 999, "humidity": 0}
    try:
        r = requests.post(TARGET, json=fake, timeout=2)
        print(f"Response: {r.status_code}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    print("=" * 40)
    print("   ESP32 Security Tool - Demo")
    print("=" * 40)
    read_data()
    find_endpoints()
    send_fake_data()
