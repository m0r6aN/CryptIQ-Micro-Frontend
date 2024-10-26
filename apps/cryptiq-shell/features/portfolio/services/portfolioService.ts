// File: services/portfolioService.ts

import { supabase } from "../../../lib/supabaseClient";


export const fetchPortfolios = async (userId: string) => {
  try {
    const { data, error } = await supabase.from('portfolios').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    throw error;
  }
};

export const insertPortfolio = async (name: string, userId: string) => {
  try {
    const { data, error } = await supabase.from('portfolios').insert({
      name,
      user_id: userId,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting portfolio:', error);
    throw error;
  }
};

export const deletePortfolio = async (portfolioId: number) => {
  try {
    const { data, error } = await supabase.from('portfolios').delete().eq('id', portfolioId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    throw error;
  }
};

export const updatePortfolio = async (portfolioId: number, name: string) => {
  try {
    const { data, error } = await supabase.from('portfolios').update({ name }).eq('id', portfolioId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating portfolio:', error);
    throw error;
  }
};