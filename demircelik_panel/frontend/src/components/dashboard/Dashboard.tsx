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
import { keyframes } from '@mui/system';
import { HealthAndSafety, Park as Eco, Assignment } from '@mui/icons-material';

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
    borderRadius: 10,
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
    padding: theme.spacing(6),
    paddingTop: theme.spacing(12),
    color: '#fff',
    zIndex: 2,
    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)',
    transform: 'translateY(0)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-10px)'
    }
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

// Animasyon tanımları
const slideIn = keyframes`
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const textGlow = keyframes`
    0% {
        transform: scale(1);
        text-shadow: 0 0 5px rgba(255,255,255,0.5);
        letter-spacing: 1px;
    }
    25% {
        transform: scale(1.1);
        text-shadow: 0 0 20px rgba(255,255,255,0.8);
        letter-spacing: 2px;
    }
    50% {
        transform: scale(1);
        text-shadow: 0 0 5px rgba(255,255,255,0.5);
        letter-spacing: 1px;
    }
    75% {
        transform: scale(1.1);
        text-shadow: 0 0 20px rgba(255,255,255,0.8);
        letter-spacing: 2px;
    }
    100% {
        transform: scale(1);
        text-shadow: 0 0 5px rgba(255,255,255,0.5);
        letter-spacing: 1px;
    }
