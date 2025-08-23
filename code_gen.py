import random
import json
import sys

numbers = [f"{random.randint(0, 999999):06d}" for _ in range(6)]

with open("numbers.json", "w") as f:
    json.dump(numbers, f)

if "--force" in sys.argv or "-f" in sys.argv:
    with open("tokens.json", "w") as f:
        json.dump(numbers, f)
