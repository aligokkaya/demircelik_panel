import React from 'react';
import { 
    Box, 
    Grid, 
    Card, 
    CardContent, 
    Typography,
    IconButton,
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import {
    Person as PersonIcon,
    School as SchoolIcon,
    Assessment as AssessmentIcon,
    AccountBalance as AccountBalanceIcon,
    Notifications as NotificationsIcon,
    AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
    <Card sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0 0 0 100%'
        }
    }}>
        <CardContent>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <IconButton sx={{ color: 'white', mb: 2, p: 0 }}>
                    {icon}
                </IconButton>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                    {value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {title}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

const Home = () => {
    const stats = [
        { title: 'Toplam Personel', value: '245', icon: <PersonIcon />, color: '#4CAF50' },
        { title: 'Toplam Öğrenci', value: '1,500', icon: <SchoolIcon />, color: '#2196F3' },
        { title: 'Toplam Gelir', value: '₺2.5M', icon: <AttachMoneyIcon />, color: '#FF9800' },
        { title: 'Aktif Projeler', value: '12', icon: <AssessmentIcon />, color: '#9C27B0' },
        { title: 'Duyurular', value: '8', icon: <NotificationsIcon />, color: '#F44336' },
        { title: 'Departmanlar', value: '6', icon: <AccountBalanceIcon />, color: '#607D8B' },
    ];

    return (
        <MainLayout>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#1a237e' }}>
                    Kontrol Paneli
                </Typography>
                
                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <StatCard {...stat} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </MainLayout>
    );
};

export default Home; 