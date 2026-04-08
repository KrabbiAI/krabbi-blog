#!/bin/bash
# Integrate pending post into data.ts
# Reads pending-post.txt + pending-til.txt, parses date, updates data.ts

PENDING_POST="pending-post.txt"
PENDING_TIL="pending-til.txt"
DATA_FILE="lib/data.ts"

cd /home/dobby/.openclaw/workspace/krabbi-blog-next

if [ ! -f "$PENDING_POST" ] || [ ! -s "$PENDING_POST" ]; then
    echo "No pending post to integrate"
    exit 0
fi

echo "=== Integrating pending post into data.ts ==="

# Extract date from post (format: "Tag N. Wochentag, DD. Monat YYYY" or "Tag N — Title")
# First line usually has the date info
FIRST_LINE=$(head -1 "$PENDING_POST")
echo "First line: $FIRST_LINE"

# Try to find date pattern like "2026-04-08" or "8. April 2026" or "April 8, 2026"
DATE_STR=""
if echo "$FIRST_LINE" | grep -qE "2026-04-[0-9]{2}"; then
    DATE_STR=$(echo "$FIRST_LINE" | grep -oE "2026-04-[0-9]{2}")
elif echo "$FIRST_LINE" | grep -qE "[0-9]+\. (Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember) 2026"; then
    # German: "8. April 2026"
    DAY=$(echo "$FIRST_LINE" | grep -oE "[0-9]+" | head -1)
    MONTH_NAME=$(echo "$FIRST_LINE" | grep -oE "(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)" | head -1)
    MONTH_NUM=""
    case "$MONTH_NAME" in
        Januar) MONTH_NUM="01" ;;
        Februar) MONTH_NUM="02" ;;
        März) MONTH_NUM="03" ;;
        April) MONTH_NUM="04" ;;
        Mai) MONTH_NUM="05" ;;
        Juni) MONTH_NUM="06" ;;
        Juli) MONTH_NUM="07" ;;
        August) MONTH_NUM="08" ;;
        September) MONTH_NUM="09" ;;
        Oktober) MONTH_NUM="10" ;;
        November) MONTH_NUM="11" ;;
        Dezember) MONTH_NUM="12" ;;
    esac
    DATE_STR="2026-${MONTH_NUM}-$(printf '%02d' $DAY)"
elif echo "$FIRST_LINE" | grep -qE "(April|May|June|July|August|September|October|November|December|January|February|March) [0-9]+, 2026"; then
    # English: "April 8, 2026"
    MONTH_NAME=$(echo "$FIRST_LINE" | grep -oE "(April|May|June|July|August|September|October|November|December|January|February|March)" | head -1)
    DAY=$(echo "$FIRST_LINE" | grep -oE "[0-9]+" | head -1)
    MONTH_NUM=""
    case "$MONTH_NAME" in
        January) MONTH_NUM="01" ;;
        February) MONTH_NUM="02" ;;
        March) MONTH_NUM="03" ;;
        April) MONTH_NUM="04" ;;
        May) MONTH_NUM="05" ;;
        June) MONTH_NUM="06" ;;
        July) MONTH_NUM="07" ;;
        August) MONTH_NUM="08" ;;
        September) MONTH_NUM="09" ;;
        October) MONTH_NUM="10" ;;
        November) MONTH_NUM="11" ;;
        December) MONTH_NUM="12" ;;
    esac
    DATE_STR="2026-${MONTH_NUM}-$(printf '%02d' $DAY)"
fi

if [ -z "$DATE_STR" ]; then
    echo "ERROR: Could not parse date from post"
    echo "Trying to use today's date instead..."
    DATE_STR=$(date +%Y-%m-%d)
fi

echo "Detected date: $DATE_STR"

# Read post content (escape backticks for TypeScript template literal)
POST_CONTENT=$(cat "$PENDING_POST" | sed 's/`/\\`/g' | sed 's/\\$/\\\\/g')

# Build new POSTS entry
NEW_POST_ENTRY="  '${DATE_STR}': \`${POST_CONTENT}\`,"

echo "=== New POSTS entry ==="
echo "$NEW_POST_ENTRY"
echo "======================"

# Check if entry for this date already exists
if grep -q "'${DATE_STR}':" "$DATA_FILE"; then
    echo "Entry for $DATE_STR already exists, replacing..."
    # Replace existing entry
    sed -i "s/'${DATE_STR}': \`[\s\S]*?\`,/${NEW_POST_ENTRY}/" "$DATA_FILE"
else
    echo "Adding new entry for $DATE_STR..."
    # Insert before the closing brace of POSTS object
    # Find the line with closing brace after the last entry
    sed -i "s/\(  '20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]': \`[\s\S]*?\`,\)/\1\n${NEW_POST_ENTRY}/" "$DATA_FILE"
fi

# Handle TIL if pending-til.txt exists and has content
if [ -f "$PENDING_TIL" ] && [ -s "$PENDING_TIL" ]; then
    echo "=== Processing TIL ==="
    # Parse TIL entries (format: "TIL #1: Title - Description" or just lines starting with - ")
    TIL_ITEMS=""
    while IFS= read -r line; do
        # Extract description after "TIL #N: " or just use the line
        ITEM=$(echo "$line" | sed 's/^TIL #[0-9]*: //' | sed 's/^-\s*//' | sed 's/`/\\`/g')
        if [ -n "$ITEM" ]; then
            if [ -n "$TIL_ITEMS" ]; then
                TIL_ITEMS="${TIL_ITEMS}, \"${ITEM}\""
            else
                TIL_ITEMS="\"${ITEM}\""
            fi
        fi
    done < "$PENDING_TIL"
    
    if [ -n "$TIL_ITEMS" ]; then
        NEW_TIL_ENTRY="  '${DATE_STR}': [${TIL_ITEMS}],"
        echo "New TIL entry: $NEW_TIL_ENTRY"
        
        if grep -q "'${DATE_STR}':" "$DATA_FILE" | grep -v POSTS; then
            # Already exists in TIL
            sed -i "s/'${DATE_STR}': \[[\s\S]*?\],/${NEW_TIL_ENTRY}/" "$DATA_FILE"
        else
            # Insert TIL entry
            sed -i "s/\(  '20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]': \[[\s\S]*?\],\)/\1\n${NEW_TIL_ENTRY}/" "$DATA_FILE"
        fi
    fi
fi

# Clear pending files
> "$PENDING_POST"
> "$PENDING_TIL"

echo "=== Integration complete ==="
echo "Date: $DATE_STR"
echo "Pending files cleared"
