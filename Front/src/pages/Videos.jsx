import React, { useState } from 'react';
import { Video, Play, Calendar, Clock } from 'lucide-react';
import { useLang } from '../LanguageContext';

const videosList = [
  {
    id: 'vid1', youtubeId: 'gCNeDWCI0BA',
    title: 'पंडित प्रदीप मिश्रा जी का विश्वगुरु भारत अभियान हेतु संदेश 🚩',
    titleHi: 'पंडित प्रदीप मिश्रा जी का विश्वगुरु भारत अभियान हेतु संदेश 🚩',
    category: 'महाउद्घोष दिवस', categoryHi: 'महाउद्घोष दिवस',
    date: '4 months ago', duration: '08:45',
    thumb: 'https://images.unsplash.com/photo-1545232979-fbf4dce93198?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vid2', youtubeId: 'kJQP7kiw5Fk',
    title: 'विश्वगुरु भारत अभियान - राष्ट्र निर्माण और युवा जागृति 🚩',
    titleHi: 'विश्वगुरु भारत अभियान - राष्ट्र निर्माण और युवा जागृति 🚩',
    category: 'विश्वगुरु भारत', categoryHi: 'विश्वगुरु भारत',
    date: '4 months ago', duration: '06:13',
    thumb: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vid3', youtubeId: 'tgbNymZ7vqY',
    title: 'परम पूज्य महाराज जी का विश्वगुरु भारत अभियान पर अमृत वाणी 🚩',
    titleHi: 'परम पूज्य महाराज जी का विश्वगुरु भारत अभियान पर अमृत वाणी 🚩',
    category: 'अमृत वाणी', categoryHi: 'अमृत वाणी',
    date: '4 months ago', duration: '12:30',
    thumb: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vid4', youtubeId: 'L_LUpnjgPso',
    title: 'बाल संस्कार एवं मातृ-पितृ पूजन दिवस - विश्वगुरु भारत अभियान 🚩',
    titleHi: 'बाल संस्कार एवं मातृ-पितृ पूजन दिवस - विश्वगुरु भारत अभियान 🚩',
    category: 'बाल संस्कार', categoryHi: 'बाल संस्कार',
    date: '3 months ago', duration: '15:20',
    thumb: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'vid5', youtubeId: 'V-_O7nl0IiU',
    title: 'सनातन संस्कृति एवं अखंड भारत संकल्प - विश्वगुरु भारत अभियान 🚩',
    titleHi: 'सनातन संस्कृति एवं अखंड भारत संकल्प - विश्वगुरु भारत अभियान 🚩',
    category: 'सनातन गौरव', categoryHi: 'सनातन गौरव',
    date: '3 months ago', duration: '18:45',
    thumb: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80'
  }
];

export default function VideosPage() {
  const { lang, t } = useLang();
  const vp = t.videosPage;
  const [selectedVideo, setSelectedVideo] = useState(videosList[0]);

  return (
    <div className="section-container">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div className="section-title-wrap">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Video color="#FF9933" size={28} /> {vp.title}
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
            src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
            title={lang === 'en' ? selectedVideo.title : selectedVideo.titleHi}
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
          <div style={{ display: 'flex', gap: '20px', color: '#94A3B8', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {selectedVideo.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14} /> {selectedVideo.duration}</span>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', margin: '30px 0 15px', color: 'var(--text-dark)' }}>
        {lang === 'en' ? 'All Videos' : 'सभी वीडियो'}
      </h3>
      <div className="video-grid">
        {videosList.map((vid) => (
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
  );
}
