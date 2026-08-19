import React, { useState, useEffect } from 'react';  
import { Video, Play, Calendar, Clock } from 'lucide-react';
import { useLang } from '../LanguageContext';

const FALLBACK_VIDEOS = [
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
  }
];

export default function VideosPage() {
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(FALLBACK_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(true);  

  const { lang, t } = useLang();
  const vp = t.videosPage;  

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
  

  const activeSelected = selectedVideo || FALLBACK_VIDEOS[0];

  return (
    <div className="section-container">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div className="section-title-wrap">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Video color="#2563EB" size={28} /> {vp.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            {lang === 'en' ? 'Official Videos & Speeches of Vishwaguru Bharat Abhiyan' : 'विश्वगुरु भारत अभियान के आधिकारिक वीडियो और संबोधन'}
          </p>
        </div>

        <a 
          href="https://www.youtube.com/@%E0%A4%B5%E0%A4%BF%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%97%E0%A5%81%E0%A4%B0%E0%A5%81%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%E0%A4%85%E0%A4%AB%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%A8"
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            background: '#FF0000',
            color: '#FFF',
            padding: '10px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(255,0,0,0.2)'
          }}
        >
          <Video size={18} /> @विश्वगुरुभारतअभियान
        </a>
      </div>

      <div className="featured-video-card">
        <div className="video-player-frame">
          <iframe
            src={`https://www.youtube.com/embed/${activeSelected.youtubeId}`}
            title={lang === 'en' ? activeSelected.title : (activeSelected.titleHi || activeSelected.title)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none' }}
          ></iframe>
        </div>
        <div style={{ padding: '20px 25px', background: '#1A2238' }}>
          <span className="video-card-category">{lang === 'en' ? activeSelected.category : (activeSelected.categoryHi || activeSelected.category)}</span>
          <h3 style={{ fontSize: '1.4rem', color: '#FFF', margin: '8px 0 10px' }}>
            {lang === 'en' ? activeSelected.title : (activeSelected.titleHi || activeSelected.title)}
          </h3>
          <div style={{ display: 'flex', gap: '20px', color: '#94A3B8', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {activeSelected.date}</span>
            {activeSelected.duration && <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {activeSelected.duration}</span>}
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', margin: '30px 0 15px', color: 'var(--text-dark)' }}>
        {lang === 'en' ? 'All Videos' : 'सभी वीडियो'}
      </h3>
      <div className="video-grid">
        {(youtubeVideos.length > 0 ? youtubeVideos : FALLBACK_VIDEOS).map((vid) => (   
          <div 
            key={vid.id} 
            className="video-card"
            onClick={() => { setSelectedVideo(vid); setIsPlaying(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="video-card-thumb">
              <img 
                src={vid.thumb} 
                alt={lang === 'en' ? vid.title : vid.titleHi} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="mini-play-btn">
                <Play size={16} fill="#2563EB" />
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
  );
}
