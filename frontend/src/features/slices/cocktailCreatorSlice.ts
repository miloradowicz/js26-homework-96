import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cocktail, GenericError, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import { isValidationError } from '../../helpers/error-helpers';
import { create } from '../thunks/cocktailCreatorThunk';

interface State {
  sending: boolean;
  cocktail: Cocktail | null;
  error: ValidationError | GenericError | null;
}

const initialState: State = {
  sending: false,
  cocktail: null,
  error: null,
};

const slice = createSlice({
  name: 'cocktailCreator',
  initialState,
  reducers: {
    clear: (state) => {
      state.sending = false;
      state.error = null;
    },
    clearError: (state, { payload }: PayloadAction<string | undefined>) => {
      if (isValidationError(state.error) && payload) {
        delete state.error.errors[payload];

        if (!Object.keys(state.error.errors).length) {
          state.error = null;
        }
      } else {
        state.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(create.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(create.fulfilled, (state) => {
        state.sending = false;
        state.cocktail = null;
      })
      .addCase(create.rejected, (state, { payload, error }) => {
        state.sending = false;
        state.error = payload ?? {
          type: 'Unknown error',
          error: error.message ?? 'Unknown error',
        };
      });
  },
});

export const cocktailCreator = slice.reducer;
export const { clear, clearError } = slice.actions;

export const selectSending = (state: RootState) =>
  state.cocktailCreator.sending;
export const selectError = (state: RootState) => state.cocktailCreator.error;
