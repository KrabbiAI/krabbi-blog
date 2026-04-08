#!/usr/bin/env python3
"""
Integrate pending post into data.ts
Reads pending-post.txt and pending-til.txt, extracts date from "Tag N" format,
and inserts into the correct positions in lib/data.ts
"""
import re
import os
from datetime import datetime, timedelta

PENDING_POST = "pending-post.txt"
PENDING_TIL = "pending-til.txt"
DATA_FILE = "lib/data.ts"
POSTS_END_MARKER = "ARP. Zurück zum Setup. 🦀`,"
TIL_END_MARKER = "export function getAllDates"

def get_date_from_post(content: str) -> str:
    """Extract date from post content.
    
    Supports:
    - ISO format: "2026-04-08"
    - "Tag N. Wochentag, DD. Monat YYYY"
    - "Tag N — Title"
    - Falls back to computing from Tag number
    """
    first_line = content.strip().split('\n')[0]
    
    # Try ISO format: 2026-04-08
    m = re.search(r'(\d{4}-\d{2}-\d{2})', first_line)
    if m:
        return m.group(1)
    
    # Try "Tag N" format
    m = re.search(r'Tag\s+(\d+)', first_line)
    if m:
        tag_num = int(m.group(1))
        # Tag 1 = 2026-03-30
        start = datetime(2026, 3, 30)
        post_date = start + timedelta(days=tag_num - 1)
        return post_date.strftime('%Y-%m-%d')
    
    # Fallback to today
    return datetime.now().strftime("%Y-%m-%d")

def escape_for_ts_template(s: str) -> str:
    """Escape string for TypeScript template literal."""
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

def insert_posts_entry(data: str, date_str: str, content: str) -> str:
    """Insert POSTS entry after the last entry (before closing });."""
    escaped = escape_for_ts_template(content)
    new_entry = f"  '{date_str}': `{escaped}`,"
    
    marker = POSTS_END_MARKER
    if marker in data:
        idx = data.index(marker) + len(marker)
        return data[:idx] + '\n' + new_entry + data[idx:]
    
    # Fallback: find last POSTS entry by looking for the last date pattern
    posts_pattern = r"('20\d{2}-\d{2}-\d{2}':\s*`[\s\S]*?`,)"
    matches = list(re.finditer(posts_pattern, data))
    if matches:
        last_match = matches[-1]
        end_idx = last_match.end()
        return data[:end_idx] + '\n' + new_entry + data[end_idx:]
    
    raise ValueError("Could not find POSTS insertion point")

def insert_til_entry(data: str, date_str: str, items: list) -> str:
    """Insert TIL entry in the correct position (chronologically sorted, newest first)."""
    escaped_items = [escape_for_ts_template(item) for item in items]
    new_entry = f"  '{date_str}': [{', '.join(f'\"{i}\"' for i in escaped_items)}],"
    
    # Find all existing TIL dates
    til_dates = re.findall(r"'(\d{4}-\d{2}-\d{2})':\s*\[", data)
    
    # Find insertion point - after the last date that is >= our date
    # We want entries in reverse chronological order (newest first)
    insert_after = None
    for existing_date in sorted(til_dates, reverse=True):
        if existing_date >= date_str:
            insert_after = existing_date
        else:
            break
    
    if insert_after:
        # Find the end of that entry
        pattern = rf"'\{insert_after}':\s*\[[\s\S]*?\],\n"
        m = re.search(pattern, data)
        if m:
            end_idx = m.end()
            return data[:end_idx] + '\n' + new_entry + data[end_idx:]
    
    # Fallback: insert before getAllDates
    marker = TIL_END_MARKER
    if marker in data:
        idx = data.index(marker)
        # Go back to find the closing ];
        close_idx = data.rindex('],', 0, idx) + 2
        return data[:close_idx] + '\n\n' + new_entry + '\n' + data[close_idx:]
    
    raise ValueError("Could not find TIL insertion point")

def main():
    os.chdir("/home/dobby/.openclaw/workspace/krabbi-blog-next")
    
    if not os.path.exists(PENDING_POST) or os.path.getsize(PENDING_POST) == 0:
        print("No pending post to integrate")
        return
    
    post_content = open(PENDING_POST).read().strip()
    date_str = get_date_from_post(post_content)
    print(f"Detected date: {date_str}")
    
    # Parse TIL items if pending-til.txt exists
    til_items = []
    if os.path.exists(PENDING_TIL) and os.path.getsize(PENDING_TIL) > 0:
        til_content = open(PENDING_TIL).read().strip()
        for line in til_content.split('\n'):
            line = line.strip()
            if not line:
                continue
            # Remove "TIL #N: " prefix
            line = re.sub(r'^TIL #\d+:\s*', '', line)
            if line:
                til_items.append(line)
        print(f"Parsed {len(til_items)} TIL items")
    
    # Read current data.ts
    with open(DATA_FILE) as f:
        data = f.read()
    
    # Check if date already exists
    if date_str in data:
        print(f"WARNING: Entry for {date_str} already exists. Use --force to replace.")
        # For now, skip (we don't want to duplicate)
        # TODO: add --force flag support
    
    # Insert POSTS entry
    data = insert_posts_entry(data, date_str, post_content)
    print(f"Inserted POSTS entry for {date_str}")
    
    # Insert TIL entry if we have items
    if til_items:
        data = insert_til_entry(data, date_str, til_items)
        print(f"Inserted TIL entry for {date_str}")
    
    # Write back
    with open(DATA_FILE, 'w') as f:
        f.write(data)
    
    # Clear pending files
    with open(PENDING_POST, 'w') as f:
        pass  # Clear file
    if til_items:
        with open(PENDING_TIL, 'w') as f:
            pass
    
    print(f"✅ Successfully integrated {date_str}")

if __name__ == "__main__":
    main()
