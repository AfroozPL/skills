#!/bin/bash
set -euo pipefail

# Install the vendored UI/UX design skills into the user's global skills
# directory (~/.claude/skills) so Claude Code auto-activates them in every
# project. The web container is ephemeral, so this runs on each session start.
#
# Runs everywhere by default; the skills install is fast and idempotent.

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

python3 "$PROJECT_DIR/scripts/design-skills/install-design-skills.py"
