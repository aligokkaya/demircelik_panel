import React from 'react';
import { 
    Box, 
    Typography, 
    Container, 
    Grid, 
    Avatar, 
    Chip,
    Card,
    IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const EventCard = styled(Card)(({ color = '#1a76d2' }: { color?: string }) => ({
    position: 'relative',
    padding: '24px',
    marginBottom: '16px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        backgroundColor: color,
        borderRadius: '4px 0 0 4px'
    },
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
    }
}));

const AvatarGroup = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    '& .MuiAvatar-root': {
        width: 32,
        height: 32,
        border: '2px solid #fff',
        marginLeft: -8,
        '&:first-of-type': {
            marginLeft: 0
        }
    }
});

const Events: React.FC = () => {
    const navigate = useNavigate();

    // Örnek etkinlik verileri (gerçek uygulamada API'den gelecek)
    const events = [
        {
            id: 1,
            title: "SPOR HABERLERİ",
            description: "Şirket Futbol Turnuvası Başlıyor! Departmanlar Arası Maçlar Bu Hafta Başlıyor",
            date: "15 Mart 2024",
            category: {
                name: "SPOR",
                icon: "⚽",
                color: "#f44336"
            },
            stats: {
                label: "Katılımcı Takım",
                value: "8 Takım"
            },
            participants: [
                "https://i.pravatar.cc/150?img=1",
                "https://i.pravatar.cc/150?img=2",
                "https://i.pravatar.cc/150?img=3"
            ],
            location: "Şirket Spor Sahası",
            time: "14:00"
        },
        {
            id: 2,
            title: "ÜRETİM BAŞARILARI",
            description: "Yeni Üretim Rekoruna İmza Attık! Aylık Üretim Hedefimizi %15 Aştık",
            date: "14 Mart 2024",
            category: {
                name: "ÜRETİM",
                icon: "🏭",
                color: "#2196f3"
            },
            stats: {
                label: "Verimlilik Artışı",
                value: "+15%"
            },
            participants: [
                "https://i.pravatar.cc/150?img=4",
                "https://i.pravatar.cc/150?img=5",
                "https://i.pravatar.cc/150?img=6"
            ],
            location: "Ana Üretim Tesisi",
            time: "10:00"
        },
        {
            id: 3,
            title: "SOSYAL ETKİNLİKLER",
            description: "Geleneksel Bahar Şenliğimiz 20 Mart'ta Başlıyor! Tüm Çalışanlarımız Davetlidir",
            date: "13 Mart 2024",
            category: {
                name: "ETKİNLİK",
                icon: "🎉",
                color: "#4caf50"
            },
            stats: {
                label: "Katılımcı Sayısı",
                value: "250+"
            },
            participants: [
                "https://i.pravatar.cc/150?img=7",
                "https://i.pravatar.cc/150?img=8",
                "https://i.pravatar.cc/150?img=9"
            ],
            location: "Şirket Bahçesi",
            time: "16:00"
        },
        {
            id: 4,
            title: "İSG DUYURULARI",
            description: "Sıfır Kaza Hedefimizde 365 Günü Geride Bıraktık! Güvenlik Önce Gelir",
            date: "12 Mart 2024",
            category: {
                name: "İSG",
                icon: "⚠️",
                color: "#ff9800"
            },
            stats: {
                label: "Güvenli Gün",
                value: "365"
            },
            participants: [
                "https://i.pravatar.cc/150?img=10",
                "https://i.pravatar.cc/150?img=11",
                "https://i.pravatar.cc/150?img=12"
            ],
            location: "Eğitim Salonu",
            time: "09:00"
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                    onClick={() => navigate(-1)}
                    sx={{ 
                        bgcolor: 'rgba(0,0,0,0.04)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' }
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
                    Tüm Etkinlikler
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {events.map((event) => (
                    <Grid item xs={12} key={event.id}>
                        <EventCard color={event.category.color}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
                                                {event.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Typography sx={{ 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    color: '#666',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                                                    {event.date}, {event.time}
                                                </Typography>
                                                <Typography sx={{ 
                                                    color: '#666',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    📍 {event.location}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontSize: '1.25rem' }}>{event.category.icon}</Typography>
                                                    <Typography sx={{ fontWeight: 600 }}>{event.category.name}</Typography>
                                                </Box>
                                            }
                                            sx={{
                                                bgcolor: `${event.category.color}15`,
                                                color: event.category.color,
                                                borderRadius: '8px',
                                                height: '32px',
                                                '& .MuiChip-label': {
                                                    px: 2
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Typography sx={{ color: '#424242', mb: 3 }}>
                                        {event.description}
                                    </Typography>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            color: '#666',
                                            bgcolor: 'rgba(0,0,0,0.04)',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 2
                                        }}>
                                            {event.stats.label}: <strong>{event.stats.value}</strong>
                                        </Box>
                                        <AvatarGroup>
                                            {event.participants.map((avatar, index) => (
                                                <Avatar
                                                    key={index}
                                                    src={avatar}
                                                    sx={{ 
                                                        width: 32, 
                                                        height: 32,
                                                        border: '2px solid #fff'
                                                    }}
                                                />
                                            ))}
                                        </AvatarGroup>
                                    </Box>
                                </Grid>
                            </Grid>
                        </EventCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Events; 