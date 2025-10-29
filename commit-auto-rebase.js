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

function gitAutoRebase() {
  console.log('Starting git auto rebase...')

  const currentBranch = getCurrentBranch()
  console.log(`Current branch: ${currentBranch}`)

  if (currentBranch === 'main') {
    console.log('Already on main branch, just pulling latest changes...')
    executeCommand('git pull origin main')
    console.log('Done!')
    return
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

function gitCommitAutoRebase() {
  console.log('Starting git commit auto rebase...')

  checkGitRepo()

  const currentBranch = getCurrentBranch()
  console.log(`Current branch: ${currentBranch}`)

  if (currentBranch === 'main') {
    console.error('Error: Cannot run commit-auto-rebase on main branch for safety reasons.')
    process.exit(1)
  }

  // Get commit message from command line arguments
  const commitMessage = process.argv.slice(2).join(' ')
  if (!commitMessage) {
    console.error('Error: Commit message is required.')
    console.error('Usage: git-commit-auto-rebase <commit message>')
    process.exit(1)
  }

  console.log(`Committing changes with message: "${commitMessage}"`)
  executeCommand(`git commit -m "${commitMessage}"`)

  console.log('Pushing changes...')
  executeCommand('git push')

  // Run git auto rebase workflow
  gitAutoRebase()
}

if (require.main === module) {
  gitCommitAutoRebase()
}

module.exports = { gitCommitAutoRebase }
