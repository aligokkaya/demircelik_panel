import React, { useEffect, useState, useMemo } from 'react';
import { 
    Box, 
    Grid,     
    Typography, 
    Card, 
    CardContent, 
    CardMedia,
    Avatar,
    Chip,
    Button,
    TextField,
    Paper,
}
from '@mui/material';
import { styled } from '@mui/material/styles';
import { Post } from '../../types';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloudIcon from '@mui/icons-material/Cloud';
import UmbrellaIcon from '@mui/icons-material/BeachAccess';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';

type WeatherTypes = {
    [key in WeatherType]: {
        icon: JSX.Element;
        gradient: string;
        overlay: string;
        text: string;
    }
}



type DailyWeather = {
    day: string;
    high: number;
    low: number;
    type: WeatherType;
}

const NewsCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    overflow: 'hidden',
    border: '1px solid #e0e0e0',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    marginBottom: theme.spacing(3),
    fontSize: '1.5rem',
    color: '#1a237e',
    position: 'relative',
    paddingBottom: theme.spacing(1),
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '40px',
        height: '4px',
        backgroundColor: '#f50057',
        borderRadius: '2px',
    },
}));

const SliderCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
        zIndex: 1,
    },
}));

const SliderContent = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(4),
    color: '#fff',
    zIndex: 2,
}));

const LoginSection = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

// Yemek kartları için stil tanımlamaları
const MealCard = styled(Card)(({ color }: { color: string }) => ({
    position: 'relative',
    borderRadius: 16,
    backgroundColor: color,
    color: 'white',
    minHeight: 320,
    display: 'flex',
    flexDirection: 'column',
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
}));

