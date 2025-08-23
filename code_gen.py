import random
import json
import sys
import os

# Generate 6 random 6-digit number strings
numbers = [f"{random.randint(0, 999999):06d}" for _ in range(6)]

# Save to numbers.json (overwrite each run)
with open("numbers.json", "w") as f:
    json.dump(numbers, f)

# Handle --force or -f argument
if "--force" in sys.argv or "-f" in sys.argv:
    # Ensure the .ose directory exists
    os.makedirs(".ose", exist_ok=True)
    with open(".ose/tokens.json", "w") as f:
        json.dump(numbers, f)
