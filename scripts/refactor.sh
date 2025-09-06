#!/bin/bash

# Refactoring script using modern CLI tools
# Usage: ./scripts/refactor.sh [command]

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if required tools are installed
check_tools() {
    local tools=("fd" "rg" "jq" "yq" "fzf")
    local missing=()
    
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            missing+=("$tool")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        error "Missing required tools: ${missing[*]}"
        error "Please install them using your package manager"
        exit 1
    fi
    
    success "All required tools are installed"
}

# Find and analyze code issues
analyze_code() {
    log "Analyzing code quality..."
    
    # Find long lines (>100 characters)
    local long_lines
    long_lines=$(rg ".*" src/ | awk 'length($0) > 100' | wc -l)
    warn "Found $long_lines lines longer than 100 characters"
    
    # Find console.log statements
    local console_logs
    console_logs=$(rg "console\.(log|warn|error|debug)" src/ | wc -l)
    warn "Found $console_logs console statements"
    
    # Find TODO/FIXME comments
    local todos
    todos=$(rg "(TODO|FIXME|HACK|XXX)" src/ -i | wc -l)
    if [ "$todos" -gt 0 ]; then
        warn "Found $todos TODO/FIXME comments"
    fi
    
    # Find unused imports (basic check)
    local unused_imports
    unused_imports=$(rg "import.*from.*;" src/ | wc -l)
    log "Found $unused_imports import statements"
    
    success "Code analysis complete"
}

# Format code using Prettier
format_code() {
    log "Formatting code with Prettier..."
    
    if command -v npx &> /dev/null; then
        npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"
        success "Code formatted successfully"
    else
        error "npx not found. Please install Node.js"
        exit 1
    fi
}

# Lint code using ESLint
lint_code() {
    log "Linting code with ESLint..."
    
    if command -v npx &> /dev/null; then
        npx eslint "src/**/*.{ts,tsx,js,jsx}" --fix
        success "Code linted successfully"
    else
        error "npx not found. Please install Node.js"
        exit 1
    fi
}

# Find and replace patterns
find_replace() {
    local pattern="$1"
    local replacement="$2"
    local files="${3:-src/**/*.{ts,tsx,js,jsx}}"
    
    log "Finding and replacing: $pattern -> $replacement"
    
    # Use rg to find files with the pattern
    local files_with_pattern
    files_with_pattern=$(rg -l "$pattern" $files)
    
    if [ -n "$files_with_pattern" ]; then
        echo "$files_with_pattern" | while read -r file; do
            log "Updating $file"
            # Use sed for replacement (works on macOS and Linux)
            sed -i.bak "s|$pattern|$replacement|g" "$file"
            rm "$file.bak"
        done
        success "Replacement complete"
    else
        warn "No files found with pattern: $pattern"
    fi
}

# Interactive file selection using fzf
select_files() {
    local pattern="${1:-.*}"
    fd -e ts -e tsx -e js -e jsx | fzf --multi --query "$pattern"
}

# Show file statistics
show_stats() {
    log "Project statistics:"
    
    # Count files by type
    local ts_files
    ts_files=$(fd -e ts | wc -l)
    local tsx_files
    tsx_files=$(fd -e tsx | wc -l)
    local js_files
    js_files=$(fd -e js | wc -l)
    local jsx_files
    jsx_files=$(fd -e jsx | wc -l)
    
    echo "  TypeScript files: $ts_files"
    echo "  TSX files: $tsx_files"
    echo "  JavaScript files: $js_files"
    echo "  JSX files: $jsx_files"
    
    # Count lines of code
    local total_lines
    total_lines=$(rg ".*" src/ | wc -l)
    echo "  Total lines of code: $total_lines"
    
    # Count functions
    local functions
    functions=$(rg "function\s+\w+|const\s+\w+\s*=\s*\(|export\s+function" src/ | wc -l)
    echo "  Functions: $functions"
    
    # Count classes
    local classes
    classes=$(rg "class\s+\w+" src/ | wc -l)
    echo "  Classes: $classes"
}

# Main command handler
case "${1:-help}" in
    "check")
        check_tools
        ;;
    "analyze")
        analyze_code
        ;;
    "format")
        format_code
        ;;
    "lint")
        lint_code
        ;;
    "stats")
        show_stats
        ;;
    "find-replace")
        if [ $# -lt 3 ]; then
            error "Usage: $0 find-replace <pattern> <replacement> [files]"
            exit 1
        fi
        find_replace "$2" "$3" "$4"
        ;;
    "select")
        select_files "$2"
        ;;
    "all")
        check_tools
        analyze_code
        format_code
        lint_code
        show_stats
        success "Full refactoring complete!"
        ;;
    "help"|*)
        echo "Usage: $0 <command>"
        echo ""
        echo "Commands:"
        echo "  check        - Check if required tools are installed"
        echo "  analyze      - Analyze code quality issues"
        echo "  format       - Format code with Prettier"
        echo "  lint         - Lint code with ESLint"
        echo "  stats        - Show project statistics"
        echo "  find-replace - Find and replace patterns in code"
        echo "  select       - Interactive file selection with fzf"
        echo "  all          - Run all refactoring steps"
        echo "  help         - Show this help message"
        ;;
esac
