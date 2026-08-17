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
  Image,
  Globe,
  Phone,
  Mail,
  FileText,
  Download,
  Menu,
  X
} from 'lucide-react';

const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const IconTwitter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const IconYoutube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const IconLinkedin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

import AboutPage from './pages/About';
import NewsPage from './pages/News';
import VideosPage from './pages/Videos';
import EnquiryPage from './pages/Enquiry';
import AuthPage from './pages/Auth';
import DownloadAppPage from './pages/DownloadApp';
import EventsPage from './pages/Events';
import GalleryPage from './pages/Gallery';
import PartnersPage from './pages/Partners';
import EventDetailsPage from './pages/EventDetails';
import DocumentsPage from './pages/Documents';
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
    title: 'welcomes record FDI inflows, attributes growth to policy stability & reforms',
    titleHi: 'Swarna Bharatने रिकॉर्ड FDI प्रवाह का स्वागत किया, विकास का श्रेय नीति स्थिरता और सुधारों को दिया',
    date: 'JULY 25, 2026',
    snippet: 'India continues to emerge as a premier global manufacturing and technology hub driven by Ease of Doing Business initiatives.',
    snippetHi: 'भारत व्यापार सुगमता पहलों द्वारा संचालित एक प्रमुख वैश्विक विनिर्माण और प्रौद्योगिकी केंद्र के रूप में उभरता रहा है।',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Swarna Bharatlaunches PM-DevINE projects aimed at holistic development in North Eastern region',
    titleHi: 'Swarna Bharatने पूर्वोत्तर क्षेत्र के समग्र विकास के लिए PM-DevINE परियोजनाएं लॉन्च कीं',
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
  const [openDropdown, setOpenDropdown] = useState(null);
  const getTabFromLocation = () => {
    const hash = window.location.hash.toLowerCase().replace('#/', '').replace('#', '');
    const path = window.location.pathname.toLowerCase().replace('/', '');
    const route = hash || path;

    if (route === 'auth' || route === 'login' || route === 'register') return 'Auth';
    if (route === 'dashboard') return 'Dashboard';
    if (route === 'about') return 'About';
    if (route === 'news') return 'News';
    if (route === 'events') return 'Events';
    if (route === 'videos') return 'Videos';
    if (route === 'gallery') return 'Gallery';
    if (route === 'enquiry') return 'Enquiry';
    if (route === 'partners') return 'Partners';
    if (route === 'partnerdetails' || route === 'partner-details') return 'PartnerDetails';
    if (route === 'eventdetails' || route === 'event-details') return 'EventDetails';
    if (route === 'documents' || route === 'docs') return 'Documents';
    if (route === 'download') return 'DownloadApp';
    if (route === 'profile') return 'ProfileDetails';
    return 'Home';
  };

  const [activeTab, setActiveTabState] = useState(getTabFromLocation);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let routeName = '';
    if (tab === 'Auth') routeName = 'auth';
    else if (tab === 'Dashboard') routeName = 'dashboard';
    else if (tab === 'About') routeName = 'about';
    else if (tab === 'News') routeName = 'news';
    else if (tab === 'Events') routeName = 'events';
    else if (tab === 'EventDetails') routeName = 'eventdetails';
    else if (tab === 'Documents') routeName = 'documents';
    else if (tab === 'Videos') routeName = 'videos';
    else if (tab === 'Gallery') routeName = 'gallery';
    else if (tab === 'Enquiry') routeName = 'enquiry';
    else if (tab === 'Partners') routeName = 'partners';
    else if (tab === 'PartnerDetails') routeName = 'partnerdetails';
    else if (tab === 'DownloadApp') routeName = 'download';
    else if (tab === 'ProfileDetails') routeName = 'profile';

    if (routeName) {
      window.location.hash = `#/${routeName}`;
    } else {
      window.location.hash = '';
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const tab = getTabFromLocation();
      setActiveTabState(tab);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [selectedPartner, setSelectedPartnerState] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedPartner');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const setSelectedPartner = (partner) => {
    setSelectedPartnerState(partner);
    if (partner) {
      try { localStorage.setItem('selectedPartner', JSON.stringify(partner)); } catch (e) {}
    } else {
      localStorage.removeItem('selectedPartner');
    }
  };

  const [selectedEvent, setSelectedEventState] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedEvent');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const setSelectedEvent = (evt) => {
    setSelectedEventState(evt);
    if (evt) {
      try { localStorage.setItem('selectedEvent', JSON.stringify(evt)); } catch (e) {}
    } else {
      localStorage.removeItem('selectedEvent');
    }
  };
  const [selectedSector, setSelectedSector] = useState('rural');

  const sectorIds = ['rural', 'health', 'education', 'sports', 'women', 'disaster', 'arts', 'environment', 'urban'];

  const [authMode, setAuthMode] = useState('login');
  const [userState, setUserState] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  // const [selectedVideo, setSelectedVideo] = useState(homeVideosList[0]);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