const Dashboard: React.FC = () => {
    const [posts, setPosts] = useState<{[key: string]: Post[]}>({
        isg: [],
        environment: [],
        quality: [],
        general: [],
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const navigate = useNavigate();

    // Hava durumu tipleri ve arka plan stilleri
    const weatherTypes: WeatherTypes = {
        sunny: {
            icon: <WbSunnyIcon sx={{ color: '#FFD700' }} />,
            gradient: 'linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)',
            overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.2) 0%, rgba(255, 140, 0, 0.1) 100%)',
            text: 'Güneşli'
        },
        cloudy: {
            icon: <CloudIcon sx={{ color: '#E0E0E0' }} />,
            gradient: 'linear-gradient(135deg, #5C6BC0 0%, #7986CB 100%)',
            overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
            text: 'Parçalı Bulutlu'
        },
        rainy: {
            icon: <UmbrellaIcon sx={{ color: '#90CAF9' }} />,
            gradient: 'linear-gradient(135deg, #42A5F5 0%, #1976D2 100%)',
            overlay: 'linear-gradient(0deg, rgba(144, 202, 249, 0.2) 0%, rgba(25, 118, 210, 0.1) 100%)',
            text: 'Yağmurlu'
        },
        snowy: {
            icon: <AcUnitIcon sx={{ color: '#E3F2FD' }} />,
            gradient: 'linear-gradient(135deg, #90A4AE 0%, #546E7A 100%)',
            overlay: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
            text: 'Karlı'
        },
        stormy: {
            icon: <ThunderstormIcon sx={{ color: '#FFD700' }} />,
            gradient: 'linear-gradient(135deg, #455A64 0%, #263238 100%)',
            overlay: 'linear-gradient(0deg, rgba(255, 215, 0, 0.1) 0%, rgba(38, 50, 56, 0.1) 100%)',
            text: 'Fırtınalı'
        }
    };

    // Örnek hava durumu verileri (gerçek API'den gelecek)
    const weatherData = {
        hourly: [...Array(8)].map((_, index) => ({
            time: `${12 + index}:00`,
            temp: 18 + index,
            type: 'rainy' as WeatherType
        })),
        daily: [
            { day: 'Pazartesi', high: 20, low: 15, type: 'rainy' as WeatherType },
            { day: 'Salı', high: 19, low: 14, type: 'rainy' as WeatherType },
            { day: 'Çarşamba', high: 21, low: 16, type: 'cloudy' as WeatherType },
            { day: 'Perşembe', high: 22, low: 17, type: 'rainy' as WeatherType },
            { day: 'Cuma', high: 20, low: 15, type: 'rainy' as WeatherType },
            { day: 'Cumartesi', high: 19, low: 14, type: 'cloudy' as WeatherType },
            { day: 'Pazar', high: 21, low: 16, type: 'rainy' as WeatherType }
        ] as DailyWeather[]
    };

    // Dummy posts data
    const dummyPosts = useMemo(() => ({
        isg: [
            {
                id: 1,
                title: "Elektrik Çarpması Tehlikesi",
                content: "Elektrik öldürür. Elektrikle çalışmalarda dikkatli olunuz. Elektrik panolarına yetkisiz müdahale etmeyin. Elektrikli ekipmanları kullanırken güvenlik kurallarına uyun.",
                image: "/isg/elektrik-uyari.jpg",
                created_at: "2024-03-15T09:00:00",
                author: {
                    name: "İSG Birimi",
                    avatar: "https://i.pravatar.cc/150?img=1"
                },
                category: "isg",
                tags: ["Elektrik Güvenliği", "İSG", "Uyarı"],
                read_time: "2 dk"
            },
            {
                id: 2,
                title: "Kişisel Koruyucu Donanım Kullanımı",
                content: "Çalışma alanlarında uygun kişisel koruyucu donanımları kullanmak zorunludur. Baret, iş ayakkabısı, koruyucu gözlük ve diğer gerekli ekipmanları kullanmadan çalışma yapmayınız.",
                image: "/isg/kkd-uyari.jpg",
                created_at: "2024-03-14T14:30:00",
                author: {
                    name: "İSG Birimi",
                    avatar: "https://i.pravatar.cc/150?img=2"
                },
                category: "isg",
                tags: ["KKD", "İş Güvenliği", "Uyarı"],
                read_time: "3 dk"
            }
        ],
        environment: [
            {
                id: 3,
                title: "Sıfır Atık Projemiz Ödül Aldı",
                content: "Geçtiğimiz ay başlattığımız sıfır atık projemiz, Çevre ve Şehircilik Bakanlığı tarafından 'En İyi Uygulama' ödülüne layık görüldü. Projemiz kapsamında atık miktarımızı %60 oranında azaltmayı başardık.",
                image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
                created_at: "2024-03-13T10:15:00",
                author: {
                    name: "Ayşe Kaya",
                    avatar: "https://i.pravatar.cc/150?img=3"
                },
                category: "environment",
                tags: ["Sürdürülebilirlik", "Çevre", "Ödül"],
                read_time: "4 dk"
            },
            {
                id: 4,
                title: "Güneş Enerjisi Sistemimiz Devrede",
                content: "Fabrikamızın çatısına kurulan güneş enerjisi sistemi bugün itibariyle tam kapasite çalışmaya başladı. Bu sistem ile yıllık enerji tüketimimizin %40'ını yenilenebilir kaynaklardan karşılayacağız.",
                image: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
                created_at: "2024-03-12T16:45:00",
                author: {
                    name: "Ali Yıldız",
                    avatar: "https://i.pravatar.cc/150?img=4"
                },
                category: "environment",
                tags: ["Yenilenebilir Enerji", "Sürdürülebilirlik"],
                read_time: "6 dk"
            }
        ],
        quality: [
            {
                id: 5,
                title: "ISO 9001:2015 Denetimimizi Başarıyla Tamamladık",
                content: "Yıllık ISO 9001:2015 kalite yönetim sistemi denetimimiz başarıyla tamamlandı. Denetim sonucunda sıfır uygunsuzluk ile sertifikamızı yenilemeye hak kazandık.",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
                created_at: "2024-03-11T11:20:00",
                author: {
                    name: "Zeynep Şahin",
                    avatar: "https://i.pravatar.cc/150?img=5"
                },
                category: "quality",
                tags: ["ISO", "Kalite", "Denetim"],
                read_time: "5 dk"
            },
            {
                id: 6,
                title: "Yeni Kalite Kontrol Laboratuvarı",
                content: "Modern cihazlarla donatılan yeni kalite kontrol laboratuvarımız hizmete girdi. Bu yatırım ile ürün test süreçlerimiz %50 daha hızlı ve %30 daha hassas hale geldi.",
                image: "https://images.unsplash.com/photo-1581093458791-9d42e3c2fd15",
                created_at: "2024-03-10T13:40:00",
                author: {
                    name: "Mustafa Özkan",
                    avatar: "https://i.pravatar.cc/150?img=6"
                },
                category: "quality",
                tags: ["Laboratuvar", "Test", "Yatırım"],
                read_time: "4 dk"
            }
        ],
        general: [
            {
                id: 7,
                title: "2024 İlk Çeyrek Başarılarımız",
                content: "2024 yılının ilk çeyreğini rekor bir büyüme ile kapattık. İhracat hedeflerimizi %15 aşarken, müşteri memnuniyet skorumuz 4.8/5 olarak gerçekleşti.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
                created_at: "2024-03-09T15:10:00",
                author: {
                    name: "Emre Can",
                    avatar: "https://i.pravatar.cc/150?img=7"
                },
                category: "general",
                tags: ["Başarı", "İhracat", "Büyüme"],
                read_time: "7 dk"
            },
            {
                id: 8,
                title: "Yeni Sosyal Tesisimiz Açıldı",
                content: "Çalışanlarımız için tasarlanan yeni sosyal tesisimiz bugün hizmete açıldı. Spor salonu, kafeterya ve dinlenme alanları ile çalışanlarımıza modern bir yaşam alanı sunuyoruz.",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
                created_at: "2024-03-08T09:30:00",
                author: {
                    name: "Selin Yılmaz",
                    avatar: "https://i.pravatar.cc/150?img=8"
                },
                category: "general",
                tags: ["Sosyal Tesis", "Çalışan Memnuniyeti"],
                read_time: "3 dk"
            }
        ]
    }), []);

    // Dummy meals data with schedule
    const dummyMeals = [
        {
            id: 1,
            date: new Date(),
            meals: {
                breakfast: {
                    menu: "• Zengin Açık Büfe Kahvaltı\n• Simit ve Poğaça Çeşitleri\n• Taze Demlenmiş Çay\n• Filtre Kahve\n• Meyve Suyu Çeşitleri",
                    time: "07:00 - 09:00"
                },
                lunch: {
                    menu: "• Mercimek Çorbası\n• Izgara Köfte\n• Pirinç Pilavı\n• Mevsim Salata\n• Cacık\n• Baklava\n• Meyve Suyu",
                    time: "12:00 - 14:00"
                },
                dinner: {
                    menu: "• Ezogelin Çorbası\n• Fırın Tavuk\n• Sebzeli Bulgur Pilavı\n• Karışık Salata\n• Yoğurt\n• Sütlaç\n• Ayran",
                    time: "18:00 - 20:00"
                }
            }
        }
    ];

    // Dummy slider verileri
    const sliderItems = [
        {
            id: 1,
            title: "Yeni Fabrika Açılışımız",
            description: "İstanbul'daki yeni üretim tesisimizin açılış töreni gerçekleştirildi",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600",
            date: "15 Mart 2024"
        },
        {
            id: 2,
            title: "ISO 9001:2015 Sertifikası Aldık",
            description: "Kalite yönetim sistemimiz uluslararası standartlara uygunluğu tescillendi",
            image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600",
            date: "10 Mart 2024"
        },
        {
            id: 3,
            title: "Sürdürülebilirlik Raporu 2024",
            description: "Yıllık sürdürülebilirlik raporumuz yayınlandı",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600",
            date: "1 Mart 2024"
        },
    ];

    useEffect(() => {
        setPosts(dummyPosts);
    }, [dummyPosts]);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false,
    };

    const handleLogin = () => {
        if (username && password) {
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/home');
        }
    };

    return (
        <Box sx={{ bgcolor: '#f8f9fc', minHeight: '100vh', p: 2 }}>
            {/* Login Section */}
            <LoginSection>
                {!isLoggedIn ? (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6" sx={{ 
                                color: '#1a237e',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <PersonIcon />
                                Kullanıcı Girişi
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <TextField
                                size="small"
                                placeholder="Kullanıcı Adı"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                            <TextField
                                size="small"
                                type="password"
                                placeholder="Şifre"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleLogin}
                                sx={{
                                    bgcolor: '#1a237e',
                                    '&:hover': {
                                        bgcolor: '#0d47a1',
                                    },
                                    borderRadius: 2,
                                    px: 3
                                }}
                                startIcon={<LockIcon />}
                            >
                                Giriş Yap
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#1a237e' }}>
                                {username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {username}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Hoş Geldiniz
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => setIsLoggedIn(false)}
                                sx={{ borderRadius: 2 }}
                            >
                                Çıkış Yap
                            </Button>
                        </Box>
                    </>
                )}
            </LoginSection>

            {/* Slider Section */}
            <Box sx={{ mb: 4 }}>
                <Slider {...sliderSettings}>
                    {sliderItems.map((item) => (
                        <div key={item.id}>
                            <SliderCard>
                                <CardMedia
                                    component="img"
                                    height="400"
                                    image={item.image}
                                    alt={item.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <SliderContent>
                                    <Typography variant="caption" sx={{ 
                                        color: '#fff',
                                        opacity: 0.8,
                                        mb: 1,
                                        display: 'block'
                                    }}>
                                        {item.date}
                                    </Typography>
                                    <Typography variant="h3" sx={{ 
                                        fontWeight: 700,
                                        mb: 2, 
                                        fontSize: { xs: '2rem', md: '3rem' }
                                    }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 400,
                                        opacity: 0.9,
                                        mb: 3
                                    }}>
                                        {item.description}
                                    </Typography>
                                </SliderContent>
                            </SliderCard>
                        </div>
                    ))}
                </Slider>
            </Box>

            {/* Ana Grid Container */}
            <Grid container spacing={3}>
                {/* Hava Durumu, Takvim ve Yemek Menüsü Grid */}
                <Grid container item xs={12} spacing={3}>
                    {/* Hava Durumu Bölümü */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            overflow: 'hidden',
                            background: weatherTypes['rainy'].gradient,
                            color: 'white',
                            position: 'relative'
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: weatherTypes['rainy'].overlay,
                                zIndex: 1
                            }} />
                            <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        {weatherTypes['rainy'].icon}
                                        24 Saatlik Tahmin
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                        İskenderun
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1, 
                                    overflowX: 'auto',
                                    pb: 1,
                                    '&::-webkit-scrollbar': {
                                        height: '4px'
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        background: 'rgba(255,255,255,0.1)'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: 'rgba(255,255,255,0.3)',
                                        borderRadius: '4px'
                                    }
                                }}>
                                    {weatherData.hourly.map((hour, index) => (
                                        <Box key={index} sx={{
                                            minWidth: '80px',
                                            p: 1.5,
                                            textAlign: 'center',
                                            borderRadius: 2,
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                background: 'rgba(255,255,255,0.15)'
                                            }
                                        }}>
                                            {weatherTypes[hour.type].icon}
                                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                                {hour.temp}°
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                {hour.time}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>

                        <Card sx={{ 
                            borderRadius: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            overflow: 'hidden',
                            background: weatherTypes['rainy'].gradient,
                            color: 'white',
                            position: 'relative'
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: weatherTypes['rainy'].overlay,
                                zIndex: 1
                            }} />
                            <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        {weatherTypes['rainy'].icon}
                                        Haftalık Tahmin
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                                        İskenderun
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {weatherData.daily.map((day, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            p: 1.5,
                                            borderRadius: 2,
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                transform: 'translateX(4px)',
                                                background: 'rgba(255,255,255,0.15)'
                                            }
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                {weatherTypes[day.type].icon}
                                                <Typography sx={{ fontWeight: 500 }}>
                                                    {day.day}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {day.high}°
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                    {day.low}°
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Takvim ve Yemek Menüsü Bölümü */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ 
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                            mb: 3,
                            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
                            border: '1px solid rgba(230, 232, 240, 0.5)',
                            overflow: 'visible'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    mb: 3
                                }}>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 700,
                                        color: '#1a237e',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        fontSize: '1.25rem'
                                    }}>
                                        <RestaurantIcon sx={{ fontSize: 24 }} />
                                        YEMEK TAKVİMİ
                                    </Typography>
                                    <Typography variant="body1" sx={{ 
                                        color: '#1a237e',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        fontWeight: 600,
                                        backgroundColor: 'rgba(26, 35, 126, 0.08)',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.9rem'
                                    }}>
                                        {format(selectedDate || new Date(), 'dd MMMM yyyy', { locale: tr })}
                                    </Typography>
                                </Box>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                                    <DateCalendar 
                                        value={selectedDate}
                                        onChange={(newValue) => {
                                            setSelectedDate(newValue);
                                        }}
                                        sx={{
                                            width: '100%',
                                            maxWidth: '100%',
                                            margin: '0 auto',
                                            backgroundColor: 'white',
                                            padding: '24px',
                                            borderRadius: '16px',
                                            '& .MuiPickersDay-root': {
                                                borderRadius: '12px',
                                                fontWeight: 500,
                                                fontSize: '1.125rem',
                                                width: '40px !important',
                                                height: '40px !important',
                                                margin: '0px',
                                                color: '#4B5563',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '&:hover': {
                                                    backgroundColor: '#F3F4F6',
                                                },
                                                '&.Mui-selected': {
                                                    backgroundColor: '#4F46E5',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    position: 'relative',
                                                    '&:hover': {
                                                        backgroundColor: '#4F46E5',
                                                    },
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        right: 0,
                                                        bottom: 0,
                                                        width: '8px',
                                                        height: '8px',
                                                        backgroundColor: 'white',
                                                        borderRadius: '2px',
                                                        transform: 'translate(-4px, -4px)'
                                                    }
                                                }
                                            },
                                            '& .MuiDayCalendar-weekDayLabel': {
                                                color: '#374151',
                                                fontWeight: 600,
                                                fontSize: '0.875rem',
                                                width: '40px !important',
                                                height: '40px !important',
                                                margin: '0px',
                                                textTransform: 'uppercase',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            },
                                            '& .MuiDayCalendar-header': {
                                                justifyContent: 'space-between',
                                                paddingBottom: '8px',
                                                borderBottom: 'none',
                                                margin: '0 8px'
                                            },
                                            '& .MuiPickersCalendarHeader-root': {
                                                paddingLeft: '8px',
                                                paddingRight: '8px',
                                                marginTop: '0',
                                                marginBottom: '8px'
                                            },
                                            '& .MuiDayCalendar-monthContainer': {
                                                minHeight: 'unset',
                                                margin: '0 8px'
                                            },
                                            '& .MuiDayCalendar-weekContainer': {
                                                justifyContent: 'space-between',
                                                margin: '0'
                                            },
                                            '& .MuiPickersCalendarHeader-label': {
                                                fontWeight: 600,
                                                fontSize: '1.25rem',
                                                color: '#111827',
                                                textTransform: 'capitalize',
                                                marginBottom: '8px'
                                            },
                                            '& .MuiPickersDay-today': {
                                                backgroundColor: '#F3F4F6',
                                                color: '#111827',
                                                fontWeight: 600,
                                                border: 'none'
                                            },
                                            '& .MuiPickersDay-dayOutsideMonth': {
                                                color: '#9CA3AF',
                                                fontWeight: 400
                                            },
                                            '& .MuiPickersCalendarHeader-switchViewButton': {
                                                display: 'none'
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </CardContent>
                        </Card>

                        {/* Seçili Gün Yemek Kartları */}
                        {selectedDate && (
                            <Grid container spacing={2}>
                                {/* Kahvaltı Kartı */}
                                <Grid item xs={12} md={4}>
                                    <MealCard color="#4caf50">
                                        <CardContent sx={{ 
                                            p: 3, 
                                            flex: 1,
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
                                        }}>
                                            <Box>
                                                <Typography variant="h6" sx={{ 
                                                    fontSize: 20, 
                                                    fontWeight: 700, 
                                                    mb: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <RestaurantIcon sx={{ fontSize: 18 }} />
                                                    Kahvaltı Menüsü
                                                </Typography>
                                                <Typography sx={{ 
                                                    fontSize: 14, 
                                                    opacity: 0.95, 
                                                    mb: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}>
                                                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                                                    {dummyMeals[0].meals.breakfast.time}
                                                </Typography>
                                                <Typography sx={{ 
                                                    fontSize: 14, 
                                                    opacity: 0.95, 
                                                    whiteSpace: 'pre-line',
                                                    lineHeight: 1.6
                                                }}>
                                                    {dummyMeals[0].meals.breakfast.menu}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </MealCard>
                                </Grid>

                                {/* Öğle Yemeği Kartı */}
                                <Grid item xs={12} md={4}>
                                    <MealCard color="#f44336">
                                        <CardContent sx={{ 
                                            p: 3, 
                                            flex: 1,
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
                                        }}>
                                            <Box>
                                                <Typography variant="h6" sx={{ 
                                                    fontSize: 20, 
                                                    fontWeight: 700, 
                                                    mb: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <RestaurantIcon sx={{ fontSize: 18 }} />
                                                    Öğle Yemeği
                                                </Typography>
                                                <Typography sx={{ 
                                                    fontSize: 14, 
                                                    opacity: 0.95, 
                                                    mb: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}>
                                                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                                                    {dummyMeals[0].meals.lunch.time}
                                                </Typography>
                                                <Typography sx={{ 
                                                    fontSize: 14, 
                                                    opacity: 0.95, 
                                                    whiteSpace: 'pre-line',
                                                    lineHeight: 1.6
                                                }}>
                                                    {dummyMeals[0].meals.lunch.menu}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </MealCard>
                                </Grid>

                                {/* Akşam Yemeği Kartı */}
                                <Grid item xs={12} md={4}>
                                    <MealCard color="#2196f3">
                                        <CardContent sx={{ 
                                            p: 3, 
                                            flex: 1,
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)'
                                        }}>
                                            <Box>
                                                <Typography variant="h6" sx={{ 
                                                    fontSize: 20, 
                                                    fontWeight: 700, 
                                                    mb: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    <RestaurantIcon sx={{ fontSize: 18 }} />
                                                    Akşam Yemeği
                                                </Typography>
                                                <Typography sx={{ 
                                                    fontSize: 14, 
                                                    opacity: 0.95, 
                                                    mb: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}>
                                                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                                                    {dummyMeals[0].meals.dinner.time}
                                                </Typography>
                                                <Typography sx={{ 
                                                    fontSize: 14, 
                                                    opacity: 0.95, 
                                                    whiteSpace: 'pre-line',
                                                    lineHeight: 1.6
                                                }}>
                                                    {dummyMeals[0].meals.dinner.menu}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </MealCard>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                {/* Haberler Grid */}
                <Grid container item xs={12} spacing={3}>
                    {Object.entries(posts).map(([category, categoryPosts]) => (
                        <Grid item xs={12} key={category}>
                            <SectionTitle>
                                {category === 'isg' ? 'İSG HABERLERİ' :
                                 category === 'environment' ? 'ÇEVRE BÜLTENİ' :
                                 category === 'quality' ? 'KALİTE KÖŞESİ' : 'GENEL DUYURULAR'}
                            </SectionTitle>
                            <Grid container spacing={3}>
                                {categoryPosts.map((post: Post) => (
                                    <Grid item xs={12} md={6} key={post.id}>
                                        <NewsCard>
                                            {post.image && (
                                                <CardMedia
                                                    component="img"
                                                    height={category === 'isg' ? "400" : "300"}
                                                    image={post.image}
                                                    alt={post.title}
                                                    sx={{ 
                                                        objectFit: category === 'isg' ? 'contain' : 'cover',
                                                        bgcolor: category === 'isg' ? '#f5f5f5' : 'transparent',
                                                        borderBottom: '1px solid #eee',
                                                        p: category === 'isg' ? 2 : 0
                                                    }}
                                                />
                                            )}
                                            <CardContent sx={{ p: 3 }}>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    mb: 2,
                                                    justifyContent: category === 'isg' ? 'center' : 'flex-start'
                                                }}>
                                                    <Avatar 
                                                        src={post.author?.avatar}
                                                        sx={{ width: 24, height: 24, mr: 1 }}
                                                    />
                                                    <Typography variant="caption" sx={{ 
                                                        color: '#666',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 500
                                                    }}>
                                                        {format(new Date(post.created_at), 'dd MMMM yyyy', { locale: tr })}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h6" sx={{ 
                                                    fontWeight: 700,
                                                    fontSize: category === 'isg' ? '1.5rem' : '1.25rem',
                                                    mb: 2,
                                                    lineHeight: 1.3,
                                                    color: category === 'isg' ? '#d32f2f' : '#1a237e',
                                                    textAlign: category === 'isg' ? 'center' : 'left'
                                                }}>
                                                    {post.title}
                                                </Typography>
                                                <Typography sx={{
                                                    color: category === 'isg' ? '#d32f2f' : '#424242',
                                                    fontSize: category === 'isg' ? '1.1rem' : '1rem',
                                                    lineHeight: 1.6,
                                                    mb: 2,
                                                    fontWeight: category === 'isg' ? 600 : 400,
                                                    textAlign: category === 'isg' ? 'center' : 'left'
                                                }}>
                                                    {post.content}
                                                </Typography>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    gap: 1,
                                                    justifyContent: category === 'isg' ? 'center' : 'flex-start'
                                                }}>
                                                    {post.tags?.map((tag, index) => (
                                                        <Chip 
                                                            key={index}
                                                            label={tag}
                                                            size="small"
                                                            sx={{ 
                                                                bgcolor: '#e3f2fd',
                                                                color: '#1a237e',
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </CardContent>
                                        </NewsCard>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box sx={{ mb: 4 }} />
                        </Grid>
                    ))}
                </Grid>

                {/* Duyuru Listesi Tamamı */}
                <Grid item xs={12}>
                    <Card sx={{ 
                        mt: 3,
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        p: 3
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ 
                                fontWeight: 700,
                                color: '#1a237e',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <NotificationsIcon />
                                Tüm Duyurular
                            </Typography>
                            <Button 
                                variant="outlined" 
                                color="primary"
                                endIcon={<ArrowForwardIcon />}
                            >
                                Tümünü Gör
                            </Button>
                        </Box>
                        <Grid container spacing={3}>
                            {sliderItems.map((item) => (
                                <Grid item xs={12} md={4} key={item.id}>
                                    <NewsCard>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={item.image}
                                            alt={item.title}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ p: 3 }}>
                                            <Typography variant="caption" sx={{ 
                                                color: '#666',
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                mb: 1,
                                                display: 'block'
                                            }}>
                                                {item.date}
                                            </Typography>
                                            <Typography variant="h6" sx={{ 
                                                fontWeight: 700,
                                                fontSize: '1.1rem',
                                                mb: 2,
                                                lineHeight: 1.3,
                                                color: '#1a237e'
                                            }}>
                                                {item.title}
                                            </Typography>
                                            <Typography sx={{
                                                color: '#424242',
                                                fontSize: '0.9rem',
                                                lineHeight: 1.6
                                            }}>
                                                {item.description}
                                            </Typography>
                                        </CardContent>
                                    </NewsCard>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 