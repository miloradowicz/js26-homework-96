import { isAxiosError } from 'axios';
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from 'react';
import { useSnackbar } from 'notistack';
import {
  Typography,
  Box,
  Grid2 as Grid,
  TextField,
  SelectChangeEvent,
  Button,
  List,
  ListItem,
  FormHelperText,
} from '@mui/material';
import { Add, AddAPhoto, Create, Delete } from '@mui/icons-material';

import { Ingredient } from '../../../types';
import FileInput from '../../../components/UI/FileInput/FileInput';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  clear,
  clearError,
  selectError,
  selectSending,
} from '../../slices/cocktailCreatorSlice';
import {
  isAuthenticationError,
  isGenericError,
  isValidationError,
} from '../../../helpers/error-helpers';
import { create } from '../../thunks/cocktailCreatorThunk';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  image: File | '';
  recipe: string;
  ingredients: Ingredient[];
}

const initialData: FormData = {
  name: '',
  image: '',
  recipe: '',
  ingredients: [],
};

const CocktailCreator = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState(initialData);
  const sending = useAppSelector(selectSending);
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(clear());
  }, [dispatch]);

  const getFieldError = (fieldName: string) => {
    if (isValidationError(error) && fieldName in error.errors) {
      return error.errors[fieldName].messages.join('; ');
    }
    return undefined;
  };

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<unknown>,
  ) => {
    dispatch(clearError(e.target.name));

    setData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(clearError(e.target.name + 'Url'));

    if (e.target.files) {
      const file = e.target.files[0];
      setData((data) => ({ ...data, [e.target.name]: file }));
    }
  };

  const handleIngredientChange = (
    index: number,
    name: string,
    value: string,
  ) => {
    dispatch(clearError(`ingredients.${index}.name`));

    setData((data) => {
      const result = { ...data, ingredients: [...data.ingredients] };
      result.ingredients[index] = {
        ...result.ingredients[index],
        [name]: value,
      };
      return result;
    });
  };

  const handleDeleteIngredient = (index: number) => {
    setData((data) => {
      const result = {
        ...data,
        ingredients: data.ingredients.filter((_, i) => i !== index),
      };
      return result;
    });
  };

  const handleAddIngredient = () => {
    dispatch(clearError('ingredients'));
    setData((data) => ({
      ...data,
      ingredients: [...data.ingredients, { name: '' }],
    }));
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        create({ ...data, image: data.image !== '' ? data.image : null }),
      ).unwrap();
      navigate('/cocktails/');
    } catch (e) {
      if (isAuthenticationError(e) || isValidationError(error)) {
        return;
      }

      if (isGenericError(e)) {
        enqueueSnackbar(e.error, { variant: 'error' });
      } else if (isAxiosError(e) && e.response?.data.error) {
        return void enqueueSnackbar(`${e.message}: ${e.response.data.error}`, {
          variant: 'error',
        });
      } else if (e instanceof Error) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      } else if (
        typeof e === 'object' &&
        !!e &&
        'message' in e &&
        typeof e.message === 'string'
      ) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      }

      setData((data) => ({ ...data, password: '' }));
    }
  };

  return (
    <Box maxWidth="sm" mx="auto">
      <Typography component="h1" variant="h4" gutterBottom>
        Add cocktail
      </Typography>
      <Box
        py={2}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            '& .MuiGrid2-root': { minHeight: 80 },
          }}
        >
          <Grid size={12}>
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={data.name}
              onChange={handleChange}
              error={!!getFieldError('name')}
              helperText={getFieldError('name')}
            />
          </Grid>
          <Grid size={12}>
            <FileInput
              fullWidth
              label="Image"
              name="image"
              buttonText="Upload"
              buttonProps={{
                disableElevation: true,
                variant: 'contained',
                startIcon: <AddAPhoto />,
                sx: { px: 5 },
              }}
              value={data.image}
              onChange={handleFileInputChange}
              error={!!getFieldError('imageUrl')}
              helperText={getFieldError('imageUrl')}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Recipe"
              name="recipe"
              value={data.recipe}
              onChange={handleChange}
              error={!!getFieldError('recipe')}
              helperText={getFieldError('recipe')}
            />
          </Grid>
          <Grid size={12}>
            <FormHelperText error={!!getFieldError('ingredients')}>
              {getFieldError('ingredients')}
            </FormHelperText>
            <List>
              {data.ingredients.map((x, i) => (
                <ListItem key={i} disablePadding>
                  <Grid container spacing={1}>
                    <Grid size={7} display="flex" alignItems="stretch">
                      <TextField
                        fullWidth
                        label="Ingredient name"
                        name="name"
                        value={x.name}
                        onChange={(e) =>
                          handleIngredientChange(
                            i,
                            e.target.name,
                            e.target.value,
                          )
                        }
                        error={!!getFieldError(`ingredients.${i}.name`)}
                        helperText={getFieldError(`ingredients.${i}.name`)}
                      />
                    </Grid>
                    <Grid size={4} display="flex" alignItems="stretch">
                      <TextField
                        fullWidth
                        label="Qty"
                        name="qty"
                        value={x.qty}
                        onChange={(e) =>
                          handleIngredientChange(
                            i,
                            e.target.name,
                            e.target.value,
                          )
                        }
                        error={!!getFieldError(`ingredients.${i}.qty`)}
                        helperText={getFieldError(`ingredients.${i}.qty`)}
                      />
                    </Grid>
                    <Grid size={1}>
                      <Button onClick={() => handleDeleteIngredient(i)}>
                        <Delete />
                      </Button>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
              <ListItem>
                <Button fullWidth onClick={handleAddIngredient}>
                  <Add />
                </Button>
              </ListItem>
            </List>
          </Grid>

          <Grid size={12}>
            <Button
              fullWidth
              type="submit"
              loading={sending}
              startIcon={<Create />}
              sx={{ p: 3 }}
              disabled={
                !!(
                  isValidationError(error) &&
                  Object.entries(error.errors).length
                )
              }
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CocktailCreator;