`;

const CategoryLabel = styled(Box)(({ color = '#ff0000' }: { color?: string }) => ({
    position: 'absolute',
    top: 30,
    right: -20,
    backgroundColor: color,
    padding: '10px 30px',
    minWidth: 200,
    transform: 'rotate(45deg)',
    zIndex: 10,
    animation: `${slideIn} 0.5s ease-out forwards`,
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    '&:hover': {
        transform: 'rotate(45deg) scale(1.05)',
        transition: 'transform 0.3s ease'
    },
    '& .category-text': {
        animation: `${textGlow} 4s ease-in-out infinite`,
        display: 'block',
        transition: 'all 0.3s ease',
        fontWeight: 800,
        fontSize: '1.2rem',
        background: 'linear-gradient(45deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,1) 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 10px rgba(255,255,255,0.5)',
        filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.3))'
    }
}));

// Özel stil bileşenleri
interface SectionBannerProps {
    color?: string;
    backgroundImage?: string;
    children: React.ReactNode;
}

const SectionBanner = styled(Box)<SectionBannerProps>(({ theme, color = '#ff0000', backgroundImage }) => ({
    position: 'relative',
    padding: '24px',
    marginBottom: '24px',
    borderRadius: '12px',
    overflow: 'hidden',
    color: 'white',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.2,
        animation: `${fadeIn} 1s ease-out`,
    },
    '& .content': {
        position: 'relative',
        zIndex: 1,
        animation: `${slideIn} 0.5s ease-out`,
    }
}));

const WeatherTabs = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '4px',
    marginBottom: '20px',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
        display: 'none'
    },
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none'
}));

const WeatherTab = styled(Button)(({ active }: { active?: boolean }) => ({
    backgroundColor: active ? '#FFD700' : 'rgba(255, 255, 255, 0.1)',
    color: active ? '#000' : '#fff',
    padding: '8px 16px',
    borderRadius: '20px',
    minWidth: 'auto',
    fontSize: '0.875rem',
    fontWeight: 500,
    '&:hover': {
        backgroundColor: active ? '#FFD700' : 'rgba(255, 255, 255, 0.2)',
    }
}));

const WeatherCard = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '100px',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-2px)'
    }
}));

const WeatherInfoBox = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    marginBottom: '8px'
}));

const TemperatureGraph = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '200px',
    width: '100%',
    marginTop: '20px',
    '& .graph-line': {
        position: 'absolute',
        left: 0,
        right: 0,
        height: '1px',
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    '& .temperature-point': {
        position: 'absolute',
        width: '8px',
        height: '8px',
        backgroundColor: '#FFD700',
        borderRadius: '50%',
        transform: 'translate(-50%, 50%)',
        cursor: 'pointer',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
            border: '2px solid rgba(255,215,0,0.3)',
            borderRadius: '50%',
            transition: 'all 0.3s ease'
        },
        '&:hover::after': {
            top: '-6px',
            left: '-6px',
            right: '-6px',
            bottom: '-6px',
            borderColor: 'rgba(255,215,0,0.5)'
        }
    }
}));

const WeatherContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    minHeight: '400px',
    width: '100%',
    zIndex: 2
}));

const RainChart = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '200px',
    width: '100%',
    marginTop: '20px',
    '& .rain-bar': {
        position: 'absolute',
        bottom: 0,
        width: '30px',
        borderRadius: '4px 4px 0 0',
        background: 'linear-gradient(180deg, rgba(144,202,249,0.2) 0%, rgba(144,202,249,0.8) 100%)',
        transition: 'all 0.3s ease'
    }
}));

const HumidityGauge = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '200px',
    height: '200px',
    margin: '20px auto',
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, rgba(144,202,249,0.8) var(--value), rgba(255,255,255,0.1) var(--value))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '80%',
        height: '80%',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(5px)'
    }
}));

const DailyTempGraph = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '100%',
    height: '120px',
    marginTop: '20px',
    marginBottom: '20px',
    '& .temp-line': {
        position: 'absolute',
        left: 0,
        right: 0,
        height: '1px',
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    '& .temp-point': {
        position: 'absolute',
        width: '6px',
        height: '6px',
        backgroundColor: '#FFD700',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '-4px',
            left: '-4px',
            right: '-4px',
            bottom: '-4px',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: '50%',
            transition: 'all 0.3s ease'
        },
        '&:hover': {
            width: '8px',
            height: '8px',
            backgroundColor: '#FFF',
            boxShadow: '0 0 10px rgba(255,215,0,0.5)',
            '&::after': {
                top: '-6px',
                left: '-6px',
                right: '-6px',
                bottom: '-6px',
                borderColor: 'rgba(255,215,0,0.5)'
            }
        }
    },
    '& .temp-line-connect': {
        position: 'absolute',
        height: '2px',
        background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
        opacity: 0.5,
        transition: 'all 0.3s ease'
    }
}));

const EventListItem = styled(Box)(({ color = '#1a76d2' }: { color?: string }) => ({
    position: 'relative',
    padding: '20px',
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
        transform: 'translateX(4px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
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
    const [currentWeather, setCurrentWeather] = useState<WeatherType>('sunny');
    const [activeTab, setActiveTab] = useState('hourly');
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

    // Rastgele hava durumu seçme fonksiyonu
    const getRandomWeather = () => {
        const weatherTypes: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'snowy', 'stormy'];
        const randomIndex = Math.floor(Math.random() * weatherTypes.length);
        return weatherTypes[randomIndex];
    };

    // Sayfa yüklendiğinde ve her yenilendiğinde rastgele hava durumu seç
    useEffect(() => {
        const newWeather = getRandomWeather();
        setCurrentWeather(newWeather);
    }, []);

    // Hava durumu verileri
    const weatherData = useMemo(() => ({
        current: {
            temp: currentWeather === 'sunny' ? 21 : 
                  currentWeather === 'cloudy' ? 18 :
                  currentWeather === 'rainy' ? 16 :
                  currentWeather === 'snowy' ? 0 : 15,
            feels_like: currentWeather === 'sunny' ? 24 : 
                         currentWeather === 'cloudy' ? 19 :
                         currentWeather === 'rainy' ? 15 :
                         currentWeather === 'snowy' ? -2 : 14,
            wind_speed: 12,
            humidity: 31,
            visibility: 10,
            pressure: 1023
        },
        hourly: [...Array(8)].map((_, index) => ({
            time: `${index + 12}:00`,
            temp: currentWeather === 'sunny' ? Math.round(21 + Math.sin(index/2) * 3) : 
                  currentWeather === 'cloudy' ? Math.round(18 + Math.sin(index/2) * 2) :
                  currentWeather === 'rainy' ? Math.round(16 + Math.sin(index/2) * 2) :
                  currentWeather === 'snowy' ? Math.round(0 + Math.sin(index/2) * 2) : 
                  Math.round(15 + Math.sin(index/2) * 2),
            type: currentWeather as WeatherType
        })),
        daily: [...Array(7)].map((_, index) => {
            const baseTemp = currentWeather === 'sunny' ? 21 :
                           currentWeather === 'cloudy' ? 18 :
                           currentWeather === 'rainy' ? 16 :
                           currentWeather === 'snowy' ? 0 : 15;
            return {
                day: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'][index],
                high: baseTemp + Math.floor(Math.random() * 3),
                low: baseTemp - Math.floor(Math.random() * 3),
                type: currentWeather as WeatherType
            };
        })
    }), [currentWeather]);

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
            title: "SPOR HABERLERİ",
            description: "Şirket Futbol Turnuvası Başlıyor! Departmanlar Arası Maçlar Bu Hafta Başlıyor",
            image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1600&q=80",
            date: "15 Mart 2024",
            gradient: "linear-gradient(to bottom, rgba(244, 67, 54, 0), rgba(244, 67, 54, 0.9))",
            category: {
                name: "SPOR",
                icon: "⚽",
                color: "#f44336"
            },
            stats: {
                label: "Katılımcı Takım",
                value: "8 Takım"
            }
        },
        {
            id: 2,
            title: "ÜRETİM BAŞARILARI",
            description: "Yeni Üretim Rekoruna İmza Attık! Aylık Üretim Hedefimizi %15 Aştık",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
            date: "14 Mart 2024",
            gradient: "linear-gradient(to bottom, rgba(33, 150, 243, 0), rgba(33, 150, 243, 0.9))",
            category: {
                name: "ÜRETİM",
                icon: "🏭",
                color: "#2196f3"
            },
            stats: {
                label: "Verimlilik Artışı",
                value: "+15%"
            }
        },
        {
            id: 3,
            title: "SOSYAL ETKİNLİKLER",
            description: "Geleneksel Bahar Şenliğimiz 20 Mart'ta Başlıyor! Tüm Çalışanlarımız Davetlidir",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80",
            date: "13 Mart 2024",
            gradient: "linear-gradient(to bottom, rgba(76, 175, 80, 0), rgba(76, 175, 80, 0.9))",
            category: {
                name: "ETKİNLİK",
                icon: "🎉",
                color: "#4caf50"
            },
            stats: {
                label: "Katılımcı Sayısı",
                value: "250+"
            }
        },
        {
            id: 4,
            title: "İSG DUYURULARI",
            description: "Sıfır Kaza Hedefimizde 365 Günü Geride Bıraktık! Güvenlik Önce Gelir",
            image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1600&q=80",
            date: "12 Mart 2024",
            gradient: "linear-gradient(to bottom, rgba(255, 152, 0, 0), rgba(255, 152, 0, 0.9))",
            category: {
                name: "İSG",
                icon: "⚠️",
                color: "#ff9800"
            },
            stats: {
                label: "Güvenli Gün",
                value: "365"
            }
        }
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

    const renderWeatherContent = () => {
        switch (activeTab) {
            case 'hourly':
                return (
                    <WeatherContent>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Günlük Sıcaklık Değişimi
                            </Typography>
                            <DailyTempGraph>
                                {/* Yatay çizgiler */}
                                {[...Array(5)].map((_, i) => (
                                    <Box
                                        key={i}
                                        className="temp-line"
                                        sx={{ top: `${i * 25}%` }}
                                    />
                                ))}
                                
                                {/* Sıcaklık noktaları ve bağlantı çizgileri */}
                                {weatherData.hourly.map((hour, index, array) => (
                                    <React.Fragment key={index}>
                                        {/* Bağlantı çizgisi */}
                                        {index < array.length - 1 && (
                                            <Box
                                                className="temp-line-connect"
                                                sx={{
                                                    left: `${(index / (array.length - 1)) * 100}%`,
                                                    width: `${100 / (array.length - 1)}%`,
                                                    top: `${100 - ((hour.temp - 15) / 20) * 100}%`,
                                                    transform: `rotate(${Math.atan2(
                                                        ((array[index + 1].temp - 15) / 20) * 100 - ((hour.temp - 15) / 20) * 100,
                                                        100 / (array.length - 1)
                                                    )}rad)`,
                                                    transformOrigin: '0 50%'
                                                }}
                                            />
                                        )}
                                        {/* Sıcaklık noktası */}
                                        <Box
                                            className="temp-point"
                                            sx={{
                                                left: `${(index / (array.length - 1)) * 100}%`,
                                                top: `${100 - ((hour.temp - 15) / 20) * 100}%`
                                            }}
                                        />
                                    </React.Fragment>
                                ))}
                            </DailyTempGraph>
                            
                            {/* Saat ve sıcaklık etiketleri */}
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                mt: 1,
                                px: 1
                            }}>
                                {weatherData.hourly.map((hour, index) => (
                                    <Box key={index} sx={{ textAlign: 'center' }}>
                                        <Typography variant="caption" sx={{ 
                                            opacity: 0.7, 
                                            display: 'block',
                                            fontSize: '0.75rem'
                                        }}>
                                            {hour.time}
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            {hour.temp}°
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        <TemperatureGraph>
                            {[...Array(6)].map((_, i) => (
                                <Box key={i} className="graph-line" sx={{ top: `${i * 20}%` }} />
                            ))}
                            <Box sx={{
                                position: 'absolute',
                                left: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '100%',
                                height: '60%',
                                background: 'linear-gradient(180deg, rgba(255,215,0,0.2) 0%, rgba(255,140,0,0.1) 100%)',
                                borderRadius: '12px'
                            }} />
                            {weatherData.hourly.map((hour, index) => (
                                <Box
                                    key={index}
                                    className="temperature-point"
                                    sx={{
                                        left: `${(index / (weatherData.hourly.length - 1)) * 100}%`,
                                        bottom: `${((hour.temp - 5) / 40) * 100}%`
                                    }}
                                />
                            ))}
                        </TemperatureGraph>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            mt: 2,
                            pt: 2,
                            borderTop: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {weatherData.hourly.map((hour, index) => (
                                <Box key={index} sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                                        {hour.time}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {hour.temp}°
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </WeatherContent>
                );
            case 'overview':
                return (
                    <WeatherContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{ 
                                    p: 3, 
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 2,
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                                        {weatherData.hourly[0].temp}°C
                                    </Typography>
                                    <Typography variant="h6" sx={{ opacity: 0.8 }}>
                                        {weatherTypes[currentWeather].text}
                                    </Typography>
                                </Box>
                            </Grid>
                            {['Nem', 'Rüzgar', 'UV İndeksi', 'Görüş'].map((item, index) => (
                                <Grid item xs={6} key={index}>
                                    <Box sx={{ 
                                        p: 2, 
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        borderRadius: 2,
                                        textAlign: 'center'
                                    }}>
                                        <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
                                            {item}
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {index === 0 ? '65%' : 
                                             index === 1 ? '12 km/s' :
                                             index === 2 ? '5' : '10 km'}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </WeatherContent>
                );
            case 'rain':
                return (
                    <WeatherContent>
                        <Typography variant="h6" sx={{ mb: 3 }}>Yağış Tahmini</Typography>
                        <RainChart>
                            {weatherData.hourly.map((hour, index) => (
                                <Box
                                    key={index}
                                    className="rain-bar"
                                    sx={{
                                        left: `${(index / weatherData.hourly.length) * 100}%`,
                                        height: `${Math.random() * 100}%`,
                                        transform: 'translateX(-50%)'
                                    }}
                                />
                            ))}
                        </RainChart>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            mt: 2
                        }}>
                            {weatherData.hourly.map((hour, index) => (
                                <Typography key={index} variant="caption" sx={{ opacity: 0.7 }}>
                                    {hour.time}
                                </Typography>
                            ))}
                        </Box>
                    </WeatherContent>
                );
            case 'humidity':
                return (
                    <WeatherContent>
                        <Typography variant="h6" sx={{ mb: 3 }}>Nem Oranı</Typography>
                        <HumidityGauge sx={{ '--value': '65%' }}>
                            <Typography variant="h4" sx={{ 
                                position: 'relative',
                                zIndex: 1,
                                fontWeight: 700 
                            }}>
                                65%
                            </Typography>
                        </HumidityGauge>
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body1" sx={{ opacity: 0.8 }}>
                                Normal Nem Seviyesi
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.6, mt: 1 }}>
                                İdeal aralık: 40-60%
                            </Typography>
                        </Box>
                    </WeatherContent>
                );
            default:
                return null;
        }
    };

    const renderSectionBanner = (category: string) => {
        let title = '';
        let subtitle = '';
        let color = '';
        let icon = null;
        let image = '';

        switch (category) {
            case 'isg':
                title = 'İSG HABERLERİ';
                subtitle = 'İş Sağlığı ve Güvenliği Güncel Bildirimleri';
                color = '#d32f2f';
                icon = <HealthAndSafety sx={{ fontSize: 40 }} />;
                image = '/images/isg-background.jpg';
                break;
            case 'environment':
                title = 'ÇEVRE BÜLTENİ';
                subtitle = 'Çevre ve Sürdürülebilirlik Haberleri';
                color = '#2e7d32';
                icon = <Eco sx={{ fontSize: 40 }} />;
                image = '/images/environment-background.jpg';
                break;
            case 'quality':
                title = 'KALİTE KÖŞESİ';
                subtitle = 'Kalite Yönetim Sistemi Güncellemeleri';
                color = '#1565c0';
                icon = <Assignment sx={{ fontSize: 40 }} />;
                image = '/images/quality-background.jpg';
                break;
            default:
                title = 'GENEL DUYURULAR';
                subtitle = 'Şirket Geneli Önemli Bilgilendirmeler';
                color = '#435785';
                icon = <NotificationsIcon sx={{ fontSize: 40 }} />;
                image = '/images/general-background.jpg';
        }

        return (
            <SectionBanner color={color} backgroundImage={image}>
                <Box className="content" sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        {icon}
                        <Box>
                            <Typography variant="h5" sx={{ 
                                fontWeight: 800,
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                letterSpacing: '0.5px'
                            }}>
                                {title}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ 
                                opacity: 0.9,
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                fontWeight: 500
                            }}>
                                {subtitle}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </SectionBanner>
        );
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
                                <CategoryLabel color={item.category.color}>
                                    <Typography className="category-text" sx={{ 
                                        color: 'white', 
                                        fontWeight: 800,
                                        textAlign: 'center',
                                        fontSize: '1.2rem',
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                                        letterSpacing: '1px'
                                    }}>
                                        {item.category.name} HABERLERİ
                                    </Typography>
                                </CategoryLabel>
                                <CardMedia
                                    component="img"
                                    height="400"
                                    image={item.image}
                                    alt={item.title}
                                    sx={{ 
                                        objectFit: 'cover',
                                        filter: 'brightness(0.85)',
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            filter: 'brightness(0.95)',
                                            transform: 'scale(1.02)'
                                        }
                                    }}
                                />
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: item.gradient,
                                    zIndex: 1
                                }} />
                                <SliderContent>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 2,
                                        mb: 3
                                    }}>
                                        <Chip
                                            label={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography sx={{ fontSize: '1.25rem' }}>{item.category.icon}</Typography>
                                                    <Typography sx={{ fontWeight: 600 }}>{item.category.name}</Typography>
                                                </Box>
                                            }
                                            sx={{
                                                bgcolor: `${item.category.color}dd`,
                                                color: 'white',
                                                borderRadius: '8px',
                                                height: '32px',
                                                '& .MuiChip-label': {
                                                    px: 2
                                                }
                                            }}
                                        />
                                    <Typography variant="caption" sx={{ 
                                        color: '#fff',
                                            opacity: 0.9,
                                            fontSize: '0.875rem',
                                            fontWeight: 500
                                    }}>
                                        {item.date}
                                    </Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ 
                                        fontWeight: 800,
                                        mb: 2.5, 
                                        fontSize: { xs: '1.75rem', md: '2.5rem' },
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                                        letterSpacing: '0.5px',
                                        lineHeight: 1.2
                                    }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 400,
                                        opacity: 0.95,
                                        mb: 4,
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                                        fontSize: '1.125rem',
                                        maxWidth: '90%',
                                        lineHeight: 1.6
                                    }}>
                                        {item.description}
                                    </Typography>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '12px',
                                        p: 2,
                                        width: 'fit-content'
                                    }}>
                                        <Typography variant="body2" sx={{ 
                                            opacity: 0.9,
                                            fontSize: '0.875rem',
                                            fontWeight: 500
                                        }}>
                                            {item.stats.label}:
                                        </Typography>
                                        <Typography variant="h6" sx={{ 
                                            fontWeight: 700,
                                            fontSize: '1rem'
                                        }}>
                                            {item.stats.value}
                                        </Typography>
                                    </Box>
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
                            borderRadius: 2,
                            overflow: 'hidden',
                            background: weatherTypes[currentWeather].gradient,
                            color: 'white',
                            position: 'relative',
                            p: 3
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: weatherTypes[currentWeather].overlay,
                                zIndex: 1
                            }} />
                            <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                                {/* Ana Hava Durumu Bilgisi */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    mb: 4
                                }}>
                                    <Box>
                                        <Typography variant="h1" sx={{ 
                                            fontSize: '4rem',
                                            fontWeight: 700,
                                            lineHeight: 1,
                                            mb: 1
                                        }}>
                                            {weatherData.current.temp}°
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                            Hissedilen {weatherData.current.feels_like}°
                                        </Typography>
                                        <Typography variant="h6" sx={{ 
                                            mt: 2,
                                            fontWeight: 600
                                        }}>
                                            {weatherTypes[currentWeather].text}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ 
                                        p: 2,
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%',
                                        width: '80px',
                                        height: '80px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {React.cloneElement(weatherTypes[currentWeather].icon as React.ReactElement, { 
                                            sx: { fontSize: 40 } 
                                        })}
                                    </Box>
                                </Box>

                                {/* Detaylı Bilgiler */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        Günlük Sıcaklık Değişimi
                                    </Typography>
                                    <DailyTempGraph>
                                        {/* Yatay çizgiler */}
                                        {[...Array(5)].map((_, i) => (
                                            <Box
                                                key={i}
                                                className="temp-line"
                                                sx={{ top: `${i * 25}%` }}
                                            />
                                        ))}
                                        
                                        {/* Sıcaklık noktaları ve bağlantı çizgileri */}
                                        {weatherData.hourly.map((hour, index, array) => (
                                            <React.Fragment key={index}>
                                                {/* Bağlantı çizgisi */}
                                                {index < array.length - 1 && (
                                                    <Box
                                                        className="temp-line-connect"
                                                        sx={{
                                                            left: `${(index / (array.length - 1)) * 100}%`,
                                                            width: `${100 / (array.length - 1)}%`,
                                                            top: `${100 - ((hour.temp - 15) / 20) * 100}%`,
                                                            transform: `rotate(${Math.atan2(
                                                                ((array[index + 1].temp - 15) / 20) * 100 - ((hour.temp - 15) / 20) * 100,
                                                                100 / (array.length - 1)
                                                            )}rad)`,
                                                            transformOrigin: '0 50%'
                                                        }}
                                                    />
                                                )}
                                                {/* Sıcaklık noktası */}
                                                <Box
                                                    className="temp-point"
                                                    sx={{
                                                        left: `${(index / (array.length - 1)) * 100}%`,
                                                        top: `${100 - ((hour.temp - 15) / 20) * 100}%`
                                                    }}
                                                />
                                            </React.Fragment>
                                        ))}
                                    </DailyTempGraph>
                                    
                                    {/* Saat ve sıcaklık etiketleri */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        mt: 1,
                                        px: 1
                                    }}>
                                        {weatherData.hourly.map((hour, index) => (
                                            <Box key={index} sx={{ textAlign: 'center' }}>
                                                <Typography variant="caption" sx={{ 
                                                    opacity: 0.7, 
                                                    display: 'block',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {hour.time}
                                                </Typography>
                                                <Typography variant="body2" sx={{ 
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {hour.temp}°
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Günlük Tahminler */}
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    7 Günlük Tahmin
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex',
                                    gap: 2,
                                    overflowX: 'auto',
                                    pb: 2,
                                    '&::-webkit-scrollbar': {
                                        height: '4px'
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: 'rgba(255,255,255,0.1)'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                        borderRadius: '4px'
                                    }
                                }}>
                                    {weatherData.daily.map((day, index) => (
                                        <WeatherCard key={index}>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                {index === 0 ? 'Bugün' : 
                                                 index === 1 ? 'Yarın' : 
                                                 day.day.slice(0, 3)}
                                            </Typography>
                                            <Box sx={{ 
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                my: 1
                                            }}>
                                                {weatherTypes[day.type].icon}
                                            </Box>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                                    {day.high}°
                                                </Typography>
                                                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                                    {day.low}°
                                                </Typography>
                                            </Box>
                                        </WeatherCard>
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

                {/* Yaklaşan Etkinlikler */}
                <Grid item xs={12}>
                    <Card sx={{ 
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        p: 3
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 3 
                        }}>
                            <Typography variant="h6" sx={{ 
                                fontWeight: 700,
                                color: '#1a237e',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <NotificationsIcon />
                                Yaklaşan Etkinlikler
                            </Typography>
                            <Button 
                                variant="outlined" 
                                color="primary"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/events')}
                            >
                                Tümünü Gör
                            </Button>
                        </Box>

                        {/* Event List */}
                        <Box>
                            {sliderItems.map((item, index) => (
                                <EventListItem key={index} color={item.category.color}>
                                    <Grid container alignItems="center" spacing={2}>
                                        <Grid item>
                                            <Avatar sx={{ 
                                                bgcolor: `${item.category.color}15`,
                                                color: item.category.color,
                                                width: 48,
                                                height: 48
                                            }}>
                                                {item.category.icon}
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ 
                                                        fontWeight: 600,
                                                        color: '#1a237e',
                                                        mb: 0.5
                                                    }}>
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ 
                                                        color: '#666',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}>
                                                        <AccessTimeIcon sx={{ fontSize: 16 }} />
                                                        {item.date}
                                                    </Typography>
                                                </Box>
                                                <AvatarGroup>
                                                    {[...Array(3)].map((_, i) => (
                                                        <Avatar
                                                            key={i}
                                                            src={`https://i.pravatar.cc/150?img=${index * 3 + i + 1}`}
                                                            sx={{ 
                                                                width: 32, 
                                                                height: 32,
                                                                border: '2px solid #fff'
                                                            }}
                                                        />
                                                    ))}
                                                </AvatarGroup>
                                            </Box>
                                            <Typography variant="body2" sx={{ 
                                                mt: 1,
                                                color: '#666'
                                            }}>
                                                {item.description}
                                            </Typography>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 1,
                                                mt: 2
                                            }}>
                                                <Chip
                                                    label={item.category.name}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: `${item.category.color}15`,
                                                        color: item.category.color,
                                                        fontWeight: 600
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{ 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    color: '#666'
                                                }}>
                                                    {item.stats.label}: <strong>{item.stats.value}</strong>
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </EventListItem>
                            ))}
                        </Box>
                    </Card>
                </Grid>

                {/* Haberler Grid */}
                <Grid container item xs={12} spacing={3}>
                    {Object.entries(posts).map(([category, categoryPosts]) => (
                        <Grid item xs={12} key={category}>
                            {renderSectionBanner(category)}
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
            </Grid>
        </Box>
    );
};

export default Dashboard; 