const [selectedVideo, setSelectedVideo] = useState(homeVideosList[0]);
const [isPlaying, setIsPlaying] = useState(false);
const [youtubeLoading, setYoutubeLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [heroList, setHeroList] = useState([]);
  const [apiNewsList, setApiNewsList] = useState([]);
  const [apiEventsList, setApiEventsList] = useState([]);
  const [apiDocumentsList, setApiDocumentsList] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/hero`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d && d.heroes && d.heroes.length > 0) {
          setHeroList(d.heroes);
        }
      })
      .catch(e => console.error('Error fetching hero settings:', e));

    fetch(`${API_URL}/news`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (Array.isArray(d) && d.length > 0) {
          setApiNewsList(d);
        }
      })
      .catch(e => console.error('Error fetching news:', e));

    fetch(`${API_URL}/events`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (Array.isArray(d) && d.length > 0) {
          setApiEventsList(d);
        }
      })
      .catch(e => console.error('Error fetching events:', e));

    fetch(`${API_URL}/documents`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (Array.isArray(d) && d.length > 0) {
          setApiDocumentsList(d);
        }
      })
      .catch(e => console.error('Error fetching documents:', e));
  }, []);




  useEffect(() => {
  const fetchYouTubeVideos = async () => {
    try {
      setYoutubeLoading(true);

      const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
      const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

      if (!API_KEY || !CHANNEL_ID) {
        console.warn('YouTube API configuration missing');
        setYoutubeLoading(false);
        return;
      }

      // 1. Get channel's uploads playlist
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
      );

      if (!channelResponse.ok) {
        throw new Error('Failed to fetch YouTube channel');
      }

      const channelData = await channelResponse.json();

      const uploadsPlaylistId =
        channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        throw new Error('Uploads playlist not found');
      }

      // 2. Get latest videos
      const videosResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${API_KEY}`
      );

      if (!videosResponse.ok) {
        throw new Error('Failed to fetch YouTube videos');
      }

      const videosData = await videosResponse.json();

      const formattedVideos = (videosData.items || [])
        .filter(item => item.snippet?.resourceId?.videoId)
        .map((item) => {
          const videoId = item.snippet.resourceId.videoId;

          return {
            id: videoId,
            youtubeId: videoId,
            videoUrl: `https://www.youtube.com/watch?v=${videoId}`,

            title: item.snippet.title,
            titleHi: item.snippet.title,

            category: 'YouTube',
            categoryHi: 'यूट्यूब',

            date: new Date(
              item.snippet.publishedAt
            ).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),

            duration: '',

            thumb:
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.medium?.url ||
              item.snippet.thumbnails?.default?.url
          };
        });

      if (formattedVideos.length > 0) {
        setYoutubeVideos(formattedVideos);
        setSelectedVideo(formattedVideos[0]);
      }
    } catch (error) {
      console.error('YouTube videos fetch error:', error);
    } finally {
      setYoutubeLoading(false);
    }
  };

  fetchYouTubeVideos();
}, []); 

 

  const demoBanners = [
    {
      id: 'demo1',
      video_url: 'https://assets.mixkit.co/videos/preview/mixkit-flag-of-india-waving-in-the-wind-41551-large.mp4',
      badge_text: '🚩 Vishwaguru Bharat Abhiyan',
      badge_text_hi: '🚩 विश्वगुरु भारत अभियान',
      title: 'Rebuilding Golden Bharat with Youth Power & Cultural Revival',
      title_hi: 'विश्वगुरु भारत अभियान - राष्ट्र निर्माण और युवा जागृति का महाअभियान 🚩',
      subtitle: 'Empowerment through education, heritage, wellness, and national development across all sectors.',
      subtitle_hi: 'शिक्षा, संस्कृति, ग्राम विकास और युवा शक्ति के माध्यम से भारत को पुनः विश्वगुरु बनाने का संकल्प।',
      btn1_text: 'Explore News',
      btn1_link: 'News',
      btn2_text: 'Watch Videos',
      btn2_link: 'Videos'
    },
    {
      id: 'demo2',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      badge_text: '🏛️ National Leadership Conclave',
      badge_text_hi: '🏛️ राष्ट्रीय नेतृत्व महासम्मेलन',
      title: 'Inspiring Innovation, Entrepreneurship & Rural Development',
      title_hi: 'नवाचार, उद्यमिता एवं ग्रामीण विकास की नई दिशा 🚀',
      subtitle: 'Connecting thousands of agencies, NGOs, and members for nationwide positive impact.',
      subtitle_hi: 'हजारों एजेंसियों, एनजीओ और सदस्यों को जोड़कर देशव्यापी बदलाव का संकल्प।',
      btn1_text: 'Our Events',
      btn1_link: 'Events',
      btn2_text: 'Join Movement',
      btn2_link: 'Auth'
    }
  ];

  const activeBanners = heroList.length > 0 ? heroList : demoBanners;
  const currentBanner = activeBanners[currentSlide % activeBanners.length] || activeBanners[0];

  useEffect(() => {
    if (activeTab !== 'Home') return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeBanners.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeBanners.length, activeTab]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % activeBanners.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + activeBanners.length) % activeBanners.length);

  const heroVideoSrc = currentBanner && currentBanner.video_url
    ? (currentBanner.video_url.startsWith('http') ? currentBanner.video_url : getMediaUrl(currentBanner.video_url))
    : demoBanners[0].video_url;

  const heroBadge = lang === 'en'
    ? (currentBanner?.badge_text || '🚩 Vishwaguru Bharat Abhiyan')
    : (currentBanner?.badge_text_hi || currentBanner?.badge_text || '🚩 विश्वगुरु भारत अभियान');

  const heroTitle = lang === 'en'
    ? (currentBanner?.title || 'Rebuilding Golden Bharat with Youth Power & Cultural Revival')
    : (currentBanner?.title_hi || currentBanner?.title || 'विश्वगुरु भारत अभियान - राष्ट्र निर्माण और युवा जागृति का महाअभियान 🚩');

  const heroSubtitle = lang === 'en'
    ? (currentBanner?.subtitle || 'Empowerment through education, heritage, wellness, and national development across all sectors.')
    : (currentBanner?.subtitle_hi || currentBanner?.subtitle || 'शिक्षा, संस्कृति, ग्राम विकास और युवा शक्ति के माध्यम से भारत को पुनः विश्वगुरु बनाने का संकल्प।');

  const heroBtn1Text = currentBanner?.btn1_text
    ? currentBanner.btn1_text
    : (lang === 'en' ? 'Explore News' : 'समाचार देखें');
  const heroBtn1Link = currentBanner?.btn1_link || 'News';

  const heroBtn2Text = currentBanner?.btn2_text
    ? currentBanner.btn2_text
    : (lang === 'en' ? 'Watch Videos' : 'वीडियो देखें');
  const heroBtn2Link = currentBanner?.btn2_link || 'Videos';

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

  const pillarIcons = getPillarIcons();

  return (
    <div className="app-main">
      {/* Main Navigation Header - Hidden on Dashboard page after login */}
      {activeTab !== 'Dashboard' && (
        <header className="main-header">
          <div className="header-container">
          <div className="logo-section" onClick={() => setActiveTab('Home')} style={{ cursor: 'pointer' }}>
            <img
              src={logoImg}
              alt="Swarna India Logo"
              className="logo-img-header"
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
            </div>
          </div>

          <nav>
            <ul className="nav-menu">
              {[
                { key: 'Home', label: t.nav.home },
                { key: 'About', label: t.nav.about },
                { key: 'News', label: t.nav.news },
                { key: 'Events', label: t.nav.events },
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
>
  <span
    onClick={() =>
      setOpenDropdown(
        openDropdown === 'sectors' ? null : 'sectors'
      )
    }
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer'
    }}
  >
    {lang === 'en' ? 'Sectors' : 'क्षेत्र'}
    <ChevronDown
      size={14}
      style={{
        transform:
          openDropdown === 'sectors'
            ? 'rotate(180deg)'
            : 'rotate(0deg)',
        transition: 'transform 0.2s'
      }}
    />
  </span>

  {openDropdown === 'sectors' && (
    <div
      className="sectors-dropdown"
      style={{
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
      }}
    >
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
            fontWeight:
              selectedSector === sec.id &&
              activeTab === 'SectorDetails'
                ? 700
                : 500,
            color:
              selectedSector === sec.id &&
              activeTab === 'SectorDetails'
                ? sec.borderColor
                : 'var(--text-dark)',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'var(--bg-alt)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'transparent')
          }
        >
          {lang === 'en' ? sec.name : sec.nameHi}
        </div>
      ))}
    </div>
  )}
