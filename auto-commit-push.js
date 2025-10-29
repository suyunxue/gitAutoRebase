#!/usr/bin/env node

const { execSync } = require('child_process')
const process = require('process')

function executeCommand(command, options = {}) {
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? ['pipe', 'pipe', 'pipe'] : ['inherit', 'pipe', 'pipe'],
    })
    return output.trim()
  } catch (error) {
    console.error(`Error executing command: ${command}`)
    console.error(error.message)
    process.exit(1)
  }
}

function getCurrentBranch() {
  return executeCommand('git branch --show-current', { silent: true })
}

function checkGitRepo() {
  try {
    executeCommand('git rev-parse --git-dir', { silent: true })
  } catch (error) {
    console.error('Error: Not in a git repository')
    process.exit(1)
  }
}

function hasStagedChanges() {
  const status = executeCommand('git diff --cached --name-only', { silent: true })
  return status.length > 0
}

function generateCommitMessage() {
  try {
    // Get staged changes only
    const diff = executeCommand('git diff --cached', { silent: true })

    if (!diff) {
      return null
    }

    // Parse diff to extract meaningful information
    const lines = diff.split('\n')
    const changedFiles = new Set()

    for (const line of lines) {
      if (line.startsWith('+++') || line.startsWith('---')) {
        const match = line.match(/[+-]{3} [ab]\/(.+)/)
        if (match && match[1] !== '/dev/null') {
          changedFiles.add(match[1])
        }
      }
    }

    // Generate commit message based on changes
    const fileList = Array.from(changedFiles)
    let message = ''

    if (fileList.length === 1) {
      message = `update ${fileList[0]}`
    } else if (fileList.length <= 3) {
      message = `update ${fileList.join(', ')}`
    } else {
      message = `update ${fileList.length} files`
    }

    return message
  } catch (error) {
    console.error('Error generating commit message')
    return 'update code'
  }
}

function autoCommitPush() {
  console.log('Starting auto commit and push...')

  checkGitRepo()

  const currentBranch = getCurrentBranch()
  console.log(`Current branch: ${currentBranch}`)

  // Check if there are staged changes
  if (!hasStagedChanges()) {
    console.log('No staged changes to commit. Please run "git add" first.')
    process.exit(0)
  }

  // Get custom commit message from command line or generate one
  let commitMessage = process.argv.slice(2).join(' ')

  if (!commitMessage) {
    console.log('Generating commit message...')
    commitMessage = generateCommitMessage()
    console.log(`Generated message: "${commitMessage}"`)
  }

  // Commit
  console.log('Committing changes...')
  executeCommand(`git commit -m "${commitMessage}"`)

  // Push
  console.log('Pushing to remote...')
  executeCommand(`git push`)

  console.log('Auto commit and push completed successfully!')
}

if (require.main === module) {
  autoCommitPush()
}

module.exports = { autoCommitPush }
