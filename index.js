#!/usr/bin/env node

const { execSync } = require('child_process')
const process = require('process')

function executeCommand(command) {
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe'],
    })
    return output.trim()
  } catch (error) {
    console.error(`Error executing command: ${command}`)
    console.error(error.message)
    process.exit(1)
  }
}

function getCurrentBranch() {
  return executeCommand('git branch --show-current')
}

function checkGitRepo() {
  try {
    executeCommand('git rev-parse --git-dir')
  } catch (error) {
    console.error('Error: Not in a git repository')
    process.exit(1)
  }
}

function gitAmendPush() {
  console.log('Starting git amend and push...')

  checkGitRepo()

  const currentBranch = getCurrentBranch()
  console.log(`Current branch: ${currentBranch}`)

  if (currentBranch === 'main') {
    console.error('Error: Cannot amend and force push on main branch for safety reasons.')
    process.exit(1)
  }

  console.log('Amending last commit without editing message...')
  executeCommand('git commit --amend --no-edit')

  console.log('Pushing changes with force-with-lease...')
  executeCommand('git push --force-with-lease')

  console.log('Git amend and push completed successfully!')
}

function gitAutoRebase() {
  console.log('Starting git auto rebase...')

  checkGitRepo()

  const currentBranch = getCurrentBranch()
  console.log(`Current branch: ${currentBranch}`)

  if (currentBranch === 'main') {
    console.log('Already on main branch, just pulling latest changes...')
    executeCommand('git pull origin main')
    console.log('Done!')
    return
  }

  console.log('Checking if working directory is clean...')
  const status = executeCommand('git status --porcelain')
  if (status) {
    console.error(
      'Error: Working directory is not clean. Please commit or stash your changes first.'
    )
    process.exit(1)
  }

  console.log('Switching to main branch...')
  executeCommand('git checkout main')

  console.log('Pulling latest changes from main...')
  executeCommand('git pull origin main')

  console.log(`Switching back to ${currentBranch} branch...`)
  executeCommand(`git checkout ${currentBranch}`)

  console.log(`Rebasing ${currentBranch} onto main...`)
  executeCommand('git rebase main')

  console.log('Pushing changes with force-with-lease...')
  executeCommand('git push --force-with-lease')

  console.log('Git auto rebase completed successfully!')
}

function showHelp() {
  console.log(`
git-auto-rebase-cli v1.1.1

Usage:
  git-auto-rebase [command]

Commands:
  rebase        Automatically rebase current branch onto main (default)
  amend         Amend last commit and force push with --force-with-lease
  amend-push    Same as amend
  --help, -h    Show this help message

Examples:
  git-auto-rebase           # Run auto rebase (default)
  git-auto-rebase rebase    # Run auto rebase explicitly
  git-auto-rebase amend     # Amend last commit and push
  git-auto-rebase --help    # Show this help

Safety Features:
  - Prevents amend/push operations on main branch
  - Uses --force-with-lease for safer force pushes
  - Checks for clean working directory before rebase
  - Comprehensive error handling
`)
}

if (require.main === module) {
  const command = process.argv[2]

  switch (command) {
    case '--help':
    case '-h':
    case 'help':
      showHelp()
      break
    case 'amend':
    case 'amend-push':
      gitAmendPush()
      break
    case 'rebase':
    default:
      gitAutoRebase()
      break
  }
}

module.exports = { gitAutoRebase, gitAmendPush }
