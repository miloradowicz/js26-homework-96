import { createAsyncThunk } from '@reduxjs/toolkit';
import { Cocktail } from '../../types';
import { api } from '../../api';

export const load = createAsyncThunk<Cocktail, string>(
  'cocktailDetailedViewer/load',
  async (id: string) => {
    const { data } = await api.get<Cocktail>(`cocktails/${id}`);
    return data;
  },
);
