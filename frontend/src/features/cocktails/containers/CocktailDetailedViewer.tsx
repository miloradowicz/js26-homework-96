import { useCallback, useEffect } from 'react';
import {
  Alert,
  Box,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Typography,
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import {
  clear,
  selectCocktail,
  selectLoading,
} from '../../slices/cocktailDetailedViewerSlice';
import { load } from '../../thunks/cocktailDetailedViewerThunk';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL } from '../../../constants';
import noImg from '../../../assets/images/no-img.svg';
import { ArrowRight } from '@mui/icons-material';
import { getRatingSummary } from '../../../helpers/utils';
import { rate } from '../../thunks/cocktailsViewerThunk';
import { enqueueSnackbar } from 'notistack';

const CocktailDetailedViewer = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectLoading);
  const data = useAppSelector(selectCocktail);

  const init = useCallback(async () => {
    dispatch(clear());
    if (id) {
      try {
        await dispatch(load(id)).unwrap();
      } catch (_) {
        return void navigate('/');
      }
    }
  }, [dispatch, navigate, id]);

  useEffect(() => {
    init();
  }, [init, user]);

  const handleRatingChange = async (value: number | null) => {
    if (id && value) {
      await dispatch(rate({ id, rating: value }));
      enqueueSnackbar('Your vote has been accepted', { variant: 'success' });
      await dispatch(load(id));
    }
  };

  return (
    <>
      <Loader open={loading} />
      <Box maxWidth="md" mx="auto">
        <Typography component="h1" variant="h4" gutterBottom>
          Cocktail
        </Typography>
        {data && (
          <Grid
            container
            direction="column"
            spacing={1}
            py={2}
            justifyContent={{ sx: 'center' }}
          >
            {!data.isPublished && (
              <Alert variant="filled" severity="warning">
                This cocktail has not yet been accepted by the admin.
              </Alert>
            )}
            <Grid>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    component="img"
                    borderRadius={5}
                    sx={{
                      maxWidth: { md: '100%' },
                      aspectRatio: '0.6',
                    }}
                    alt={data.name}
                    src={
                      data.imageUrl
                        ? new URL(
                            data.imageUrl,
                            new URL('uploads/cocktails/', baseURL),
                          ).href
                        : noImg
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography component="h2" variant="h5" gutterBottom>
                    {data.name}
                  </Typography>
                  <Typography component="h5" variant="subtitle1" gutterBottom>
                    Rating:
                    <Typography component="span" mx={1}>
                      {`${
                        !Number.isNaN(getRatingSummary(data.ratings).avg)
                          ? getRatingSummary(data.ratings).avg.toFixed(1)
                          : 'no rating yet'
                      } (
                      ${getRatingSummary(data.ratings).count} votes)`}
                    </Typography>
                  </Typography>
                  <Typography component="h5" variant="subtitle1" gutterBottom>
                    Ingredients:
                  </Typography>
                  <List>
                    {data.ingredients.map((x, i) => (
                      <ListItem key={i} disablePadding>
                        <ListItemIcon sx={{ fontSize: 16 }}>
                          <ArrowRight />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${x.name}${x.qty ? ` - ${x.qty}` : null}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Grid>
            <Grid>
              <Typography component="h5" variant="h6" gutterBottom>
                Recipe:
              </Typography>
              <Typography>{data.recipe}</Typography>
              <Typography component="h5" variant="h6" gutterBottom>
                Rate:
              </Typography>
              <Rating
                name="half-rating"
                max={10}
                value={getRatingSummary(data.ratings).avg}
                precision={1}
                onChange={(_, value) => handleRatingChange(value)}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default CocktailDetailedViewer;
