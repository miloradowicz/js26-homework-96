import { createAsyncThunk } from '@reduxjs/toolkit';
import { CocktailBrief } from '../../types';
import { api } from '../../api';
import { RootState } from '../../app/store';

export const load = createAsyncThunk<CocktailBrief[], void>(
  'cocktailsViewer/load',
  async () => {
    const { data } = await api.get<CocktailBrief[]>(`cocktails`);
    return data;
  },
);

export const loadMine = createAsyncThunk<
  CocktailBrief[],
  void,
  { state: RootState }
>('cocktailsViewer/load', async (_, { getState }) => {
  const user = getState().users.user;
  if (user) {
    const { data } = await api.get<CocktailBrief[]>(
      `cocktails?user=${user._id}`,
    );
    return data;
  } else throw new Error('Unauthenticated');
});

export const publish = createAsyncThunk<void, string, { state: RootState }>(
  'cocktailsViewer/publish',
  async (id: string, { dispatch }) => {
    await api.patch<void>(`cocktails/publish/${id}`);
    dispatch(load());
  },
);

export const rate = createAsyncThunk<
  void,
  { id: string; rating: number },
  { state: RootState }
>('cocktailsViewer/rate', async ({ id, rating }, { dispatch }) => {
  await api.patch<void>(`cocktails/rate/${id}`, { rating });
  dispatch(load());
});

export const destroy = createAsyncThunk<void, string, { state: RootState }>(
  'cocktailsViewer/destroy',
  async (id: string, { dispatch }) => {
    await api.delete<void>(`cocktails/${id}`);
    dispatch(load());
  },
);
