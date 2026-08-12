import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Video as VideoIcon, Search, ZoomIn, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useLang } from '../LanguageContext';
import { API_URL, getMediaUrl } from '../config';

const fallbackImages = [
  {
    id: 'f1',
    src: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    title: 'National Event',
    titleHi: 'Swarna Bharat राष्ट्रीय कार्यक्रम में',
    category: 'Events', categoryHi: 'कार्यक्रम',
    type: 'image'
  },
  {
    id: 'f2',
    src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    title: 'International Diplomatic Summit',
    titleHi: 'अंतर्राष्ट्रीय कूटनीतिक शिखर सम्मेलन',
    category: 'Diplomacy', categoryHi: 'कूटनीति',
    type: 'image'
  },
  {
    id: 'f3',
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    title: 'National Conclave on Education',
    titleHi: 'शिक्षा पर राष्ट्रीय सम्मेलन',
    category: 'Education', categoryHi: 'शिक्षा',
    type: 'image'
  },
  {
    id: 'f4',
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    title: 'Infrastructure Development Inauguration',
    titleHi: 'बुनियादी ढांचा विकास उद्घाटन',
    category: 'Infrastructure', categoryHi: 'बुनियादी ढांचा',
    type: 'image'
  },
  {
    id: 'f5',
    src: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    title: 'Solar Energy Green Initiative',
    titleHi: 'सौर ऊर्जा हरित पहल',
    category: 'Environment', categoryHi: 'पर्यावरण',
    type: 'image'
  },
  {
    id: 'f6',
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    title: 'Youth & Technology Innovation Forum',
    titleHi: 'युवा और प्रौद्योगिकी नवाचार मंच',
    category: 'Youth', categoryHi: 'युवा',
    type: 'image'
  },
  {
    id: 'f7',
    src: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=800&q=80',
    title: 'Women Empowerment Program',
    titleHi: 'महिला सशक्तिकरण कार्यक्रम',
    category: 'Empowerment', categoryHi: 'सशक्तिकरण',
    type: 'image'
  },
  {
    id: 'f8',
    src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    title: 'International Day of Yoga Celebrations',
    titleHi: 'अंतर्राष्ट्रीय योग दिवस समारोह',
    category: 'Culture', categoryHi: 'संस्कृति',
    type: 'image'
  }
];

const fallbackVideos = [
  {
    id: 'fv1',
    src: 'https://www.youtube.com/embed/gCNeDWCI0BA',
    youtubeId: 'gCNeDWCI0BA',
    thumb: 'https://images.unsplash.com/photo-1545232979-fbf4dce93198?auto=format&fit=crop&w=600&q=80',
    title: 'पंडित प्रदीप मिश्रा जी का विश्वगुरु भारत अभियान हेतु संदेश 🚩',
    titleHi: 'पंडित प्रदीप मिश्रा जी का विश्वगुरु भारत अभियान हेतु संदेश 🚩',
    category: 'Events', categoryHi: 'कार्यक्रम',
    type: 'video'
  },
  {
    id: 'fv2',
    src: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    youtubeId: 'kJQP7kiw5Fk',
    thumb: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=600&q=80',
    title: 'विश्वगुरु भारत अभियान - राष्ट्र निर्माण और युवा जागृति 🚩',
    titleHi: 'विश्वगुरु भारत अभियान - राष्ट्र निर्माण और युवा जागृति 🚩',
    category: 'Youth', categoryHi: 'युवा',
    type: 'video'
  },
  {
    id: 'fv3',
    src: 'https://www.youtube.com/embed/tgbNymZ7vqY',
    youtubeId: 'tgbNymZ7vqY',
    thumb: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    title: 'परम पूज्य महाराज जी का विश्वगुरु भारत अभियान पर अमृत वाणी 🚩',
    titleHi: 'परम पूज्य महाराज जी का विश्वगुरु भारत अभियान पर अमृत वाणी 🚩',
    category: 'Culture', categoryHi: 'संस्कृति',
    type: 'video'
  }
];

function extractYoutubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function GalleryPage() {
  const { lang } = useLang();
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/gallery`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(item => {
            const isHttp = item.src && (item.src.startsWith('http://') || item.src.startsWith('https://'));
            const mediaSrc = isHttp ? item.src : getMediaUrl(item.src);
            const ytId = extractYoutubeId(item.src);

            return {
              id: 'api_' + item.id,
              src: mediaSrc,
              youtubeId: ytId,
              thumb: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : mediaSrc,
              title: item.title || (item.type === 'video' ? 'Gallery Video' : 'Gallery Photo'),
              titleHi: item.title_hi || item.title || (item.type === 'video' ? 'गैलरी वीडियो' : 'गैलरी फोटो'),
              category: item.category || 'Events',
              categoryHi: item.category_hi || item.category || 'कार्यक्रम',
              type: item.type === 'video' ? 'video' : 'image',
              creator: item.creator_name || null
            };
          });
          setGalleryItems(formatted);
        }
      })
      .catch(err => console.error('Error loading gallery items:', err))
      .finally(() => setLoading(false));
  }, []);

  // Separate API items into Images and Videos
  const apiImages = galleryItems.filter(item => item.type === 'image');
  const apiVideos = galleryItems.filter(item => item.type === 'video');

  const activeImageList = apiImages.length > 0 ? apiImages : fallbackImages;
  const activeVideoList = apiVideos.length > 0 ? apiVideos : fallbackVideos;

  const currentDataset = mediaType === 'image' ? activeImageList : activeVideoList;

  const categories = lang === 'en'
    ? ['All', 'Events', 'Diplomacy', 'Education', 'Infrastructure', 'Environment', 'Youth', 'Empowerment', 'Culture', 'Health']
    : ['सभी', 'कार्यक्रम', 'कूटनीति', 'शिक्षा', 'बुनियादी ढांचा', 'पर्यावरण', 'युवा', 'सशक्तिकरण', 'संस्कृति', 'स्वास्थ्य'];

  const categoryMapEn = ['All', 'Events', 'Diplomacy', 'Education', 'Infrastructure', 'Environment', 'Youth', 'Empowerment', 'Culture', 'Health'];

  const getFilterCategory = () => {
    if (selectedCategory === 'All' || selectedCategory === 'सभी') return 'All';
    const idx = categories.indexOf(selectedCategory);
    return idx >= 0 ? categoryMapEn[idx] : selectedCategory;
  };

  const filtered = currentDataset.filter((item) => {
    const filterCat = getFilterCategory();
    const matchCat = filterCat === 'All' || item.category === filterCat;
    const title = lang === 'en' ? item.title : (item.titleHi || item.title);
    const matchSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % filtered.length);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length);

  return (
    <div className="section-container" style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      {/* Header Title */}
      <div className="section-header">
        <div className="section-title-wrap">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {mediaType === 'image' ? <ImageIcon color="#FF9933" size={28} /> : <VideoIcon color="#FF9933" size={28} />}
            {lang === 'en' ? (mediaType === 'image' ? 'Photo Gallery' : 'Video Gallery') : (mediaType === 'image' ? 'फोटो गैलरी' : 'वीडियो गैलरी')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            {lang === 'en' 
              ? 'Official photographs & videos from events, conclaves and national development programs' 
              : 'कार्यक्रमों, सम्मेलनों और राष्ट्रीय विकास कार्यक्रमों के आधिकारिक फोटो एवं वीडियो'}
          </p>
        </div>
      </div>

      {/* Main Media Tabs: Photos vs Videos */}
      <div style={{
        display: 'flex',
        justify: 'center',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <button
          onClick={() => { setMediaType('image'); setSelectedCategory('All'); setSearchQuery(''); }}
          style={{
            padding: '12px 28px',
            borderRadius: '40px',
            border: 'none',
            background: mediaType === 'image' ? 'linear-gradient(135deg, #FF9933, #FF6B00)' : '#F1F5F9',
            color: mediaType === 'image' ? '#FFF' : '#334155',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: mediaType === 'image' ? '0 6px 20px rgba(255, 153, 51, 0.35)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <ImageIcon size={20} /> {lang === 'en' ? 'Photos' : 'तस्वीरें'} ({activeImageList.length})
        </button>

        <button
          onClick={() => { setMediaType('video'); setSelectedCategory('All'); setSearchQuery(''); }}
          style={{
            padding: '12px 28px',
            borderRadius: '40px',
            border: 'none',
            background: mediaType === 'video' ? 'linear-gradient(135deg, #FF9933, #FF6B00)' : '#F1F5F9',
            color: mediaType === 'video' ? '#FFF' : '#334155',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: mediaType === 'video' ? '0 6px 20px rgba(255, 153, 51, 0.35)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <VideoIcon size={20} /> {lang === 'en' ? 'Videos' : 'वीडियो'} ({activeVideoList.length})
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="dark-card" style={{
        background: '#FFF', padding: '20px', borderRadius: '14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0',
        marginBottom: '35px', display: 'flex', flexWrap: 'wrap', gap: '20px',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={lang === 'en' ? `Search ${mediaType === 'image' ? 'photos' : 'videos'}...` : `${mediaType === 'image' ? 'फ़ोटो' : 'वीडियो'} खोजें...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px',
              border: '1px solid var(--card-border)', outline: 'none', fontSize: '0.9rem',
              background: 'var(--bg-light)', color: 'var(--text-dark)'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '7px 14px', borderRadius: '20px', border: 'none',
                background: selectedCategory === cat ? '#FF9933' : '#F1F5F9',
                color: selectedCategory === cat ? '#FFF' : '#475569',
                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Display Grid */}
      {filtered.length > 0 ? (
        mediaType === 'image' ? (
          /* Photos Grid with Lightbox */
          <div style={{
            columns: '3 300px',
            columnGap: '20px'
          }}>
            {filtered.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => openLightbox(idx)}
                style={{
                  breakInside: 'avoid',
                  marginBottom: '20px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  border: '1px solid var(--card-border)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'; }}
              >
                <img
                  src={img.src}
                  alt={lang === 'en' ? img.title : (img.titleHi || img.title)}
                  style={{ width: '100%', display: 'block' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                {/* Hover Overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  padding: '20px', opacity: 0, transition: 'opacity 0.3s ease'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                >
                  <span style={{ color: '#FF9933', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {lang === 'en' ? img.category : (img.categoryHi || img.category)}
                  </span>
                  <h4 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 700, lineHeight: '1.3' }}>
                    {lang === 'en' ? img.title : (img.titleHi || img.title)}
                  </h4>
                  <ZoomIn size={20} color="#FFF" style={{ position: 'absolute', top: '15px', right: '15px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Videos Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '25px'
          }}>
            {filtered.map((vid) => (
              <div
                key={vid.id}
                className="dark-card"
                style={{
                  background: '#FFF',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveVideoModal(vid)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden', background: '#0F172A' }}>
                  <img
                    src={vid.thumb}
                    alt={lang === 'en' ? vid.title : (vid.titleHi || vid.title)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1545232979-fbf4dce93198?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center'
                  }}>
                    <div style={{
                      width: '54px', height: '54px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(255, 153, 51, 0.5)'
                    }}>
                      <Play size={24} color="#FFF" fill="#FFF" style={{ marginLeft: '3px' }} />
                    </div>
                  </div>
                  <span style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: '#FF9933', color: '#FFF', fontSize: '0.75rem',
                    fontWeight: 700, padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase'
                  }}>
                    {lang === 'en' ? vid.category : (vid.categoryHi || vid.category)}
                  </span>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: '1.35' }}>
                    {lang === 'en' ? vid.title : (vid.titleHi || vid.title)}
                  </h4>
                  {vid.creator && (
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                      Uploaded by: {vid.creator}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <p style={{ color: '#64748B', fontSize: '1.05rem', fontWeight: 600 }}>
            {lang === 'en' ? `No ${mediaType === 'image' ? 'photos' : 'videos'} match your search or filter.` : `आपकी खोज से मेल खाती कोई ${mediaType === 'image' ? 'फ़ोटो' : 'वीडियो'} नहीं मिली।`}
          </p>
        </div>
      )}

      {/* Photos Lightbox Viewer Modal */}
      {lightboxIndex !== null && mediaType === 'image' && filtered[lightboxIndex] && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(11, 27, 44, 0.95)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: '24px', right: '24px',
              background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFF',
              width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            style={{
              position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFF',
              width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <ChevronLeft size={28} />
          </button>

          <div style={{ maxWidth: '90vw', maxHeight: '85vh', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].title}
              style={{ maxWidth: '100%', maxHeight: '75vh', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            />
            <div style={{ marginTop: '16px', color: '#FFF' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {lang === 'en' ? filtered[lightboxIndex].title : (filtered[lightboxIndex].titleHi || filtered[lightboxIndex].title)}
              </h3>
              <span style={{ color: '#FF9933', fontSize: '0.85rem', fontWeight: 600 }}>
                {lang === 'en' ? filtered[lightboxIndex].category : (filtered[lightboxIndex].categoryHi || filtered[lightboxIndex].category)}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            style={{
              position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFF',
              width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(11, 27, 44, 0.92)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}
          onClick={() => setActiveVideoModal(null)}
        >
          <div style={{
            background: '#1A2238',
            width: '100%',
            maxWidth: '850px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            position: 'relative'
          }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideoModal(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px', zIndex: 10,
                background: 'rgba(0,0,0,0.6)', border: 'none', color: '#FFF',
                width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ width: '100%', height: '450px', background: '#000' }}>
              {activeVideoModal.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoModal.youtubeId}?autoplay=1`}
                  title={activeVideoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none' }}
                ></iframe>
              ) : (
                <video
                  src={activeVideoModal.src}
                  controls
                  autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
            </div>

            <div style={{ padding: '24px', color: '#FFF' }}>
              <span style={{ background: '#FF9933', color: '#FFF', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '4px', textTransform: 'uppercase' }}>
                {lang === 'en' ? activeVideoModal.category : (activeVideoModal.categoryHi || activeVideoModal.category)}
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '10px' }}>
                {lang === 'en' ? activeVideoModal.title : (activeVideoModal.titleHi || activeVideoModal.title)}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
