import { FC, useEffect } from 'react';
import { Box, Grid2 as Grid, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import Loader from '../../../components/UI/Loader/Loader';
import CocktailListItem from '../components/CocktailListItem';
import {
  clear,
  selectCocktails,
  selectLoading,
} from '../../slices/cocktailsViewerSlice';
import { load, loadMine } from '../../thunks/cocktailsViewerThunk';

interface Props {
  showMine?: boolean;
}

const CocktailsViewer: FC<Props> = ({ showMine }) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectLoading);
  const data = useAppSelector(selectCocktails);

  useEffect(() => {
    dispatch(clear());
    dispatch(showMine ? loadMine() : load());
  }, [dispatch, showMine, user]);

  return (
    <>
      <Loader open={loading} />
      <Box maxWidth="md" mx="auto">
        <Typography component="h1" variant="h4" gutterBottom>
          Cocktails
        </Typography>
        <Grid container spacing={1} py={2} justifyContent={{ sx: 'center' }}>
          {data.length ? (
            data.map((x) => (
              <Grid key={x._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <CocktailListItem
                  id={x._id}
                  name={x.name}
                  imageUrl={x.imageUrl}
                  isPublished={x.isPublished}
                  rating={x.rating}
                />
              </Grid>
            ))
          ) : (
            <Typography fontStyle="italic">Nothing here yet.</Typography>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default CocktailsViewer;
