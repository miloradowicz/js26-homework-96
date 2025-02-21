import { createSlice } from '@reduxjs/toolkit';
import { CocktailBrief, GenericError } from '../../types';
import { RootState } from '../../app/store';
import { destroy, load, publish, rate } from '../thunks/cocktailsViewerThunk';

interface State {
  loading: boolean;
  cocktails: CocktailBrief[];
  error: GenericError | null;
}

const initialState: State = {
  loading: false,
  cocktails: [],
  error: null,
};

const slice = createSlice({
  name: 'cocktailsViewer',
  initialState,
  reducers: {
    clear: (state) => {
      state.loading = false;
      state.cocktails = [];
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
        state.cocktails = payload;
      })
      .addCase(load.rejected, (state, { error }) => {
        state.loading = false;
        state.error = {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      })
      .addCase(publish.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publish.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(publish.rejected, (state, { error }) => {
        state.loading = false;
        state.error = {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      })
      .addCase(rate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(rate.rejected, (state, { error }) => {
        state.loading = false;
        state.error = {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      })
      .addCase(destroy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(destroy.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(destroy.rejected, (state, { error }) => {
        state.loading = false;
        state.error = {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      });
  },
});

export const cocktailsViewer = slice.reducer;
export const { clear, clearError } = slice.actions;

export const selectLoading = (state: RootState) =>
  state.cocktailsViewer.loading;
export const selectCocktails = (state: RootState) =>
  state.cocktailsViewer.cocktails;
export const selectError = (state: RootState) => state.cocktailsViewer.error;
