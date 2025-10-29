# git-auto-rebase-cli

A CLI tool that provides git automation commands including auto-rebase and amend-push functionality.

## Installation

```bash
npm install -g git-auto-rebase-cli
```

## Usage

In any git repository directory, run:

### Auto Rebase (default)
```bash
git-auto-rebase
# or explicitly
git-auto-rebase rebase
```

### Amend and Push
```bash
git-auto-rebase amend
# or
git-auto-rebase amend-push
```

### Commit and Auto Rebase
```bash
git-commit-auto-rebase "your commit message"
```

### Help
```bash
git-auto-rebase --help
# or
git-auto-rebase -h
```

## What it does

### Auto Rebase Command (`rebase`)
1. Checks if you're in a git repository
2. Verifies working directory is clean (no uncommitted changes)
3. Gets current branch name
4. Switches to main branch
5. Pulls latest changes from origin/main
6. Switches back to your original branch
7. Rebases your branch onto main
8. Pushes changes with `--force-with-lease`

### Amend and Push Command (`amend`)
1. Checks if you're in a git repository
2. Gets current branch name
3. Prevents execution on main branch for safety
4. Amends the last commit without editing the message (`git commit --amend --no-edit`)
5. Pushes changes with `--force-with-lease`

### Commit and Auto Rebase Command (`git-commit-auto-rebase`)
1. Checks if you're in a git repository
2. Gets current branch name
3. Prevents execution on main branch for safety
4. Commits changes with provided message (`git commit -m "message"`)
5. Pushes changes to remote (`git push`)
6. Switches to main branch
7. Pulls latest changes from origin/main
8. Switches back to your original branch
9. Rebases your branch onto main
10. Pushes changes with `--force-with-lease`

### Help Command (`--help`)
Displays usage information including:
- Available commands and their descriptions
- Usage examples
- Safety features overview

## Requirements

- Node.js >= 12.0.0
- Git repository
- Clean working directory (no uncommitted changes)

## Safety Features

- Checks for uncommitted changes before proceeding (rebase command)
- Uses `--force-with-lease` for safer force pushes
- Prevents amend-push on main branch for safety
- Error handling with clear messages
- Exits gracefully if not in a git repository

## Example Output

### Auto Rebase
```
Starting git auto rebase...
Current branch: feature-branch
Checking if working directory is clean...
Switching to main branch...
Pulling latest changes from main...
Switching back to feature-branch branch...
Rebasing feature-branch onto main...
Pushing changes with force-with-lease...
Git auto rebase completed successfully!
```

### Amend and Push
```
Starting git amend and push...
Current branch: feature-branch
Amending last commit without editing message...
Pushing changes with force-with-lease...
Git amend and push completed successfully!
```

### Commit and Auto Rebase
```
Starting git commit auto rebase...
Current branch: feature-branch
Committing changes with message: "feat: add new feature"
Pushing changes...
Starting git auto rebase...
Current branch: feature-branch
Switching to main branch...
Pulling latest changes from main...
Switching back to feature-branch branch...
Rebasing feature-branch onto main...
Pushing changes with force-with-lease...
Git auto rebase completed successfully!
```

### Help Output
```
git-auto-rebase-cli v1.2.0

Usage:
  git-auto-rebase [command]

Commands:
  rebase        Automatically rebase current branch onto main (default)
  amend         Amend last commit and force push with --force-with-lease
  amend-push    Same as amend
  --help, -h    Show this help message

Examples:
  git-auto-rebase                          # Run auto rebase (default)
  git-auto-rebase rebase                   # Run auto rebase explicitly
  git-auto-rebase amend                    # Amend last commit and push
  git-commit-auto-rebase "commit message"  # Commit, push and auto rebase
  git-auto-rebase --help                   # Show this help
```

## License

MIT