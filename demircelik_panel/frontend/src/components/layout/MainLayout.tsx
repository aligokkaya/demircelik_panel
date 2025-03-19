import React, { useState, useMemo, createContext } from 'react';
import { 
    Box, 
    Drawer, 
    List, 
    ListItemIcon, 
    ListItemText, 
    ListItemButton,
    Collapse,
    Typography,
    IconButton,
    Avatar,
    Divider,
    InputBase,
    Badge,
    Menu,
    MenuItem,
    AppBar,
    Toolbar,
    styled,
    createTheme,
    ThemeProvider,
    PaletteMode,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Person,
    School,
    Assignment,
    AccountBalance,
    Notifications,
    Assessment,
    Settings,
    ExpandLess,
    ExpandMore,
    LibraryBooks,
    AttachMoney,
    Event,
    MenuOpen,
    People,
    Description,
    EventNote,
    LocalShipping,
    Business,
    CalendarMonth,
    Report,
    Security,
    Search as SearchIcon,
    Brightness4,
    Brightness7,
    Mail as MailIcon,
    KeyboardArrowDown,
    ExitToApp,
    AccountCircle,
    Build,
    Apps,
    Chat,
    CheckCircle,
    Email,
    Folder,
    Note,
    ListAlt,
    Person as PersonOutline,
    Factory,
    Storage,
    Inventory2,
    BarChart,
    SwapHoriz,
    Warning,
    History,
    HealthAndSafety,
    Timeline,
    PieChart,
    DonutLarge,
    MonetizationOn,
    Storefront,
    Tune,
    VpnKey,
    Today,
    ViewWeek,
    Science,
    Rule,
    Inventory,
    Error as ErrorIcon,
    CardMembership,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 280;

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 20,
    backgroundColor: '#f5f6fa',
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    alignItems: 'center',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#5A729A',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: '#435785',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1.5, 1.5, 1.5, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%',
        '&::placeholder': {
            color: '#5A729A',
            opacity: 0.7,
        },
    },
}));

interface NavMenuItem {
    title: string;
    icon: React.ReactNode;
    children?: NavMenuItem[];
    path?: string;
}

