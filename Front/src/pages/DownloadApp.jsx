import React from 'react';
import { Smartphone, Download, ShieldCheck, Zap, Bell, Globe } from 'lucide-react';
import { useLang } from '../LanguageContext';

export default function DownloadAppPage() {
  const { lang, t } = useLang();
  const dp = t.downloadPage;

  const features = [
    {
      icon: <Bell size={32} color="#2563EB" style={{ marginBottom: '15px' }} />,
      title: lang === 'en' ? 'Instant News Notifications' : 'तत्काल समाचार अधिसूचना',
      desc: lang === 'en'
        ? "First-hand notifications on Swarna Bharat's speeches, cabinet decisions, and international visits."
        : 'Swarna Bharat के भाषणों, कैबिनेट निर्णयों और अंतर्राष्ट्रीय दौरों पर प्रत्यक्ष अधिसूचनाएं।'
    },
    {
      icon: <Zap size={32} color="#2563EB" style={{ marginBottom: '15px' }} />,
      title: lang === 'en' ? 'Mann Ki Baat Audio & Text' : 'मन की बात ऑडियो और टेक्स्ट',
      desc: lang === 'en'
        ? 'Listen to live audio broadcasts or read full transcripts in multiple regional languages.'
        : 'लाइव ऑडियो प्रसारण सुनें या कई क्षेत्रीय भाषाओं में पूर्ण प्रतिलेखन पढ़ें।'
    },
    {
      icon: <Globe size={32} color="#2563EB" style={{ marginBottom: '15px' }} />,
      title: lang === 'en' ? 'Viksit Bharat Volunteer Desk' : 'विकसित भारत स्वयंसेवक डेस्क',
      desc: lang === 'en'
        ? 'Participate in national tasks, share suggestions, and earn digital certificates.'
        : 'राष्ट्रीय कार्यों में भाग लें, सुझाव साझा करें और डिजिटल प्रमाण पत्र अर्जित करें।'
    },
    {
      icon: <ShieldCheck size={32} color="#2563EB" style={{ marginBottom: '15px' }} />,
      title: lang === 'en' ? 'Secure & Direct Feedback' : 'सुरक्षित और सीधी प्रतिक्रिया',
      desc: lang === 'en'
        ? "Direct platform to convey your ideas and views directly to the Prime Minister's Office."
        : 'अपने विचार और दृष्टिकोण सीधे प्रधानमंत्री कार्यालय तक पहुंचाने का सीधा मंच।'
    }
  ];

  return (
    <div className="section-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone color="#2563EB" size={28} /> {dp.title}
          </h2>
        </div>
      </div>

      {/* Hero App Showcase Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1A2238 0%, #0F172A 100%)', 
        borderRadius: '16px', padding: '40px', color: '#FFF',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px', alignItems: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)', marginBottom: '40px'
      }}>
        <div>
          <span style={{ background: '#2563EB', color: '#FFF', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            {lang === 'en' ? 'Official Mobile Application' : 'आधिकारिक मोबाइल एप्लिकेशन'}
          </span>
          <h3 style={{ fontSize: '2.2rem', margin: '15px 0', lineHeight: '1.25', fontWeight: 800 }}>
            {dp.subtitle}
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: '1.6', marginBottom: '30px' }}>
            {dp.desc}
          </p>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary"
              style={{ background: '#000', border: '1px solid #334155', padding: '12px 24px', borderRadius: '8px' }}
              onClick={() => alert(lang === 'en' ? 'Redirecting to Google Play Store...' : 'Google Play Store पर रीडायरेक्ट हो रहा है...')}
            >
              <Download size={20} color="#2563EB" /> {dp.playStore}
            </button>
            <button 
              className="btn-primary"
              style={{ background: '#000', border: '1px solid #334155', padding: '12px 24px', borderRadius: '8px' }}
              onClick={() => alert(lang === 'en' ? 'Redirecting to Apple App Store...' : 'Apple App Store पर रीडायरेक्ट हो रहा है...')}
            >
              <Download size={20} color="#2563EB" /> {dp.appStore}
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <img 
            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80" 
            alt="Swarna Bharat App Screen" 
            style={{ maxWidth: '320px', width: '100%', borderRadius: '24px', border: '4px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
          />
        </div>
      </div>

      {/* App Key Features Grid */}
      <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '25px', textAlign: 'center' }}>
        {lang === 'en' ? 'Key Features of Swarna Bharat App' : 'Swarna Bharat ऐप की प्रमुख विशेषताएं'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
        {features.map((f, i) => (
          <div key={i} className="dark-card" style={{ background: '#FFF', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
            {f.icon}
            <h4 style={{ fontSize: '1.1rem', color: 'var(--header-bg)', marginBottom: '8px' }}>{f.title}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
