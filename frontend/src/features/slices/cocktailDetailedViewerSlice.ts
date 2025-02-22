import { createSlice } from '@reduxjs/toolkit';
import { Cocktail, GenericError } from '../../types';
import { RootState } from '../../app/store';
import { load } from '../thunks/cocktailDetailedViewerThunk';

interface State {
  loading: boolean;
  cocktail: Cocktail | null;
  error: GenericError | null;
}

const initialState: State = {
  loading: false,
  cocktail: null,
  error: null,
};

const slice = createSlice({
  name: 'cocktailDetailedViewer',
  initialState,
  reducers: {
    clear: (state) => {
      state.loading = false;
      state.cocktail = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(load.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(load.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.cocktail = payload;
      })
      .addCase(load.rejected, (state, { error }) => {
        state.loading = false;
        state.error = {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      });
  },
});

export const cocktailDetailedViewer = slice.reducer;
export const { clear, clearError } = slice.actions;

export const selectLoading = (state: RootState) =>
  state.cocktailDetailedViewer.loading;
export const selectCocktail = (state: RootState) =>
  state.cocktailDetailedViewer.cocktail;
export const selectError = (state: RootState) =>
  state.cocktailDetailedViewer.error;
