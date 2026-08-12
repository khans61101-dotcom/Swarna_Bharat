import React, { useState, useEffect } from 'react';
import { useLang } from '../LanguageContext';
import { Building2, Heart, Users, User, MapPin, Globe, Award, Star, TrendingUp } from 'lucide-react';
import { API_URL, getMediaUrl } from '../config';

export default function PartnersPage({
  setActiveTab,  
  setSelectedPartner,
}) {
  const { lang, t } = useLang();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [hoveredPartner, setHoveredPartner] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/partners`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.partners)) {
          setPartners(data.partners);
        } else if (Array.isArray(data)) {
          setPartners(data);
        } else {
          setPartners([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching partners:', err);
        setPartners([]);
        setLoading(false);
      });
  }, []);

  const safePartners = Array.isArray(partners) ? partners : [];

  const getRoleIcon = (roleName) => {
    switch(roleName) {
      case 'Agency': return <Building2 size={18} />;
      case 'NGO': return <Heart size={18} />;
      case 'Member': return <Users size={18} />;
      default: return <User size={18} />;
    }
  };

  const getRoleColor = (roleName) => {
    switch(roleName) {
      case 'Agency': return { bg: '#FFF7ED', color: '#EA580C', border: '#FDBA74', hover: '#FFEDD5' };
      case 'NGO': return { bg: '#FDF2F8', color: '#DB2777', border: '#F9A8D4', hover: '#FCE7F3' };
      case 'Member': return { bg: '#F5F3FF', color: '#7C3AED', border: '#C4B5FD', hover: '#EDE9FE' };
      default: return { bg: '#EFF6FF', color: '#2563EB', border: '#93C5FD', hover: '#DBEAFE' };
    }
  };

  const getRoleStats = (roleName) => {
    const filtered = safePartners.filter(p => p.role_name === roleName);
    return filtered.length;
  };

  const filteredPartners = filter === 'All' 
    ? safePartners 
    : safePartners.filter(p => p.role_name === filter);

  // Stats for filter buttons
  const stats = {
    All: safePartners.length,
    Agency: getRoleStats('Agency'),
    NGO: getRoleStats('NGO'),
    Member: getRoleStats('Member'),
    User: getRoleStats('User')
  };

  return (
    <div className="partners-container" style={{ 
      padding: '60px 20px 80px', 
      minHeight: '80vh',
      background: 'var(--bg-light)',
      color: 'var(--text-dark)'
    }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '50px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
          borderRadius: '50%',
          opacity: '0.08',
          filter: 'blur(20px)'
        }} />
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255, 153, 51, 0.15)',
          padding: '8px 20px',
          borderRadius: '50px',
          marginBottom: '20px'
        }}>
          <Globe size={20} color="#FF9933" />
          <span style={{ color: '#FF9933', fontWeight: 600, fontSize: '0.9rem' }}>
            {lang === 'en' ? 'Global Network' : 'वैश्विक नेटवर्क'}
          </span>
        </div>

        <h2 style={{ 
          fontSize: 'clamp(2rem, 4vw, 3rem)', 
          fontWeight: 800, 
          color: 'var(--text-dark)',
          marginBottom: '12px',
          letterSpacing: '-0.02em'
        }}>
          {lang === 'en' ? 'Our Network & Partners' : 'हमारे नेटवर्क और भागीदार'}
        </h2>
        
        <p style={{ 
          color: 'var(--text-muted)', 
          maxWidth: '640px', 
          margin: '0 auto', 
          fontSize: '1.1rem',
          lineHeight: '1.7'
        }}>
          {lang === 'en' 
            ? 'Discover the dedicated agencies, NGOs, members, and users working together for a better future.' 
            : 'बेहतर भविष्य के लिए एक साथ काम करने वाली एजेंसियों, गैर सरकारी संगठनों, सदस्यों और उपयोगकर्ताओं की खोज करें।'}
        </p>
      </div>

      {/* Filter Buttons with Stats */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '12px', 
        marginBottom: '45px', 
        flexWrap: 'wrap',
        padding: '0 10px'
      }}>
        {['All', 'Agency', 'NGO', 'Member', 'User'].map(role => {
          const isActive = filter === role;
          const colors = getRoleColor(role);
          
          return (
            <button
              key={role}
              onClick={() => setFilter(role)}
              style={{
                padding: '10px 24px',
                borderRadius: '50px',
                border: isActive ? 'none' : '1px solid var(--card-border)',
                background: isActive 
                  ? `linear-gradient(135deg, ${colors.color}, ${colors.color}dd)` 
                  : 'var(--card-bg)',
                color: isActive ? '#FFFFFF' : 'var(--text-dark)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive 
                  ? `0 4px 15px ${colors.color}40` 
                  : '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = colors.color;
                  e.currentTarget.style.color = colors.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--card-border)';
                  e.currentTarget.style.color = 'var(--text-dark)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {role === 'All' ? (lang === 'en' ? 'All' : 'सभी') : role}
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-alt)',
                padding: '2px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isActive ? 'inherit' : 'var(--text-muted)'
              }}>
                {stats[role] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '4px solid var(--card-border)',
            borderTopColor: '#FF9933',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            {lang === 'en' ? 'Loading network...' : 'नेटवर्क लोड हो रहा है...'}
          </p>
        </div>
      ) : filteredPartners.length > 0 ? (
        // Partners Grid
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '28px',
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          {filteredPartners.map((partner) => {
            const colors = getRoleColor(partner.role_name);
            const displayName = partner.organization_name || partner.name;
            const initials = displayName.substring(0, 2).toUpperCase();
            const isHovered = hoveredPartner === partner.id;

            return (
              <div 
                key={partner.id} 
                onClick={() => {
                  setSelectedPartner(partner);
                  setActiveTab("PartnerDetails");
                }}  
                onMouseEnter={() => setHoveredPartner(partner.id)}
                onMouseLeave={() => setHoveredPartner(null)}
                style={{
                  background: 'var(--card-bg)',
                  borderRadius: '20px',
                  padding: '30px 25px',
                  border: '1px solid var(--card-border)',
                  boxShadow: isHovered 
                    ? '0 20px 40px rgba(0,0,0,0.08)' 
                    : '0 4px 15px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Gradient Top Bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${colors.color}, ${colors.color}80)`,
                  opacity: isHovered ? 1 : 0.6,
                  transition: 'opacity 0.3s'
                }} />

                {/* Decorative Circle */}
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: `${colors.color}08`,
                  pointerEvents: 'none'
                }} />

                {/* Avatar */}
                {partner.profile_image ? (
                  <img 
                    src={getMediaUrl(partner.profile_image)}       
                    alt={displayName}   
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '18px',
                      border: `3px solid ${colors.border}`,
                      boxShadow: isHovered ? `0 8px 25px ${colors.color}30` : 'none',
                      transition: 'all 0.3s'
                    }} 
                  />
                ) : (
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${colors.bg}, ${colors.hover})`,
                    color: colors.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 800,
                    marginBottom: '18px',
                    border: `3px solid ${colors.border}`,
                    boxShadow: isHovered ? `0 8px 25px ${colors.color}30` : 'none',
                    transition: 'all 0.3s'
                  }}>
                    {initials}
                  </div>
                )}

                {/* Name */}
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 700, 
                  color: 'var(--text-dark)', 
                  marginBottom: '8px',
                  transition: 'color 0.3s'
                }}>
                  {displayName}
                </h3>
                
                {/* Role Badge */}
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 16px',
                  borderRadius: '50px',
                  background: 'var(--bg-alt)',
                  color: colors.color,
                  border: `1px solid ${colors.border}`,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                  transition: 'all 0.3s'
                }}>
                  {getRoleIcon(partner.role_name)}
                  {partner.role_name}
                </div>

                {/* Location */}
                {(partner.city || partner.state) && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    color: 'var(--text-muted)', 
                    fontSize: '0.85rem',
                    marginBottom: '16px'
                  }}>
                    <MapPin size={16} color="var(--text-muted)" />
                    {[partner.city, partner.state].filter(Boolean).join(', ')}
                  </div>
                )}

                {/* Stats or Description */}
                {partner.description && (
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#64748B',
                    lineHeight: '1.6',
                    marginTop: '4px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {partner.description}
                  </p>
                )}

                {/* View Profile Button - Appears on Hover */}
                <div style={{
                  marginTop: '20px',
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  width: '100%'
                }}>
                  <button style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    border: 'none',
                    background: `linear-gradient(135deg, ${colors.color}, ${colors.color}cc)`,
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 4px 15px ${colors.color}50`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    {lang === 'en' ? 'View Profile' : 'प्रोफ़ाइल देखें'}
                    <TrendingUp size={16} />
                  </button>
                </div>

                {/* Index Badge */}
                

                {/* Verified Badge (optional) */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#10B981',
                  color: '#FFFFFF',
                  padding: '2px 10px',
                  borderRadius: '50px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Star size={12} />
                  Verified
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Empty State
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Users size={48} color="#94A3B8" />
          </div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            color: '#1E293B', 
            marginBottom: '8px',
            fontWeight: 700
          }}>
            {lang === 'en' ? 'No partners found' : 'कोई भागीदार नहीं मिला'}
          </h3>
          <p style={{ color: '#94A3B8', lineHeight: '1.7' }}>
            {lang === 'en' 
              ? `There are no ${filter !== 'All' ? filter + 's' : 'partners'} to display at the moment.` 
              : 'इस समय प्रदर्शित करने के लिए कोई भागीदार नहीं हैं।'}
          </p>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .partners-container {
            animation: fadeIn 0.6s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}  