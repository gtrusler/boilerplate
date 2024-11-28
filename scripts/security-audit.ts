import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function runSecurityAudit() {
  try {
    // Check npm dependencies
    await execAsync('npm audit')
    
    // Check environment variables
    const envCheck = require('./check-env')
    await envCheck()
    
    // Check API endpoints
    const apiCheck = require('./check-api-security')
    await apiCheck()
    
    // Check file permissions
    const permCheck = require('./check-permissions')
    await permCheck()
    
    console.log('Security audit completed successfully')
  } catch (error) {
    console.error('Security audit failed:', error)
    process.exit(1)
  }
}

runSecurityAudit() 