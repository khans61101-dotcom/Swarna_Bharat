import React from 'react';
import { User, Award, Globe, Flag } from 'lucide-react';
import { useLang } from '../LanguageContext';

export default function AboutPage() {
  const { lang, t } = useLang();

  const pillars = [
    {
      icon: <User size={30} color="#FF9933" />,
      title: lang === 'en' ? 'Inclusive Governance' : 'समावेशी शासन',
      desc: lang === 'en'
        ? 'Ensuring every citizen has access to government services and information through Digital India.'
        : 'डिजिटल इंडिया के माध्यम से प्रत्येक नागरिक को सरकारी सेवाओं और सूचनाओं तक पहुंच सुनिश्चित करना।'
    },
    {
      icon: <Award size={30} color="#FF9933" />,
      title: lang === 'en' ? 'Transparent Administration' : 'पारदर्शी प्रशासन',
      desc: lang === 'en'
        ? 'Promoting open governance, RTI compliance and proactive disclosure of government activities.'
        : 'खुले शासन, आरटीआई अनुपालन और सरकारी गतिविधियों के सक्रिय प्रकटीकरण को बढ़ावा देना।'
    },
    {
      icon: <Flag size={30} color="#FF9933" />,
      title: lang === 'en' ? 'Digital Empowerment' : 'डिजिटल सशक्तिकरण',
      desc: lang === 'en'
        ? 'Leveraging technology to democratise access to public services and government schemes.'
        : 'सार्वजनिक सेवाओं और सरकारी योजनाओं तक पहुंच को लोकतांत्रिक बनाने के लिए प्रौद्योगिकी का उपयोग।'
    },
    {
      icon: <Globe size={30} color="#FF9933" />,
      title: lang === 'en' ? 'Global Leadership' : 'वैश्विक नेतृत्व',
      desc: lang === 'en'
        ? 'Representing India on international platforms while fostering strong diplomatic relationships.'
        : 'अंतरराष्ट्रीय मंचों पर भारत का प्रतिनिधित्व करते हुए मजबूत कूटनीतिक संबंधों को बढ़ावा देना।'
    }
  ];

  return (
    <div className="section-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2 className="section-title">{t.about.pageTitle}</h2>
        </div>
      </div>

      <div className="dark-card" style={{ background: '#FFF', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
          <div>
            <img 
              src="/AboutLogo.jpg"  
              alt="Swarna India" 
              style={{ width: '100%', borderRadius: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
            />
          </div>
          <div>
            <span style={{ color: '#FF9933', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem' }}>
              {t.about.subtitle}
            </span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--header-bg)', margin: '10px 0 15px' }}>
              {lang === 'en' ? 'Leadership Dedicated to Nation\'s Progress' : 'राष्ट्र की प्रगति के लिए समर्पित नेतृत्व'}
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '15px' }}>
              {t.about.intro}
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              {lang === 'en'
                ? 'Our vision of "Sabka Saath, Sabka Vikas, Sabka Vishwas, Sabka Prayas" forms the bedrock of key national initiatives spanning infrastructure, healthcare, green energy, and technology.'
                : '"सबका साथ, सबका विकास, सबका विश्वास, सबका प्रयास" की हमारी दृष्टि बुनियादी ढांचे, स्वास्थ्य सेवा, हरित ऊर्जा और प्रौद्योगिकी में प्रमुख राष्ट्रीय पहलों की आधारशिला है।'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '40px' }}>
          {pillars.map((pillar, i) => (
            <div key={i} className="dark-date-box" style={{ background: '#F8F9FA', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #FF9933' }}>
              {pillar.icon}
              <h4 style={{ margin: '10px 0 5px', color: 'var(--header-bg)' }}>{pillar.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
