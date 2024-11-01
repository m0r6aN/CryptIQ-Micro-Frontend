import { task } from 'hardhat/config'

task('deploy', 'Deploy all contracts')
  .addParam('network', 'Network to deploy to')
  .setAction(async (taskArgs, hre) => {
    const { network } = taskArgs
    
    console.log(`📦 Starting deployment to ${network}...`)
    
    try {
      await hre.run('compile')
      await hre.run('deploy', { network })
      
      console.log('✅ Deployment complete!')
    } catch (error) {
      console.error('❌ Deployment failed:', error)
      process.exit(1)
    }
  })