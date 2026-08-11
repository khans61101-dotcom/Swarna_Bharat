import React, { useState } from 'react';
import { Calendar, MapPin, Search, Filter, ChevronRight, Clock } from 'lucide-react';
import { useLang } from '../LanguageContext';

const allEventsList = [
  {
    id: 1,
    day: '07 & 08',
    month: 'FEB',
    year: '2026',
    title: 'Building Flourishing Futures: National Conclave on Early Education & Youth Development',
    location: 'Bharat Mandapam, Pragati Maidan, New Delhi',
    category: 'National Conclave',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    desc: 'Bringing together educationists, policymakers, and innovators to shape early childhood development and NEP implementation across India.'
  },
  {
    id: 2,
    day: '24',
    month: 'SEP',
    year: '2025',
    title: 'India Day @ UNGA: Highlighting India’s Leadership on SDGs, AI-Driven Development & Climate Action',
    location: 'United Nations Headquarters, New York',
    category: 'Global Summit',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
    desc: 'Showcasing India’s digital public infrastructure, green energy transition, and global leadership at the UN General Assembly.'
  },
  {
    id: 3,
    day: '25',
    month: 'SEP',
    year: '2024',
    title: 'Global Youth & Technology Forum: Crafting a Bold Vision for Sustainable Innovation',
    location: 'Amrit Udyan & Vigyan Bhawan, New Delhi',
    category: 'Youth Forum',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    desc: 'Interactive exchange between national startup founders, AI researchers, and international youth delegates on emerging tech.'
  },
  {
    id: 4,
    day: '15',
    month: 'AUG',
    year: '2024',
    title: '78th Independence Day Address from Historic Red Fort',
    location: 'Red Fort, Old Delhi',
    category: 'National Address',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
    desc: 'National address outlining key achievements under Viksit Bharat 2047, manufacturing roadmaps, and semiconductor missions.'
  },
  {
    id: 5,
    day: '21',
    month: 'JUN',
    year: '2024',
    title: 'International Day of Yoga 10th Anniversary Celebrations',
    location: 'Srinagar, Jammu & Kashmir',
    category: 'Cultural & Wellness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    desc: 'Mass Yoga demonstration promoting holistic health, mindfulness, and global wellness traditions.'
  }
];

import { API_URL } from '../config';

export default function EventsPage() {
  const { lang, t } = useLang();
  const ep = t.eventsPage;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [eventsList, setEventsList] = useState(allEventsList);

  React.useEffect(() => {
    fetch(`${API_URL}/events`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map(item => ({
            id: 'api_' + item.id,
            day: item.day || '01',
            month: item.month || 'JAN',
            year: item.year || '2026',
            title: item.title,
            titleHi: item.title_hi || item.title,
            location: item.location || 'New Delhi',
            locationHi: item.location_hi || item.location || 'नई दिल्ली',
            category: item.category || 'National Conclave',
            categoryHi: item.category_hi || item.category || 'राष्ट्रीय सम्मेलन',
            image: item.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
            desc: item.desc || '',
            descHi: item.desc_hi || item.desc || ''
          }));
          setEventsList([...formatted, ...allEventsList]);
        }
      })
      .catch(err => console.log('Using static events fallback'));
  }, []);

  const categories = lang === 'en'
    ? ['All', 'National Conclave', 'Global Summit', 'Youth Forum', 'National Address', 'Cultural & Wellness']
    : ['सभी', 'राष्ट्रीय सम्मेलन', 'वैश्विक शिखर सम्मेलन', 'युवा मंच', 'राष्ट्रीय संबोधन', 'सांस्कृतिक और कल्याण'];

  const filteredEvents = eventsList.filter((evt) => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="section-container">
      {/* Header Title */}
      <div className="section-header">
        <div className="section-title-wrap">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar color="#FF9933" size={28} /> {ep.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>{ep.subtitle}</p>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div style={{
        background: '#FFF',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        border: '1px solid #E2E8F0',
        marginBottom: '35px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder={ep.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: 'none',
                background: selectedCategory === cat ? '#FF9933' : '#F1F5F9',
                color: selectedCategory === cat ? '#FFF' : '#475569',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt) => (
            <div 
              key={evt.id}
              style={{
                background: '#FFF',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                border: '1px solid #E2E8F0',
                display: 'grid',
                gridTemplateColumns: 'minmax(120px, 160px) 1fr minmax(200px, 280px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
              }}
            >
              {/* Date Column */}
              <div style={{
                background: '#F8FAFC',
                borderRight: '1px solid #E2E8F0',
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {evt.month}
                </span>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1E293B', lineHeight: '1' }}>
                  {evt.day}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>
                  {evt.year}
                </span>
              </div>

              {/* Event Content Details */}
              <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: '#FF9933', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  {evt.category}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1A2238', marginBottom: '10px', lineHeight: '1.35' }}>
                  {evt.title}
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '12px', lineHeight: '1.5' }}>
                  {evt.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>
                  <MapPin size={16} color="#FF9933" /> {evt.location}
                </div>
              </div>

              {/* Image Preview */}
              <div style={{ position: 'relative', height: '100%', minHeight: '180px' }}>
                <img 
                  src={evt.image} 
                  alt={evt.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', background: 'var(--card-bg)', borderRadius: '12px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              {lang === 'en' ? 'No events found matching your search query.' : 'आपकी खोज क्वेरी से मेल खाने वाले कोई कार्यक्रम नहीं मिले।'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
