# Vendored design skills — provenance

The skill folders under `skills/` are a verbatim copy of the `.claude/skills/`
tree from the upstream UI/UX Pro Max skill repository. They are vendored (rather
than installed at runtime) because Claude Code on the web runs in an ephemeral
container with no guaranteed network access to third-party registries; the
`SessionStart` hook copies them into `~/.claude/skills/` on every session start.

| | |
| --- | --- |
| Upstream | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| Version | 2.13.0 |
| Commit | `abb7f2fd5a083fa1ff55c326a963ff0d95c33f99` |
| License | MIT — see `LICENSE.upstream` |

Skills included: `banner-design`, `brand`, `design`, `design-system`, `slides`,
`ui-styling`, `ui-ux-pro-max`.

## Refreshing

```bash
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uupm
rm -rf scripts/design-skills/skills
mkdir -p scripts/design-skills/skills
cp -R /tmp/uupm/.claude/skills/. scripts/design-skills/skills/
```

Then update the version/commit above, re-run
`python3 scripts/design-skills/install-design-skills.py`, and commit.

Do not hand-edit files under `skills/` — local changes are silently lost on the
next refresh. Upstream fixes belong in a PR to the upstream repository.
