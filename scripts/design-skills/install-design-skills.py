#!/usr/bin/env python3
"""Install the vendored UI/UX design skills into the user's global skills dir.

Copies every skill folder in scripts/design-skills/skills/ into ~/.claude/skills/
and registers it in ~/.claude/skills/manifest.json so Claude Code auto-activates
it in any project. Idempotent: safe to run on every session start.
"""

import json
import os
import re
import shutil
import sys
from datetime import datetime, timezone

PROJECT_DIR = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
SRC = os.path.join(PROJECT_DIR, "scripts", "design-skills", "skills")
DST = os.path.join(os.path.expanduser("~"), ".claude", "skills")
MANIFEST = os.path.join(DST, "manifest.json")
SOURCE_TAG = "ui-ux-pro-max"


def parse_frontmatter(skill_md):
    text = open(skill_md, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    fm = m.group(1) if m else ""

    def field(key):
        mm = re.search(rf"^{key}:\s*(.*)$", fm, re.M)
        if not mm:
            return None
        v = mm.group(1).strip()
        if len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
            v = v[1:-1]
        return v

    return field("name"), field("description")


def load_manifest():
    if os.path.isfile(MANIFEST):
        try:
            data = json.load(open(MANIFEST))
            if isinstance(data, dict) and isinstance(data.get("skills"), list):
                return data
        except (json.JSONDecodeError, OSError):
            pass
    return {"skills": []}


def main():
    if not os.path.isdir(SRC):
        print(f"[install-design-skills] source not found: {SRC}", file=sys.stderr)
        return 0  # don't block session start

    os.makedirs(DST, exist_ok=True)
    manifest = load_manifest()
    by_id = {s.get("skillId"): s for s in manifest["skills"] if isinstance(s, dict)}
    now = datetime.now(timezone.utc).isoformat()

    installed = []
    for name in sorted(os.listdir(SRC)):
        sdir = os.path.join(SRC, name)
        skill_md = os.path.join(sdir, "SKILL.md")
        if not os.path.isdir(sdir) or not os.path.isfile(skill_md):
            continue

        skill_name, desc = parse_frontmatter(skill_md)
        target = os.path.join(DST, name)
        if os.path.exists(target):
            shutil.rmtree(target)
        shutil.copytree(sdir, target)

        entry = by_id.get(name)
        if entry is None:
            entry = {"skillId": name}
            manifest["skills"].append(entry)
            by_id[name] = entry
        entry.update(
            {
                "name": skill_name or name,
                "description": desc or "",
                "source": SOURCE_TAG,
                "updatedAt": now,
            }
        )
        installed.append(name)

    manifest["lastUpdated"] = int(datetime.now(timezone.utc).timestamp() * 1000)
    json.dump(manifest, open(MANIFEST, "w"), indent=2)
    print(f"[install-design-skills] installed {len(installed)}: {', '.join(installed)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
