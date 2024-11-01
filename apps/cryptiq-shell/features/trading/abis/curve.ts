// File: features/trading/abis/curve.ts

export const CURVE_REGISTRY_ADDRESS = '0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5'

export const CURVE_REGISTRY_ABI = [
  'function get_pool_from_lp_token(address) view returns (address)',
  'function get_n_coins(address) view returns (uint256)',
  'function get_coins(address) view returns (address[8])',
  'function get_underlying_coins(address) view returns (address[8])',
  'function get_rates(address) view returns (uint256[8])',
  'function get_balances(address) view returns (uint256[8])',
  'function get_underlying_balances(address) view returns (uint256[8])',
  'function get_virtual_price_from_lp_token(address) view returns (uint256)',
  'function get_pool_name(address) view returns (string)',
  'function get_parameters(address) view returns (uint256[8])',
  'function get_fees(address) view returns (uint256[2])',
  'event TokenExchange(address indexed buyer, int128 sold_id, uint256 tokens_sold, int128 bought_id, uint256 tokens_bought)'
] as const

export const CURVE_POOL_ABI = [
  'function get_dy(int128 i, int128 j, uint256 dx) view returns (uint256)',
  'function exchange(int128 i, int128 j, uint256 dx, uint256 min_dy) payable returns (uint256)',
  'function get_virtual_price() view returns (uint256)',
  'function coins(uint256) view returns (address)',
  'function balances(uint256) view returns (uint256)'
] as const