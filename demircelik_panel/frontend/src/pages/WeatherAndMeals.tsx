import React, { useState } from 'react';
import { 
    Box, 
    Grid, 
    Typography, 
    Card, 
    CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloudIcon from '@mui/icons-material/Cloud';
import UmbrellaIcon from '@mui/icons-material/BeachAccess';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MainLayout from '../components/layout/MainLayout';

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';

type WeatherTypes = {
    [key in WeatherType]: {
        icon: JSX.Element;
        gradient: string;
        overlay: string;
        text: string;
    }
}

type HourlyWeather = {
    time: string;
    temp: number;
    type: WeatherType;
}

type DailyWeather = {
    day: string;
    high: number;
    low: number;
    type: WeatherType;
}

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

const WeatherAndMeals = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

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

    return (
        <MainLayout>
            <Box sx={{ bgcolor: '#f8f9fc', minHeight: '100vh', p: 3 }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#1a237e' }}>
                    Hava Durumu ve Yemek Menüsü
                </Typography>

                <Grid container spacing={3}>
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
            </Box>
        </MainLayout>
    );
};

export default WeatherAndMeals; 