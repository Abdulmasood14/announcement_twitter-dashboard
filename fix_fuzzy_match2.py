# Read the file
with open(r'f:\Announcement and Twitter Final\announcement-twitter-dashboard\app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and replace lines 155-157
for i in range(len(lines)):
    if i == 154:  # Line 155 (0-indexed)
        # Replace the fuzzy match logic
        lines[i] = "            const commonWords = ['ltd', 'limited', 'co', 'company', 'inc', 'corporation', 'corp'];\n"
        lines.insert(i+1, "            const significantWords = nameWords.filter(word => word.length > 2 && !commonWords.includes(word));\n")
        lines.insert(i+2, "            const fuzzyMatch = significantWords.length > 0 && (significantWords.length === 1 ? entryWords.includes(significantWords[0]) : significantWords.filter(word => entryWords.includes(word)).length >= Math.min(2, significantWords.length));\n")
        # Remove old lines 156-157
        del lines[i+3:i+5]
        break

# Write back
with open(r'f:\Announcement and Twitter Final\announcement-twitter-dashboard\app.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed fuzzy matching logic successfully!")
