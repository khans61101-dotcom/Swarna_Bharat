import React, { useState, useEffect } from 'react';
import './css/ProfilePage.css'; // For custom styles
import { API_URL, getMediaUrl } from '../config';

const ProfilePage = ({ partner, setActiveTab }) => {
  const [activeTabMenu, setActiveTabMenu] = useState('images');
  const [activeMediaTab, setActiveMediaTab] = useState('self');
  const [details, setDetails] = useState({ taskCount: 0, usersCount: 0, membersCount: 0, media: [] });
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    if (!partner) return;
    setLoadingDetails(true);
    fetch(`${API_URL}/partners/${partner.id}/details`)
      .then(r => r.json())
      .then(d => { setDetails(d); setLoadingDetails(false); })
      .catch(() => setLoadingDetails(false));
  }, [partner]);

  if (!partner) return null;

  const displayName = partner.organization_name || partner.name;
  const displayImage = partner.profile_image ? getMediaUrl(partner.profile_image) : null; 
  const roleName = partner.role_name || 'User';
  const initials = displayName.substring(0, 2).toUpperCase();

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
    <div style={{
      backgroundColor: '#f9f9f9',
      color: '#1a1c1c',
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
        backgroundColor: '#f9f9f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        height: '64px',
        borderBottom: '1px solid #e2e2e2'
      }} className="md:hidden">
        <button aria-label="Go back" style={{
          color: '#000666',
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
          color: '#1a1c1c'
        }}>{displayName}</h1>
        <button aria-label="More options" style={{
          color: '#454652',
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
        {/* Profile Header Section */}
        <section style={{
          position: 'relative',
          width: '100%',
          backgroundColor: '#f9f9f9'
        }}>
          {/* Cover Image */}
          <div style={{
            width: '100%',
            height: '192px',
            backgroundColor: '#e2e2e2',
            position: 'relative',
            overflow: 'hidden'
          }} className="md:h-64">
            <div 
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmJwMVc4eFd3OEDQdoSRwKYB6KPSQJ3AYM_8zoogXAxQazdxE_C9zowsPDO_wuYsQS00yTBs9AzhW3PKVhLOoENaN5eISPnwKJGwOvzzFZCAHQGyoVZ6FXOn3zYwOSsbzzj5sj9FhFm0cCXBnydmFG76diDxcm-w0Zl32Hhx2himcoP_hmnN0eXz18_0_ulBOe4DzCC44y2ZqL5xgSNwcYGnUN_5uKqU3UODBuwgNan6YqoPADT91v")',
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
              background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)'
            }}></div>
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
              {/* Avatar */}
              <div style={{
                position: 'relative',
                width: '128px',
                height: '128px',
                borderRadius: '50%',
                border: '4px solid #f9f9f9',
                backgroundColor: '#e2e2e2',
                overflow: 'hidden',
                zIndex: 10,
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
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
              </div>

              {/* Desktop Actions */}
               
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
                {partner.address || partner.city ? (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>location_on</span>
                    {[partner.address, partner.city, partner.state].filter(Boolean).join(', ')}
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
                display: partner.email ? 'inline-flex' : 'none',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none'
              }} href={`mailto:${partner.email}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>mail</span> {partner.email}
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
                  cursor: 'pointer',
                  overflow: 'hidden',
                  backgroundColor: '#e2e2e2',
                  borderRadius: '4px'
                }} className="md:rounded-xl"
              >
                {item.placeholder ? (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#e8e8e8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span className="material-symbols-outlined" style={{
                      fontSize: '36px',
                      color: '#454652'
                    }}>image</span>
                  </div>
                ) : (
                  <>
                    {item.type === 'video' ? (
                      <video 
                        src={getMediaUrl(item.image)}
                        controls
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        style={{
                          backgroundImage: `url("${getMediaUrl(item.image)}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          width: '100%',
                          height: '100%' 
                        }}
                      />
                    )}
                    {item.type === 'video' && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>movie</span>
                      </div>
                    )}
                    {item.type === 'carousel' && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>dynamic_feed</span>
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px'
                    }} className="group-hover:opacity-100">
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'white',
                        gap: '4px',
                        fontWeight: 600,
                        fontSize: '12px'
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>favorite</span> {item.likes}
                      </div>
                      {item.comments && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'white',
                          gap: '4px',
                          fontWeight: 600,
                          fontSize: '12px'
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat_bubble</span> {item.comments}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav Bar (Mobile Only) */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '64px',
        padding: '0 16px',
        backgroundColor: '#f9f9f9',
        borderTop: '1px solid #c6c5d4'
      }} className="md:hidden">
        <a style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#454652',
          textDecoration: 'none',
          flex: 1,
          height: '100%'
        }} href="#">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>home</span>
        </a>
        <a style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#454652',
          textDecoration: 'none',
          flex: 1,
          height: '100%'
        }} href="#">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>search</span>
        </a>
        <a style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#454652',
          textDecoration: 'none',
          flex: 1,
          height: '100%'
        }} href="#">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>add_box</span>
        </a>
        <a style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#454652',
          textDecoration: 'none',
          flex: 1,
          height: '100%'
        }} href="#">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>movie</span>
        </a>
        <a style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000666',
          textDecoration: 'none',
          flex: 1,
          height: '100%'
        }} href="#">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>person</span>
        </a>
      </nav>
    </div>
  );
};

export default ProfilePage; 