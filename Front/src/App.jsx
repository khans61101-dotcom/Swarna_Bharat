import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  Calendar, 
  Clock, 
  Video, 
  Newspaper, 
  Search,
  ExternalLink,
  User,
  LogIn,
  Sun,
  Moon,
  Heart,
  BookOpen,
  Award,
  Users,
  Shield,
  Palette,
  Trees,
  Building2,
  Quote,
  MapPin,
  Languages,
  Image
} from 'lucide-react';

import AboutPage from './pages/About';
import NewsPage from './pages/News';
import VideosPage from './pages/Videos';
import EnquiryPage from './pages/Enquiry';
import AuthPage from './pages/Auth';
import DownloadAppPage from './pages/DownloadApp';
import EventsPage from './pages/Events';
import GalleryPage from './pages/Gallery';
import PartnersPage from './pages/Partners';
import logoImg from './assets/logo.jpg';
import { useLang } from './LanguageContext';
import { API_URL, getMediaUrl } from './config';

import ProfileDetails from "./pages/ProfileDetails";
import Dashboard from "./pages/Dashboard";
import SectorPage from "./pages/SectorPage";
import { sectorDataList } from './data/sectorData';

const bannerBgs = [
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80'
];

const getPillarIcons = () => [
  { borderColor: '#E11D48', icon: <Sun size={26} color="#E11D48" /> },
  { borderColor: '#16A34A', icon: <Heart size={26} color="#16A34A" /> },
  { borderColor: '#DC2626', icon: <BookOpen size={26} color="#DC2626" /> },
  { borderColor: '#0284C7', icon: <Award size={26} color="#0284C7" /> },
  { borderColor: '#EA580C', icon: <Users size={26} color="#EA580C" /> },
  { borderColor: '#0369A1', icon: <Shield size={26} color="#0369A1" /> },
  { borderColor: '#D97706', icon: <Palette size={26} color="#D97706" /> },
  { borderColor: '#15803D', icon: <Trees size={26} color="#15803D" /> },
  { borderColor: '#F59E0B', icon: <Building2 size={26} color="#F59E0B" /> },
];

const eventImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80',
];

const eventLocations = [
  'Bharat Mandapam, Pragati Maidan, New Delhi',
  'United Nations Headquarters, New York',
  'Amrit Udyan & Vigyan Bhawan, New Delhi',
];

const eventDates = [
  { day: '07 & 08', month: 'FEB', year: '2026' },
  { day: '24', month: 'SEP', year: '2025' },
  { day: '25', month: 'SEP', year: '2024' },
];

