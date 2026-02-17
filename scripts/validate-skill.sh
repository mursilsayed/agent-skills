#!/usr/bin/env bash
# Validates skill directories against the schema.
# Usage: validate-skill.sh [skill-dir ...]
# If no arguments, validates all skills in skills/

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_DIR="$REPO_ROOT/skills"
ERRORS=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

log_error() { echo -e "${RED}ERROR:${NC} $1"; ERRORS=$((ERRORS + 1)); }
log_warn()  { echo -e "${YELLOW}WARN:${NC} $1"; }
log_ok()    { echo -e "${GREEN}OK:${NC} $1"; }

validate_skill() {
    local skill_dir="$1"
    local skill_name
    skill_name="$(basename "$skill_dir")"

    echo "--- Validating: $skill_name ---"

    # Check SKILL.md exists
    if [[ ! -f "$skill_dir/SKILL.md" ]]; then
        log_error "$skill_name: Missing SKILL.md"
    else
        log_ok "$skill_name: SKILL.md exists"

        # Check SKILL.md has no YAML frontmatter with dependency fields
        if head -1 "$skill_dir/SKILL.md" | grep -q '^---'; then
            # Extract frontmatter
            frontmatter=$(sed -n '/^---$/,/^---$/p' "$skill_dir/SKILL.md")
            for field in "allowed-tools" "mcp-servers" "dependencies" "npm-packages" "pip-packages"; do
                if echo "$frontmatter" | grep -qi "$field"; then
                    log_error "$skill_name: SKILL.md frontmatter contains '$field' — move to skill-metadata.yaml"
                fi
            done
        fi
    fi

    # Check skill-metadata.yaml exists
    local meta="$skill_dir/skill-metadata.yaml"
    if [[ ! -f "$meta" ]]; then
        log_error "$skill_name: Missing skill-metadata.yaml"
        return
    else
        log_ok "$skill_name: skill-metadata.yaml exists"
    fi

    # Validate required fields
    for field in name version description status; do
        if ! grep -q "^${field}:" "$meta"; then
            log_error "$skill_name: Missing required field '$field' in skill-metadata.yaml"
        fi
    done

    # Validate name matches directory
    local meta_name
    meta_name=$(grep "^name:" "$meta" | head -1 | sed 's/^name:[[:space:]]*//')
    if [[ "$meta_name" != "$skill_name" ]]; then
        log_error "$skill_name: name field '$meta_name' does not match directory name '$skill_name'"
    fi

    # Validate status is one of allowed values
    local status
    status=$(grep "^status:" "$meta" | head -1 | sed 's/^status:[[:space:]]*//')
    if [[ -n "$status" ]] && [[ "$status" != "stable" && "$status" != "experimental" && "$status" != "deprecated" ]]; then
        log_error "$skill_name: Invalid status '$status' (must be stable|experimental|deprecated)"
    fi

    # Validate version format
    local version
    version=$(grep "^version:" "$meta" | head -1 | sed 's/^version:[[:space:]]*//')
    if [[ -n "$version" ]] && ! echo "$version" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
        log_error "$skill_name: Invalid version '$version' (must be semver: X.Y.Z)"
    fi

    # Validate includes paths exist
    local in_includes=false
    while IFS= read -r line; do
        if echo "$line" | grep -q "^includes:"; then
            in_includes=true
            continue
        fi
        if $in_includes; then
            if echo "$line" | grep -q "^[a-z]"; then
                in_includes=false
                continue
            fi
            local path
            path=$(echo "$line" | sed 's/^[[:space:]]*-[[:space:]]*//')
            if [[ -n "$path" ]] && [[ ! -e "$skill_dir/$path" ]]; then
                log_error "$skill_name: includes path '$path' does not exist"
            fi
        fi
    done < "$meta"

    log_ok "$skill_name: validation complete"
}

# Determine which skills to validate
if [[ $# -gt 0 ]]; then
    SKILL_DIRS=("$@")
else
    SKILL_DIRS=()
    for dir in "$SKILLS_DIR"/*/; do
        [[ -d "$dir" ]] && SKILL_DIRS+=("$dir")
    done
fi

# Check for orphan directories (skill dirs without both files)
for dir in "$SKILLS_DIR"/*/; do
    [[ -d "$dir" ]] || continue
    name="$(basename "$dir")"
    if [[ ! -f "$dir/SKILL.md" ]] && [[ ! -f "$dir/skill-metadata.yaml" ]]; then
        log_warn "Orphan directory: $name (has neither SKILL.md nor skill-metadata.yaml)"
    fi
done

# Validate each skill
for skill_dir in "${SKILL_DIRS[@]}"; do
    # Remove trailing slash
    skill_dir="${skill_dir%/}"
    validate_skill "$skill_dir"
    echo
done

# Summary
if [[ $ERRORS -gt 0 ]]; then
    echo -e "${RED}Validation failed with $ERRORS error(s)${NC}"
    exit 1
else
    echo -e "${GREEN}All skills validated successfully${NC}"
    exit 0
fi
