import { useContractRead, useContractWrite } from 'wagmi'
import { ArbitrageContract } from '../types'

export function useArbitrageContract(contractConfig: ArbitrageContract) {
  return {
    read: useContractRead({
      address: contractConfig.address,
      abi: contractConfig.abi
    }),
    write: useContractWrite({
      address: contractConfig.address,
      abi: contractConfig.abi
    })
  }
}