const homeVideosList = [
  {
    id: 'vid1',
    youtubeId: 'gCNeDWCI0BA',
    videoUrl: 'https://www.youtube.com/@%E0%A4%B5%E0%A4%BF%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%97%E0%A5%81%E0%A4%B0%E0%A5%81%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%E0%A4%85%E0%A4%AB%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%A8',
    title: 'पंडित प्रदीप मिश्रा जी का विश्वगुरु भारत अभियान हेतु संदेश 🚩',
    titleHi: 'पंडित प्रदीप मिश्रा जी का विश्वगुरु भारत अभियान हेतु संदेश 🚩',
    category: 'महाउद्घोष दिवस',
    categoryHi: 'महाउद्घोष दिवस',
    date: '4 months ago',
    duration: '08:45',
    thumb: 'https://images.unsplash.com/photo-1545232979-fbf4dce93198?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vid2',
    youtubeId: 'kJQP7kiw5Fk',
    videoUrl: 'https://www.youtube.com/@%E0%A4%B5%E0%A4%BF%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%97%E0%A5%81%E0%A4%B0%E0%A5%81%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%E0%A4%85%E0%A4%AB%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%A8',
    title: 'विश्वगुरु भारत अभियान - राष्ट्र निर्माण और युवा जागृति 🚩',
    titleHi: 'विश्वगुरु भारत अभियान - राष्ट्र निर्माण और युवा जागृति 🚩',
    category: 'विश्वगुरु भारत',
    categoryHi: 'विश्वगुरु भारत',
    date: '4 months ago',
    duration: '06:13',
    thumb: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vid3',
    youtubeId: 'tgbNymZ7vqY',
    videoUrl: 'https://www.youtube.com/@%E0%A4%B5%E0%A4%BF%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%97%E0%A5%81%E0%A4%B0%E0%A5%81%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%E0%A4%85%E0%A4%AB%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%A8',
    title: 'परम पूज्य महाराज जी का विश्वगुरु भारत अभियान पर अमृत वाणी 🚩',
    titleHi: 'परम पूज्य महाराज जी का विश्वगुरु भारत अभियान पर अमृत वाणी 🚩',
    category: 'अमृत वाणी',
    categoryHi: 'अमृत वाणी',
    date: '4 months ago',
    duration: '12:30',
    thumb: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vid4',
    youtubeId: 'L_LUpnjgPso',
    videoUrl: 'https://www.youtube.com/@%E0%A4%B5%E0%A4%BF%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%97%E0%A5%81%E0%A4%B0%E0%A5%81%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%E0%A4%85%E0%A4%AB%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%A8',
    title: 'बाल संस्कार एवं मातृ-पितृ पूजन दिवस - विश्वगुरु भारत अभियान 🚩',
    titleHi: 'बाल संस्कार एवं मातृ-पितृ पूजन दिवस - विश्वगुरु भारत अभियान 🚩',
    category: 'बाल संस्कार',
    categoryHi: 'बाल संस्कार',
    date: '3 months ago',
    duration: '15:20',
    thumb: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vid5',
    youtubeId: 'V-_O7nl0IiU',
    videoUrl: 'https://www.youtube.com/@%E0%A4%B5%E0%A4%BF%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%97%E0%A5%81%E0%A4%B0%E0%A5%81%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%E0%A4%85%E0%A4%AB%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%A8',
    title: 'सनातन संस्कृति एवं अखंड भारत संकल्प - विश्वगुरु भारत अभियान 🚩',
    titleHi: 'सनातन संस्कृति एवं अखंड भारत संकल्प - विश्वगुरु भारत अभियान 🚩',
    category: 'सनातन गौरव',
    categoryHi: 'सनातन गौरव',
    date: '3 months ago',
    duration: '18:45',
    thumb: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80'
  }
];

const homeNewsData = [
  {
    id: 1,
    title: 'PM Modi welcomes record FDI inflows, attributes growth to policy stability & reforms',
    titleHi: 'PM मोदी ने रिकॉर्ड FDI प्रवाह का स्वागत किया, विकास का श्रेय नीति स्थिरता और सुधारों को दिया',
    date: 'JULY 25, 2026',
    snippet: 'India continues to emerge as a premier global manufacturing and technology hub driven by Ease of Doing Business initiatives.',
    snippetHi: 'भारत व्यापार सुगमता पहलों द्वारा संचालित एक प्रमुख वैश्विक विनिर्माण और प्रौद्योगिकी केंद्र के रूप में उभरता रहा है।',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'PM launches PM-DevINE projects aimed at holistic development in North Eastern region',
    titleHi: 'PM ने पूर्वोत्तर क्षेत्र के समग्र विकास के लिए PM-DevINE परियोजनाएं लॉन्च कीं',
    date: 'JULY 24, 2026',
    snippet: 'Multiple connectivity, healthcare, and educational institutions dedicated to the nation to empower local youth.',
    snippetHi: 'स्थानीय युवाओं को सशक्त बनाने के लिए राष्ट्र को समर्पित कई कनेक्टिविटी, स्वास्थ्य सेवा और शैक्षणिक संस्थान।',
    image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=600&q=80'
  }
];

const storyImages = [
  'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
];

