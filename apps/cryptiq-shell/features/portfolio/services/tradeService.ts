// File: services/tradeService.ts

import { supabase } from "../../../lib/supabaseClient";

export const fetchTrades = async (walletId: number = 0, exchangeId: number = 0) => {
  try {
    let query = supabase.from('trades').select('*');
    if (walletId) {
      query = query.eq('wallet_id', walletId);
    }
    if (exchangeId) {
      query = query.eq('exchange_id', exchangeId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};

export const insertTrade = async (walletId: number, exchangeId: number, tradeType: string, amount: number, price: number) => {
  try {
    const { data, error } = await supabase.from('trades').insert({
      wallet_id: walletId,
      exchange_id: exchangeId,
      trade_type: tradeType,
      amount,
      price,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting trade:', error);
    throw error;
  }
};

export const deleteTrade = async (tradeId: number) => {
  try {
    const { data, error } = await supabase.from('trades').delete().eq('id', tradeId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting trade:', error);
    throw error;
  }
};