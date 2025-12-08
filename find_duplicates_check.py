import re
import sys

file_path = "/Users/akerkeyakhiyayeva/Downloads/nurtore 2/digital-truth.html"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Regex to find consecutive duplicate words
# \b start of word
# (\w+) capture word
# \s+ one or more whitespace
# \1 match same word
# \b end of word
# flags=re.IGNORECASE | re.UNICODE
regex_space = re.compile(r'\b([a-zA-Zа-яА-ЯёЁ0-9]+)(\s+)\1\b', re.IGNORECASE | re.UNICODE)
regex_slash = re.compile(r'\b([a-zA-Zа-яА-ЯёЁ0-9]+)\s*/\s*\1\b', re.IGNORECASE | re.UNICODE)

print("--- Space duplicates ---")
matches = regex_space.finditer(content)
for match in matches:
    start = match.start()
    end = match.end()
    context = content[max(0, start-20):min(len(content), end+20)]
    print(f"Found duplicate: '{match.group(0)}' at {start}")
    print(f"Context: ...{context.replace(chr(10), ' ')}...")

print("\n--- Slash duplicates ---")
matches = regex_slash.finditer(content)
for match in matches:
    print(f"Found duplicate: '{match.group(0)}' at {match.start()}")
