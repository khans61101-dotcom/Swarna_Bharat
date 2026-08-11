import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { useLang } from '../LanguageContext';
import { API_URL } from '../config';

export default function EnquiryPage() {
  const { lang, t } = useLang();
  const q = t.enquiryPage;

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
    } catch (err) {
      alert('Error submitting enquiry.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid var(--card-border)',
    outline: 'none',
    background: 'var(--bg-light)',
    color: 'var(--text-dark)',
    fontSize: '0.95rem'
  };

  const labelStyle = { display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '5px', color: 'var(--text-dark)' };

  const categories = lang === 'en'
    ? ['Governance Suggestion', 'PM Scheme Enquiry', 'Public Grievance', 'Media Inquiry']
    : ['शासन सुझाव', 'PM योजना पूछताछ', 'सार्वजनिक शिकायत', 'मीडिया जांच'];

  return (
    <div className="section-container">
      <div className="section-header">
        <div className="section-title-wrap">
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle color="#FF9933" size={28} /> {q.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>{q.subtitle}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        {/* Form Column */}
        <div className="dark-card" style={{ background: '#FFF', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <CheckCircle size={60} color="#22C55E" style={{ margin: '0 auto 15px' }} />
              <h3 style={{ color: 'var(--header-bg)', fontSize: '1.5rem', marginBottom: '10px' }}>{q.successTitle}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{q.successMsg}</p>
              <button className="btn-primary" style={{ marginTop: '20px' }} onClick={() => setSubmitted(false)}>
                {lang === 'en' ? 'Submit Another Enquiry' : 'और पूछताछ जमा करें'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 style={{ color: 'var(--header-bg)', fontSize: '1.3rem', marginBottom: '20px' }}>
                {lang === 'en' ? 'Write Your Query / Suggestion' : 'अपनी क्वेरी / सुझाव लिखें'}
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>{q.name} *</label>
                <input type="text" required placeholder={lang === 'en' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={labelStyle}>{q.email} *</label>
                  <input type="email" required placeholder="name@domain.com"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>{q.phone}</label>
                  <input type="tel" placeholder="+91 9876543210"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>{q.category} *</label>
                <select required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} style={inputStyle}>
                  <option value="">{lang === 'en' ? 'Select Category' : 'श्रेणी चुनें'}</option>
                  {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>{q.message} *</label>
                <textarea rows={4} required
                  placeholder={lang === 'en' ? 'Provide brief details about your enquiry...' : 'अपनी पूछताछ के बारे में संक्षिप्त विवरण दें...'}
                  value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {q.submit} <Send size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Column */}
        <div style={{ background: '#1A2238', color: '#FFF', padding: '30px', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#FF9933', marginBottom: '20px' }}>{q.contactInfo}</h3>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <MapPin size={24} color="#FF9933" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1rem', color: '#FFF' }}>{lang === 'en' ? 'Address' : 'पता'}</h4>
              <p style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>{q.address}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <Phone size={24} color="#FF9933" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1rem', color: '#FFF' }}>{lang === 'en' ? 'Helpline / Telephone' : 'हेल्पलाइन / टेलीफोन'}</h4>
              <p style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>+91-11-23012312 ({lang === 'en' ? 'Public Grievances Desk' : 'जन शिकायत डेस्क'})</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <Mail size={24} color="#FF9933" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1rem', color: '#FFF' }}>{lang === 'en' ? 'Official Email' : 'आधिकारिक ईमेल'}</h4>
              <p style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>connect@pmindia.gov.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