export default function App() {
  const { lang, toggleLang, t } = useLang();

  const [activeTab, setActiveTab] = useState('Home');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedSector, setSelectedSector] = useState('rural');

  const sectorIds = ['rural', 'health', 'education', 'sports', 'women', 'disaster', 'arts', 'environment', 'urban'];

  const [authMode, setAuthMode] = useState('login');
  const [userState, setUserState] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(homeVideosList[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [heroSettings, setHeroSettings] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/hero`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d && d.hero) {
          setHeroSettings(d.hero);
        }
      })
      .catch(e => console.error('Error fetching hero settings:', e));
  }, []);

  const demoVideo = 'https://assets.mixkit.co/videos/preview/mixkit-flag-of-india-waving-in-the-wind-41551-large.mp4';
  const heroVideoSrc = heroSettings && heroSettings.video_url
    ? (heroSettings.video_url.startsWith('http') ? heroSettings.video_url : getMediaUrl(heroSettings.video_url))
    : demoVideo;

  const heroBadge = lang === 'en'
    ? (heroSettings?.badge_text || '🚩 Vishwaguru Bharat Abhiyan')
    : (heroSettings?.badge_text_hi || heroSettings?.badge_text || '🚩 विश्वगुरु भारत अभियान');

  const heroTitle = lang === 'en'
    ? (heroSettings?.title || 'Rebuilding Golden Bharat with Youth Power & Cultural Revival')
    : (heroSettings?.title_hi || heroSettings?.title || 'विश्वगुरु भारत अभियान - राष्ट्र निर्माण और युवा जागृति का महाअभियान 🚩');

  const heroSubtitle = lang === 'en'
    ? (heroSettings?.subtitle || 'Empowerment through education, heritage, wellness, and national development across all sectors.')
    : (heroSettings?.subtitle_hi || heroSettings?.subtitle || 'शिक्षा, संस्कृति, ग्राम विकास और युवा शक्ति के माध्यम से भारत को पुनः विश्वगुरु बनाने का संकल्प।');

  const heroBtn1Text = heroSettings?.btn1_text
    ? heroSettings.btn1_text
    : (lang === 'en' ? 'Explore News' : 'समाचार देखें');
  const heroBtn1Link = heroSettings?.btn1_link || 'News';

  const heroBtn2Text = heroSettings?.btn2_text
    ? heroSettings.btn2_text
    : (lang === 'en' ? 'Watch Videos' : 'वीडियो देखें');
  const heroBtn2Link = heroSettings?.btn2_link || 'Videos';

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % t.slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + t.slides.length) % t.slides.length);

  const pillarIcons = getPillarIcons();

  return (
    <div className="app-main">
      {/* Top utility bar */}
      <div className="top-bar">
        <div>{t.topBar}</div>
        <div className="top-bar-links">
          <span>{t.skipContent}</span> |
          <span onClick={toggleLang} style={{ cursor: 'pointer', color: '#FF9933', fontWeight: 700 }}>
            {t.langToggle}
          </span> |
          <span>{t.accessibility}</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="main-header">
        <div className="header-container">
          <div className="logo-section" onClick={() => setActiveTab('Home')} style={{ cursor: 'pointer' }}>
            <img 
              src={logoImg} 
              alt="Swarna India Logo" 
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(255, 153, 51, 0.4)',
                border: '2px solid #FF9933'
              }} 
            />
            <div className="logo-title">
              <h1>Swarna Bharat</h1> 
              {/* <span>{lang === 'en' ? 'Welcome to Swarna Bharat' : 'सुवार्ड इंडिया में आपका स्वागत है'}</span> */}
            </div>
          </div> 

          <nav>
            <ul className="nav-menu">
              {[
                { key: 'Home',        label: t.nav.home },
                { key: 'About',       label: t.nav.about },
                { key: 'News',        label: t.nav.news },
                { key: 'Events',      label: t.nav.events },
              ].map(({ key, label }) => (
                <li
                  key={key}
                  className={`nav-link ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </li>
              ))}

              {/* SECTORS DROPDOWN */}
              <li
                className={`nav-link ${activeTab === 'SectorDetails' ? 'active' : ''}`}
                style={{ position: 'relative' }}
                onMouseEnter={(e) => { const dd = e.currentTarget.querySelector('.sectors-dropdown'); if (dd) dd.style.display = 'block'; }}
                onMouseLeave={(e) => { const dd = e.currentTarget.querySelector('.sectors-dropdown'); if (dd) dd.style.display = 'none'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  {lang === 'en' ? 'Sectors' : 'क्षेत्र'} <ChevronDown size={14} />
                </span>
                <div className="sectors-dropdown" style={{
                  display: 'none',
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  minWidth: '220px',
                  padding: '8px 0',
                  zIndex: 1001,
                  marginTop: '8px'
                }}>
                  {sectorDataList.map((sec) => (
                    <div
                      key={sec.id}
                      onClick={() => {
                        setSelectedSector(sec.id);
                        setActiveTab('SectorDetails');
                      }}
                      style={{
                        padding: '10px 18px',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: selectedSector === sec.id && activeTab === 'SectorDetails' ? 700 : 500,
                        color: selectedSector === sec.id && activeTab === 'SectorDetails' ? sec.borderColor : 'var(--text-dark)',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-alt)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {lang === 'en' ? sec.name : sec.nameHi}
                    </div>
                  ))}
                </div>
              </li>

              {/* MEDIA DROPDOWN: Videos + Gallery */}
              <li
                className={`nav-link ${activeTab === 'Videos' || activeTab === 'Gallery' ? 'active' : ''}`}
                style={{ position: 'relative' }}
                onMouseEnter={(e) => { const dd = e.currentTarget.querySelector('.media-dropdown'); if (dd) dd.style.display = 'block'; }}
                onMouseLeave={(e) => { const dd = e.currentTarget.querySelector('.media-dropdown'); if (dd) dd.style.display = 'none'; }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  {lang === 'en' ? 'Media' : 'मीडिया'} <ChevronDown size={14} />
                </span>
                <div className="media-dropdown" style={{
                  display: 'none',
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '10px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  minWidth: '190px',
                  padding: '8px 0',
                  zIndex: 1001,
                  marginTop: '8px'
                }}>
                  <div
                    onClick={() => setActiveTab('Videos')}
                    style={{
                      padding: '10px 20px',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      cursor: 'pointer',
                      color: activeTab === 'Videos' ? '#FF9933' : 'var(--text-dark)',
                      fontWeight: activeTab === 'Videos' ? 700 : 500,
                      fontSize: '0.9rem',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-alt)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Video size={16} /> {t.nav.videos}
                  </div>
                  <div
                    onClick={() => setActiveTab('Gallery')}
                    style={{
                      padding: '10px 20px',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      cursor: 'pointer',
                      color: activeTab === 'Gallery' ? '#FF9933' : 'var(--text-dark)',
                      fontWeight: activeTab === 'Gallery' ? 700 : 500,
                      fontSize: '0.9rem',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-alt)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Image size={16} /> {lang === 'en' ? 'Gallery' : 'गैलरी'}
                  </div>
                </div>
              </li>

              {[
                { key: 'Enquiry',     label: t.nav.enquiry },
                { key: 'Partners',    label: t.nav.partners || 'Partners' },
                { key: 'DownloadApp', label: t.nav.downloadApp },
                { key: userState || localStorage.getItem('userToken') ? 'Dashboard' : 'Auth', label: userState || localStorage.getItem('userToken') ? 'Dashboard' : t.nav.loginRegister },
              ].map(({ key, label }) => (
                <li
                  key={key}
                  className={`nav-link ${activeTab === key ? 'active' : ''}`}
                  onClick={() => { if (key === 'Auth') setAuthMode('login'); setActiveTab(key); }}
                >
                  {label}
                </li>
              ))}
            </ul>
          </nav>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}> 
            {/* <Search size={20} style={{ cursor: 'pointer', color: 'var(--nav-text)' }} /> */}

            {/* Language Toggle Button */}
               

            {/* Dark Mode Toggle Button */}
            <button
              className="theme-toggle-btn"
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
              >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Dynamic View Content */}
      {activeTab === 'About'       && <AboutPage />}
      {activeTab === 'News'        && <NewsPage />}
      {activeTab === 'Events'      && <EventsPage />}
      {activeTab === 'Videos'      && <VideosPage />}
      {activeTab === 'Gallery'     && <GalleryPage />}
      {activeTab === 'Enquiry'     && <EnquiryPage />}
      {activeTab === "Partners" && (
  <PartnersPage
    setActiveTab={setActiveTab}
    setSelectedPartner={setSelectedPartner}
  />
)}  
{activeTab === "PartnerDetails" && (
  <ProfileDetails
    partner={selectedPartner}
    setActiveTab={setActiveTab}
  />
)}
{activeTab === "SectorDetails" && (
  <SectorPage
    initialSectorId={selectedSector}
    setActiveTab={setActiveTab}
  />
)}

      {activeTab === 'DownloadApp' && <DownloadAppPage />}
      {activeTab === 'Auth'        && <AuthPage initialMode={authMode} onAuthSuccess={(name) => { setUserState(name); setActiveTab('Dashboard'); }} />}
      {activeTab === 'Dashboard'   && <Dashboard setActiveTab={setActiveTab} setUserState={setUserState} />}

      {activeTab === 'Home' && (
        <>
          {/* Dynamic Hero Video Banner Section */}
          <section className="banner-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '540px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              key={heroVideoSrc}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'translate(-50%, -50%)',
                zIndex: 0
              }}
              src={heroVideoSrc}
            />
            <div className="banner-overlay" style={{ background: 'linear-gradient(180deg, rgba(11, 43, 74, 0.75) 0%, rgba(11, 43, 74, 0.88) 100%)', zIndex: 1 }}></div>

            <div className="section-container banner-content" style={{ position: 'relative', zIndex: 2, padding: '60px 20px', textAlign: 'center', maxWidth: '920px', margin: '0 auto', color: '#FFF' }}>
              <span className="banner-tag" style={{ background: 'rgba(255, 153, 51, 0.25)', color: '#FF9933', border: '1px solid rgba(255, 153, 51, 0.5)', padding: '6px 20px', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', display: 'inline-block', marginBottom: '18px' }}>
                {heroBadge}
              </span>
              <h2 className="banner-title" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '18px', textShadow: '0 4px 20px rgba(0,0,0,0.5)', color: '#FFFFFF' }}>
                {heroTitle}
              </h2>
              <p className="banner-desc" style={{ fontSize: '1.1rem', color: '#E2E8F0', maxWidth: '780px', margin: '0 auto 30px', lineHeight: 1.6 }}>
                {heroSubtitle}
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => setActiveTab(heroBtn1Link)}
                  style={{ background: 'linear-gradient(135deg, #FF9933, #FF6B00)', color: '#FFF', border: 'none', padding: '14px 34px', borderRadius: '40px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 20px rgba(255, 153, 51, 0.4)' }}
                >
                  {heroBtn1Text} <ChevronRight size={18} />
                </button>

                {heroBtn2Text && (
                  <button 
                    onClick={() => setActiveTab(heroBtn2Link)}
                    style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FFF', border: '1px solid rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', padding: '14px 32px', borderRadius: '40px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Play size={18} /> {heroBtn2Text}
                  </button>
                )}
              </div>
            </div>
          </section>  

         <section className="overflow-hidden w-full bg-gray-100 py-3">
  <div className="animate-marquee whitespace-nowrap">
    Hello 👋 Welcome to our website • Best Software Development • AI Solutions • Web Development • Digital Marketing 🚀
  </div>
</section> 



          {/* Circular Icon Ribbon */}
          <section className="section-bg-faf7f2" style={{ background: '#FAF7F2', padding: '40px 20px', borderBottom: '1px solid #E5E0D8' }}>
            <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '25px 35px' }}>
              {t.pillars.map((title, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setSelectedSector(sectorIds[index] || 'rural');
                    setActiveTab('SectorDetails');
                  }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '115px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                >
                  <div style={{ width: '74px', height: '74px', borderRadius: '50%', border: `2px solid ${pillarIcons[index].borderColor}`, padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '10px' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: `1.5px solid ${pillarIcons[index].borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF' }}>
                      {pillarIcons[index].icon}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', lineHeight: '1.25', fontFamily: 'var(--font-heading)' }}>
                    {title}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Events Section */}
          <section className="section-bg-white" style={{ background: '#FFF' }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-title-wrap">
                  <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar color="#FF9933" size={28} /> {t.eventsSection}
                  </h2>
                </div>
                <span className="view-all-link" onClick={() => setActiveTab('Events')}>
                  {t.viewAllEvents} <ChevronRight size={16} />
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                {/* Featured Big Event Card */}
                <div className="dark-card" style={{ background: '#FFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '270px', position: 'relative', overflow: 'hidden' }}>
                    <img src={eventImages[0]} alt="event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '15px', left: '15px', background: '#FF9933', color: '#FFF', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {lang === 'en' ? 'National Conclave' : 'राष्ट्रीय सम्मेलन'}
                    </span>
                  </div>
                  <div style={{ padding: '25px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div className="dark-date-box" style={{ textAlign: 'center', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '10px 16px', borderRadius: '10px', minWidth: '85px', flexShrink: 0 }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase' }}>FEB</span>
                      <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: '1.1' }}>07 & 08</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>2026</span>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px', lineHeight: '1.3' }}>
                        {lang === 'en'
                          ? 'Building Flourishing Futures: National Conclave on Early Education & Youth Development'
                          : 'समृद्ध भविष्य का निर्माण: प्रारंभिक शिक्षा और युवा विकास पर राष्ट्रीय सम्मेलन'}
                      </h3>
                      <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '12px', lineHeight: '1.5' }}>
                        {lang === 'en'
                          ? 'Bringing together educationists, policymakers, and innovators to shape early childhood development and NEP implementation.'
                          : 'प्रारंभिक बाल विकास और एनईपी कार्यान्वयन को आकार देने के लिए शिक्षाविदों, नीति निर्माताओं और नवप्रवर्तकों को एक साथ लाना।'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF9933', fontSize: '0.82rem', fontWeight: 600 }}>
                        <MapPin size={15} /> {eventLocations[0]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Stacked Event Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[1, 2].map((i) => (
                    <div 
                      key={i}
                      className="dark-card"
                      style={{ background: '#FFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', transition: 'transform 0.3s ease', cursor: 'pointer' }}
                      onClick={() => setActiveTab('Events')}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                    >
                      <div style={{ padding: '20px', display: 'flex', gap: '15px' }}>
                        <div className="dark-date-box" style={{ textAlign: 'center', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '8px', height: 'fit-content', flexShrink: 0 }}>
                          <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#16A34A' }}>{eventDates[i].month}</span>
                          <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: '1' }}>{eventDates[i].day}</span>
                          <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B' }}>{eventDates[i].year}</span>
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px', lineHeight: '1.35' }}>
                            {i === 1
                              ? (lang === 'en' ? "India Day @ UNGA: Highlighting India's Leadership on SDGs, AI-Driven Development & Climate Action" : 'संयुक्त राष्ट्र महासभा में भारत दिवस: SDG, AI-संचालित विकास और जलवायु कार्रवाई में भारत के नेतृत्व को उजागर करना')
                              : (lang === 'en' ? 'Global Youth & Technology Forum: Crafting a Bold Vision for Sustainable Innovation' : 'वैश्विक युवा और प्रौद्योगिकी मंच: सतत नवाचार के लिए एक साहसिक दृष्टिकोण')}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', fontSize: '0.8rem' }}>
                            <MapPin size={14} color="#FF9933" /> {eventLocations[i]}
                          </div>
                        </div>
                      </div>
                      <div style={{ height: '100%', minHeight: '130px' }}>
                        <img src={eventImages[i]} alt="event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Impact Counter Bar */}
          <section className="impact-counter-bar">
            <div className="impact-counter-grid">
              {t.metrics.map((item, index) => (
                <div key={index} className="impact-counter-item">
                  <div className="impact-counter-number">{item.value}</div>
                  <div className="impact-counter-label">{item.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Ground Impact Stories Section */}
          <section className="section-bg-f8fafc" style={{ background: '#F8FAFC' }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-title-wrap">
                  <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Quote color="#FF9933" size={28} /> {t.impactSectionTitle}
                  </h2>
                </div>
                <span className="view-all-link" onClick={() => setActiveTab('News')}>
                  {t.viewAllImpact} <ChevronRight size={16} />
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                {t.stories.map((story, idx) => (
                  <div key={idx} className="story-card">
                    <div className="story-card-img">
                      <img src={storyImages[idx]} alt={story.title} />
                      <span className="story-tag">{story.tag}</span>
                    </div>
                    <div className="story-card-content">
                      <h3 className="story-title">{story.title}</h3>
                      <p className="story-quote">{story.quote}</p>
                      <a href="#" className="view-all-link" style={{ fontSize: '0.85rem' }} onClick={(e) => { e.preventDefault(); setActiveTab('News'); }}>
                        {story.readMore} <ChevronRight size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Video Section */}
          <section className="video-section-bg">
            <div className="section-container">
              <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div className="section-title-wrap">
                  <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Video color="#FF9933" size={28} /> {t.videoSectionTitle}
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <a 
                    href="https://www.youtube.com/@%E0%A4%B5%E0%A4%BF%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%97%E0%A5%81%E0%A4%B0%E0%A5%81%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%E0%A4%85%E0%A4%AD%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%A8"
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      background: '#FF0000',
                      color: '#FFF',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Video size={16} /> @विश्वगुरुभारतअभियान
                  </a>
                  <span className="view-all-link" style={{ color: '#FF9933', cursor: 'pointer' }} onClick={() => setActiveTab('Videos')}>
                    {t.viewAllVideos} <ExternalLink size={16} />
                  </span>
                </div>
              </div>

              {/* Main Featured Video Player */}
              <div className="featured-video-card">
                <div className="video-player-frame">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  ></iframe>
                </div>
                <div style={{ padding: '20px 25px', background: '#1A2238' }}>
                  <span className="video-card-category">{lang === 'en' ? selectedVideo.category : selectedVideo.categoryHi}</span>
                  <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: '8px 0 10px' }}>
                    {lang === 'en' ? selectedVideo.title : selectedVideo.titleHi}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '20px', color: '#94A3B8', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {selectedVideo.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {selectedVideo.duration}</span>
                    </div>
                    <a
                      href="https://www.youtube.com/@%E0%A4%B5%E0%A4%BF%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%97%E0%A5%81%E0%A4%B0%E0%A5%81%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%E0%A4%85%E0%A4%AB%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%A8"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#FF0000',
                        color: '#FFF',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Video size={14} /> Watch on @विश्वगुरुभारतअभियान
                    </a>
                  </div>
                </div>
              </div>

              {/* More Videos Grid */}
              <h3 style={{ fontSize: '1.2rem', margin: '30px 0 15px', color: '#CBD5E1' }}>{t.moreVideos}</h3>
              <div className="video-grid">
                {homeVideosList.map((vid) => (
                  <div 
                    key={vid.id} 
                    className="video-card"
                    onClick={() => { setSelectedVideo(vid); setIsPlaying(true); window.scrollTo({ top: 450, behavior: 'smooth' }); }}
                  >
                    <div className="video-card-thumb">
                      <img 
                        src={vid.thumb} 
                        alt={vid.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      <div className="mini-play-btn">
                        <Play size={16} fill="#FF9933" />
                      </div>
                    </div>
                    <div className="video-card-info">
                      <span className="video-card-category">{lang === 'en' ? vid.category : vid.categoryHi}</span>
                      <h4 className="video-card-title">{lang === 'en' ? vid.title : vid.titleHi}</h4>
                      <div className="video-card-date">
                        <Clock size={12} /> {vid.duration} • {vid.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* News Section */}
          <section className="section-bg-f1f5f9" style={{ background: '#F1F5F9' }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-title-wrap">
                  <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Newspaper color="#FF9933" size={28} /> {t.newsSectionTitle}
                  </h2>
                </div>
                <span className="view-all-link" onClick={() => setActiveTab('News')}>
                  {t.readAllNews} <ChevronRight size={16} />
                </span>
              </div>

              <div className="news-grid">
                {homeNewsData.map((item) => (
                  <div key={item.id} className="news-card">
                    <div className="news-card-img">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="news-card-content">
                      <div className="news-date">{item.date}</div>
                      <h3 className="news-title">{lang === 'en' ? item.title : item.titleHi}</h3>
                      <p className="news-snippet">{lang === 'en' ? item.snippet : item.snippetHi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <div className="footer-col">
            <h3>{t.footer.quickLinks}</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('About'); }}>{t.footer.links.aboutPM}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('News'); }}>{t.footer.links.newsUpdates}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Events'); }}>{t.footer.links.eventsConclaves}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Videos'); }}>{t.footer.links.videoLibrary}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Enquiry'); }}>{t.footer.links.citizenEnquiry}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('DownloadApp'); }}>{t.footer.links.downloadApp}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('login'); setActiveTab('Auth'); }}>{t.footer.links.citizenLogin}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>{t.footer.mediaCorner}</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Videos'); }}>{t.footer.links.speeches}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('News'); }}>{t.footer.links.pressReleases}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>{t.footer.contactDesk}</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Enquiry'); }}>{t.footer.links.submitGrievance}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Enquiry'); }}>{t.footer.links.pmoAddress}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