const menuItems: NavMenuItem[] = [
    {
        title: 'Ana Panel',
        icon: <DashboardIcon />,
        children: [
            { title: 'Yönetici Paneli', icon: <DashboardIcon />, path: '/admin-dashboard' },
            { title: 'Üretim Paneli', icon: <Business />, path: '/production-dashboard' },
            { title: 'Personel Paneli', icon: <People />, path: '/staff-dashboard' },
            { title: 'Kalite Paneli', icon: <Assignment />, path: '/quality-dashboard' }
        ]
    },
    {
        title: 'Uygulama',
        icon: <Apps />,
        children: [
            { title: 'Sohbet', icon: <Chat />, path: '/chat' },
            { title: 'Takvim', icon: <Event />, path: '/calendar' },
            { title: 'E-posta', icon: <Email />, path: '/email' },
            { title: 'Yapılacaklar', icon: <CheckCircle />, path: '/todo' },
            { title: 'Notlar', icon: <Note />, path: '/notes' },
            { title: 'Dosya Yöneticisi', icon: <Folder />, path: '/files' }
        ]
    },
    {
        title: 'Personel',
        icon: <People />,
        children: [
            {
                title: 'Çalışanlar',
                icon: <Person />,
                children: [
                    { title: 'Tüm Çalışanlar', icon: <People />, path: '/staff/all' },
                    { title: 'Çalışan Listesi', icon: <ListAlt />, path: '/staff/list' },
                    { title: 'Çalışan Detayları', icon: <PersonOutline />, path: '/staff/details' }
                ]
            },
            {
                title: 'Departmanlar',
                icon: <Business />,
                children: [
                    { title: 'Departman Listesi', icon: <ListAlt />, path: '/departments/list' },
                    { title: 'Departman Detayları', icon: <Description />, path: '/departments/details' }
                ]
            }
        ]
    },
    {
        title: 'Üretim',
        icon: <Factory />,
        children: [
            {
                title: 'Üretim Planı',
                icon: <EventNote />,
                children: [
                    { title: 'Günlük Plan', icon: <Today />, path: '/production/daily' },
                    { title: 'Haftalık Plan', icon: <ViewWeek />, path: '/production/weekly' },
                    { title: 'Aylık Plan', icon: <CalendarMonth />, path: '/production/monthly' }
                ]
            },
            {
                title: 'Kalite Kontrol',
                icon: <Assignment />,
                children: [
                    { title: 'Kalite Testleri', icon: <Science />, path: '/quality/tests' },
                    { title: 'Kalite Raporları', icon: <Assessment />, path: '/quality/reports' },
                    { title: 'Standartlar', icon: <Rule />, path: '/quality/standards' }
                ]
            }
        ]
    },
    {
        title: 'Stok Yönetimi',
        icon: <Inventory />,
        children: [
            {
                title: 'Hammadde',
                icon: <Storage />,
                children: [
                    { title: 'Stok Durumu', icon: <BarChart />, path: '/inventory/raw/status' },
                    { title: 'Giriş/Çıkış', icon: <SwapHoriz />, path: '/inventory/raw/movements' },
                    { title: 'Tedarikçiler', icon: <Business />, path: '/inventory/raw/suppliers' }
                ]
            },
            {
                title: 'Ürünler',
                icon: <Inventory2 />,
                children: [
                    { title: 'Ürün Stoku', icon: <BarChart />, path: '/inventory/products/status' },
                    { title: 'Sevkiyat', icon: <LocalShipping />, path: '/inventory/products/shipping' },
                    { title: 'Müşteriler', icon: <People />, path: '/inventory/products/customers' }
                ]
            }
        ]
    },
    {
        title: 'Bakım',
        icon: <Build />,
        children: [
            {
                title: 'Planlı Bakım',
                icon: <EventNote />,
                children: [
                    {
                        title: 'Bakım Planlaması',
                        icon: <CalendarMonth />,
                        children: [
                            { title: 'Günlük Bakımlar', icon: <Today />, path: '/maintenance/daily' },
                            { title: 'Haftalık Bakımlar', icon: <ViewWeek />, path: '/maintenance/weekly' },
                            { title: 'Aylık Bakımlar', icon: <CalendarMonth />, path: '/maintenance/monthly' },
                            { title: 'Yıllık Bakımlar', icon: <Event />, path: '/maintenance/yearly' }
                        ]
                    },
                    {
                        title: 'Bakım Dokümanları',
                        icon: <Description />,
                        children: [
                            { title: 'Bakım Talimatları', icon: <ListAlt />, path: '/maintenance/instructions' },
                            { title: 'Kontrol Listeleri', icon: <Assignment />, path: '/maintenance/checklists' },
                            { title: 'Teknik Çizimler', icon: <Description />, path: '/maintenance/drawings' },
                            { title: 'El Kitapları', icon: <LibraryBooks />, path: '/maintenance/manuals' }
                        ]
                    },
                    {
                        title: 'Bakım Takibi',
                        icon: <Timeline />,
                        children: [
                            { title: 'Bakım Geçmişi', icon: <History />, path: '/maintenance/history' },
                            { title: 'Performans Analizi', icon: <Assessment />, path: '/maintenance/performance' },
                            { title: 'Maliyet Takibi', icon: <MonetizationOn />, path: '/maintenance/costs' },
                            { title: 'Raporlar', icon: <Assessment />, path: '/maintenance/reports' }
                        ]
                    },
                    {
                        title: 'Ekipman Yönetimi',
                        icon: <Build />,
                        children: [
                            { title: 'Ekipman Listesi', icon: <ListAlt />, path: '/maintenance/equipment-list' },
                            { title: 'Yedek Parçalar', icon: <Build />, path: '/maintenance/spare-parts' },
                            { title: 'Kalibrasyon', icon: <Science />, path: '/maintenance/calibration' },
                            { title: 'Ömür Takibi', icon: <Timeline />, path: '/maintenance/lifecycle' }
                        ]
                    }
                ]
            },
            {
                title: 'Arıza Yönetimi',
                icon: <Warning />,
                children: [
                    { title: 'Aktif Arızalar', icon: <ErrorIcon />, path: '/maintenance/active-issues' },
                    { title: 'Arıza Kayıtları', icon: <Assignment />, path: '/maintenance/issue-records' },
                    { title: 'Parça Talepleri', icon: <Build />, path: '/maintenance/part-requests' }
                ]
            }
        ]
    },
    {
        title: 'İSG',
        icon: <HealthAndSafety />,
        children: [
            {
                title: 'Risk Yönetimi',
                icon: <Warning />,
                children: [
                    { title: 'Risk Değerlendirme', icon: <Assessment />, path: '/safety/risk-assessment' },
                    { title: 'Önleyici Faaliyetler', icon: <Security />, path: '/safety/preventive-actions' },
                    { title: 'Kaza Raporları', icon: <Report />, path: '/safety/accident-reports' }
                ]
            },
            {
                title: 'Eğitimler',
                icon: <School />,
                children: [
                    { title: 'Eğitim Planı', icon: <EventNote />, path: '/safety/training-schedule' },
                    { title: 'Eğitim Kayıtları', icon: <Assignment />, path: '/safety/training-records' },
                    { title: 'Sertifikalar', icon: <CardMembership />, path: '/safety/certificates' }
                ]
            }
        ]
    },
    {
        title: 'Raporlar',
        icon: <Assessment />,
        children: [
            {
                title: 'Üretim Raporları',
                icon: <BarChart />,
                children: [
                    { title: 'Verimlilik Analizi', icon: <Timeline />, path: '/reports/production/efficiency' },
                    { title: 'Kalite Metrikleri', icon: <PieChart />, path: '/reports/production/quality' },
                    { title: 'Kapasite Kullanımı', icon: <DonutLarge />, path: '/reports/production/capacity' }
                ]
            },
            {
                title: 'Finansal Raporlar',
                icon: <AttachMoney />,
                children: [
                    { title: 'Maliyet Analizi', icon: <MonetizationOn />, path: '/reports/financial/costs' },
                    { title: 'Bütçe Takibi', icon: <AccountBalance />, path: '/reports/financial/budget' },
                    { title: 'Satış Raporları', icon: <Storefront />, path: '/reports/financial/sales' }
                ]
            }
        ]
    },
    {
        title: 'Ayarlar',
        icon: <Settings />,
        children: [
            {
                title: 'Genel Ayarlar',
                icon: <Tune />,
                children: [
                    { title: 'Profil Ayarları', icon: <Person />, path: '/settings/profile' },
                    { title: 'Güvenlik Ayarları', icon: <Security />, path: '/settings/security' },
                    { title: 'Bildirim Ayarları', icon: <Notifications />, path: '/settings/notifications' }
                ]
            },
            {
                title: 'Sistem Ayarları',
                icon: <Settings />,
                children: [
                    { title: 'Kullanıcı Yönetimi', icon: <People />, path: '/settings/users' },
                    { title: 'Rol ve İzinler', icon: <VpnKey />, path: '/settings/roles' },
                    { title: 'Sistem Günlüğü', icon: <History />, path: '/settings/logs' }
                ]
            }
        ]
    }
];

