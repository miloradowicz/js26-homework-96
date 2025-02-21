import { FC, MouseEventHandler, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Menu, MenuItem } from '@mui/material';

import { User } from '../../../types';
import { useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../features/users/usersThunk';
import { baseURL } from '../../../constants';

interface Props {
  user: User;
}

const UserMenu: FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  const isUrlRelative = (url: string) =>
    new URL(document.baseURI).origin === new URL(url, document.baseURI).origin;

  const stringToColor = (str: string) =>
    '#' +
    (
      Array.from({ length: str.length }, (_, i) => str.charCodeAt(i)).reduce(
        (p, n) => (n + p) << (5 - p),
        0,
      ) & 0xffffff
    )
      .toString(16)
      .slice(-6);

  const closeAndNavigate = (url: string) => {
    setOpen(false);
    navigate(url);
  };

  const handleClick: MouseEventHandler = async () => {
    setOpen(false);
    await dispatch(logout());
  };

  return (
    <>
      <Button
        color="inherit"
        ref={ref}
        endIcon={
          <Avatar
            alt={user.displayName}
            sx={{
              bgcolor: stringToColor(user.displayName),
              width: 48,
              height: 48,
            }}
            {...(user.avatarUrl
              ? {
                  src: isUrlRelative(user.avatarUrl)
                    ? new URL(
                        user.avatarUrl as string,
                        new URL('images/', baseURL),
                      ).href
                    : user.avatarUrl,
                }
              : {
                  children: user.displayName
                    .split(' ')
                    .map((x) => x.charAt(0))
                    .join(''),
                })}
          />
        }
        onClick={() => setOpen(true)}
      >
        {user.displayName}
      </Button>
      <Menu anchorEl={ref.current} open={open} onClose={() => setOpen(false)}>
        <MenuItem onClick={() => closeAndNavigate('/cocktails/mine')}>
          My cocktails
        </MenuItem>
        <MenuItem onClick={() => closeAndNavigate('/cocktails/new')}>
          Add new cocktail
        </MenuItem>
        <MenuItem onClick={handleClick}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
