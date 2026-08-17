import React, { useState, useEffect } from 'react';
import { useLang } from '../LanguageContext';
import { FileText, Download, Search, Filter, Calendar, File, Check, ExternalLink } from 'lucide-react';
import { API_URL, getMediaUrl } from '../config';

export default function DocumentsPage() {
  const { lang } = useLang();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchDocuments = () => {
    setLoading(true);
    fetch(`${API_URL}/documents`)
      .then(res => {
        if (!res.ok) throw new Error('API returned status ' + res.status);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setDocuments(data);
        } else {
          setDocuments([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching documents from server:', err);
        setDocuments([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const categories = lang === 'en'
    ? ['All', 'Policy Document', 'Circular & Notice', 'Application Form', 'Gazette Notification', 'Annual Report', 'General']
    : ['सभी', 'नीति दस्तावेज़', 'परिपत्र और सूचना', 'आवेदन पत्र', 'राजपत्र अधिसूचना', 'वार्षिक रिपोर्ट', 'सामान्य'];

  const normalizeCategory = (cat) => {
    if (!cat) return 'all';
    const c = cat.trim().toLowerCase();
    if (c === 'all' || c === 'सभी') return 'all';
    if (c.includes('policy') || c.includes('नीति')) return 'policy';
    if (c.includes('circular') || c.includes('notice') || c.includes('परिपत्र')) return 'circular';
    if (c.includes('application') || c.includes('form') || c.includes('आवेदन')) return 'form';
    if (c.includes('gazette') || c.includes('राजपत्र')) return 'gazette';
    if (c.includes('annual') || c.includes('report') || c.includes('वार्षिक')) return 'report';
    return c;
  };

  const filteredDocs = (Array.isArray(documents) ? documents : []).filter(doc => {
    if (!doc) return false;
    const title = (doc.title || '').toLowerCase();
    const titleHi = (doc.title_hi || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || title.includes(q) || titleHi.includes(q);

    const targetCat = normalizeCategory(selectedCategory);
    const docCat = normalizeCategory(doc.category);
    const matchesCat = targetCat === 'all' || docCat === targetCat;

    return matchesSearch && matchesCat;
  });

  const getFileBadgeClass = (fileType, fileUrl) => {
    const ft = (fileType || '').toLowerCase();
    const url = (fileUrl || '').toLowerCase();
    if (ft.includes('pdf') || url.endsWith('.pdf')) return { bg: '#FEF2F2', color: '#DC2626', label: 'PDF' };
    if (ft.includes('doc') || url.endsWith('.doc') || url.endsWith('.docx')) return { bg: '#EFF6FF', color: '#2563EB', label: 'DOC' };
    if (ft.includes('xls') || url.endsWith('.xls') || url.endsWith('.xlsx')) return { bg: '#F0FDF4', color: '#16A34A', label: 'XLS' };
    if (ft.includes('zip') || url.endsWith('.zip')) return { bg: '#FFF7ED', color: '#EA580C', label: 'ZIP' };
    if (ft.includes('jpg') || ft.includes('png') || ft.includes('jpeg') || ft.includes('webp') || url.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return { bg: '#FDF4FF', color: '#C026D3', label: (ft || 'IMG').toUpperCase() };
    }
    return { bg: '#F5F3FF', color: '#7C3AED', label: (ft || 'FILE').toUpperCase() };
  };

  return (
    <div className="section-container" style={{ padding: '60px 20px 80px', minHeight: '85vh', background: 'var(--bg-light)', color: 'var(--text-dark)' }}>
      
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '45px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255, 153, 51, 0.12)',
          padding: '8px 20px',
          borderRadius: '50px',
          marginBottom: '16px'
        }}>
          <FileText size={20} color="#FF9933" />
          <span style={{ color: '#FF9933', fontWeight: 700, fontSize: '0.9rem' }}>
            {lang === 'en' ? 'Official Downloads Portal' : 'आधिकारिक डाउनलोड पोर्टल'}
          </span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          {lang === 'en' ? 'Important Documents & Circulars' : 'महत्वपूर्ण दस्तावेज़ एवं परिपत्र'}
        </h2>

        <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
          {lang === 'en'
            ? 'Access and download official policy guidelines, application forms, public notices, and gazette notifications.'
            : 'आधिकारिक नीतिगत दिशा-निर्देश, आवेदन पत्र, सार्वजनिक सूचनाएं और राजपत्र अधिसूचनाएं देखें और डाउनलोड करें।'}
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div style={{
        background: 'var(--card-bg)',
        padding: '24px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        border: '1px solid var(--card-border)',
        marginBottom: '40px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder={lang === 'en' ? 'Search documents by title, keyword...' : 'शीर्षक या कीवर्ड द्वारा दस्तावेज़ खोजें...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              borderRadius: '12px',
              border: '1px solid var(--card-border)',
              outline: 'none',
              fontSize: '0.92rem',
              background: 'var(--bg-alt)',
              color: 'var(--text-dark)'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '30px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #FF9933, #FF6B00)' : 'var(--bg-alt)',
                  color: isActive ? '#FFF' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(255,153,51,0.3)' : 'none'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          {lang === 'en' ? 'Loading documents...' : 'दस्तावेज़ लोड हो रहे हैं...'}
        </div>
      ) : filteredDocs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredDocs.map((doc, idx) => {
            const badge = getFileBadgeClass(doc.file_type, doc.file_url);
            const downloadUrl = doc.file_url ? (doc.file_url.startsWith('http') ? doc.file_url : getMediaUrl(doc.file_url)) : '#';
            const displayTitle = (lang === 'hi' && doc.title_hi) ? doc.title_hi : doc.title;
            const dateStr = doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '2026';

            return (
              <div
                key={doc.id || idx}
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid var(--card-border)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{
                      background: badge.bg,
                      color: badge.color,
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      letterSpacing: '0.5px'
                    }}>
                      {badge.label}
                    </span>

                    <span style={{
                      background: 'var(--bg-alt)',
                      color: 'var(--text-muted)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}>
                      {doc.category || 'General'}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: 'var(--text-dark)',
                    margin: '0 0 12px',
                    lineHeight: '1.4'
                  }}>
                    {displayTitle}
                  </h3>
                </div>

                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="#FF9933" /> {dateStr} {doc.file_size ? `• ${doc.file_size}` : ''}
                  </div>

                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={{
                      background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
                      color: '#FFF',
                      padding: '8px 18px',
                      borderRadius: '30px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(255,153,51,0.25)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Download size={15} /> {lang === 'en' ? 'Download' : 'डाउनलोड'}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--card-bg)', borderRadius: '20px', border: '1px dashed var(--card-border)' }}>
          <FileText size={48} color="#CBD5E1" style={{ marginBottom: '12px' }} />
          <h3 style={{ color: 'var(--text-dark)', margin: '0 0 8px', fontWeight: 700 }}>
            {lang === 'en' ? 'No Documents Found' : 'कोई दस्तावेज़ नहीं मिला'}
          </h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.92rem' }}>
            {lang === 'en' ? 'Try adjusting your search query or selected category filter.' : 'अपनी खोज या चुने गए श्रेणी फ़िल्टर को बदलने का प्रयास करें।'}
          </p>
        </div>
      )}

    </div>
  );
}