interface MainLayoutProps {
    children: React.ReactNode;
}

// Theme context
interface ThemeContextType {
    mode: PaletteMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    toggleTheme: () => {},
});

// Notification Menu
const NotificationMenu = ({ anchorEl, handleClose }: { anchorEl: HTMLElement | null, handleClose: () => void }) => (
    <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
            sx: {
                mt: 1.5,
                width: 320,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }
        }}
    >
        <Box sx={{ p: 2, borderBottom: '1px solid #e5e9f2' }}>
            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                Bildirimler (4)
            </Typography>
        </Box>
        <MenuItem sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}>
                    <Notifications />
                </Avatar>
                <Box>
                    <Typography sx={{ fontSize: '0.9rem', color: 'text.primary', fontWeight: 500 }}>
                        Yeni görev atandı
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                        2 dakika önce
                    </Typography>
                </Box>
            </Box>
        </MenuItem>
        <Box sx={{ p: 1.5, borderTop: '1px solid #e5e9f2', textAlign: 'center' }}>
            <Typography 
                sx={{ 
                    color: 'primary.main', 
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                }}
            >
                Tümünü Gör
            </Typography>
        </Box>
    </Menu>
);

// Profile Menu
const ProfileMenu = ({ 
    anchorEl, 
    handleClose, 
    handleLogout,
    navigate 
}: { 
    anchorEl: HTMLElement | null, 
    handleClose: () => void, 
    handleLogout: () => void,
    navigate: (path: string) => void 
}) => (
    <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
            sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }
        }}
    >
        <MenuItem onClick={() => { handleClose(); navigate('/profile'); }} sx={{ py: 1.5 }}>
            <AccountCircle sx={{ mr: 2, color: 'primary.main' }} />
            <Typography sx={{ color: 'text.primary' }}>Profilim</Typography>
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/settings'); }} sx={{ py: 1.5 }}>
            <Settings sx={{ mr: 2, color: 'primary.main' }} />
            <Typography sx={{ color: 'text.primary' }}>Ayarlar</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
            <ExitToApp sx={{ mr: 2, color: 'primary.main' }} />
            <Typography sx={{ color: 'text.primary' }}>Çıkış Yap</Typography>
        </MenuItem>
    </Menu>
);