</li>


{/* MEDIA DROPDOWN */}
<li
  className={`nav-link ${
    activeTab === 'Videos' || activeTab === 'Gallery'
      ? 'active'
      : ''
  }`}
  style={{ position: 'relative' }}
>
  <span
    onClick={() =>
      setOpenDropdown(
        openDropdown === 'media' ? null : 'media'
      )
    }
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer'
    }}
  >
    {lang === 'en' ? 'Media' : 'मीडिया'}

    <ChevronDown
      size={14}
      style={{
        transform:
          openDropdown === 'media'
            ? 'rotate(180deg)'
            : 'rotate(0deg)',
        transition: 'transform 0.2s'
      }}
    />
  </span>

  {openDropdown === 'media' && (
    <div
      className="media-dropdown"
      style={{
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
      }}
    >
      <div
        onClick={() => setActiveTab('Videos')}
        style={{
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          color:
            activeTab === 'Videos'
              ? '#FF9933'
              : 'var(--text-dark)',
          fontWeight:
            activeTab === 'Videos' ? 700 : 500,
          fontSize: '0.9rem',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'var(--bg-alt)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = 'transparent')
        }
      >
        <Video size={16} />
        {t.nav.videos}
      </div>

      <div
        onClick={() => setActiveTab('Gallery')}
        style={{
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          color:
            activeTab === 'Gallery'
              ? '#FF9933'
              : 'var(--text-dark)',
          fontWeight:
            activeTab === 'Gallery' ? 700 : 500,
          fontSize: '0.9rem',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'var(--bg-alt)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = 'transparent')
        }
       >
        <Image size={16} />
        {lang === 'en' ? 'Gallery' : 'गैलरी'}
      </div>

      <div
        onClick={() => setActiveTab('Documents')}
        style={{
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          color:
            activeTab === 'Documents'
              ? '#FF9933'
              : 'var(--text-dark)',
          fontWeight:
            activeTab === 'Documents' ? 700 : 500,
          fontSize: '0.9rem',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'var(--bg-alt)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = 'transparent')
        }
       >
        <FileText size={16} />
        {lang === 'en' ? 'Documents' : 'दस्तावेज़'}
      </div>

    </div>
  )}
</li>  

              {[
                { key: 'Enquiry', label: t.nav.enquiry },
                { key: 'Partners', label: t.nav.partners || 'Partners' },
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

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Language Toggle Button */}
            <button
              className="header-lang-btn"
              onClick={toggleLang}
              style={{
                background: 'rgba(255, 153, 51, 0.1)',
                border: '1px solid #FF9933',
                color: '#FF9933',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Change Language"
            >
              {t.langToggle}
            </button>

            {/* Dark Mode Toggle Button */}
            <button
              className="theme-toggle-btn"
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle Navigation Menu"
              title="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-header">
                <div className="mobile-menu-brand">
                  <img src={logoImg} alt="Swarna Bharat" />
                  <span>Swarna Bharat</span>
                </div>
                <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              <div className="mobile-menu-list">
                <div className={`mobile-nav-item ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => setActiveTab('Home')}>
                  🏠 {t.nav.home}
                </div>
                <div className={`mobile-nav-item ${activeTab === 'About' ? 'active' : ''}`} onClick={() => setActiveTab('About')}>
                  ℹ️ {t.nav.about}
                </div>
                <div className={`mobile-nav-item ${activeTab === 'News' ? 'active' : ''}`} onClick={() => setActiveTab('News')}>
                  📰 {t.nav.news}
                </div>
                <div className={`mobile-nav-item ${activeTab === 'Events' ? 'active' : ''}`} onClick={() => setActiveTab('Events')}>
                  📅 {t.nav.events}
                </div>

                {/* Sectors Accordion/List */}
                <div className="mobile-nav-group">
                  <div className="mobile-nav-group-title">
                    🌐 {lang === 'en' ? 'Sectors & Pillars' : 'क्षेत्र और स्तंभ'}
                  </div>
                  <div className="mobile-nav-sublist">
                    {sectorDataList.map((sec) => (
                      <div
                        key={sec.id}
                        className={`mobile-nav-subitem ${selectedSector === sec.id && activeTab === 'SectorDetails' ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedSector(sec.id);
                          setActiveTab('SectorDetails');
                        }}
                      >
                        ▸ {lang === 'en' ? sec.name : sec.nameHi}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media Group */}
                <div className="mobile-nav-group">
                  <div className="mobile-nav-group-title">
                    🎬 {lang === 'en' ? 'Media & Downloads' : 'मीडिया और डाउनलोड'}
                  </div>
                  <div className="mobile-nav-sublist">
                    <div className={`mobile-nav-subitem ${activeTab === 'Videos' ? 'active' : ''}`} onClick={() => setActiveTab('Videos')}>
                      🎥 {t.nav.videos}
                    </div>
                    <div className={`mobile-nav-subitem ${activeTab === 'Gallery' ? 'active' : ''}`} onClick={() => setActiveTab('Gallery')}>
                      🖼️ {lang === 'en' ? 'Gallery' : 'गैलरी'}
                    </div>
                    <div className={`mobile-nav-subitem ${activeTab === 'Documents' ? 'active' : ''}`} onClick={() => setActiveTab('Documents')}>
                      📄 {lang === 'en' ? 'Important Documents' : 'महत्वपूर्ण दस्तावेज़'}
                    </div>
                  </div>
                </div>

                <div className={`mobile-nav-item ${activeTab === 'Enquiry' ? 'active' : ''}`} onClick={() => setActiveTab('Enquiry')}>
                  📩 {t.nav.enquiry}
                </div>
                <div className={`mobile-nav-item ${activeTab === 'Partners' ? 'active' : ''}`} onClick={() => setActiveTab('Partners')}>
                  🏢 {t.nav.partners || 'Partners'}
                </div>
                <div className={`mobile-nav-item ${activeTab === 'DownloadApp' ? 'active' : ''}`} onClick={() => setActiveTab('DownloadApp')}>
                  📱 {t.nav.downloadApp}
                </div>
                <div className={`mobile-nav-item ${activeTab === 'Auth' || activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => { if (!userState && !localStorage.getItem('userToken')) setAuthMode('login'); setActiveTab(userState || localStorage.getItem('userToken') ? 'Dashboard' : 'Auth'); }}>
                  🔐 {userState || localStorage.getItem('userToken') ? 'Dashboard' : t.nav.loginRegister}
                </div>

                <div className="mobile-menu-footer">
                  <button onClick={toggleLang} className="mobile-lang-btn">
                    🌐 {t.langToggle}
                  </button>
                  <button onClick={toggleDarkMode} className="mobile-theme-btn">
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />} {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      )}

      {/* Main Dynamic View Content */}
      {activeTab === 'About' && <AboutPage />}
      {activeTab === 'News' && <NewsPage />}
      {activeTab === 'Events' && <EventsPage setSelectedEvent={setSelectedEvent} setActiveTab={setActiveTab} />}
      {activeTab === 'EventDetails' && <EventDetailsPage event={selectedEvent} setActiveTab={setActiveTab} />}
      {activeTab === 'Videos' && <VideosPage />}
      {activeTab === 'Gallery' && <GalleryPage />}
      {activeTab === 'Documents' && <DocumentsPage />}
      {activeTab === 'Enquiry' && <EnquiryPage />}
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
      {activeTab === 'Auth' && <AuthPage initialMode={authMode} onAuthSuccess={(name) => { setUserState(name); setActiveTab('Dashboard'); }} />}
      {activeTab === 'Dashboard' && <Dashboard setActiveTab={setActiveTab} setUserState={setUserState} />}

      {activeTab === 'Home' && (
        <>
          {/* Dynamic Hero Video Banner Section */}
          <section className="banner-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                filter: 'brightness(1.4)',
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

            {/* Slider Manual Navigation Arrows & Dots */}
            {activeBanners.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#FFF', width: '46px', height: '46px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', transition: 'all 0.2s ease' }}
                  title="Previous Banner"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={nextSlide}
                  style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: '#FFF', width: '46px', height: '46px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', transition: 'all 0.2s ease' }}
                  title="Next Banner"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Dots Indicator Pills */}
                <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.45)', padding: '8px 18px', borderRadius: '30px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  {activeBanners.map((b, idx) => (
                    <button
                      key={b.id || idx}
                      onClick={() => setCurrentSlide(idx)}
                      style={{
                        width: (currentSlide % activeBanners.length) === idx ? '32px' : '10px',
                        height: '10px',
                        borderRadius: '5px',
                        border: 'none',
                        background: (currentSlide % activeBanners.length) === idx ? '#FF9933' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                      title={`Go to Banner ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* <section className="marquee-section overflow-hidden w-full py-3" style={{ borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
            <div className="animate-marquee whitespace-nowrap" style={{ fontWeight: 600 }}>
              Hello 👋 Welcome to Swarna Bharat • Youth Power & Cultural Revival • Education • Digital Empowerment 🚀
            </div>
          </section> */}



          {/* Circular Icon Ribbon */}
          <section className="section-bg-faf7f2" style={{ background: '#FAF7F2', padding: '30px 16px', borderBottom: '1px solid #E5E0D8' }}>
            <div className="pillars-ribbon-container">
              {t.pillars.map((title, index) => (
                <div
                  key={index}
                  className="pillars-ribbon-item"
                  onClick={() => {
                    setSelectedSector(sectorIds[index] || 'rural');
                    setActiveTab('SectorDetails');
                  }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '115px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                >
                  <div className="pillar-circle-wrap" style={{ width: '74px', height: '74px', borderRadius: '50%', border: `2px solid ${pillarIcons[index].borderColor}`, padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '10px' }}>
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

          {/* About Section */}
          <section className="section-bg-f8fafc" style={{ background: '#F8FAFC', padding: '60px 0' }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-title-wrap">
                  <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen color="#FF9933" size={28} /> {lang === 'en' ? 'About Vishwaguru Bharat Abhiyan' : 'विश्वगुरु भारत अभियान के बारे में'}
                  </h2>
                </div>
                <span className="view-all-link" onClick={() => setActiveTab('About')}>
                  {lang === 'en' ? 'Learn More' : 'अधिक जानें'} <ChevronRight size={16} />
                </span>
              </div>

              <div className="dark-card" style={{ background: '#FFF', padding: '35px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src="/AboutLogo.jpg"      
                      alt="Vishwaguru Bharat Abhiyan" 
                      style={{ width: '100%', borderRadius: '16px', boxShadow: '0 12px 30px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0' }}
                    />
                    <span style={{ position: 'absolute', top: '15px', left: '15px', background: 'linear-gradient(135deg, #FF9933, #FF6B00)', color: '#FFF', fontSize: '0.8rem', fontWeight: 700, padding: '6px 16px', borderRadius: '30px', boxShadow: '0 4px 12px rgba(255,107,0,0.3)' }}>
                      🚩 {lang === 'en' ? 'National Movement' : 'राष्ट्रीय महाअभियान'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#FF9933', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.88rem', letterSpacing: '0.5px' }}>
                      {lang === 'en' ? 'Rebuilding Golden Bharat' : 'स्वर्णिम भारत का पुनः निर्माण'}
                    </span>
                    <h3 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-dark)', margin: '12px 0 16px', lineHeight: 1.3 }}>
                      {lang === 'en' ? 'Empowering Youth, Reviving Heritage & Driving Sustainable Progress' : 'युवा शक्ति, सांस्कृतिक पुनरुत्थान एवं सतत विकास का महासंकल्प'}
                    </h3>
                    <p style={{ color: '#64748B', lineHeight: '1.7', fontSize: '0.98rem', marginBottom: '16px' }}>
                      {lang === 'en'
                        ? 'Vishwaguru Bharat Abhiyan is a nationwide transformative movement committed to youth empowerment, cultural heritage, digital education, and inclusive development across all sectors.'
                        : 'विश्वगुरु भारत अभियान एक देशव्यापी परिवर्तनकारी अभियान है जो युवा सशक्तिकरण, सांस्कृतिक विरासत, डिजिटल शिक्षा और सभी क्षेत्रों में समावेशी विकास के लिए समर्पित है।'}
                    </p>
                    <div style={{ background: '#FFF7ED', borderLeft: '4px solid #FF9933', padding: '14px 18px', borderRadius: '8px', marginBottom: '22px' }}>
                      <p style={{ color: '#C2410C', fontWeight: 700, fontSize: '0.92rem', margin: 0, fontStyle: 'italic' }}>
                        "{lang === 'en' ? 'Sabka Saath, Sabka Vikas, Sabka Vishwas, Sabka Prayas' : 'सबका साथ, सबका विकास, सबका विश्वास, सबका प्रयास'}"
                      </p>
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => setActiveTab('About')}
                      style={{ background: 'linear-gradient(135deg, #FF9933, #FF6B00)', color: '#FFF', border: 'none', padding: '12px 28px', borderRadius: '40px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 18px rgba(255, 153, 51, 0.35)' }}
                    >
                      {lang === 'en' ? 'Explore Full Vision' : 'पूरा दृष्टिकोण देखें'} <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* 4 Pillars Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #F1F5F9' }}>
                  {[
                    {
                      icon: <User size={26} color="#FF9933" />,
                      title: lang === 'en' ? 'Inclusive Governance' : 'समावेशी शासन',
                      desc: lang === 'en' ? 'Ensuring direct access to government schemes & welfare.' : 'प्रत्येक नागरिक को सरकारी योजनाओं तक सीधी पहुँच।'
                    },
                    {
                      icon: <Award size={26} color="#FF9933" />,
                      title: lang === 'en' ? 'Transparent Admin' : 'पारदर्शी प्रशासन',
                      desc: lang === 'en' ? 'Promoting accountability and open public governance.' : 'जवाबदेही और पारदर्शी सार्वजनिक व्यवस्था।'
                    },
                    {
                      icon: <BookOpen size={26} color="#FF9933" />,
                      title: lang === 'en' ? 'Digital Empowerment' : 'डिजिटल सशक्तिकरण',
                      desc: lang === 'en' ? 'Bridging digital gap with accessible tech & skills.' : 'तकनीक और कौशल से डिजिटल क्रांति।'
                    },
                    {
                      icon: <Globe size={26} color="#FF9933" />,
                      title: lang === 'en' ? 'Global Leadership' : 'वैश्विक नेतृत्व',
                      desc: lang === 'en' ? 'Positioning Bharat as a premier world benchmark.' : 'विश्व मंच पर भारत के नेतृत्व को सुदृढ़ करना।'
                    }
                  ].map((p, idx) => (
                    <div key={idx} style={{ background: '#F8FAFC', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #FF9933' }}>
                      <div style={{ marginBottom: '10px' }}>{p.icon}</div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>{p.title}</h4>
                      <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: '1.4', margin: 0 }}>{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>  

          {/* Impact Counter Bar */}
          <section className="impact-counter-bar section-bg-f8fafc" style={{ background: '#F8FAFC' }}>
            <div className="impact-counter-grid">
              {t.metrics.map((item, index) => (
                <div key={index} className="impact-counter-item">
                  <div className="impact-counter-number">{item.value}</div>
                  <div className="impact-counter-label">{item.label}</div>
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

              {(() => {
                const activeEvents = apiEventsList.length > 0 ? apiEventsList : [
                  {
                    id: 'd1',
                    day: '07 & 08',
                    month: 'FEB',
                    year: '2026',
                    category: 'National Conclave',
                    category_hi: 'राष्ट्रीय सम्मेलन',
                    title: 'Building Flourishing Futures: National Conclave on Early Education & Youth Development',
                    title_hi: 'समृद्ध भविष्य का निर्माण: प्रारंभिक शिक्षा और युवा विकास पर राष्ट्रीय सम्मेलन',
                    desc: 'Bringing together educationists, policymakers, and innovators to shape early childhood development and NEP implementation.',
                    desc_hi: 'प्रारंभिक बाल विकास और एनईपी कार्यान्वयन को आकार देने के लिए शिक्षाविदों, नीति निर्माताओं और नवप्रवर्तकों को एक साथ लाना।',
                    location: 'Bharat Mandapam, Pragati Maidan, New Delhi',
                    location_hi: 'भारत मंडपम, प्रगति मैदान, नई दिल्ली',
                    image: eventImages[0]
                  },
                  {
                    id: 'd2',
                    day: '24',
                    month: 'SEP',
                    year: '2025',
                    category: 'Global Summit',
                    category_hi: 'वैश्विक शिखर सम्मेलन',
                    title: "India Day @ UNGA: Highlighting India's Leadership on SDGs, AI-Driven Development & Climate Action",
                    title_hi: 'संयुक्त राष्ट्र महासभा में भारत दिवस: SDG, AI-संचालित विकास और जलवायु कार्रवाई में भारत के नेतृत्व को उजागर करना',
                    location: 'United Nations Headquarters, New York',
                    location_hi: 'संयुक्त राष्ट्र मुख्यालय, न्यूयॉर्क',
                    image: eventImages[1]
                  },
                  {
                    id: 'd3',
                    day: '25',
                    month: 'SEP',
                    year: '2024',
                    category: 'Youth Forum',
                    category_hi: 'युवा मंच',
                    title: 'Global Youth & Technology Forum: Crafting a Bold Vision for Sustainable Innovation',
                    title_hi: 'वैश्विक युवा और प्रौद्योगिकी मंच: सतत नवाचार के लिए एक साहसिक दृष्टिकोण',
                    location: 'Amrit Udyan & Vigyan Bhawan, New Delhi',
                    location_hi: 'अमृत उद्यान और विज्ञान भवन, नई दिल्ली',
                    image: eventImages[2]
                  }
                ];

                const featuredEvt = activeEvents[0];
                const sideEvts = activeEvents.slice(1, 3);

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                    {/* Featured Big Event Card */}
                    <div className="dark-card" style={{ background: '#FFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '270px', position: 'relative', overflow: 'hidden' }}>
                        <img 
                          src={featuredEvt.image ? (featuredEvt.image.startsWith('http') ? featuredEvt.image : getMediaUrl(featuredEvt.image)) : eventImages[0]} 
                          alt={featuredEvt.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <span style={{ position: 'absolute', top: '15px', left: '15px', background: '#FF9933', color: '#FFF', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '4px', textTransform: 'uppercase' }}>
                          {lang === 'en' ? (featuredEvt.category || 'National Conclave') : (featuredEvt.category_hi || featuredEvt.category || 'राष्ट्रीय सम्मेलन')}
                        </span>
                      </div>
                      <div style={{ padding: '25px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <div className="dark-date-box" style={{ textAlign: 'center', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '10px 16px', borderRadius: '10px', minWidth: '85px', flexShrink: 0 }}>
                          <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase' }}>{featuredEvt.month || 'FEB'}</span>
                          <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: '1.1' }}>{featuredEvt.day || '07'}</span>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{featuredEvt.year || '2026'}</span>
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px', lineHeight: '1.3' }}>
                            {lang === 'en' ? featuredEvt.title : (featuredEvt.title_hi || featuredEvt.title)}
                          </h3>
                          <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '12px', lineHeight: '1.5' }}>
                            {lang === 'en' ? (featuredEvt.desc || featuredEvt.snippet || '') : (featuredEvt.desc_hi || featuredEvt.desc || '')}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF9933', fontSize: '0.82rem', fontWeight: 600 }}>
                            <MapPin size={15} /> {lang === 'en' ? (featuredEvt.location || 'New Delhi') : (featuredEvt.location_hi || featuredEvt.location || 'नई दिल्ली')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side Stacked Event Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {sideEvts.map((evt, i) => (
                        <div
                          key={evt.id || i}
                          className="dark-card"
                          style={{ background: '#FFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', transition: 'transform 0.3s ease', cursor: 'pointer' }}
                          onClick={() => setActiveTab('Events')}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                        >
                          <div style={{ padding: '20px', display: 'flex', gap: '15px' }}>
                            <div className="dark-date-box" style={{ textAlign: 'center', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '8px', height: 'fit-content', flexShrink: 0 }}>
                              <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#16A34A' }}>{evt.month || 'AUG'}</span>
                              <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: '1' }}>{evt.day || '15'}</span>
                              <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748B' }}>{evt.year || '2026'}</span>
                            </div>
                            <div>
                              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px', lineHeight: '1.35' }}>
                                {lang === 'en' ? evt.title : (evt.title_hi || evt.title)}
                              </h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', fontSize: '0.8rem' }}>
                                <MapPin size={14} color="#FF9933" /> {lang === 'en' ? (evt.location || 'New Delhi') : (evt.location_hi || evt.location || 'नई दिल्ली')}
                              </div>
                            </div>
                          </div>
                          <div style={{ height: '100%', minHeight: '130px' }}>
                            <img 
                              src={evt.image ? (evt.image.startsWith('http') ? evt.image : getMediaUrl(evt.image)) : eventImages[1]} 
                              alt={evt.title} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>

          

          

          {/* Video Section */}
          <section className="video-section-bg section-bg-f8fafc" style={{ background: '#F8FAFC' }}>
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
                {(youtubeVideos.length > 0 ? youtubeVideos : homeVideosList).map((vid) => (
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
                {(apiNewsList.length > 0 ? apiNewsList.map(n => ({
                  id: n.id,
                  title: n.title,
                  titleHi: n.title_hi || n.title,
                  date: n.date ? n.date.toUpperCase() : (n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : 'RECENT'),
                  snippet: n.snippet || '',
                  snippetHi: n.snippet_hi || n.snippet || '',
                  image: n.image ? (n.image.startsWith('http') ? n.image : getMediaUrl(n.image)) : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
                })) : homeNewsData).map((item) => (
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

          {/* Important Documents & Circulars Section */}
          <section className="section-bg-white" style={{ background: '#FFF', padding: '60px 0', borderTop: '1px solid #E2E8F0' }}>
            <div className="section-container">
              <div className="section-header">
                <div className="section-title-wrap">
                  <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText color="#FF9933" size={28} /> {lang === 'en' ? 'Important Documents & Circulars' : 'महत्वपूर्ण दस्तावेज़ एवं परिपत्र'}
                  </h2>
                </div>
                <span className="view-all-link" onClick={() => setActiveTab('Documents')} style={{ cursor: 'pointer' }}>
                  {lang === 'en' ? 'View All Documents' : 'सभी दस्तावेज़ देखें'} <ChevronRight size={16} />
                </span>
              </div>

              {apiDocumentsList.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {apiDocumentsList.slice(0, 4).map((doc, idx) => {
                    const downloadUrl = doc.file_url ? (doc.file_url.startsWith('http') ? doc.file_url : getMediaUrl(doc.file_url)) : '#';
                    const displayTitle = (lang === 'hi' && doc.title_hi) ? doc.title_hi : doc.title;
                    const dateStr = doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '2026';
                    const fileType = (doc.file_type || 'PDF').toUpperCase();

                    return (
                      <div key={doc.id || idx} style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ background: '#FEF2F2', color: '#DC2626', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                              {fileType}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#64748B', background: '#FFF', padding: '4px 10px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                              {doc.category || 'General'}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 10px', lineHeight: '1.4' }}>
                            {displayTitle}
                          </h4>
                        </div>
                        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>📅 {dateStr} {doc.file_size ? `• ${doc.file_size}` : ''}</span>
                          <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download style={{ background: 'linear-gradient(135deg, #FF9933, #FF6B00)', color: '#FFF', padding: '6px 16px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Download size={14} /> {lang === 'en' ? 'Download' : 'डाउनलोड'}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                  <FileText size={36} color="#94A3B8" style={{ marginBottom: '8px' }} />
                  <p style={{ color: '#64748B', margin: 0, fontWeight: 600 }}>
                    {lang === 'en' ? 'No documents published yet.' : 'अभी कोई दस्तावेज़ प्रकाशित नहीं हुआ है।'}
                  </p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ── HIGH-END MODERN FOOTER WITH SOCIAL MEDIA ─────────────────────── */}
      {activeTab !== 'Dashboard' && (
        <footer style={{ background: '#0F172A', color: '#94A3B8', borderTop: '4px solid #FF9933', fontFamily: "'Outfit', sans-serif" }}>
          {/* Main Footer Body Container */}
          <div style={{ maxWidth: '1600px', width: '94%', margin: '0 auto', padding: '60px 20px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            
            {/* Col 1: Brand & Mission */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={logoImg}
                  alt="Swarna Bharat Logo"
                  style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #FF9933', boxShadow: '0 4px 12px rgba(255,153,51,0.4)', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ margin: 0, color: '#FFF', fontSize: '1.3rem', fontWeight: 800 }}>Swarna Bharat</h3>
                  <span style={{ fontSize: '0.75rem', color: '#FF9933', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {lang === 'en' ? 'Vishwaguru Bharat Abhiyan' : 'विश्वगुरु भारत अभियान'}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: '1.6', margin: 0 }}>
                {lang === 'en'
                  ? 'Rebuilding Golden Bharat through youth empowerment, cultural heritage, national development, and citizen participation across all sectors.'
                  : 'शिक्षा, संस्कृति, ग्राम विकास और युवा शक्ति के माध्यम से भारत को पुनः विश्वगुरु बनाने का राष्ट्रीय संकल्प।'}
              </p>

              {/* Social Media Links Section */}
              <div style={{ marginTop: '8px' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#F8FAFC', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  {lang === 'en' ? 'CONNECT WITH US' : 'हमसे जुड़ें'}
                </span>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-link fb" title="Facebook">
                    <IconFacebook />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-link tw" title="Twitter / X">
                    <IconTwitter />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-link ig" title="Instagram">
                    <IconInstagram />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-link yt" title="YouTube">
                    <IconYoutube />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-link li" title="LinkedIn">
                    <IconLinkedin />
                  </a>
                </div>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 style={{ color: '#FFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', position: 'relative', paddingBottom: '10px', borderBottom: '2px solid rgba(255,153,51,0.3)' }}>
                {lang === 'en' ? 'QUICK NAVIGATION' : 'त्वरित नेविगेशन'}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Home'); }} className="footer-nav-item">▸ {t.nav.home}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('About'); }} className="footer-nav-item">▸ {t.nav.about}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('News'); }} className="footer-nav-item">▸ {t.nav.news}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Events'); }} className="footer-nav-item">▸ {t.nav.events}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Videos'); }} className="footer-nav-item">▸ {t.nav.videos}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Partners'); }} className="footer-nav-item">▸ {t.nav.partners || 'Partners'}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Documents'); }} className="footer-nav-item">▸ {lang === 'en' ? 'Important Documents' : 'महत्वपूर्ण दस्तावेज़'}</a></li>
              </ul>
            </div>

            {/* Col 3: Focus Sectors */}
            <div>
              <h4 style={{ color: '#FFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', position: 'relative', paddingBottom: '10px', borderBottom: '2px solid rgba(255,153,51,0.3)' }}>
                {lang === 'en' ? 'NATIONAL PILLARS' : 'प्रमुख स्तंभ'}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedSector('rural'); setActiveTab('SectorDetails'); }} className="footer-nav-item">▸ {lang === 'en' ? 'Rural Development' : 'ग्रामीण विकास'}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedSector('health'); setActiveTab('SectorDetails'); }} className="footer-nav-item">▸ {lang === 'en' ? 'Healthcare & Wellness' : 'स्वास्थ्य एवं निरोग'}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedSector('education'); setActiveTab('SectorDetails'); }} className="footer-nav-item">▸ {lang === 'en' ? 'Youth & Skill Education' : 'युवा एवं कौशल शिक्षा'}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedSector('women'); setActiveTab('SectorDetails'); }} className="footer-nav-item">▸ {lang === 'en' ? 'Women Empowerment' : 'महिला सशक्तिकरण'}</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedSector('arts'); setActiveTab('SectorDetails'); }} className="footer-nav-item">▸ {lang === 'en' ? 'Cultural Heritage & Arts' : 'सांस्कृतिक विरासत एवं कला'}</a></li>
              </ul>
            </div>

            {/* Col 4: Contact & Helpline */}
            <div>
              <h4 style={{ color: '#FFF', fontSize: '1.05rem', fontWeight: 800, marginBottom: '20px', position: 'relative', paddingBottom: '10px', borderBottom: '2px solid rgba(255,153,51,0.3)' }}>
                {lang === 'en' ? 'CITIZEN HELPDESK' : 'नागरिक सहायता केंद्र'}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: '#CBD5E1' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={18} color="#FF9933" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>Swarna Bharat Bhawan, Central Secretariat, New Delhi - 110001</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={18} color="#FF9933" style={{ flexShrink: 0 }} />
                  <span>1800-11-2026 (Toll Free Helpline)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={18} color="#FF9933" style={{ flexShrink: 0 }} />
                  <span>support@swarnabharat.org</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Globe size={18} color="#FF9933" style={{ flexShrink: 0 }} />
                  <span>www.swarnabharat.gov.in</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Sub-Footer Copyright & Bottom Links */}
          <div style={{ background: '#0B1120', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px' }}>
            <div style={{ maxWidth: '1600px', width: '94%', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', fontSize: '0.82rem', color: '#94A3B8' }}>
              <div>
                © 2026 Swarna Bharat Network. All Rights Reserved. Govt Citizen Access Portal.
              </div>
              <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                <a href="#" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</a>
                <span>|</span>
                <a href="#" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms of Service</a>
                <span>|</span>
                <a href="#" style={{ color: '#94A3B8', textDecoration: 'none' }}>Accessibility</a>
                <span>|</span>
                <a href="#" style={{ color: '#94A3B8', textDecoration: 'none' }}>Sitemap</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
