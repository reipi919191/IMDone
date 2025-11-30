import { Memo } from '../types';

const STORAGE_KEY = 'imdone_memos';

export const saveMemos = (memos: Memo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
  } catch (error) {
    console.error('Failed to save memos to localStorage', error);
  }
};

export const loadMemos = (): Memo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load memos from localStorage', error);
    return [];
  }
};