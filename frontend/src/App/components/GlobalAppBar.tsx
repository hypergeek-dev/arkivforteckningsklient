import {
  AccountTree,
  AutoDelete,
  Build,
  EventNoteOutlined,
  FileDownload,
  Home,
  Info,
  Label,
} from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import { actions as userActions } from 'Store/ducks/user/reducer';
import {
  selectAuthUser,
  selectThemeSelected,
} from 'Store/ducks/user/selectors';
import { useAppDispatch, useAppSelector } from 'Store/hooks';
import { UserSelectors } from 'Store/index';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import blackLogo from '../../img/Isolated_IHPv_logo_with_text_black.png';
import whiteLogo from '../../img/Isolated_IHPv_logo_with_text_neg.png';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

type Props = {
  children?: JSX.Element[] | JSX.Element;
};

const GlobalAppBar: React.FC<Props> = ({ children }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const currentKS = useAppSelector(UserSelectors.selectUserSelectedKS);
  const themeSelected = useAppSelector(selectThemeSelected);
  const auth = useAppSelector(selectAuthUser);
  const [menuItems, setMenuItems] = useState([
    { label: 'START', url: '/hem', icon: <Home /> },
    { label: 'GRANSKA', url: `/tree`, icon: <AccountTree /> },
    { label: 'SKAPA', url: '/indexks', icon: <Build /> },
  ]);
  const [isDark, setIsDark] = useState(themeSelected === 'dark');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const items = [];

    items.push({
      label: 'START',
      url: `/tree`,
      icon: <Home />,
    });
    items.push({
      label: 'RAPPORTER',
      url: '/rapport',
      icon: <FileDownload />,
    });
    items.push({
      label: 'EGNA ELEMENT',
      url: '/elements',
      icon: <Label sx={{ transform: 'rotate(45deg)' }} />,
    });

    if (auth) {
      items.push({
        label: 'HÄNDELSELOGG',
        url: '/eventlogg',
        icon: <EventNoteOutlined />,
      });
      items.push({
        label: 'REGELBANKEN',
        url: '/indexregulation',
        icon: <AutoDelete />,
      });
    }
    items.push({ label: 'OM', url: '/about', icon: <Info /> });
    if (items.length !== 0) {
      setMenuItems(items);
    }
  }, [auth, currentKS]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onChangeTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDark(event.target.checked);
    if (event.target.checked) {
      dispatch(userActions.setTheme('dark'));
    }

    if (!event.target.checked) {
      dispatch(userActions.setTheme('light'));
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            aria-controls="Drawer"
            aria-label="Expandera menyn"
            id="expand"
            title="Expandera menyn"
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          {isDark ? (
            <img src={whiteLogo} height={48} alt="Migrationsverkets logotyp" />
          ) : (
            <img src={blackLogo} height={48} alt="Migrationsverkets logotyp" />
          )}
          <small></small>
        </Toolbar>
      </AppBar>

      <Drawer id="Drawer" variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton aria-label="expand menu" onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={isDark} onChange={onChangeTheme} />}
                label={open && 'Mörkt tema'}
                title="Byt mellan mörkt och ljust tema"
                aria-label="Byt mellan mörkt och ljust tema"
              />
            </FormGroup>
          </ListItem>
          {menuItems.map((obj) => (
            <ListItem key={obj.label} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                aria-label={obj.label}
                title={obj.label}
                selected={location.pathname.includes(obj.url)}
                key={obj.label}
                component={Link}
                to={obj.url}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {obj.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={obj.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        width={1}
        height={1}
        sx={{ backgroundColor: 'background.paper', minHeight: '100vh' }}
      >
        {children}
      </Box>
    </Box>
  );
};
export default GlobalAppBar;
