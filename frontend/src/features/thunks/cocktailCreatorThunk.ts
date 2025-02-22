import { isAxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ValidationError, Cocktail, CocktailMutation } from '../../types';
import { api } from '../../api';
import { isValidationError } from '../../helpers/error-helpers';

export const create = createAsyncThunk<
  Cocktail,
  CocktailMutation,
  { rejectValue: ValidationError }
>('cocktailCreator/create', async (mutation, { rejectWithValue }) => {
  try {
    const body = new FormData();
    body.append('name', mutation.name);
    body.append('recipe', mutation.recipe);
    if (mutation.image) {
      body.append('image', mutation.image);
    }
    for (const { x, i } of mutation.ingredients.map((x, i) => ({ x, i }))) {
      body.append(`ingredients[${i}][name]`, x.name);
      if (x.qty) {
        body.append(`ingredients[${i}][qty]`, x.qty);
      }
    }

    const { data } = await api.post<Cocktail>('cocktails', body);

    return data;
  } catch (e) {
    if (
      isAxiosError(e) &&
      e.response?.status === 400 &&
      isValidationError(e.response.data)
    ) {
      return rejectWithValue(e.response.data);
    }

    throw e;
  }
});
