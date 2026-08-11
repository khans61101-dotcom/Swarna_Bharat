import React, { useState } from 'react';
import { Image, Search, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '../LanguageContext';

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    title: 'PM Modi at National Event',
    titleHi: 'PM मोदी राष्ट्रीय कार्यक्रम में',
    category: 'Events', categoryHi: 'कार्यक्रम'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    title: 'International Diplomatic Summit',
    titleHi: 'अंतर्राष्ट्रीय कूटनीतिक शिखर सम्मेलन',
    category: 'Diplomacy', categoryHi: 'कूटनीति'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    title: 'National Conclave on Education',
    titleHi: 'शिक्षा पर राष्ट्रीय सम्मेलन',
    category: 'Education', categoryHi: 'शिक्षा'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    title: 'Infrastructure Development Inauguration',
    titleHi: 'बुनियादी ढांचा विकास उद्घाटन',
    category: 'Infrastructure', categoryHi: 'बुनियादी ढांचा'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    title: 'Solar Energy Green Initiative',
    titleHi: 'सौर ऊर्जा हरित पहल',
    category: 'Environment', categoryHi: 'पर्यावरण'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    title: 'Youth & Technology Innovation Forum',
    titleHi: 'युवा और प्रौद्योगिकी नवाचार मंच',
    category: 'Youth', categoryHi: 'युवा'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=800&q=80',
    title: 'Women Empowerment Program',
    titleHi: 'महिला सशक्तिकरण कार्यक्रम',
    category: 'Empowerment', categoryHi: 'सशक्तिकरण'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    title: 'International Day of Yoga Celebrations',
    titleHi: 'अंतर्राष्ट्रीय योग दिवस समारोह',
    category: 'Culture', categoryHi: 'संस्कृति'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    title: 'Science Congress Keynote Address',
    titleHi: 'विज्ञान कांग्रेस मुख्य भाषण',
    category: 'Education', categoryHi: 'शिक्षा'
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    title: 'Mann Ki Baat Recording Session',
    titleHi: 'मन की बात रिकॉर्डिंग सत्र',
    category: 'Events', categoryHi: 'कार्यक्रम'
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80',
    title: 'Vande Bharat Express Launch',
    titleHi: 'वंदे भारत एक्सप्रेस लॉन्च',
    category: 'Infrastructure', categoryHi: 'बुनियादी ढांचा'
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    title: 'Digital Health Mission Summit',
    titleHi: 'डिजिटल स्वास्थ्य मिशन शिखर सम्मेलन',
    category: 'Health', categoryHi: 'स्वास्थ्य'
  }
];

import { API_URL } from '../config';

export default function GalleryPage() {
  const { lang } = useLang();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [imagesList, setImagesList] = useState(galleryImages);

  React.useEffect(() => {
    fetch(`${API_URL}/gallery`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(item => ({
            id: 'api_' + item.id,
            src: item.src,
            title: item.title || 'Gallery Photo',
            titleHi: item.title_hi || item.title || 'गैलरी फोटो',
            category: item.category || 'Events',
            categoryHi: item.category_hi || item.category || 'कार्यक्रम'
          }));
          setImagesList([...formatted, ...galleryImages]);
        }
      })
      .catch(err => console.log('Using static gallery fallback'));
  }, []);

  const categories = lang === 'en'
    ? ['All', 'Events', 'Diplomacy', 'Education', 'Infrastructure', 'Environment', 'Youth', 'Empowerment', 'Culture', 'Health']
    : ['सभी', 'कार्यक्रम', 'कूटनीति', 'शिक्षा', 'बुनियादी ढांचा', 'पर्यावरण', 'युवा', 'सशक्तिकरण', 'संस्कृति', 'स्वास्थ्य'];

  const categoryMapEn = ['All', 'Events', 'Diplomacy', 'Education', 'Infrastructure', 'Environment', 'Youth', 'Empowerment', 'Culture', 'Health'];

  const getFilterCategory = () => {
    if (selectedCategory === 'All' || selectedCategory === 'सभी') return 'All';
    const idx = categories.indexOf(selectedCategory);
    return idx >= 0 ? categoryMapEn[idx] : selectedCategory;
  };

  const filtered = imagesList.filter((img) => {
    const filterCat = getFilterCategory();
    const matchCat = filterCat === 'All' || img.category === filterCat;
    const title = lang === 'en' ? img.title : img.titleHi;
    const matchSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const openLightbox = (idx) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % filtered.length);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + filtered.length) % filtered.length);

  return (
    <div className="section-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image color="#FF9933" size={28} /> {lang === 'en' ? 'Photo Gallery' : 'फोटो गैलरी'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            {lang === 'en' ? 'Official photographs from events, summits & national programs' : 'कार्यक्रमों, शिखर सम्मेलनों और राष्ट्रीय कार्यक्रमों की आधिकारिक तस्वीरें'}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="dark-card" style={{
        background: '#FFF', padding: '20px', borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0',
        marginBottom: '35px', display: 'flex', flexWrap: 'wrap', gap: '20px',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={lang === 'en' ? 'Search photos...' : 'फ़ोटो खोजें...'}
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

      {/* Masonry-style Gallery Grid */}
      {filtered.length > 0 ? (
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
                borderRadius: '12px',
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
                alt={lang === 'en' ? img.title : img.titleHi}
                style={{ width: '100%', display: 'block' }}
              />
              {/* Hover Overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: '20px', opacity: 0, transition: 'opacity 0.3s ease'
              }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
              >
                <span style={{ color: '#FF9933', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  {lang === 'en' ? img.category : img.categoryHi}
                </span>
                <h4 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 700, lineHeight: '1.3' }}>
                  {lang === 'en' ? img.title : img.titleHi}
                </h4>
                <ZoomIn size={20} color="#FFF" style={{ position: 'absolute', top: '15px', right: '15px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px', background: 'var(--card-bg)', borderRadius: '12px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            {lang === 'en' ? 'No photos found matching your search.' : 'आपकी खोज से मेल खाने वाली कोई तस्वीरें नहीं मिलीं।'}
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: '25px', right: '25px',
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF',
              width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s', zIndex: 10
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#FF9933'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <X size={24} />
          </button>

          {/* Prev Button */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            style={{
              position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF',
              width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s', zIndex: 10
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#FF9933'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            style={{
              position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF',
              width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s', zIndex: 10
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#FF9933'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <ChevronRight size={28} />
          </button>

          {/* Image */}
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '85vw', maxHeight: '85vh', textAlign: 'center' }}>
            <img
              src={filtered[lightboxIndex].src}
              alt={lang === 'en' ? filtered[lightboxIndex].title : filtered[lightboxIndex].titleHi}
              style={{
                maxWidth: '100%', maxHeight: '78vh', objectFit: 'contain',
                borderRadius: '10px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}
            />
            <div style={{ marginTop: '15px', color: '#FFF' }}>
              <span style={{ color: '#FF9933', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                {lang === 'en' ? filtered[lightboxIndex].category : filtered[lightboxIndex].categoryHi}
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '4px' }}>
                {lang === 'en' ? filtered[lightboxIndex].title : filtered[lightboxIndex].titleHi}
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>
                {lightboxIndex + 1} / {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
