import { FC, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete, Publish } from '@mui/icons-material';

import { baseURL } from '../../../constants';
import noImg from '../../../assets/images/no-img.svg';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { clear, selectUser } from '../../users/usersSlice';
import { destroy, publish } from '../../thunks/cocktailsViewerThunk';
import { isAxiosError } from 'axios';
import { getRatingSummary } from '../../../helpers/utils';

interface Props {
  id: string;
  name: string;
  imageUrl: string;
  isPublished: boolean;
  rating: number;
}

const CocktailListItem: FC<Props> = ({
  id,
  name,
  imageUrl,
  isPublished,
  rating,
}) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePublish = async () => {
    try {
      setPublishing(true);
      await dispatch(publish(id)).unwrap();
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        dispatch(clear());
      }
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await dispatch(destroy(id)).unwrap();
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        dispatch(clear());
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 360, mx: 'auto' }} elevation={5}>
      <CardActionArea component={Link} to={`/cocktails/${id}`}>
        <CardMedia
          component="img"
          height="300"
          width="200"
          image={
            imageUrl
              ? new URL(imageUrl, new URL('uploads/cocktails/', baseURL)).href
              : noImg
          }
          alt={name}
          sx={{
            objectFit: imageUrl ? 'cover' : 'contain',
            objectPosition: 'center',
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Rating:
            <Typography component="span" mx={1}>
              {rating ? rating.toFixed(1) : 'no rating yet'}
            </Typography>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {!isPublished && (
          <Chip
            label="Unpublished"
            variant="outlined"
            deleteIcon={
              user && user.role === 'admin' ? (
                <Tooltip title="Publish" placement="right">
                  {publishing ? <CircularProgress size={18} /> : <Publish />}
                </Tooltip>
              ) : undefined
            }
            onDelete={user && user.role === 'admin' ? handlePublish : undefined}
          />
        )}
        {user && user.role === 'admin' && (
          <Chip
            label="Uploaded"
            variant="outlined"
            deleteIcon={
              <Tooltip title="Delete" placement="right">
                {deleting ? <CircularProgress size={18} /> : <Delete />}
              </Tooltip>
            }
            onDelete={handleDelete}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default memo(
  CocktailListItem,
  (prev, next) => prev.id === next.id && prev.isPublished === next.isPublished,
);