const MainLayout: React.FC<MainLayoutProps> = ({ children }): JSX.Element => {
    const [open, setOpen] = useState<{ [key: string]: boolean }>({});
    const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const [mode, setMode] = useState<PaletteMode>('light');

    // Theme configuration
    const themeConfig = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {
                main: '#435785',
                light: '#5A729A',
                dark: '#1a237e',
            },
            background: {
                default: mode === 'light' ? '#f8f9fc' : '#121212',
                paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
            },
            text: {
                primary: mode === 'light' ? '#435785' : '#ffffff',
                secondary: mode === 'light' ? '#5A729A' : '#b0bec5',
            },
        },
        components: {
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                        borderRight: `1px solid ${mode === 'light' ? '#e5e9f2' : '#333333'}`,
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                        boxShadow: mode === 'light' ? '0 2px 6px rgba(0,0,0,0.05)' : '0 2px 6px rgba(0,0,0,0.2)',
                    },
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        '&:hover': {
                            backgroundColor: mode === 'light' ? 'rgba(67, 87, 133, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                        },
                    },
                },
            },
        },
    }), [mode]);

    const themeContext = useMemo(() => ({
        mode,
        toggleTheme: () => setMode(prevMode => prevMode === 'light' ? 'dark' : 'light'),
    }), [mode]);

    const handleClick = (title: string) => {
        setOpen(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const handleNavigate = (path?: string) => {
        if (path) {
            navigate(path);
        }
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationMenuClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleLogout = () => {
        handleProfileMenuClose();
        localStorage.removeItem('isLoggedIn');
        navigate('/');
    };

    const renderMenuItem = (item: NavMenuItem, level = 0) => {
        if (item.children) {
            return (
                <React.Fragment key={item.title}>
                    <ListItemButton 
                        onClick={() => handleClick(item.title)}
                        sx={{
                            pl: isDrawerCollapsed ? 2 : level * 2 + 2,
                            py: 1.75,
                            mb: 0.5,
                            borderRadius: '0 24px 24px 0',
                            position: 'relative',
                            '&:hover': {
                                backgroundColor: 'rgba(67, 87, 133, 0.08)',
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: level > 0 ? `${level * 16}px` : 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: 4,
                                height: '60%',
                                backgroundColor: '#435785',
                                borderRadius: '0 4px 4px 0',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                            },
                            ...(open[item.title] && {
                                backgroundColor: 'rgba(67, 87, 133, 0.08)',
                                '&::before': {
                                    opacity: 1,
                                },
                                '& .MuiListItemIcon-root': {
                                    color: '#435785',
                                },
                                '& .MuiListItemText-primary': {
                                    color: '#435785',
                                    fontWeight: 600,
                                }
                            }),
                            ...(level > 0 && {
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    left: `${(level - 1) * 16 + 20}px`,
                                    top: 0,
                                    bottom: 0,
                                    width: '2px',
                                    backgroundColor: 'rgba(67, 87, 133, 0.1)',
                                    zIndex: 0,
                                }
                            })
                        }}
                    >
                        {level > 0 && !isDrawerCollapsed && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: `${(level - 1) * 16 + 20}px`,
                                    top: '50%',
                                    width: '16px',
                                    height: '2px',
                                    backgroundColor: 'rgba(67, 87, 133, 0.1)',
                                    zIndex: 0,
                                }}
                            />
                        )}
                        <ListItemIcon sx={{ 
                            minWidth: 40,
                            color: '#5A729A',
                            transition: 'color 0.2s',
                            zIndex: 1,
                        }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                            primary={item.title}
                            sx={{ 
                                opacity: isDrawerCollapsed ? 0 : 1,
                                transition: 'opacity 0.2s',
                                zIndex: 1,
                                '& .MuiTypography-root': {
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    color: '#5A729A',
                                    transition: 'color 0.2s, font-weight 0.2s',
                                }
                            }}
                        />
                        {!isDrawerCollapsed && (
                            open[item.title] ? 
                                <ExpandLess sx={{ color: '#435785', transition: 'transform 0.3s', zIndex: 1 }} /> : 
                                <ExpandMore sx={{ color: '#5A729A', transition: 'transform 0.3s', zIndex: 1 }} />
                        )}
                    </ListItemButton>
                    <Collapse in={open[item.title]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children.map((child) => renderMenuItem(child, level + 1))}
                        </List>
                    </Collapse>
                </React.Fragment>
            );
        }

        return (
            <ListItemButton 
                key={item.title}
                onClick={() => handleNavigate(item.path)}
                sx={{
                    pl: isDrawerCollapsed ? 2 : level * 2 + 2,
                    py: 1.75,
                    mb: 0.5,
                    borderRadius: '0 24px 24px 0',
                    position: 'relative',
                    '&:hover': {
                        backgroundColor: 'rgba(67, 87, 133, 0.08)',
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: level > 0 ? `${level * 16}px` : 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 4,
                        height: '60%',
                        backgroundColor: '#435785',
                        borderRadius: '0 4px 4px 0',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                    },
                    ...(window.location.pathname === item.path && {
                        backgroundColor: 'rgba(67, 87, 133, 0.08)',
                        '&::before': {
                            opacity: 1,
                        },
                        '& .MuiListItemIcon-root': {
                            color: '#435785',
                        },
                        '& .MuiListItemText-primary': {
                            color: '#435785',
                            fontWeight: 600,
                        }
                    }),
                    ...(level > 0 && {
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: `${(level - 1) * 16 + 20}px`,
                            top: 0,
                            bottom: 0,
                            width: '2px',
                            backgroundColor: 'rgba(67, 87, 133, 0.1)',
                            zIndex: 0,
                        }
                    })
                }}
            >
                {level > 0 && !isDrawerCollapsed && (
                    <Box
                        sx={{
                            position: 'absolute',
                            left: `${(level - 1) * 16 + 20}px`,
                            top: '50%',
                            width: '16px',
                            height: '2px',
                            backgroundColor: 'rgba(67, 87, 133, 0.1)',
                            zIndex: 0,
                        }}
                    />
                )}
                <ListItemIcon sx={{ 
                    minWidth: 40,
                    color: '#5A729A',
                    transition: 'color 0.2s',
                    zIndex: 1,
                }}>
                    {item.icon}
                </ListItemIcon>
                <ListItemText 
                    primary={item.title}
                    sx={{ 
                        opacity: isDrawerCollapsed ? 0 : 1,
                        transition: 'opacity 0.2s',
                        zIndex: 1,
                        '& .MuiTypography-root': {
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            color: '#5A729A',
                            transition: 'color 0.2s, font-weight 0.2s',
                        }
                    }}
                />
            </ListItemButton>
        );
    };

    return (
        <ThemeContext.Provider value={themeContext}>
            <ThemeProvider theme={themeConfig}>
                <Box sx={{ 
                    display: 'flex',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    minHeight: '100vh',
                }}>
                    <AppBar 
                        position="fixed" 
                        sx={{ 
                            width: `calc(100% - ${isDrawerCollapsed ? 80 : DRAWER_WIDTH}px)`,
                            ml: `${isDrawerCollapsed ? 80 : DRAWER_WIDTH}px`,
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            transition: 'width 0.2s, margin-left 0.2s',
                        }}
                    >
                        <Toolbar sx={{ justifyContent: 'space-between' }}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Ara..."
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <IconButton 
                                    onClick={themeContext.toggleTheme} 
                                    sx={{ color: 'text.primary' }}
                                >
                                    {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                                </IconButton>
                                <IconButton onClick={handleNotificationMenuOpen} sx={{ color: '#435785' }}>
                                    <Badge badgeContent={4} color="error">
                                        <Notifications />
                                    </Badge>
                                </IconButton>
                                <IconButton sx={{ color: '#435785' }}>
                                    <Badge badgeContent={3} color="error">
                                        <MailIcon />
                                    </Badge>
                                </IconButton>
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 1, 
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(67, 87, 133, 0.05)',
                                        }
                                    }}
                                    onClick={handleProfileMenuOpen}
                                >
                                    <Avatar 
                                        sx={{ 
                                            width: 40, 
                                            height: 40,
                                            backgroundColor: '#435785',
                                        }}
                                    >
                                        A
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ 
                                            color: '#435785',
                                            fontWeight: 600,
                                            fontSize: '0.95rem',
                                        }}>
                                            Ali Gökkaya
                                        </Typography>
                                        <Typography sx={{ 
                                            color: '#5A729A',
                                            fontSize: '0.8rem',
                                        }}>
                                            Yönetici
                                        </Typography>
                                    </Box>
                                    <KeyboardArrowDown sx={{ color: '#5A729A' }} />
                                </Box>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    <Drawer
                        variant="permanent"
                        sx={{
                            width: isDrawerCollapsed ? 80 : DRAWER_WIDTH,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: isDrawerCollapsed ? 80 : DRAWER_WIDTH,
                                boxSizing: 'border-box',
                                bgcolor: 'background.paper',
                                borderRight: '1px solid',
                                borderColor: mode === 'light' ? '#e5e9f2' : 'rgba(255, 255, 255, 0.12)',
                                transition: 'width 0.2s',
                                overflowX: 'hidden',
                            },
                        }}
                    >
                        <Box sx={{ 
                            p: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #e5e9f2',
                        }}>
                            {!isDrawerCollapsed && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar 
                                        src="/logo.png" 
                                        variant="rounded"
                                        sx={{ 
                                            width: 40, 
                                            height: 40,
                                            backgroundColor: '#435785',
                                            fontSize: '1.2rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        D
                                    </Avatar>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 600,
                                        color: '#435785',
                                        fontSize: '1.1rem',
                                    }}>
                                        Demirçelik Panel
                                    </Typography>
                                </Box>
                            )}
                            <IconButton 
                                onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
                                sx={{ 
                                    color: '#435785',
                                    backgroundColor: 'rgba(67, 87, 133, 0.05)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(67, 87, 133, 0.1)',
                                    }
                                }}
                            >
                                <MenuOpen />
                            </IconButton>
                        </Box>
                        <List sx={{ pt: 1 }}>
                            {menuItems.map((item) => renderMenuItem(item, 0))}
                        </List>
                    </Drawer>

                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            width: `calc(100% - ${isDrawerCollapsed ? 80 : DRAWER_WIDTH}px)`,
                            transition: 'width 0.2s',
                            bgcolor: 'background.default',
                            minHeight: '100vh',
                            pt: '64px',
                        }}
                    >
                        {children}
                    </Box>

                    {/* Add Notification Menu */}
                    <NotificationMenu 
                        anchorEl={notificationAnchorEl}
                        handleClose={handleNotificationMenuClose}
                    />

                    {/* Add Profile Menu */}
                    <ProfileMenu 
                        anchorEl={anchorEl}
                        handleClose={handleProfileMenuClose}
                        handleLogout={handleLogout}
                        navigate={navigate}
                    />
                </Box>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default MainLayout;