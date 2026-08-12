import React from 'react';
import { Newspaper, ChevronRight, Calendar, Tag, User } from 'lucide-react';
import { useLang } from '../LanguageContext';

const FALLBACK_NEWS = [
  {
    id: 'f1',
    title: 'Welcomes record FDI inflows, attributes growth to policy stability & reforms',
    titleHi: 'Swarna Bharat मोदी ने रिकॉर्ड FDI प्रवाह का स्वागत किया, विकास का श्रेय नीति स्थिरता और सुधारों को दिया',
    date: 'JULY 25, 2026',
    category: 'Economy & Trade',
    categoryHi: 'अर्थव्यवस्था और व्यापार',
    snippet: 'India continues to emerge as a premier global manufacturing and technology hub driven by Ease of Doing Business initiatives.',
    snippetHi: 'भारत व्यापार सुगमता पहलों द्वारा संचालित एक प्रमुख वैश्विक विनिर्माण और प्रौद्योगिकी केंद्र के रूप में उभरता रहा है।',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f2',
    title: 'Swarna Bharat launches PM-DevINE projects aimed at holistic development in North Eastern region',
    titleHi: 'Swarna Bharat ने पूर्वोत्तर क्षेत्र के समग्र विकास के लिए PM-DevINE परियोजनाएं लॉन्च कीं',
    date: 'JULY 24, 2026',
    category: 'Development',
    categoryHi: 'विकास',
    snippet: 'Multiple connectivity, healthcare, and educational institutions dedicated to the nation to empower local youth.',
    snippetHi: 'स्थानीय युवाओं को सशक्त बनाने के लिए राष्ट्र को समर्पित कई कनेक्टिविटी, स्वास्थ्य सेवा और शैक्षणिक संस्थान।',
    image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f3',
    title: 'India surpasses 2 Billion Green Energy Milestone: Swarna Bharat lauds Renewable Energy sector',
    titleHi: 'भारत 2 अरब हरित ऊर्जा मील के पत्थर को पार किया: Swarna Bharat ने नवीकरणीय ऊर्जा क्षेत्र की प्रशंसा की',
    date: 'JULY 22, 2026',
    category: 'Environment',
    categoryHi: 'पर्यावरण',
    snippet: 'Solar and wind infrastructure acceleration positions India as a global benchmark for climate action.',
    snippetHi: 'सौर और पवन बुनियादी ढांचे का त्वरण भारत को जलवायु कार्रवाई के लिए वैश्विक मानदंड के रूप में स्थापित करता है।',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'f4',
    title: 'Inaugurates National Artificial Intelligence & Robotics Research Complex',
    titleHi: 'Swarna Bharat मोदी ने राष्ट्रीय कृत्रिम बुद्धिमत्ता और रोबोटिक्स अनुसंधान परिसर का उद्घाटन किया',
    date: 'JULY 19, 2026',
    category: 'Technology',
    categoryHi: 'प्रौद्योगिकी',
    snippet: 'State-of-the-art facility will foster innovation, research startups, and next-gen tech talent in India.',
    snippetHi: 'अत्याधुनिक सुविधा भारत में नवाचार, अनुसंधान स्टार्टअप और अगली पीढ़ी की तकनीकी प्रतिभा को बढ़ावा देगी।',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80'
  }
];

import { API_URL } from '../config';

const API_BASE = API_URL;
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80';

function formatApiNews(items) {
  return items.map(item => ({
    id: 'api_' + item.id,
    title: item.title || '',
    titleHi: item.title_hi || item.title || '',
    date: item.date
      ? item.date.toUpperCase()
      : new Date(item.created_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
    category: item.category || 'General',
    categoryHi: item.category_hi || item.category || 'सामान्य',
    snippet: item.snippet || '',
    snippetHi: item.snippet_hi || item.snippet || '',
    image: item.image || DEFAULT_IMG,
    publisher: item.creator_name || null,
    publisherRole: item.creator_role || null,
  }));
}

export default function NewsPage() {
  const { lang, t } = useLang();
  const [newsList, setNewsList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [usingFallback, setUsingFallback] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/news`)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNewsList(formatApiNews(data));
          setUsingFallback(false);
        } else {
          setNewsList(FALLBACK_NEWS);
          setUsingFallback(true);
        }
      })
      .catch(() => {
        setNewsList(FALLBACK_NEWS);
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const sectionStyle = {
    padding: '0.5rem 0 2rem',
  };

  const badgeStyle = (color = '#FF9933') => ({
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color,
    background: color + '18',
    padding: '2px 10px',
    borderRadius: '40px',
    textTransform: 'uppercase',
  });

  const publisherStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.75rem',
    color: 'var(--text-muted, #64748B)',
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: '1px solid rgba(0,0,0,0.06)',
  };

  return (
    <div className="section-container" style={sectionStyle}>
      <div className="section-header">
        <div className="section-title-wrap">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Newspaper color="#FF9933" size={28} /> {t.newsPage.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>{t.newsPage.subtitle}</p>
        </div>
        {usingFallback && (
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', background: '#F1F5F9', padding: '4px 12px', borderRadius: '40px' }}>
            📰 Sample News
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
          <p>Loading latest news...</p>
        </div>
      ) : newsList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
          <Newspaper size={48} strokeWidth={1} style={{ marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>No news articles available yet.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Check back soon for the latest updates.</p>
        </div>
      ) : (
        <div className="news-grid">
          {newsList.map((item) => (
            <div key={item.id} className="news-card">
              <div className="news-card-img">
                <img
                  src={item.image}
                  alt={lang === 'en' ? item.title : item.titleHi}
                  onError={e => { e.target.onerror = null; e.target.src = DEFAULT_IMG; }}
                />
              </div>
              <div className="news-card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="news-date" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {item.date}
                  </span>
                  <span style={badgeStyle()}>
                    <Tag size={10} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                    {lang === 'en' ? item.category : item.categoryHi}
                  </span>
                </div>
                <h3 className="news-title">{lang === 'en' ? item.title : item.titleHi}</h3>
                <p className="news-snippet">{lang === 'en' ? item.snippet : item.snippetHi}</p>
                {item.publisher && (
                  <div style={publisherStyle}>
                    <User size={12} />
                    <span>{item.publisher}</span>
                    {item.publisherRole && (
                      <span style={{ color: '#CBD5E1', marginLeft: '2px' }}>· {item.publisherRole}</span>
                    )}
                  </div>
                )}
                <a href="#" className="view-all-link" style={{ fontSize: '0.85rem', marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {t.newsPage.readMore} <ChevronRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
