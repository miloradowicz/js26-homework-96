import { Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';

import { useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import Header from './components/UI/Header/Header';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import SignIn from './features/users/containers/SignIn';
import SignUp from './features/users/containers/SignUp';
import Page404 from './components/Page404/Page404';
import CocktailsViewer from './features/cocktails/containers/CocktailsViewer';
import CocktailCreator from './features/cocktails/containers/CocktailCreator';
import CocktailDetailedViewer from './features/cocktails/containers/CocktailDetailedViewer';
import { selectError as selectCreatorError } from './features/slices/cocktailCreatorSlice';
import { selectError as selectDetailedViewerError } from './features/slices/cocktailDetailedViewerSlice';
import { selectError as selectViewerError } from './features/slices/cocktailsViewerSlice';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { isGenericError } from './helpers/error-helpers';

const App = () => {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const user = useAppSelector(selectUser);
  const creatorError = useAppSelector(selectCreatorError);
  const detailedViewerError = useAppSelector(selectDetailedViewerError);
  const viewerError = useAppSelector(selectViewerError);

  useEffect(() => {
    if (creatorError) {
      closeSnackbar();
    }

    if (isGenericError(creatorError)) {
      enqueueSnackbar(creatorError.error, { variant: 'error' });
    }
  }, [closeSnackbar, enqueueSnackbar, creatorError]);

  useEffect(() => {
    if (detailedViewerError) {
      closeSnackbar();
    }

    if (isGenericError(detailedViewerError)) {
      enqueueSnackbar(detailedViewerError.error, { variant: 'error' });
    }
  }, [closeSnackbar, enqueueSnackbar, detailedViewerError]);

  useEffect(() => {
    if (viewerError) {
      closeSnackbar();
    }

    if (isGenericError(viewerError)) {
      enqueueSnackbar(viewerError.error, { variant: 'error' });
    }
  }, [closeSnackbar, enqueueSnackbar, viewerError]);

  return (
    <>
      <Header />
      <Container sx={{ py: 8, px: 2, minWidth: 360 }}>
        <Routes>
          <Route path="/" element={<CocktailsViewer />} />
          <Route path="/cocktails" element={<CocktailsViewer />} />
          <Route
            path="/cocktails/mine"
            element={
              <ProtectedRoute
                isAllowed={user?.role === 'user' || user?.role === 'admin'}
              >
                <CocktailsViewer showMine />
              </ProtectedRoute>
            }
          />
          <Route path="/cocktails/:id" element={<CocktailDetailedViewer />} />
          <Route path="/cocktails/not-found" element={<Page404 />} />
          <Route
            path="/cocktails/new"
            element={
              <ProtectedRoute
                isAllowed={user?.role === 'user' || user?.role === 'admin'}
              >
                <CocktailCreator />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
