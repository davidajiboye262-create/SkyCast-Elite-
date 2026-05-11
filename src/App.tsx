/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Wind, 
  Droplets, 
  Gauge, 
  MapPin, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  CloudFog,
  AlertCircle,
  Thermometer
} from 'lucide-react';
import { WeatherData, ForecastData } from './types';

const API_KEY = '0d39d85e02c81695f271a253db092ae4';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (cityName: string) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`)
      ]);

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error('City not found. Please try again.');
      }

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (id: number, size: number = 64) => {
    if (id === 800) return <Sun size={size} className="text-white" />;
    if (id >= 200 && id < 300) return <CloudLightning size={size} className="text-white" />;
    if (id >= 300 && id < 600) return <CloudRain size={size} className="text-white" />;
    if (id >= 600 && id < 700) return <Snowflake size={size} className="text-white" />;
    if (id >= 700 && id < 800) return <CloudFog size={size} className="text-white" />;
    if (id > 800) return <Cloud size={size} className="text-white" />;
    return <Sun size={size} className="text-white" />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  useEffect(() => {
    fetchWeather('Geneva');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-20 bg-[#050505] selection:bg-accent selection:text-black">
      {/* Background radial accent */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-4xl z-10">
        {/* Header / Search */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="dot" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-60">Real-time Satellite Feed</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl italic leading-tight">
              {weather ? `${weather.name}, ${weather.sys.country}` : 'SkyCast Elite'}
            </h1>
            <p className="text-xs opacity-40 uppercase tracking-[0.25em]">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </motion.div>

          <motion.form 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onSubmit={handleSubmit} 
            className="w-full md:w-80 relative group"
          >
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search destination..."
              className="w-full bg-white/[0.03] border border-white/[0.08] py-3 px-5 pr-12 rounded-full outline-none focus:border-accent/40 focus:bg-white/[0.05] transition-all text-sm tracking-wide placeholder:text-white/20"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-accent transition-colors"
            >
              <Search size={18} />
            </button>
          </motion.form>
        </header>

        {/* Status Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-6 rounded-3xl flex items-center gap-4 text-accent border-accent/20"
              >
                <AlertCircle size={24} />
                <p className="font-medium tracking-wide">{error}</p>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                className="flex items-center justify-center py-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-12 h-12 border-2 border-white/5 border-t-accent rounded-full"
                />
              </motion.div>
            ) : weather && (
              <motion.div
                key={weather.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="space-y-12"
              >
                {/* Main Temperature Hero */}
                <div className="flex items-end gap-12">
                  <div className="relative">
                    <span className="font-serif text-[120px] md:text-[200px] leading-none tracking-tighter">
                      {Math.round(weather.main.temp)}°
                    </span>
                    <motion.div 
                      className="absolute -top-4 -right-8 md:-right-12 h-12 w-12 md:h-16 md:w-16 glass rounded-full flex items-center justify-center"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                      {getWeatherIcon(weather.weather[0].id)}
                    </motion.div>
                  </div>
                  <div className="pb-4 md:pb-8 space-y-2">
                    <h2 className="text-xl md:text-3xl font-light tracking-[0.15em] uppercase opacity-90">
                      {weather.weather[0].description}
                    </h2>
                    <div className="flex gap-6 text-sm opacity-40 font-medium tracking-widest">
                      <span className="flex items-center gap-1.5 uppercase italic">H {Math.ceil(weather.main.temp + 2)}°</span>
                      <span className="flex items-center gap-1.5 uppercase italic">L {Math.floor(weather.main.temp - 2)}°</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="glass rounded-[2rem] overflow-hidden grid grid-cols-2 md:grid-cols-4">
                  <StatCard 
                    label="Humidity" 
                    value={`${weather.main.humidity}%`} 
                    subValue={weather.main.humidity > 60 ? "High density" : "Moderate density"}
                  />
                  <StatCard 
                    label="Wind Speed" 
                    value={`${weather.wind.speed} m/s`} 
                    subValue="Northwest Flow"
                  />
                  <StatCard 
                    label="Feels Like" 
                    value={`${Math.round(weather.main.feels_like)}°`} 
                    subValue="Atmospheric Adjust"
                  />
                  <StatCard 
                    label="Pressure" 
                    value={`${weather.main.pressure}`} 
                    subValue="hPa / Stable"
                    isLast
                  />
                </div>

                {/* 5-Day Forecast */}
                {forecast && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-[11px] uppercase tracking-[0.25em] font-semibold opacity-60 ml-4">Extended Perspective</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                      {forecast.list
                        .filter((item) => item.dt_txt.includes('12:00:00'))
                        .map((day, idx) => (
                          <motion.div
                            key={day.dt}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="glass min-w-[140px] p-6 rounded-[2rem] flex flex-col items-center gap-4 hover:bg-white/[0.05] transition-colors"
                          >
                            <span className="text-xs font-medium opacity-40">
                              {new Date(day.dt * 1000).toLocaleDateString('en-GB', { weekday: 'short' })}
                            </span>
                            <div className="text-white/80">
                              {getWeatherIcon(day.weather[0].id, 32)}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-serif text-2xl">{Math.round(day.main.temp)}°</span>
                              <span className="text-[9px] uppercase tracking-wider opacity-30 font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                {day.weather[0].main}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <footer className="mt-auto py-12 flex flex-col items-center gap-4 opacity-20">
        <div className="divider w-40" />
        <p className="text-[10px] uppercase tracking-[0.3em] font-medium">SkyCast Elite Integrated Feed</p>
      </footer>
    </div>
  );
}

function StatCard({ label, value, subValue, isLast }: { label: string, value: string, subValue: string, isLast?: boolean }) {
  return (
    <div className={`p-8 border-white/[0.03] ${!isLast ? 'border-r' : ''}`}>
      <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-30 mb-3">{label}</p>
      <p className="font-serif text-3xl mb-2">{value}</p>
      <p className="text-[9px] uppercase tracking-[0.1em] opacity-40 font-semibold">{subValue}</p>
    </div>
  );
}
