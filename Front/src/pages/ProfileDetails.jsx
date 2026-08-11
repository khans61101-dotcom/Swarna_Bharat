import React, { useState, useEffect } from 'react';
import './css/ProfilePage.css';
import { API_URL, getMediaUrl } from '../config';

const ProfilePage = ({ partner, setActiveTab }) => {
  const [currentPartner, setCurrentPartner] = useState(partner);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeTabMenu, setActiveTabMenu] = useState('images');
  const [activeMediaTab, setActiveMediaTab] = useState('self');
  const [details, setDetails] = useState({ taskCount: 0, usersCount: 0, membersCount: 0, media: [] });
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const [editForm, setEditForm] = useState({
    name: partner?.name || '',
    phone: partner?.phone || '',
    city: partner?.city || '',
    state: partner?.state || '',
    address: partner?.address || ''
  });

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && data.id) {
            setCurrentUserId(data.id);
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!partner) return;
    setCurrentPartner(partner);
    setEditForm({
      name: partner.name || '',
      phone: partner.phone || '',
      city: partner.city || '',
      state: partner.state || '',
      address: partner.address || ''
    });

    setLoadingDetails(true);
    fetch(`${API_URL}/partners/${partner.id}/details`)
      .then(r => r.json())
      .then(d => { setDetails(d); setLoadingDetails(false); })
      .catch(() => setLoadingDetails(false));
  }, [partner]);

  if (!partner) return null;

  const isOwner = currentUserId && partner && Number(currentUserId) === Number(partner.id);

  const targetPartner = currentPartner || partner;
  const displayName = targetPartner.organization_name || targetPartner.name;
  const displayImage = targetPartner.profile_image ? getMediaUrl(targetPartner.profile_image) : null; 
  const roleName = targetPartner.role_name || 'User';
  const initials = displayName.substring(0, 2).toUpperCase();

  const defaultCover = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200';
  const coverUrl = targetPartner.cover_image ? getMediaUrl(targetPartner.cover_image) : defaultCover;

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem('userToken');
    setMsg({ text: 'Uploading cover photo...', type: 'info' });

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
          body: JSON.stringify({ ...editForm, cover_image: uploadData.url })
        });
        if (updateRes.ok) {
          setCurrentPartner(prev => ({ ...prev, cover_image: uploadData.url }));
          setMsg({ text: 'Cover photo updated successfully!', type: 'success' });
        }
      }
    } catch (err) {
      setMsg({ text: 'Error uploading cover photo', type: 'error' });
    } finally {
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem('userToken');
    setMsg({ text: 'Uploading profile photo...', type: 'info' });

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
          body: JSON.stringify({ ...editForm, profile_image: uploadData.url })
        });
        if (updateRes.ok) {
          setCurrentPartner(prev => ({ ...prev, profile_image: uploadData.url }));
          setMsg({ text: 'Profile picture updated successfully!', type: 'success' });
        }
      }
    } catch (err) {
      setMsg({ text: 'Error uploading profile picture', type: 'error' });
    } finally {
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    setMsg({ text: 'Saving profile details...', type: 'info' });
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setCurrentPartner(prev => ({ ...prev, ...editForm }));
        setMsg({ text: 'Profile details saved successfully!', type: 'success' });
        setShowEditModal(false);
      } else {
        setMsg({ text: 'Failed to update profile', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Error saving profile', type: 'error' });
    } finally {
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  // Grid items data based on activeMediaTab (self vs company)
  const currentMediaList = activeMediaTab === 'company' 
    ? (details.companyMedia || []) 
    : (details.selfMedia || details.media || []);

  const gridItems = currentMediaList.length > 0
    ? currentMediaList.map(m => {
        const src = m.src || m.image || '';
        const isVideo = m.type === 'video' || src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');
        return {
          id: m.id,
          image: src,
          title: m.title || '',
          type: isVideo ? 'video' : 'image'
        };
      })
    : [];

  const displayMediaItems = gridItems.filter(item => {
    if (activeTabMenu === 'videos') {
      return item.type === 'video';
    }
    return item.type === 'image';
  });

  return (
    <div className="profile-card" style={{
      backgroundColor: 'var(--bg-light)',
      color: 'var(--text-dark)',
      fontFamily: "'Montserrat', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top App Bar (Mobile) */}
      <header style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        backgroundColor: 'var(--card-bg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        height: '64px',
        borderBottom: '1px solid var(--card-border)'
      }} className="md:hidden">
        <button aria-label="Go back" style={{
          color: '#FF9933',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.2s'
        }} onClick={() => setActiveTab('Partners')}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--text-dark)'
        }}>{displayName}</h1>
        <button aria-label="More options" style={{
          color: 'var(--text-muted)',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>more_vert</span>
        </button>
      </header>

      <main style={{
        flexGrow: 1,
        width: '100%',
        paddingTop: '64px',
        paddingBottom: '80px'
      }} className="md:pl-280 md:pr-320 md:max-w-1440 md:mx-auto md:pt-24 md:pb-8">

        {/* Global Alert Notification */}
        {msg.text && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 9999,
            padding: '12px 20px',
            borderRadius: '12px',
            background: msg.type === 'error' ? '#FEE2E2' : msg.type === 'success' ? '#DCFCE7' : '#DBEAFE',
            color: msg.type === 'error' ? '#DC2626' : msg.type === 'success' ? '#16A34A' : '#2563EB',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: `1px solid ${msg.type === 'error' ? '#FCA5A5' : msg.type === 'success' ? '#86EFAC' : '#93C5FD'}`
          }}>
            {msg.text}
          </div>
        )}

        {/* Profile Header Section */}
        <section style={{
          position: 'relative',
          width: '100%',
          backgroundColor: 'var(--bg-light)'
        }}>
          {/* Cover Image Container */}
          <div style={{
            width: '100%',
            height: '220px',
            backgroundColor: '#e2e2e2',
            position: 'relative',
            overflow: 'hidden'
          }} className="md:h-64">
            <div 
              style={{
                backgroundImage: `url("${coverUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)'
            }}></div>

            {/* Edit Cover Photo Badge - ONLY SHOW IF LOGGED IN USER IS OWNER */}
            {isOwner && (
              <label style={{
                position: 'absolute',
                bottom: '16px',
                right: '24px',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
                zIndex: 10
              }} title="Upload Cover Image">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>photo_camera</span>
                <span>Edit Cover Photo</span>
                <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* Profile Info Container */}
          <div style={{
            padding: '0 24px',
            position: 'relative',
            marginTop: '-64px',
            paddingBottom: '24px',
            borderBottom: '1px solid #e2e2e2'
          }} className="md:-mt-24">
            {/* Avatar & Action Buttons Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '16px'
            }}>
              {/* Avatar with Camera Badge */}
              <div style={{
                position: 'relative',
                width: '128px',
                height: '128px',
                borderRadius: '50%',
                border: '4px solid #f9f9f9',
                backgroundColor: '#e2e2e2',
                overflow: 'hidden',
                zIndex: 10,
                boxShadow: '0 4px 15px rgba(0,0,0,0.12)'
              }} className="md:w-40 md:h-40">
                {displayImage ? (
                  <img 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    src={displayImage}
                    alt={displayName}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem', fontWeight: 700, color: '#fff', letterSpacing: '1px'
                  }}>
                    {initials}
                  </div>
                )}

                {/* Profile Photo Camera Badge - ONLY SHOW IF LOGGED IN USER IS OWNER */}
                {isOwner && (
                  <label style={{
                    position: 'absolute', bottom: '6px', right: '6px',
                    background: '#FF9933', color: '#FFF', width: '34px', height: '34px',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', zIndex: 12,
                    border: '2px solid #FFF'
                  }} title="Change Profile Picture">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>camera_alt</span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                  </label>
                )}
              </div>

              {/* Edit Profile Action Button - ONLY SHOW IF LOGGED IN USER IS OWNER */}
              {isOwner && (
                <div style={{ zIndex: 10 }}>
                  <button 
                    onClick={() => setShowEditModal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 22px',
                      borderRadius: '30px',
                      background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(255, 153, 51, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                    <span>Edit Profile</span>
                  </button>
                </div>
              )}
            </div>

            {/* Text Details */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#1a1c1c',
                marginBottom: '4px'
              }}>{displayName}</h2>
              <p style={{
                fontSize: '18px',
                color: '#454652',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {roleName}
                <span className="material-symbols-outlined" style={{
                  color: '#fec330',
                  fontSize: '18px'
                }}>verified</span>
              </p>
              <p style={{
                fontSize: '16px',
                color: '#1a1c1c',
                maxWidth: '672px',
                lineHeight: '1.625'
              }}>
                {targetPartner.address || targetPartner.city ? (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>location_on</span>
                    {[targetPartner.address, targetPartner.city, targetPartner.state].filter(Boolean).join(', ')}
                  </>
                ) : (
                  'No bio or address provided.'
                )}
              </p>
              <a style={{
                fontWeight: 600,
                fontSize: '12px',
                color: '#000666',
                marginTop: '8px',
                display: targetPartner.email ? 'inline-flex' : 'none',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none'
              }} href={`mailto:${targetPartner.email}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>mail</span> {targetPartner.email}
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section - Dynamic from API */}
        <section style={{
          padding: '16px 24px',
          backgroundColor: '#f9f9f9',
          borderTop: '1px solid #e2e2e2'
         }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#1a1c1c' }}>
                {loadingDetails ? '...' : details.usersCount}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 500, color: '#454652', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Users</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#1a1c1c' }}>
                {loadingDetails ? '...' : details.membersCount}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 500, color: '#454652', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Members</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#1a1c1c' }}>
                {loadingDetails ? '...' : details.taskCount}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 500, color: '#454652', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tasks</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#1a1c1c' }}>
                {loadingDetails ? '...' : (details.selfMedia ? details.selfMedia.length : (details.media ? details.media.length : 0))}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 500, color: '#454652', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Media</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              flex: 1,
              backgroundColor: '#eeeeee',
              color: '#1a1c1c',
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '0.05em',
              padding: '8px 0',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
              Share Profile
            </button>
          </div>
        </section>

        {/* Media Toggle Buttons */}
        <section style={{
          padding: '16px 24px',
          backgroundColor: '#f9f9f9'
         }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '4px',
            backgroundColor: '#eeeeee',
            borderRadius: '8px'
          }}>
            <button 
              style={{
                flex: 1,
                padding: '8px 0',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '0.05em',
                textAlign: 'center',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeMediaTab === 'self' ? '#f9f9f9' : 'transparent',
                color: activeMediaTab === 'self' ? '#1a1c1c' : '#454652',
                boxShadow: activeMediaTab === 'self' ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'
              }}
              onClick={() => setActiveMediaTab('self')}
            >
              Self Media
            </button>
            <button 
              style={{
                flex: 1,
                padding: '8px 0',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '0.05em',
                textAlign: 'center',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: activeMediaTab === 'company' ? '#f9f9f9' : 'transparent',
                color: activeMediaTab === 'company' ? '#1a1c1c' : '#454652',
                boxShadow: activeMediaTab === 'company' ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'
              }}
              onClick={() => setActiveMediaTab('company')}
            >
              Company Media
            </button>
          </div>
        </section> 

        {/* Content Grid */}
        <section style={{ backgroundColor: '#f9f9f9' }}>
          {/* Tab Headers */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e2e2e2'
          }}>
            <button 
              style={{
                flex: 1,
                padding: '16px 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                borderBottom: `2px solid ${activeTabMenu === 'images' ? '#000666' : 'transparent'}`,
                color: activeTabMenu === 'images' ? '#000666' : '#454652',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onClick={() => setActiveTabMenu('images')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>grid_on</span>
              <span style={{
                fontWeight: 600,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'none'
              }} className="md:inline">Images</span>
            </button>
            <button 
              style={{
                flex: 1,
                padding: '16px 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                borderBottom: `2px solid ${activeTabMenu === 'videos' ? '#000666' : 'transparent'}`,
                color: activeTabMenu === 'videos' ? '#000666' : '#454652',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onClick={() => setActiveTabMenu('videos')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>play_arrow</span>
              <span style={{
                fontWeight: 600,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'none'
              }} className="md:inline">Videos</span>
            </button>
          </div>

          {/* Grid Container */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
            padding: '4px'
          }} className="md:gap-4 md:p-6">
          {displayMediaItems.length === 0 ? (
            <div style={{
              gridColumn: 'span 3',
              padding: '50px 20px',
              textAlign: 'center',
              color: '#94A3B8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#CBD5E1' }}>photo_library</span>
              <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>No {activeTabMenu === 'videos' ? 'videos' : 'images'} uploaded yet</p>
            </div>
          ) : displayMediaItems.map((item) => (
              <div 
                key={item.id} 
                style={{
                  aspectRatio: '1',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#e2e2e2'
                }} className="md:rounded-xl">
                {item.type === 'video' ? (
                  <video 
                    src={getMediaUrl(item.image)} 
                    controls 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    src={getMediaUrl(item.image)}
                    alt={item.title}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── EDIT PROFILE MODAL ──────────────────────────────────────────────── */}
      {showEditModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)',
          zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '540px',
            padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#1E293B', fontWeight: 800 }}>Edit Profile Details</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.2rem', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>City</label>
                  <input 
                    type="text" 
                    value={editForm.city} 
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>State</label>
                  <input 
                    type="text" 
                    value={editForm.state} 
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>Address / Location Bio</label>
                <textarea 
                  rows="3"
                  value={editForm.address} 
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF', color: '#64748B', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #FF9933, #FF6B00)', color: '#FFF', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255, 153, 51, 0.3)' }}
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;