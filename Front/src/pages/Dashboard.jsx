import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Camera, LogOut, CheckCircle, Shield, 
  Trash2, Video, Image, PlusCircle, Award, Users, CheckSquare, 
  Film, LayoutDashboard, Copy, Check, ExternalLink, Share2, Sparkles, Key, Search
} from 'lucide-react';
import { useLang } from '../LanguageContext';
import { API_BASE_URL, API_URL, getMediaUrl } from '../config';

export default function Dashboard({ setActiveTab, setUserState }) {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDashTab, setActiveDashTab] = useState('overview'); // 'overview' | 'media' | 'profile'
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all' | 'image' | 'video'

  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [copiedRef, setCopiedRef] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', dob: '', address: '', city: '', state: '', pincode: '',
    bank_name: '', account_no: '', ifsc_code: '', upi_id: ''
  });

  const [mediaFile, setMediaFile] = useState(null);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // User Stats, Media & Downline Network
  const [userStats, setUserStats] = useState({ taskCount: 0, usersCount: 0, membersCount: 0 });
  const [userMedia, setUserMedia] = useState([]);
  const [downlineUsers, setDownlineUsers] = useState([]);
  const [networkSearch, setNetworkSearch] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setActiveTab('Auth');
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          dob: data.dob ? data.dob.split('T')[0] : '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          bank_name: data.bank_name || '',
          account_no: data.account_no || '',
          ifsc_code: data.ifsc_code || '',
          upi_id: data.upi_id || ''
        });

        // Fetch User Stats, Media & Downline Network
        fetchUserStatsAndMedia(data.id);
      } else {
        localStorage.removeItem('userToken');
        setActiveTab('Auth');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStatsAndMedia = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/partners/${userId}/details`);
      if (res.ok) {
        const data = await res.json();
        setUserStats({
          taskCount: data.taskCount || 0,
          usersCount: data.usersCount || 0,
          membersCount: data.membersCount || 0
        });
        setUserMedia(data.media || []);
        setDownlineUsers(data.downlineUsers || []);
      }
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    setUserState(null);
    setActiveTab('Auth');
  };

  const handleCopyRef = () => {
    if (user?.referral_link) {
      navigator.clipboard.writeText(user.referral_link);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('userToken');
    setUploading(true);
    setMsg({ text: lang === 'en' ? 'Uploading profile image...' : 'प्रोफ़ाइल फ़ोटो अपलोड हो रही है...', type: 'info' });

    try {
      const imgData = new FormData();
      imgData.append('image', file);
      
      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: imgData
      });
      const uploadData = await uploadRes.json();
      
      if (uploadRes.ok && uploadData.url) {
        const updateRes = await fetch(`${API_URL}/auth/profile`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...formData, profile_image: uploadData.url })
        });
        
        if (updateRes.ok) {
          setUser(prev => ({ ...prev, profile_image: uploadData.url }));
          setMsg({ text: lang === 'en' ? 'Profile image updated successfully!' : 'प्रोफ़ाइल फ़ोटो सफलतापूर्वक अपडेट हो गई!', type: 'success' });
        }
      } else {
        setMsg({ text: lang === 'en' ? 'Image upload failed' : 'फ़ोटो अपलोड विफल', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Network error', type: 'error' });
    } finally {
      setUploading(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const token = localStorage.getItem('userToken');
    setMsg({ text: lang === 'en' ? 'Saving profile changes...' : 'प्रोफ़ाइल सहेजी जा रही है...', type: 'info' });
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, profile_image: user.profile_image })
      });
      
      if (res.ok) {
        setMsg({ text: lang === 'en' ? 'Profile updated successfully!' : 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!', type: 'success' });
        setUser(prev => ({ ...prev, ...formData }));
      } else {
        setMsg({ text: lang === 'en' ? 'Failed to update profile' : 'प्रोफ़ाइल अपडेट करने में विफल', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Network error', type: 'error' });
    } finally {
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (!mediaFile) {
      setMsg({ text: lang === 'en' ? 'Please select a photo or video to upload.' : 'कृपया अपलोड करने के लिए फ़ोटो या वीडियो चुनें।', type: 'error' });
      return;
    }
    const token = localStorage.getItem('userToken');
    setUploadingMedia(true);
    setMsg({ text: lang === 'en' ? 'Uploading media...' : 'मीडिया अपलोड हो रहा है...', type: 'info' });

    try {
      const uploadData = new FormData();
      uploadData.append('proof_file', mediaFile);
      
      const uploadRes = await fetch(`${API_URL}/upload/proof`, {
        method: 'POST',
        body: uploadData
      });
      const data = await uploadRes.json();
      
      if (uploadRes.ok && data.url) {
        const type = mediaFile.type && mediaFile.type.startsWith('video/') ? 'video' : 'image';
        
        const galleryRes = await fetch(`${API_URL}/gallery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            src: data.url,
            title: galleryTitle,
            type: type,
            category: 'General'
          })
        });

        if (galleryRes.ok) {
          setMsg({ text: lang === 'en' ? 'Media posted to your gallery successfully!' : 'मीडिया आपकी गैलरी में पोस्ट हो गया!', type: 'success' });
          setMediaFile(null);
          setGalleryTitle('');
          fetchUserStatsAndMedia(user.id);
        } else {
          setMsg({ text: lang === 'en' ? 'Failed to save to gallery.' : 'गैलरी में सहेजने में विफल।', type: 'error' });
        }
      } else {
        setMsg({ text: data.error || 'Media upload failed.', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Network error during media upload.', type: 'error' });
    } finally {
      setUploadingMedia(false);
      setTimeout(() => setMsg({ text: '', type: '' }), 4000);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm(lang === 'en' ? 'Are you sure you want to delete this item?' : 'क्या आप वाकई इस मीडिया को हटाना चाहते हैं?')) return;
    const token = localStorage.getItem('userToken');
    try {
      const res = await fetch(`${API_URL}/gallery/${mediaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMsg({ text: lang === 'en' ? 'Media deleted successfully!' : 'मीडिया सफलतापूर्वक हटा दिया गया!', type: 'success' });
        fetchUserStatsAndMedia(user.id);
      } else {
        setMsg({ text: 'Failed to delete media', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Error deleting media', type: 'error' });
    } finally {
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center', fontSize: '1.2rem', color: '#64748B' }}>Loading Dashboard...</div>;
  }

  if (!user) return null;

  // Media counts
  const photosCount = userMedia.filter(m => m.type !== 'video' && !m.src?.endsWith('.mp4') && !m.src?.endsWith('.webm') && !m.src?.endsWith('.mov')).length;
  const videosCount = userMedia.filter(m => m.type === 'video' || m.src?.endsWith('.mp4') || m.src?.endsWith('.webm') || m.src?.endsWith('.mov')).length;

  const filteredMedia = userMedia.filter(item => {
    const isVid = item.type === 'video' || item.src?.endsWith('.mp4') || item.src?.endsWith('.webm') || item.src?.endsWith('.mov');
    if (mediaFilter === 'image') return !isVid;
    if (mediaFilter === 'video') return isVid;
    return true;
  });

  return (
    <div style={{ background: 'var(--bg-light)', color: 'var(--text-dark)', minHeight: '100vh', padding: '30px 16px 60px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header Profile Summary Card */}
        <div className="dashboard-card" style={{ 
          background: 'var(--card-bg)', 
          borderRadius: '24px', 
          padding: '28px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          marginBottom: '20px',
          position: 'relative',
          border: '1px solid var(--card-border)'
        }}>
          <button 
            onClick={handleLogout}
            style={{ position: 'absolute', top: '24px', right: '24px', background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, transition: '0.2s' }}
          >
            <LogOut size={16} /> {lang === 'en' ? 'Logout' : 'लॉगआउट'}
          </button>

          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '105px', height: '105px', borderRadius: '50%', 
              background: 'var(--bg-alt)', overflow: 'hidden', border: '4px solid var(--card-bg)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              {user.profile_image ? (
                <img src={getMediaUrl(user.profile_image)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {user.name.substring(0,2).toUpperCase()}
                </div>
              )}
            </div>
            
            <label style={{
              position: 'absolute', bottom: '0', right: '0',
              background: '#FF9933', color: '#FFF', width: '34px', height: '34px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }} title="Change Profile Picture">
              <Camera size={16} />
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.7rem', color: 'var(--text-dark)', fontWeight: 800 }}>{user.name}</h2>
              <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Shield size={14} /> {user.role_name}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={15} color="#FF9933" /> {user.email}</span>
              {user.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={15} color="#FF9933" /> {user.phone}</span>}
              {user.city && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} color="#FF9933" /> {user.city}, {user.state}</span>}
            </div>
          </div>
        </div>

        {/* Global Notifications */}
        {msg.text && (
          <div style={{
            padding: '14px 20px', borderRadius: '12px', marginBottom: '20px',
            background: msg.type === 'error' ? '#FEE2E2' : msg.type === 'success' ? '#DCFCE7' : '#DBEAFE',
            color: msg.type === 'error' ? '#DC2626' : msg.type === 'success' ? '#16A34A' : '#2563EB',
            display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600,
            border: `1px solid ${msg.type === 'error' ? '#FCA5A5' : msg.type === 'success' ? '#86EFAC' : '#93C5FD'}`
          }}>
            <CheckCircle size={18} /> {msg.text}
          </div>
        )}

        {/* ── MAIN DASHBOARD TABS NAVIGATION BAR ── */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '28px',
          background: '#FFF',
          padding: '8px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveDashTab('overview')}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              background: activeDashTab === 'overview' ? 'linear-gradient(135deg, #FF9933, #FF6B00)' : 'transparent',
              color: activeDashTab === 'overview' ? '#FFF' : '#64748B',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: activeDashTab === 'overview' ? '0 4px 12px rgba(255, 153, 51, 0.3)' : 'none'
            }}
          >
            <LayoutDashboard size={18} />
            <span>{lang === 'en' ? 'Dashboard Overview' : 'डैशबोर्ड ओवरव्यू'}</span>
          </button>

          <button
            onClick={() => setActiveDashTab('network')}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              background: activeDashTab === 'network' ? 'linear-gradient(135deg, #FF9933, #FF6B00)' : 'transparent',
              color: activeDashTab === 'network' ? '#FFF' : '#64748B',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: activeDashTab === 'network' ? '0 4px 12px rgba(255, 153, 51, 0.3)' : 'none'
            }}
          >
            <Users size={18} />
            <span>{lang === 'en' ? 'My Connected Network' : 'मेरे से जुड़े सदस्य'} ({downlineUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveDashTab('media')}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              background: activeDashTab === 'media' ? 'linear-gradient(135deg, #FF9933, #FF6B00)' : 'transparent',
              color: activeDashTab === 'media' ? '#FFF' : '#64748B',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: activeDashTab === 'media' ? '0 4px 12px rgba(255, 153, 51, 0.3)' : 'none'
            }}
          >
            <Film size={18} />
            <span>{lang === 'en' ? 'Upload Photo / Video & My Gallery' : 'फोटो/वीडियो अपलोड एवं मेरी गैलरी'} ({userMedia.length})</span>
          </button>

          <button
            onClick={() => setActiveDashTab('profile')}
            style={{
              flex: 1,
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              background: activeDashTab === 'profile' ? 'linear-gradient(135deg, #FF9933, #FF6B00)' : 'transparent',
              color: activeDashTab === 'profile' ? '#FFF' : '#64748B',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: activeDashTab === 'profile' ? '0 4px 12px rgba(255, 153, 51, 0.3)' : 'none'
            }}
          >
            <User size={18} />
            <span>{lang === 'en' ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें'}</span>
          </button>
        </div>

        {/* ── TAB 1: OVERVIEW ────────────────────────────────────────────── */}
        {activeDashTab === 'overview' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            {/* Quick Stats Grid Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: '#FFF', padding: '22px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '14px', borderRadius: '14px' }}>
                  <CheckSquare size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'en' ? 'Assigned Tasks' : 'सौंपे गए कार्य'}
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#1E293B' }}>{userStats.taskCount}</h3>
                </div>
              </div>

              <div style={{ background: '#FFF', padding: '22px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#F0FDF4', color: '#16A34A', padding: '14px', borderRadius: '14px' }}>
                  <Users size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'en' ? 'Downline Users' : 'डाउनलाइन उपयोगकर्ता'}
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#1E293B' }}>{userStats.usersCount}</h3>
                </div>
              </div>

              <div style={{ background: '#FFF', padding: '22px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#FEF3C7', color: '#D97706', padding: '14px', borderRadius: '14px' }}>
                  <Award size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'en' ? 'Members Count' : 'कुल सदस्य'}
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#1E293B' }}>{userStats.membersCount}</h3>
                </div>
              </div>

              <div style={{ background: '#FFF', padding: '22px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#FFF7ED', color: '#EA580C', padding: '14px', borderRadius: '14px' }}>
                  <Film size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'en' ? 'Total Media Posts' : 'कुल मीडिया पोस्ट'}
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#1E293B' }}>{userMedia.length}</h3>
                </div>
              </div>

              <div style={{ background: '#FFF', padding: '22px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#F5F3FF', color: '#8B5CF6', padding: '14px', borderRadius: '14px' }}>
                  <Image size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'en' ? 'Photos Uploaded' : 'अपलोड की गई फ़ोटो'}
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#1E293B' }}>{photosCount}</h3>
                </div>
              </div>

              <div style={{ background: '#FFF', padding: '22px', borderRadius: '18px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#ECFDF5', color: '#10B981', padding: '14px', borderRadius: '14px' }}>
                  <Video size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {lang === 'en' ? 'Videos Uploaded' : 'अपलोड किए गए वीडियो'}
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#1E293B' }}>{videosCount}</h3>
                </div>
              </div>
            </div>

            {/* Account & Referral Information Card */}
            <div style={{
              background: '#FFF',
              borderRadius: '24px',
              padding: '28px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              marginBottom: '28px'
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', color: '#1E293B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Share2 size={20} color="#FF9933" />
                {lang === 'en' ? 'Referral Link & Code' : 'रेफरल लिंक एवं कोड'}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    {lang === 'en' ? 'Your Referral Code' : 'आपका रेफरल कोड'}
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FF9933', marginTop: '4px', letterSpacing: '1px' }}>
                    {user.referral_code || 'REF-USER-101'}
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                    {lang === 'en' ? 'Your Referral Link' : 'आपका रेफरल लिंक'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                    <input 
                      type="text" 
                      readOnly 
                      value={user.referral_link || `${API_BASE_URL}/register.html?ref=${user.referral_code || ''}`} 
                      style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', color: '#334155', background: '#FFF' }}
                    />
                    <button
                      onClick={handleCopyRef}
                      style={{
                        background: copiedRef ? '#16A34A' : '#FF9933',
                        color: '#FFF',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: '0.2s'
                      }}
                    >
                      {copiedRef ? <Check size={16} /> : <Copy size={16} />}
                      {copiedRef ? (lang === 'en' ? 'Copied' : 'कॉपी हो गया') : (lang === 'en' ? 'Copy' : 'कॉपी करें')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Personal Profile Details Card */}
            <div style={{
              background: '#FFF',
              borderRadius: '24px',
              padding: '28px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1E293B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={22} color="#FF9933" />
                  {lang === 'en' ? 'Complete Personal & Account Profile' : 'संपूर्ण व्यक्तिगत एवं खाता प्रोफ़ाइल'}
                </h3>
                <button
                  onClick={() => setActiveDashTab('profile')}
                  style={{
                    background: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5',
                    padding: '6px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  ✏️ {lang === 'en' ? 'Edit Profile Info' : 'विवरण संपादित करें'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Full Name</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>{user.name || 'N/A'}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Email Address</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>{user.email || 'N/A'}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Mobile Phone</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>{user.phone || 'N/A'}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>User Role</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FF9933', marginTop: '3px' }}>{user.role_name || user.role || 'Member'}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Date of Birth</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>{user.dob ? new Date(user.dob).toLocaleDateString('en-IN') : 'N/A'}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Address</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>{user.address || 'N/A'}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>City / State / Pincode</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>
                    {user.city || user.state || user.pincode ? `${user.city || ''}, ${user.state || ''} ${user.pincode || ''}` : 'N/A'}
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Bank Name</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>{user.bank_name || 'N/A'}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Account Number</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>{user.account_no || 'N/A'}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>IFSC Code</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>{user.ifsc_code || 'N/A'}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>UPI ID</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>{user.upi_id || 'N/A'}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Account Created On</span>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div 
                onClick={() => setActiveDashTab('media')} 
                style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', padding: '24px', borderRadius: '20px', border: '1px solid #FED7AA', cursor: 'pointer', transition: '0.2s' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Film size={28} color="#EA580C" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#EA580C', background: '#FFF', padding: '3px 10px', borderRadius: '20px' }}>Quick Access</span>
                </div>
                <h4 style={{ margin: '14px 0 4px', fontSize: '1.15rem', color: '#9A3412', fontWeight: 800 }}>
                  {lang === 'en' ? 'Upload Photos & Videos' : 'फ़ोटो एवं वीडियो अपलोड करें'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#C2410C' }}>
                  {lang === 'en' ? 'Add media posts to your public profile gallery' : 'अपनी प्रोफ़ाइल गैलरी में मीडिया जोड़ें'}
                </p>
              </div>

              <div 
                onClick={() => setActiveDashTab('profile')} 
                style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', padding: '24px', borderRadius: '20px', border: '1px solid #BFDBFE', cursor: 'pointer', transition: '0.2s' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <User size={28} color="#2563EB" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563EB', background: '#FFF', padding: '3px 10px', borderRadius: '20px' }}>Quick Edit</span>
                </div>
                <h4 style={{ margin: '14px 0 4px', fontSize: '1.15rem', color: '#1E40AF', fontWeight: 800 }}>
                  {lang === 'en' ? 'Update Profile Details' : 'प्रोफ़ाइल विवरण अपडेट करें'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#1D4ED8' }}>
                  {lang === 'en' ? 'Edit phone, address, city and location info' : 'फोन, पता और स्थान की जानकारी संपादित करें'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: MY CONNECTED NETWORK (DOWNLINE LIST) ───────────────── */}
        {activeDashTab === 'network' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{
              background: '#FFF',
              borderRadius: '24px',
              padding: '28px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', color: '#1E293B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={24} color="#FF9933" />
                    {lang === 'en' ? 'My Connected Network & Downline Members' : 'मेरे से जुड़े सदस्य एवं नेटवर्क'}
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>
                    {lang === 'en' ? 'List of all users, members, agencies and NGOs connected directly or indirectly under your account.' : 'आपके खाते के अंतर्गत सीधे या अप्रत्यक्ष रूप से जुड़े सभी सदस्यों की सूची।'}
                  </p>
                </div>

                <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', padding: '8px 18px', borderRadius: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C2410C' }}>
                    {lang === 'en' ? 'Total Connected:' : 'कुल जुड़े सदस्य:'} {downlineUsers.length}
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'Search connected member by name, email, phone or role...' : 'नाम, ईमेल, फोन या भूमिका द्वारा जुड़े सदस्य को खोजें...'}
                  value={networkSearch}
                  onChange={(e) => setNetworkSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 42px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.92rem',
                    background: '#F8FAFC',
                    color: '#1E293B',
                    outline: 'none'
                  }}
                />
                <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              {/* Connected Members List Table */}
              {(() => {
                const safeNetwork = Array.isArray(downlineUsers) ? downlineUsers : [];
                const filteredNetwork = safeNetwork.filter(u => {
                  if (!u) return false;
                  const q = (networkSearch || '').toLowerCase();
                  const name = (u.name || '').toLowerCase();
                  const email = (u.email || '').toLowerCase();
                  const phone = (u.phone || '').toLowerCase();
                  const role = (u.role_name || '').toLowerCase();
                  return name.includes(q) || email.includes(q) || phone.includes(q) || role.includes(q);
                });

                if (filteredNetwork.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '50px 20px', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                      <Users size={48} color="#CBD5E1" style={{ marginBottom: '12px' }} />
                      <h4 style={{ fontSize: '1.1rem', color: '#334155', margin: '0 0 6px', fontWeight: 700 }}>
                        {safeNetwork.length === 0 
                          ? (lang === 'en' ? 'No members connected yet' : 'अभी तक कोई सदस्य नहीं जुड़ा है') 
                          : (lang === 'en' ? 'No matching members found' : 'कोई मेल खाता सदस्य नहीं मिला')}
                      </h4>
                      <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 20px' }}>
                        {lang === 'en'
                          ? 'Share your unique referral link to invite friends, team members, and organizations to register under your network.'
                          : 'मित्रों, टीम के सदस्यों और संगठनों को अपने नेटवर्क के तहत पंजीकृत करने के लिए अपना अद्वितीय रेफरल लिंक साझा करें।'}
                      </p>
                      <button
                        onClick={handleCopyRef}
                        style={{
                          background: copiedRef ? '#16A34A' : 'linear-gradient(135deg, #FF9933, #FF6B00)',
                          color: '#FFF', border: 'none', padding: '10px 24px', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px'
                        }}
                      >
                        {copiedRef ? <Check size={16} /> : <Copy size={16} />}
                        {copiedRef ? (lang === 'en' ? 'Link Copied!' : 'लिंक कॉपी हो गया!') : (lang === 'en' ? 'Copy Referral Link' : 'रेफरल लिंक कॉपी करें')}
                      </button>
                    </div>
                  );
                }

                return (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          <th style={{ padding: '12px 16px' }}>Member / Name</th>
                          <th style={{ padding: '12px 16px' }}>Role</th>
                          <th style={{ padding: '12px 16px' }}>Contact Info</th>
                          <th style={{ padding: '12px 16px' }}>Location</th>
                          <th style={{ padding: '12px 16px' }}>Joined Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNetwork.map((m, idx) => {
                          if (!m) return null;
                          let badgeBg = '#EFF6FF';
                          let badgeColor = '#2563EB';
                          if (m.role_name === 'Agency') { badgeBg = '#FFF7ED'; badgeColor = '#EA580C'; }
                          else if (m.role_name === 'NGO') { badgeBg = '#FDF2F8'; badgeColor = '#DB2777'; }
                          else if (m.role_name === 'Member') { badgeBg = '#F5F3FF'; badgeColor = '#7C3AED'; }

                          const initials = (m.name || 'User').substring(0, 2).toUpperCase();
                          const profileImg = m.profile_image ? getMediaUrl(m.profile_image) : null;

                          return (
                            <tr key={m.id || idx} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                              <td style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9933, #FF6B00)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', overflow: 'hidden', flexShrink: 0 }}>
                                    {profileImg ? (
                                      <img src={profileImg} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <span>{initials}</span>
                                    )}
                                  </div>
                                  <div>
                                    <strong style={{ fontSize: '0.95rem', color: '#0F172A', display: 'block' }}>{m.name || 'N/A'}</strong>
                                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Ref Code: {m.referral_code || `REF-${m.id}`}</span>
                                  </div>
                                </div>
                              </td>

                              <td style={{ padding: '14px 16px' }}>
                                <span style={{ background: badgeBg, color: badgeColor, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                                  {m.role_name || 'Member'}
                                </span>
                              </td>

                              <td style={{ padding: '14px 16px' }}>
                                <div style={{ fontSize: '0.85rem', color: '#334155' }}>✉️ {m.email || 'N/A'}</div>
                                {m.phone && <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>📞 {m.phone}</div>}
                              </td>

                              <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#475569' }}>
                                {m.city || m.state ? `${m.city || ''}${m.state ? `, ${m.state}` : ''}` : 'N/A'}
                              </td>

                              <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#64748B' }}>
                                {m.created_at ? new Date(m.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── TAB 2: MY MEDIA & GALLERY ─────────────────────────────────── */}
        {activeDashTab === 'media' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            {/* Upload Media Section */}
            <div style={{ 
              background: '#FFF', 
              borderRadius: '24px', 
              padding: '28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              marginBottom: '28px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}>
                  <PlusCircle size={24} color="#FF9933" />
                  {lang === 'en' ? 'Upload Photo or Video to My Gallery' : 'अपनी गैलरी में फ़ोटो या वीडियो अपलोड करें'}
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '4px' }}>
                  {lang === 'en' ? 'Media posts uploaded here will appear in your public Profile Page under Photos & Videos.' : 'यहाँ अपलोड की गई मीडिया आपकी सार्वजनिक प्रोफ़ाइल पृष्ठ पर दिखाई देगी।'}
                </p>
              </div>

              <form onSubmit={handleGalleryUpload} style={{ display: 'grid', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '6px', fontWeight: 600 }}>
                    {lang === 'en' ? 'Title / Caption (Optional)' : 'शीर्षक / विवरण (वैकल्पिक)'}
                  </label>
                  <input 
                    type="text" 
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    placeholder={lang === 'en' ? 'Enter caption for your photo or video' : 'अपनी फ़ोटो या वीडियो के लिए कैप्शन दर्ज करें'}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#FFF', color: '#1E293B', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '6px', fontWeight: 600 }}>
                    {lang === 'en' ? 'Select File (Photo or Video)' : 'फ़ाइल चुनें (फ़ोटो या वीडियो)'}
                  </label>
                  <input 
                    type="file" 
                    accept="image/*,video/*"
                    onChange={(e) => setMediaFile(e.target.files[0])}
                    style={{ 
                      width: '100%', padding: '12px', borderRadius: '10px', border: '2px dashed #CBD5E1', background: '#F8FAFC', color: '#64748B', cursor: 'pointer'
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={uploadingMedia || !mediaFile}
                  style={{ 
                    background: uploadingMedia || !mediaFile ? '#CBD5E1' : 'linear-gradient(135deg, #FF9933, #FF6B00)', 
                    color: '#FFF', border: 'none', padding: '12px 28px', borderRadius: '10px', 
                    cursor: uploadingMedia || !mediaFile ? 'not-allowed' : 'pointer', 
                    fontWeight: 700, fontSize: '0.95rem', transition: '0.2s', width: 'fit-content',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: uploadingMedia || !mediaFile ? 'none' : '0 4px 14px rgba(255, 153, 51, 0.3)'
                  }}
                >
                  <PlusCircle size={18} />
                  {uploadingMedia ? (lang === 'en' ? 'Uploading Media...' : 'मीडिया अपलोड हो रहा है...') : (lang === 'en' ? 'Post to My Gallery' : 'मेरी गैलरी में पोस्ट करें')}
                </button>
              </form>
            </div>

            {/* Gallery Media Grid & Filters */}
            <div style={{ 
              background: '#FFF', 
              borderRadius: '24px', 
              padding: '28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#1E293B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Film size={22} color="#FF9933" />
                  {lang === 'en' ? 'My Uploaded Media' : 'मेरी अपलोड की गई मीडिया'} ({filteredMedia.length})
                </h4>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
                  <button
                    onClick={() => setMediaFilter('all')}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', border: 'none',
                      background: mediaFilter === 'all' ? '#FFF' : 'transparent',
                      color: mediaFilter === 'all' ? '#FF9933' : '#64748B',
                      fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                      boxShadow: mediaFilter === 'all' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {lang === 'en' ? `All (${userMedia.length})` : `सभी (${userMedia.length})`}
                  </button>
                  <button
                    onClick={() => setMediaFilter('image')}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', border: 'none',
                      background: mediaFilter === 'image' ? '#FFF' : 'transparent',
                      color: mediaFilter === 'image' ? '#FF9933' : '#64748B',
                      fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                      boxShadow: mediaFilter === 'image' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {lang === 'en' ? `Photos (${photosCount})` : `फ़ोटो (${photosCount})`}
                  </button>
                  <button
                    onClick={() => setMediaFilter('video')}
                    style={{
                      padding: '6px 14px', borderRadius: '8px', border: 'none',
                      background: mediaFilter === 'video' ? '#FFF' : 'transparent',
                      color: mediaFilter === 'video' ? '#FF9933' : '#64748B',
                      fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                      boxShadow: mediaFilter === 'video' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {lang === 'en' ? `Videos (${videosCount})` : `वीडियो (${videosCount})`}
                  </button>
                </div>
              </div>

              {filteredMedia.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', background: '#F8FAFC', borderRadius: '18px', color: '#94A3B8', border: '1px dashed #CBD5E1' }}>
                  <Image size={44} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>
                    {lang === 'en' ? 'No media posts found.' : 'कोई मीडिया पोस्ट नहीं मिली।'}
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                  {filteredMedia.map(item => {
                    const src = item.src || '';
                    const isVideo = item.type === 'video' || src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');
                    return (
                      <div key={item.id} style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', background: '#F8FAFC', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <div style={{ height: '170px', position: 'relative', background: '#000' }}>
                          {isVideo ? (
                            <video src={getMediaUrl(src)} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <img src={getMediaUrl(src)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                          <span style={{ position: 'absolute', top: '10px', left: '10px', background: isVideo ? '#2563EB' : '#FF9933', color: '#FFF', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {isVideo ? 'VIDEO' : 'IMAGE'}
                          </span>
                        </div>
                        
                        <div style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#1E293B', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                              {item.title || (lang === 'en' ? 'Untitled' : 'बिना शीर्षक')}
                            </h5>
                            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.category || 'General'}</span>
                          </div>

                          <button 
                            onClick={() => handleDeleteMedia(item.id)}
                            title={lang === 'en' ? 'Delete media post' : 'मीडिया हटाएं'}
                            style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: EDIT PROFILE ────────────────────────────────────────── */}
        {activeDashTab === 'profile' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ 
              background: '#FFF', 
              borderRadius: '24px', 
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1E293B', fontWeight: 800 }}>
                    {lang === 'en' ? 'Edit Profile Details' : 'प्रोफ़ाइल विवरण संपादित करें'}
                  </h3>
                  <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.88rem' }}>
                    {lang === 'en' ? 'Update your personal and contact details' : 'अपनी व्यक्तिगत और संपर्क जानकारी अपडेट करें'}
                  </p>
                </div>

                <button 
                  onClick={handleSave} 
                  style={{ 
                    background: 'linear-gradient(135deg, #16A34A, #15803D)', 
                    color: '#FFF', border: 'none', padding: '10px 24px', 
                    borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.92rem',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  {lang === 'en' ? 'Save Profile Changes' : 'प्रोफ़ाइल सहेजें'}
                </button>
              </div>

              <form onSubmit={handleSave} className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '6px', fontWeight: 600 }}>
                    {lang === 'en' ? 'Full Name' : 'पूरा नाम'}
                  </label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#FFF', color: '#1E293B', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '6px', fontWeight: 600 }}>
                    {lang === 'en' ? 'Phone Number' : 'फोन नंबर'}
                  </label>
                  <input 
                    type="text" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#FFF', color: '#1E293B', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '6px', fontWeight: 600 }}>
                    {lang === 'en' ? 'City' : 'शहर'}
                  </label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#FFF', color: '#1E293B', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '6px', fontWeight: 600 }}>
                    {lang === 'en' ? 'State' : 'राज्य'}
                  </label>
                  <input 
                    type="text" 
                    value={formData.state} 
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#FFF', color: '#1E293B', outline: 'none' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '6px', fontWeight: 600 }}>
                    {lang === 'en' ? 'Address' : 'पता'}
                  </label>
                  <input 
                    type="text" 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#FFF', color: '#1E293B', outline: 'none' }}
                  />
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
