import React, { useState } from 'react';
import { useLang } from '../LanguageContext';
import { Calendar, MapPin, Tag, ArrowLeft, Share2, Check, ExternalLink, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMediaUrl } from '../config';

export default function EventDetailsPage({ event, setActiveTab, onBack }) {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [registered, setRegistered] = useState(false);

  if (!event) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h2>{lang === 'en' ? 'Event Not Found' : 'कार्यक्रम नहीं मिला'}</h2>
        <button
          onClick={() => setActiveTab ? setActiveTab('Events') : (onBack && onBack())}
          style={{
            marginTop: '20px',
            background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
            color: '#FFF',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '30px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          ← {lang === 'en' ? 'Back to Events' : 'वापस कार्यक्रमों पर जाएं'}
        </button>
      </div>
    );
  }

  // Parse gallery images
  let galleryImages = [];
  try {
    if (Array.isArray(event.gallery_images)) {
      galleryImages = event.gallery_images;
    } else if (typeof event.gallery_images === 'string') {
      galleryImages = JSON.parse(event.gallery_images);
    }
  } catch (e) {
    galleryImages = [];
  }

  const title = (lang === 'hi' && event.title_hi) ? event.title_hi : event.title;
  const location = (lang === 'hi' && event.location_hi) ? event.location_hi : event.location;
  const category = (lang === 'hi' && event.category_hi) ? event.category_hi : event.category;
  const desc = (lang === 'hi' && event.desc_hi) ? event.desc_hi : (event.desc || event.snippet || '');

  const mainCoverImg = event.image ? getMediaUrl(event.image) : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const openLightbox = (index) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
    }
  };

  return (
    <div style={{ background: 'var(--bg-light)', color: 'var(--text-dark)', minHeight: '90vh', paddingBottom: '80px' }}>
      
      {/* Top Header Navigation Bar */}
      <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', padding: '16px 24px', sticky: 'top', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => setActiveTab ? setActiveTab('Events') : (onBack && onBack())}
            style={{
              background: 'var(--bg-alt)',
              border: '1px solid var(--card-border)',
              padding: '8px 20px',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: 'var(--text-dark)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={16} />
            {lang === 'en' ? 'Back to Events' : 'वापस कार्यक्रमों पर जाएं'}
          </button>

          <button
            onClick={handleShare}
            style={{
              background: copied ? '#16A34A' : 'linear-gradient(135deg, #FF9933, #FF6B00)',
              color: '#FFF',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            {copied ? (lang === 'en' ? 'Link Copied!' : 'लिंक कॉपी हो गया!') : (lang === 'en' ? 'Share Event' : 'शेयर करें')}
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0', padding: '0 20px' }}>
        
        {/* Event Banner & Title Hero Card */}
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid var(--card-border)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          marginBottom: '32px'
        }}>
          {mainCoverImg && (
            <div style={{ width: '100%', maxHeight: '420px', overflow: 'hidden', position: 'relative' }}>
              <img 
                src={mainCoverImg} 
                alt={title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.75), transparent 60%)'
              }} />

              {/* Category Pill Overlay */}
              <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', gap: '10px' }}>
                <span style={{
                  background: 'rgba(255, 153, 51, 0.92)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFF',
                  padding: '6px 16px',
                  borderRadius: '30px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Tag size={14} /> {category || 'Event'}
                </span>
              </div>
            </div>
          )}

          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Date Box */}
              <div style={{
                background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
                color: '#FFF',
                padding: '16px 22px',
                borderRadius: '20px',
                textAlign: 'center',
                minWidth: '95px',
                boxShadow: '0 6px 18px rgba(255,153,51,0.25)',
                flexShrink: 0
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1 }}>{event.day || '15'}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px', letterSpacing: '1px' }}>{event.month || 'AUG'}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '2px' }}>{event.year || '2026'}</div>
              </div>

              {/* Title & Meta Info */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.25 }}>
                  {title}
                </h1>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} color="#FF9933" />
                    <span>{location || 'India'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} color="#FF9933" />
                    <span>{event.day} {event.month} {event.year}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Column Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          {/* LEFT COLUMN: About & Photos */}
          <div style={{ gridColumn: 'span 2' }}>
            
            {/* Event Description Section */}
            <div style={{
              background: 'var(--card-bg)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid var(--card-border)',
              marginBottom: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{ margin: '0 0 18px', fontSize: '1.35rem', color: 'var(--text-dark)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '4px', height: '22px', background: '#FF9933', borderRadius: '4px' }} />
                {lang === 'en' ? 'About This Event' : 'कार्यक्रम विवरण'}
              </h3>
              
              <div style={{
                fontSize: '1.05rem',
                lineHeight: '1.8',
                color: 'var(--text-muted)',
                whiteSpace: 'pre-line'
              }}>
                {desc || (lang === 'en' ? 'Detailed information for this event will be updated soon.' : 'इस कार्यक्रम के लिए विस्तृत जानकारी जल्द ही अपडेट की जाएगी।')}
              </div>
            </div>

            {/* Event Gallery Grid (Multiple Images) */}
            {galleryImages && galleryImages.length > 0 && (
              <div style={{
                background: 'var(--card-bg)',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid var(--card-border)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-dark)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ImageIcon size={22} color="#FF9933" />
                    {lang === 'en' ? 'Event Photo Gallery' : 'कार्यक्रम फ़ोटो गैलरी'}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                    {galleryImages.length} {lang === 'en' ? 'Photos' : 'फ़ोटो'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  {galleryImages.map((imgSrc, index) => {
                    const fullImgUrl = getMediaUrl(imgSrc);
                    return (
                      <div 
                        key={index}
                        onClick={() => openLightbox(index)}
                        style={{
                          height: '160px',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative',
                          border: '1px solid var(--card-border)',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.03)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <img 
                          src={fullImgUrl} 
                          alt={`Gallery photo ${index + 1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.2)',
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          color: '#FFF'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                        >
                          <span style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                            🔍 {lang === 'en' ? 'View Photo' : 'फ़ोटो देखें'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Event Summary & Action Card */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{
              background: 'var(--card-bg)',
              borderRadius: '24px',
              padding: '28px',
              border: '1px solid var(--card-border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              position: 'sticky',
              top: '90px'
            }}>
              <h4 style={{ margin: '0 0 20px', fontSize: '1.2rem', color: 'var(--text-dark)', fontWeight: 800 }}>
                {lang === 'en' ? 'Event Details Summary' : 'कार्यक्रम सारांश'}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'var(--bg-alt)', padding: '12px 16px', borderRadius: '14px' }}>
                  <Calendar size={22} color="#FF9933" />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{lang === 'en' ? 'Date' : 'दिनांक'}</span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>{event.day} {event.month} {event.year}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'var(--bg-alt)', padding: '12px 16px', borderRadius: '14px' }}>
                  <MapPin size={22} color="#FF9933" />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{lang === 'en' ? 'Venue / Location' : 'स्थान'}</span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>{location || 'India'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'var(--bg-alt)', padding: '12px 16px', borderRadius: '14px' }}>
                  <Tag size={22} color="#FF9933" />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{lang === 'en' ? 'Category' : 'श्रेणी'}</span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)' }}>{category || 'National Event'}</div>
                  </div>
                </div>

              </div>

              {/* Register / Participate CTA Button */}
              <button
                onClick={() => setRegistered(true)}
                disabled={registered}
                style={{
                  width: '100%',
                  background: registered ? '#16A34A' : 'linear-gradient(135deg, #FF9933, #FF6B00)',
                  color: '#FFF',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '30px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: registered ? 'default' : 'pointer',
                  boxShadow: registered ? 'none' : '0 6px 20px rgba(255,153,51,0.3)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {registered ? (
                  <>
                    <Check size={20} />
                    {lang === 'en' ? 'Successfully Registered!' : 'सफलतापूर्वक पंजीकृत!'}
                  </>
                ) : (
                  <>
                    <ExternalLink size={20} />
                    {lang === 'en' ? 'Register / Participate Now' : 'अभी भाग लें / पंजीकरण करें'}
                  </>
                )}
              </button>

              {registered && (
                <div style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', textAlign: 'center', marginTop: '14px', fontWeight: 600 }}>
                  🎉 {lang === 'en' ? 'Your seat has been reserved. Organizer details will be sent via SMS/Email.' : 'आपकी सीट सुरक्षित कर ली गई है। विवरण जल्द ही एसएमएस/ईमेल पर भेजा जाएगा।'}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {selectedImageIndex !== null && galleryImages[selectedImageIndex] && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#FFF',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>

          {/* Prev Button */}
          {galleryImages.length > 1 && (
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '24px',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#FFF',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image Container */}
          <div style={{ maxWidth: '90vw', maxHeight: '85vh', textAlign: 'center' }}>
            <img 
              src={getMediaUrl(galleryImages[selectedImageIndex])} 
              alt="Gallery Preview" 
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} 
            />
            <div style={{ color: '#94A3B8', marginTop: '14px', fontSize: '0.9rem', fontWeight: 600 }}>
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>
          </div>

          {/* Next Button */}
          {galleryImages.length > 1 && (
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '24px',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#FFF',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}

    </div>
  );
}
