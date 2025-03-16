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
    Stack,
    Button,
    TextField,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Meal, Post } from '../../types';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const Dashboard: React.FC = () => {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [posts, setPosts] = useState<{[key: string]: Post[]}>({
        isg: [],
        environment: [],
        quality: [],
        general: [],
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    });
    const [registerError, setRegisterError] = useState('');

    // Dummy posts data
    const dummyPosts = useMemo(() => ({
        isg: [
            {
                id: 1,
                title: "İş Güvenliği Eğitimlerimiz Tamamlandı",
                content: "Tüm departmanlarımızda 2024 yılı ilk çeyrek İSG eğitimleri başarıyla tamamlandı. Çalışanlarımızın %100 katılımı ile gerçekleşen eğitimlerde yeni güvenlik protokolleri ve acil durum prosedürleri detaylı olarak aktarıldı.",
                image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86",
                created_at: "2024-03-15T09:00:00",
                author: {
                    name: "Ahmet Yılmaz",
                    avatar: "https://i.pravatar.cc/150?img=1"
                },
                category: "isg",
                tags: ["Eğitim", "İSG", "Güvenlik"],
                read_time: "5 dk"
            },
            {
                id: 2,
                title: "Yeni İSG Ekipmanları Teslim Alındı",
                content: "Fabrikamız için sipariş edilen yeni nesil koruyucu ekipmanlar teslim alındı. Bu ekipmanlar en son teknoloji ile üretilmiş olup, çalışanlarımıza maksimum koruma sağlayacak şekilde tasarlanmıştır.",
                image: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4",
                created_at: "2024-03-14T14:30:00",
                author: {
                    name: "Mehmet Demir",
                    avatar: "https://i.pravatar.cc/150?img=2"
                },
                category: "isg",
                tags: ["Ekipman", "Güvenlik", "Yenilik"],
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

    // Dummy meals data
    const dummyMeals = [
        {
            id: 1,
            meal_type: 'breakfast' as const,
            menu: "• Zengin Açık Büfe Kahvaltı\n• Simit ve Poğaça Çeşitleri\n• Taze Demlenmiş Çay\n• Filtre Kahve\n• Meyve Suyu Çeşitleri",
            created_at: "2024-03-15T06:00:00"
        },
        {
            id: 2,
            meal_type: 'lunch' as const,
            menu: "• Mercimek Çorbası\n• Izgara Köfte\n• Pirinç Pilavı\n• Mevsim Salata\n• Cacık\n• Baklava\n• Meyve Suyu",
            created_at: "2024-03-15T11:00:00"
        },
        {
            id: 3,
            meal_type: 'dinner' as const,
            menu: "• Ezogelin Çorbası\n• Fırın Tavuk\n• Sebzeli Bulgur Pilavı\n• Karışık Salata\n• Yoğurt\n• Sütlaç\n• Ayran",
            created_at: "2024-03-15T17:00:00"
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
        setMeals(dummyMeals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            setIsLoggedIn(true);
        }
    };

    const handleRegister = () => {
        if (!registerData.username || !registerData.password || !registerData.email) {
            setRegisterError('Lütfen tüm alanları doldurun.');
            return;
        }
        if (registerData.password !== registerData.confirmPassword) {
            setRegisterError('Şifreler eşleşmiyor.');
            return;
        }
        if (registerData.password.length < 6) {
            setRegisterError('Şifre en az 6 karakter olmalıdır.');
            return;
        }
        // Burada gerçek kayıt işlemi yapılacak
        setRegisterError('');
        setIsRegisterOpen(false);
        // Otomatik giriş yap
        setUsername(registerData.username);
        setPassword(registerData.password);
        setIsLoggedIn(true);
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
                            <Button
                                variant="outlined"
                                onClick={() => setIsRegisterOpen(true)}
                                sx={{
                                    borderColor: '#1a237e',
                                    color: '#1a237e',
                                    '&:hover': {
                                        borderColor: '#0d47a1',
                                        bgcolor: 'rgba(26, 35, 126, 0.04)',
                                    },
                                    borderRadius: 2,
                                }}
                            >
                                Kayıt Ol
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

            {/* Register Dialog */}
            <Dialog 
                open={isRegisterOpen} 
                onClose={() => setIsRegisterOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ 
                    bgcolor: '#1a237e', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <PersonIcon />
                    Yeni Kullanıcı Kaydı
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {registerError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {registerError}
                        </Alert>
                    )}
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Kullanıcı Adı"
                            value={registerData.username}
                            onChange={(e) => setRegisterData({
                                ...registerData,
                                username: e.target.value
                            })}
                        />
                        <TextField
                            fullWidth
                            label="E-posta"
                            type="email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({
                                ...registerData,
                                email: e.target.value
                            })}
                        />
                        <TextField
                            fullWidth
                            label="Şifre"
                            type="password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({
                                ...registerData,
                                password: e.target.value
                            })}
                            helperText="En az 6 karakter olmalıdır"
                        />
                        <TextField
                            fullWidth
                            label="Şifre Tekrar"
                            type="password"
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({
                                ...registerData,
                                confirmPassword: e.target.value
                            })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: '#f8f9fc' }}>
                    <Button 
                        onClick={() => setIsRegisterOpen(false)}
                        sx={{ color: '#666' }}
                    >
                        İptal
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleRegister}
                        sx={{
                            bgcolor: '#1a237e',
                            '&:hover': {
                                bgcolor: '#0d47a1',
                            },
                        }}
                    >
                        Kayıt Ol
                    </Button>
                </DialogActions>
            </Dialog>

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
                                    <Button 
                                        variant="contained" 
                                        sx={{ 
                                            bgcolor: '#f50057',
                                            '&:hover': {
                                                bgcolor: '#c51162'
                                            }
                                        }}
                                        endIcon={<ArrowForwardIcon />}
                                    >
                                        Detayları Gör
                                    </Button>
                                </SliderContent>
                            </SliderCard>
                        </div>
                    ))}
                </Slider>
            </Box>

            {/* Ana Grid Container */}
            <Grid container spacing={3}>
                {/* Hava Durumu ve Yemek Menüsü Grid */}
                <Grid container item xs={12} spacing={3}>
                    {/* Hava Durumu Bölümü */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ 
                                    fontWeight: 700,
                                    mb: 3,
                                    color: '#1a237e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <WbSunnyIcon sx={{ color: '#ffb74d' }} />
                                    24 Saatlik Hava Durumu
                                </Typography>
                                <Grid container spacing={2}>
                                    {[...Array(8)].map((_, index) => (
                                        <Grid item xs={3} key={index}>
                                            <Card sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                boxShadow: 'none',
                                                border: '1px solid #eee',
                                                borderRadius: 2,
                                                '&:hover': {
                                                    borderColor: '#1a237e',
                                                }
                                            }}>
                                                <WbSunnyIcon sx={{ color: '#ffb74d', mb: 1 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {22 + index}°C
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {`${12 + index}:00`}
                                                </Typography>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card sx={{ 
                            borderRadius: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ 
                                    fontWeight: 700,
                                    mb: 3,
                                    color: '#1a237e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <WbSunnyIcon sx={{ color: '#ffb74d' }} />
                                    Haftalık Hava Durumu
                                </Typography>
                                <Grid container spacing={2}>
                                    {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day, index) => (
                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                            <Card sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                boxShadow: 'none',
                                                border: '1px solid #eee',
                                                borderRadius: 2,
                                                '&:hover': {
                                                    borderColor: '#1a237e',
                                                }
                                            }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
                                                    {day}
                                                </Typography>
                                                <WbSunnyIcon sx={{ color: '#ffb74d', mb: 1 }} />
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {20 + index}°C
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {15 + index}°C
                                                    </Typography>
                                                </Box>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Yemek Menüsü Bölümü */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ 
                            height: '100%',
                            borderRadius: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ 
                                    fontWeight: 700,
                                    mb: 3,
                                    color: '#1a237e',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <RestaurantIcon />
                                    GÜNÜN MENÜSÜ
                                </Typography>
                                <Stack spacing={3}>
                                    {meals.map((meal) => (
                                        <Card key={meal.id} sx={{
                                            boxShadow: 'none',
                                            border: '1px solid #eee',
                                            borderRadius: 2,
                                            '&:hover': {
                                                borderColor: '#1a237e',
                                            }
                                        }}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography variant="subtitle1" sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 2,
                                                    color: '#1a237e',
                                                    borderBottom: '1px solid #eee',
                                                    pb: 1
                                                }}>
                                                    {meal.meal_type === 'breakfast' ? 'Kahvaltı' :
                                                     meal.meal_type === 'lunch' ? 'Öğle Yemeği' : 'Akşam Yemeği'}
                                                </Typography>
                                                <Typography sx={{ 
                                                    whiteSpace: 'pre-line',
                                                    color: '#424242',
                                                    fontSize: '0.9rem',
                                                    lineHeight: 1.6
                                                }}>
                                                    {meal.menu}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Haberler Grid */}
                <Grid container item xs={12} spacing={3}>
                    {Object.entries(posts).map(([category, categoryPosts]) => (
                        <Grid item xs={12} md={6} lg={3} key={category}>
                            <SectionTitle>
                                {category === 'isg' ? 'İSG HABERLERİ' :
                                 category === 'environment' ? 'ÇEVRE BÜLTENİ' :
                                 category === 'quality' ? 'KALİTE KÖŞESİ' : 'GENEL DUYURULAR'}
                            </SectionTitle>
                            <Stack spacing={3}>
                                {categoryPosts.map((post: Post) => (
                                    <NewsCard key={post.id}>
                                        {post.image && (
                                            <CardMedia
                                                component="img"
                                                height="200"
                                                image={post.image}
                                                alt={post.title}
                                                sx={{ 
                                                    objectFit: 'cover',
                                                    borderBottom: '1px solid #eee'
                                                }}
                                            />
                                        )}
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                                                fontSize: '1.1rem',
                                                mb: 2,
                                                lineHeight: 1.3,
                                                color: '#1a237e'
                                            }}>
                                                {post.title}
                                            </Typography>
                                            <Typography sx={{
                                                color: '#424242',
                                                fontSize: '0.9rem',
                                                lineHeight: 1.6,
                                                mb: 2
                                            }}>
                                                {post.content}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
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
                                ))}
                            </Stack>
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