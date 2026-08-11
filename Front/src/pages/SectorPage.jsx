import React, { useState } from 'react';
import { 
  Sun, 
  Heart, 
  BookOpen, 
  Award, 
  Users, 
  Shield, 
  Palette, 
  Trees, 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Send
} from 'lucide-react';
import { useLang } from '../LanguageContext';
import { sectorDataList } from '../data/sectorData';

const iconMap = {
  Sun: Sun,
  Heart: Heart,
  BookOpen: BookOpen,
  Award: Award,
  Users: Users,
  Shield: Shield,
  Palette: Palette,
  Trees: Trees,
  Building2: Building2,
};

export default function SectorPage({ initialSectorId = 'rural', setActiveTab }) {
  const { lang } = useLang();
  const [currentSectorId, setCurrentSectorId] = useState(initialSectorId);

  const sector = sectorDataList.find(s => s.id === currentSectorId) || sectorDataList[0];
  const IconComp = iconMap[sector.iconName] || Sun;

  return (
    <div style={{ background: 'var(--bg-main)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* Top Sector Navigation Bar */}
      <div style={{ background: '#FAF7F2', borderBottom: '1px solid #E5E0D8', padding: '20px 15px' }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <button 
              onClick={() => setActiveTab('Home')}
              style={{
                background: '#FFF',
                border: '1px solid #CBD5E1',
                padding: '6px 16px',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-dark)'
              }}
            >
              <ArrowLeft size={16} /> {lang === 'en' ? 'Back to Home' : 'मुख्य पृष्ठ पर लौटें'}
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-saffron)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {lang === 'en' ? 'Key Governance Sectors' : 'प्रमुख शासन क्षेत्र'}
            </span>
          </div>

          <div style={{ display: 'flex', overflowX: 'auto', gap: '20px', paddingBottom: '8px', scrollbarWidth: 'thin' }}>
            {sectorDataList.map((item) => {
              const ItemIcon = iconMap[item.iconName] || Sun;
              const isActive = item.id === currentSectorId;
              return (
                <div
                  key={item.id}
                  onClick={() => setCurrentSectorId(item.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '95px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    opacity: isActive ? 1 : 0.7,
                    transition: 'all 0.2s ease',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <div style={{
                    width: '62px',
                    height: '62px',
                    borderRadius: '50%',
                    border: `2.5px solid ${item.borderColor}`,
                    padding: '2px',
                    background: isActive ? `${item.borderColor}15` : '#FFF',
                    boxShadow: isActive ? `0 6px 16px ${item.borderColor}40` : '0 2px 6px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '6px'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: `1.5px solid ${item.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#FFF'
                    }}>
                      <ItemIcon size={22} color={item.borderColor} />
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? item.borderColor : 'var(--text-dark)',
                    lineHeight: '1.2'
                  }}>
                    {lang === 'en' ? item.name : item.nameHi}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero Banner for Selected Sector */}
      <div style={{
        position: 'relative',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.88)), url(${sector.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#FFF',
        padding: '70px 20px 80px',
        borderBottom: `4px solid ${sector.borderColor}`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: `${sector.borderColor}30`, border: `1px solid ${sector.borderColor}`, padding: '6px 16px', borderRadius: '30px', marginBottom: '20px' }}>
            <IconComp size={20} color={sector.borderColor} />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFF' }}>
              {lang === 'en' ? sector.name : sector.nameHi}
            </span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '15px', lineHeight: '1.25' }}>
            {lang === 'en' ? sector.name : sector.nameHi}
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#E2E8F0', maxWidth: '850px', marginBottom: '25px', lineHeight: '1.6', fontWeight: 500 }}>
            {lang === 'en' ? sector.tagline : sector.taglineHi}
          </p>

          <p style={{ fontSize: '0.98rem', color: '#94A3B8', maxWidth: '850px', lineHeight: '1.7' }}>
            {lang === 'en' ? sector.desc : sector.descHi}
          </p>
        </div>
      </div>

      {/* Sector Impact Stats Grid */}
      <div style={{ maxWidth: '1200px', margin: '-40px auto 50px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {sector.stats.map((stat, idx) => (
            <div key={idx} style={{
              background: 'var(--card-bg)',
              borderRadius: '16px',
              padding: '25px 20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderTop: `4px solid ${sector.borderColor}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: sector.borderColor }}>{stat.value}</span>
                <TrendingUp size={24} color={sector.borderColor} />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                {lang === 'en' ? stat.label : stat.labelHi}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Flagship Initiatives & Schemes */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 60px', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 color={sector.borderColor} size={28} />
              {lang === 'en' ? 'Flagship Initiatives & Schemes' : 'प्रमुख योजनाएं एवं पहल'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
              {lang === 'en' ? `Transformative government programs shaping the ${sector.name} sector` : `${sector.nameHi} क्षेत्र को आकार देने वाले प्रमुख सरकारी कार्यक्रम`}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          {sector.initiatives.map((init, index) => (
            <div key={index} style={{
              background: 'var(--card-bg)',
              borderRadius: '16px',
              padding: '30px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              transition: 'transform 0.3s ease, boxShadow 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{
                  background: `${sector.borderColor}15`,
                  color: sector.borderColor,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '15px'
                }}>
                  {lang === 'en' ? `Initiative 0${index + 1}` : `पहल 0${index + 1}`}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px', lineHeight: '1.35' }}>
                  {lang === 'en' ? init.title : init.titleHi}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  {lang === 'en' ? init.desc : init.descHi}
                </p>
              </div>

              <div style={{ marginTop: '25px', paddingTop: '18px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: sector.borderColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {lang === 'en' ? 'Active Scheme' : 'सक्रिय योजना'} <CheckCircle2 size={14} />
                </span>
                <button
                  onClick={() => setActiveTab('Enquiry')}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${sector.borderColor}`,
                    color: sector.borderColor,
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {lang === 'en' ? 'Inquire' : 'पूछताछ'} <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Action & Inquiry Callout */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${sector.borderColor}15, #1E293B)`,
          borderRadius: '24px',
          padding: '40px',
          color: '#FFF',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '25px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px', color: '#FFF' }}>
              {lang === 'en' ? `Have Suggestions for ${sector.name}?` : `${sector.nameHi} के लिए सुझाव देना चाहते हैं?`}
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.98rem', maxWidth: '650px', lineHeight: '1.5' }}>
              {lang === 'en'
                ? 'Submit your valuable feedback, citizen grievance, or project ideas directly to the Prime Minister’s Office.'
                : 'अपनी बहुमूल्य प्रतिक्रिया, शिकायत या परियोजना विचार सीधे प्रधानमंत्री कार्यालय को भेजें।'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('Enquiry')}
            style={{
              background: sector.borderColor,
              color: '#FFF',
              padding: '12px 28px',
              borderRadius: '30px',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
            }}
          >
            <Send size={18} /> {lang === 'en' ? 'Submit Inquiry / Feedback' : 'सुझाव / पूछताछ भेजें'}
          </button>
        </div>
      </div>

    </div>
  );
}
