import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Camera, LogOut, CheckCircle, Shield, 
  Trash2, Video, Image, PlusCircle, Award, Users, CheckSquare, 
  Film, LayoutDashboard, Copy, Check, ExternalLink, Share2, Sparkles, Key, Search,
  Menu, X, ChevronRight, Eye, Star, Crown, TrendingUp, Calendar, 
  Clock, Wallet, Gift, Bell, Settings, HelpCircle, ArrowUpRight,
  Grid, List, Heart, ThumbsUp, MessageCircle, Bookmark, Play,
  ChevronDown, Filter, Download, Upload, RefreshCw, Zap
} from 'lucide-react';
import { useLang } from '../LanguageContext';
import { API_BASE_URL, API_URL, getMediaUrl } from '../config';
import ProfilePage from './ProfileDetails';

export default function Dashboard({ setActiveTab, setUserState }) {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDashTab, setActiveDashTab] = useState('overview');
  const [mediaFilter, setMediaFilter] = useState('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  const [userStats, setUserStats] = useState({ taskCount: 0, usersCount: 0, membersCount: 0 });
  const [userMedia, setUserMedia] = useState([]);
  const [downlineUsers, setDownlineUsers] = useState([]);
  const [networkSearch, setNetworkSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isDark, setIsDark] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [proofModal, setProofModal] = useState({ isOpen: false, task: null });
  const [proofText, setProofText] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofVideoUrl, setProofVideoUrl] = useState('');
  const [submittingProof, setSubmittingProof] = useState(false);
  const [viewProofModal, setViewProofModal] = useState({ isOpen: false, task: null });
  const [walletData, setWalletData] = useState({ balance: 0, total_credited: 0, total_debited: 0, transactions: [] });
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    points: 100,
    priority: 'Medium',
    start_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    target_role: 'User'
  });
  const [creatingTask, setCreatingTask] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchUserTasks();
    fetchWalletData();
  }, []);

  useEffect(() => {
    if (activeDashTab === 'tasks') {
      fetchUserTasks();
    }
    if (activeDashTab === 'wallet') {
      fetchWalletData();
    }
  }, [activeDashTab, user]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      setActiveTab('Auth');
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/auth/me?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
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

        fetchUserStatsAndMedia(data.id, data.role_name);
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

  const fetchUserTasks = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/task-assignments?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAssignedTasks(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching assigned tasks:', err);
    }
  };

  const fetchWalletData = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/wallet/balance?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setWalletData(data);
      }
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
    }
  };

  const handleStartTask = async (assignmentId) => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/task-assignments/${assignmentId}/start`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMsg({ text: lang === 'en' ? 'Task started successfully!' : 'कार्य सफलतापूर्वक शुरू हुआ!', type: 'success' });
        fetchUserTasks();
      } else {
        const data = await res.json().catch(() => ({}));
        setMsg({ text: data.error || 'Failed to start task', type: 'error' });
      }
    } catch (e) {
      setMsg({ text: 'Network error starting task', type: 'error' });
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!proofModal.task) return;
    const token = localStorage.getItem('userToken');
    if (!token) return;

    if (!proofText && !proofFile && !proofVideoUrl) {
      alert(lang === 'en' ? 'Please write work notes, upload a proof file, or provide a video link.' : 'कृपया कार्य विवरण लिखें, फ़ाइल अपलोड करें या वीडियो लिंक दें।');
      return;
    }

    setSubmittingProof(true);
    try {
      let uploadedFileUrl = '';
      if (proofFile) {
        const fileFormData = new FormData();
        fileFormData.append('proof_file', proofFile);
        const uploadRes = await fetch(`${API_URL}/upload/proof`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fileFormData
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          uploadedFileUrl = uploadData.url || uploadData.publicUrl || '';
        } else {
          alert(uploadData.error || 'Proof file upload failed');
          setSubmittingProof(false);
          return;
        }
      }

      const submitRes = await fetch(`${API_URL}/task-assignments/${proofModal.task.id}/submit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          proof_text: proofText || null,
          proof_file: uploadedFileUrl || null,
          video_url: proofVideoUrl || null
        })
      });

      if (submitRes.ok) {
        setMsg({ text: lang === 'en' ? 'Proof submitted successfully! Awaiting review.' : 'कार्य प्रमाण जमा हो गया! समीक्षा की प्रतीक्षा है।', type: 'success' });
        setProofModal({ isOpen: false, task: null });
        setProofText('');
        setProofFile(null);
        setProofVideoUrl('');
        fetchUserTasks();
      } else {
        const submitData = await submitRes.json().catch(() => ({}));
        alert(submitData.error || 'Failed to submit proof.');
      }
    } catch (err) {
      alert('Network error submitting proof.');
    } finally {
      setSubmittingProof(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    if (!token) return;

    if (!newTaskData.title.trim()) {
      alert(lang === 'en' ? 'Please enter task title' : 'कृपया कार्य शीर्षक दर्ज करें');
      return;
    }

    setCreatingTask(true);
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTaskData.title.trim(),
          description: newTaskData.description.trim() || null,
          points: parseInt(newTaskData.points) || 100,
          priority: newTaskData.priority || 'Medium',
          start_date: newTaskData.start_date,
          due_date: newTaskData.due_date,
          status: 'Active'
        })
      });

      const data = await res.json();

      if (!res.ok || !data.task) {
        alert(data.error || 'Failed to create task master');
        setCreatingTask(false);
        return;
      }

      const createdTaskId = data.task.id;

      const assignRes = await fetch(`${API_URL}/task-assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          task_id: createdTaskId,
          target_role: newTaskData.target_role || 'User'
        })
      });

      const assignData = await assignRes.json();

      setMsg({
        text: lang === 'en'
          ? `Task "${newTaskData.title}" created & assigned to ${newTaskData.target_role} role successfully!`
          : `कार्य "${newTaskData.title}" सफलतापूर्वक बनाया गया और ${newTaskData.target_role} भूमिका को सौंपा गया!`,
        type: 'success'
      });

      setNewTaskData({
        title: '',
        description: '',
        points: 100,
        priority: 'Medium',
        start_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        target_role: 'User'
      });

      fetchUserTasks();
      setActiveDashTab('tasks');
    } catch (err) {
      alert('Network error creating task');
    } finally {
      setCreatingTask(false);
    }
  };

  const fetchUserStatsAndMedia = async (userId, roleName) => {
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
        
        const list = (data.downlineUsers && Array.isArray(data.downlineUsers))
          ? data.downlineUsers
          : (data.downlines && Array.isArray(data.downlines) ? data.downlines : []);

        setDownlineUsers(list);
      }
    } catch (e) {
      console.error('Error fetching stats:', e);
      setDownlineUsers([]);
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
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '4px solid #2563EB',
            borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '1.1rem', color: '#78350F', fontWeight: 600 }}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const photosCount = userMedia.filter(m => m.type !== 'video' && !m.src?.endsWith('.mp4') && !m.src?.endsWith('.webm') && !m.src?.endsWith('.mov')).length;
  const videosCount = userMedia.filter(m => m.type === 'video' || m.src?.endsWith('.mp4') || m.src?.endsWith('.webm') || m.src?.endsWith('.mov')).length;

  const filteredMedia = userMedia.filter(item => {
    const isVid = item.type === 'video' || item.src?.endsWith('.mp4') || item.src?.endsWith('.webm') || item.src?.endsWith('.mov');
    if (mediaFilter === 'image') return !isVid;
    if (mediaFilter === 'video') return isVid;
    return true;
  });

  const statsCards = [
    { icon: Wallet, label: lang === 'en' ? 'Wallet Balance' : 'वॉलेट बैलेंस', value: `${walletData.balance ?? 0} Pts`, color: '#0284C7', bg: '#E0F2FE', tab: 'wallet' },
    { icon: CheckSquare, label: lang === 'en' ? 'Tasks' : 'कार्य', value: userStats.taskCount, color: '#3B82F6', bg: '#EFF6FF', tab: 'tasks' },
    { icon: Users, label: lang === 'en' ? 'Downline' : 'डाउनलाइन', value: userStats.usersCount, color: '#10B981', bg: '#ECFDF5', tab: 'network' },
    { icon: Award, label: lang === 'en' ? 'Members' : 'सदस्य', value: userStats.membersCount, color: '#F59E0B', bg: '#FEF3C7', tab: 'network' },
    { icon: Film, label: lang === 'en' ? 'Media Posts' : 'मीडिया', value: userMedia.length, color: '#8B5CF6', bg: '#F5F3FF', tab: 'media' },
  ];

  return (
    <div style={{ 
      background: '#F8FAFC', 
      color: '#1E293B', 
      minHeight: '100vh', 
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* LIGHT GRADIENT BACKGROUND */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #dbeafe 50%, #eff6ff 75%, #f8fafc 100%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      
      {/* Light Animated Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #2563EB 0%, #3b82f6 30%, #60a5fa 60%, #93bbfc 80%, #dbeafe 100%)',
        opacity: 0.05,
        backgroundSize: '400% 400%',
        animation: 'gradientMove 20s ease infinite',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          25% { background-position: 50% 0%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 100%; }
          100% { background-position: 0% 50%; }
        }
        .fade-in { animation: fadeIn 0.5s ease; }
        .stat-card:hover { transform: translateY(-4px); transition: all 0.3s ease; }
        .media-grid-item:hover { transform: scale(1.02); transition: all 0.3s ease; }
        @media (max-width: 1023px) {
          .dash-sidebar { transform: translateX(-100%); }
          .dash-sidebar.open { transform: translateX(0) !important; }
          .dash-main-panel { margin-left: 0 !important; width: 100% !important; }
        }
        @media (min-width: 1024px) {
          .dash-sidebar { transform: translateX(0) !important; }
          .dash-main-panel { margin-left: 280px !important; width: calc(100% - 280px) !important; }
        }
        .glow-btn:hover { box-shadow: 0 0 25px rgba(37, 99, 235, 0.5); }
        .nav-item-active { background: linear-gradient(135deg, #2563EB, #1D4ED8) !important; color: #FFF !important; }
        .nav-item-active .nav-icon { color: #FFF !important; }
        .nav-item:hover { background: rgba(37, 99, 235, 0.1); }
      `}</style>

      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(15,23,42,0.6)', 
            backdropFilter: 'blur(4px)', 
            zIndex: 99 
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className="dash-sidebar"
        style={{
          width: '280px',
          background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFF',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0, bottom: 0, left: 0,
          zIndex: 100,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '4px 0 30px rgba(0,0,0,0.2)'
        }}
      >
        {/* Brand */}
        <div style={{ 
          padding: '24px 20px', 
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#FFF',
              fontSize: '1.3rem',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
            }}>
              SB
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFF', letterSpacing: '-0.3px' }}>
                Swarna Bharat
              </h3>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.3px' }}>
                CITIZEN PORTAL
              </span>
            </div>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(false)} 
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: 'none', 
              color: '#94A3B8', 
              cursor: 'pointer', 
              padding: '6px',
              borderRadius: '8px',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div style={{ 
          padding: '20px', 
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              position: 'relative',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#FFF',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
            }}>
              {user.profile_image ? (
                <img src={getMediaUrl(user.profile_image)} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.2rem' }}>{user.name.substring(0, 2).toUpperCase()}</span>
              )}
              <label style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#2563EB',
                color: '#FFF',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid #1E293B'
              }}>
                <Camera size={10} />
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
              </label>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h4 style={{ 
                margin: 0, 
                fontSize: '0.95rem', 
                color: '#F8FAFC', 
                fontWeight: 700,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
                {user.name}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <Shield size={12} color="#2563EB" />
                <span style={{
                  fontSize: '0.72rem',
                  color: '#2563EB',
                  fontWeight: 600
                }}>
                  {user.role_name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            padding: '0 12px 8px'
          }}>
            {lang === 'en' ? 'Main Menu' : 'मुख्य मेनू'}
          </div>

          {(() => {
            const isAgencyOrNgoOrAdmin = user && (user.role_name === 'Agency' || user.role_name === 'NGO' || user.role_name === 'Admin');
            const menuItems = [
              { id: 'overview', icon: LayoutDashboard, label: lang === 'en' ? 'Dashboard Overview' : 'डैशबोर्ड' },
              { id: 'tasks', icon: CheckSquare, label: lang === 'en' ? 'My Tasks' : 'सौंपे गए कार्य', badge: assignedTasks.length },
              { id: 'wallet', icon: Wallet, label: lang === 'en' ? 'Wallet Balance' : 'वॉलेट बैलेंस' },
              ...(isAgencyOrNgoOrAdmin ? [
                { id: 'create_task', icon: PlusCircle, label: lang === 'en' ? 'Create Task' : 'नया कार्य बनाएं' }
              ] : []),
              { id: 'network', icon: Users, label: lang === 'en' ? 'Network' : 'नेटवर्क', badge: downlineUsers.length },
              { id: 'media', icon: Film, label: lang === 'en' ? 'Gallery' : 'गैलरी', badge: userMedia.length },
              { id: 'public_profile', icon: Eye, label: lang === 'en' ? 'Public Profile' : 'सार्वजनिक प्रोफ़ाइल' },
              { id: 'profile', icon: User, label: lang === 'en' ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें' },
            ];

            return menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveDashTab(item.id); setMobileSidebarOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeDashTab === item.id ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'transparent',
                  color: activeDashTab === item.id ? '#FFF' : '#94A3B8',
                  fontWeight: activeDashTab === item.id ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: activeDashTab === item.id ? '0 4px 15px rgba(37, 99, 235, 0.3)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <item.icon size={18} style={{ color: activeDashTab === item.id ? '#FFF' : '#94A3B8' }} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span style={{
                    background: activeDashTab === item.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                    color: '#FFF',
                    padding: '2px 10px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ));
          })()}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.08)',
              color: '#F87171',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={18} />
            <span>{lang === 'en' ? 'Logout' : 'लॉगआउट'}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="dash-main-panel" style={{
        flex: 1,
        marginLeft: '280px',
        width: 'calc(100% - 280px)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <header style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(10px)',
          padding: '0 28px',
          height: '72px',
          borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 10px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
              style={{
                background: 'rgba(241, 245, 249, 0.8)',
                border: 'none',
                padding: '8px 10px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                color: '#0F172A'
              }}
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.2rem', 
                fontWeight: 800, 
                color: '#0F172A',
                letterSpacing: '-0.3px'
              }}>
                {activeDashTab === 'overview' && (lang === 'en' ? 'Dashboard Overview' : 'डैशबोर्ड अवलोकन')}
                {activeDashTab === 'tasks' && (lang === 'en' ? 'My Assigned Tasks' : 'सौंपे गए कार्य')}
                {activeDashTab === 'wallet' && (lang === 'en' ? 'My Wallet Balance & Points' : 'वॉलेट बैलेंस और पॉइंट्स')}
                {activeDashTab === 'create_task' && (lang === 'en' ? 'Create & Assign Task' : 'नया कार्य बनाएं')}
                {activeDashTab === 'network' && (lang === 'en' ? 'My Network' : 'मेरा नेटवर्क')}
                {activeDashTab === 'media' && (lang === 'en' ? 'Media Gallery' : 'मीडिया गैलरी')}
                {activeDashTab === 'public_profile' && (lang === 'en' ? 'Public Profile' : 'सार्वजनिक प्रोफ़ाइल')}
                {activeDashTab === 'profile' && (lang === 'en' ? 'Profile Settings' : 'प्रोफ़ाइल सेटिंग्स')}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(248, 250, 252, 0.8)',
              padding: '6px 16px',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(226, 232, 240, 0.5)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#16A34A',
                display: 'inline-block'
              }}></div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Body */}
        <main style={{ padding: '28px', flex: 1 }}>
          {/* Messages */}
          {msg.text && (
            <div style={{
              padding: '14px 20px',
              borderRadius: '14px',
              marginBottom: '24px',
              background: msg.type === 'error' ? '#FEF2F2' : msg.type === 'success' ? '#F0FDF4' : '#EFF6FF',
              color: msg.type === 'error' ? '#DC2626' : msg.type === 'success' ? '#16A34A' : '#2563EB',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
              border: `1px solid ${msg.type === 'error' ? '#FCA5A5' : msg.type === 'success' ? '#86EFAC' : '#93C5FD'}`
            }}>
              <CheckCircle size={18} /> {msg.text}
            </div>
          )}

          {/* OVERVIEW */}
          {activeDashTab === 'overview' && (
            <div className="fade-in">
              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '28px'
              }}>
                {statsCards.map((stat, idx) => (
                  <div
                    key={idx}
                    className="stat-card"
                    onClick={() => stat.tab && setActiveDashTab(stat.tab)}
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(10px)',
                      padding: '20px',
                      borderRadius: '18px',
                      border: '1px solid rgba(226, 232, 240, 0.5)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                      cursor: stat.tab ? 'pointer' : 'default',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        background: stat.bg,
                        color: stat.color,
                        padding: '12px',
                        borderRadius: '14px',
                        display: 'flex'
                      }}>
                        <stat.icon size={22} />
                      </div>
                      <div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#94A3B8',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {stat.label}
                        </span>
                        <h3 style={{
                          margin: '2px 0 0',
                          fontSize: '1.5rem',
                          fontWeight: 800,
                          color: '#0F172A'
                        }}>
                          {stat.value}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Referral Card */}
              <div style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                boxShadow: '0 2px 15px rgba(0,0,0,0.02)',
                marginBottom: '28px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      background: '#EFF6FF',
                      padding: '10px',
                      borderRadius: '12px',
                      display: 'flex'
                    }}>
                      <Share2 size={20} color="#1D4ED8" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                        {lang === 'en' ? 'Referral Program' : 'रेफरल प्रोग्राम'}
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                        {lang === 'en' ? 'Share your unique link and earn rewards' : 'अपनी अनूठी लिंक साझा करें और इनाम प्राप्त करें'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyRef}
                    style={{
                      background: copiedRef ? '#16A34A' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      color: '#FFF',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '30px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    {copiedRef ? <Check size={16} /> : <Copy size={16} />}
                    {copiedRef ? (lang === 'en' ? 'Copied!' : 'कॉपी हो गया!') : (lang === 'en' ? 'Copy Referral Link' : 'रेफरल लिंक कॉपी करें')}
                  </button>
                </div>
                <div style={{
                  marginTop: '16px',
                  background: 'rgba(248, 250, 252, 0.8)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(226, 232, 240, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>
                    {lang === 'en' ? 'Your Referral Code:' : 'आपका रेफरल कोड:'}
                  </span>
                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#1D4ED8',
                    letterSpacing: '1px'
                  }}>
                    {user.referral_code || 'REF-USER-101'}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    background: '#DBEAFE',
                    color: '#2563EB',
                    padding: '2px 12px',
                    borderRadius: '20px',
                    fontWeight: 700
                  }}>
                    {lang === 'en' ? 'Active' : 'सक्रिय'}
                  </span>
                </div>
              </div>

              {/* Profile Details Card */}
              <div style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                boxShadow: '0 2px 15px rgba(0,0,0,0.02)',
                marginBottom: '28px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <User size={22} color="#1D4ED8" />
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                      {lang === 'en' ? 'Personal Information' : 'व्यक्तिगत जानकारी'}
                    </h4>
                  </div>
                  <button
                    onClick={() => setActiveDashTab('profile')}
                    style={{
                      background: '#EFF6FF',
                      border: '1px solid #DBEAFE',
                      color: '#2563EB',
                      padding: '6px 18px',
                      borderRadius: '30px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ✏️ {lang === 'en' ? 'Edit' : 'संपादित करें'}
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '14px'
                }}>
                  {[
                    { label: lang === 'en' ? 'Full Name' : 'पूरा नाम', value: user.name || 'N/A', icon: User },
                    { label: lang === 'en' ? 'Email' : 'ईमेल', value: user.email || 'N/A', icon: Mail },
                    { label: lang === 'en' ? 'Phone' : 'फोन', value: user.phone || 'N/A', icon: Phone },
                    { label: lang === 'en' ? 'Role' : 'भूमिका', value: user.role_name || 'Member', icon: Shield, highlight: true },
                    { label: lang === 'en' ? 'Date of Birth' : 'जन्म तिथि', value: user.dob ? user.dob.split('T')[0] : 'N/A', icon: Calendar },
                    { label: lang === 'en' ? 'City / State' : 'शहर / राज्य', value: user.city || user.state ? `${user.city || ''}${user.city && user.state ? ', ' : ''}${user.state || ''} ${user.pincode ? '(' + user.pincode + ')' : ''}` : 'N/A', icon: MapPin },
                    { label: lang === 'en' ? 'Bank Account' : 'बैंक खाता', value: user.bank_name ? `${user.bank_name} (${user.account_no || 'N/A'})` : 'N/A', icon: Wallet },
                    { label: lang === 'en' ? 'UPI ID' : 'UPI आईडी', value: user.upi_id || 'N/A', icon: Zap },
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(248, 250, 252, 0.8)',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(226, 232, 240, 0.5)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <item.icon size={14} color="#94A3B8" />
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {item.label}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: item.highlight ? '#1D4ED8' : '#0F172A'
                      }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px'
              }}>
                {[
                  { 
                    icon: Film, 
                    label: lang === 'en' ? 'Upload Media' : 'मीडिया अपलोड करें',
                    desc: lang === 'en' ? 'Add photos & videos to gallery' : 'गैलरी में फ़ोटो और वीडियो जोड़ें',
                    color: '#2563EB',
                    bg: '#EFF6FF',
                    action: () => setActiveDashTab('media')
                  },
                  { 
                    icon: Users, 
                    label: lang === 'en' ? 'View Network' : 'नेटवर्क देखें',
                    desc: lang === 'en' ? 'See all connected members' : 'सभी जुड़े सदस्यों को देखें',
                    color: '#3B82F6',
                    bg: '#EFF6FF',
                    action: () => setActiveDashTab('network')
                  },
                  { 
                    icon: Eye, 
                    label: lang === 'en' ? 'Public Profile' : 'सार्वजनिक प्रोफ़ाइल',
                    desc: lang === 'en' ? 'View your public page' : 'अपना सार्वजनिक पृष्ठ देखें',
                    color: '#8B5CF6',
                    bg: '#F5F3FF',
                    action: () => setActiveDashTab('public_profile')
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={item.action}
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(10px)',
                      padding: '20px',
                      borderRadius: '18px',
                      border: '1px solid rgba(226, 232, 240, 0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        background: item.bg,
                        color: item.color,
                        padding: '12px',
                        borderRadius: '14px',
                        display: 'flex'
                      }}>
                        <item.icon size={22} />
                      </div>
                      <div>
                        <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                          {item.label}
                        </h5>
                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <div style={{
                      marginTop: '12px',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {lang === 'en' ? 'Explore' : 'जाएं'} <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MY TASKS TAB */}
          {activeDashTab === 'tasks' && (
            <div className="fade-in">
              {/* Task Summary Stat Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '16px',
                marginBottom: '28px'
              }}>
                {[
                  { label: lang === 'en' ? 'Total Assigned' : 'कुल सौंपे गए', value: assignedTasks.length, color: '#2563EB', bg: '#EFF6FF' },
                  { label: lang === 'en' ? 'Pending' : 'लंबित', value: assignedTasks.filter(t => t.status === 'Pending').length, color: '#64748B', bg: '#F8FAFC' },
                  { label: lang === 'en' ? 'In Progress' : 'प्रगति में', value: assignedTasks.filter(t => t.status === 'In Progress').length, color: '#2563EB', bg: '#EFF6FF' },
                  { label: lang === 'en' ? 'Submitted' : 'समीक्षाधीन', value: assignedTasks.filter(t => t.status === 'Submitted').length, color: '#7C3AED', bg: '#F5F3FF' },
                  { label: lang === 'en' ? 'Completed / Approved' : 'पूर्ण / स्वीकृत', value: assignedTasks.filter(t => ['Approved', 'Completed'].includes(t.status)).length, color: '#16A34A', bg: '#F0FDF4' },
                ].map((s, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(10px)',
                    padding: '18px 20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(226, 232, 240, 0.5)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Tasks List Card */}
              <div style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                boxShadow: '0 2px 15px rgba(0,0,0,0.02)'
              }}>
                {/* ... rest of tasks content remains the same ... */}
                {/* (tasks list content is unchanged, just the container has glass effect) */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                      {lang === 'en' ? 'Your Role Assigned Tasks' : 'आपकी भूमिका के लिए सौंपे गए कार्य'}
                    </h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                      {lang === 'en' ? 'Complete assigned tasks, upload work proof, and earn wallet reward points!' : 'सौंपे गए कार्य पूरा करें, कार्य का प्रमाण अपलोड करें, और वॉलेट पॉइंट कमाएं!'}
                    </p>
                  </div>
                  <button
                    onClick={fetchUserTasks}
                    style={{
                      background: 'rgba(241, 245, 249, 0.8)',
                      border: '1px solid rgba(203, 213, 225, 0.5)',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RefreshCw size={14} /> {lang === 'en' ? 'Refresh Tasks' : 'ताज़ा करें'}
                  </button>
                </div>

                {assignedTasks.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: 'rgba(248, 250, 252, 0.8)',
                    borderRadius: '16px',
                    border: '1px dashed rgba(203, 213, 225, 0.5)'
                  }}>
                    <CheckSquare size={48} color="#CBD5E1" style={{ marginBottom: '12px' }} />
                    <h4 style={{ fontSize: '1.1rem', color: '#334155', margin: '0 0 6px', fontWeight: 700 }}>
                      {lang === 'en' ? 'No tasks assigned to your role currently' : 'वर्तमान में आपकी भूमिका के लिए कोई कार्य नहीं है'}
                    </h4>
                    <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto' }}>
                      {lang === 'en' ? 'Admin will assign new tasks for your role soon. Check back later!' : 'एडमिन जल्द ही आपकी भूमिका के लिए नए कार्य असाइन करेंगे।'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {assignedTasks.map((t) => {
                      const isPending = t.status === 'Pending';
                      const isInProgress = t.status === 'In Progress';
                      const isSubmitted = t.status === 'Submitted';
                      const isApproved = t.status === 'Approved' || t.status === 'Completed';
                      const isRejected = t.status === 'Rejected';

                      return (
                        <div
                          key={t.id}
                          style={{
                            background: 'rgba(248, 250, 252, 0.8)',
                            border: `1px solid ${isApproved ? '#86EFAC' : isRejected ? '#FCA5A5' : isSubmitted ? '#DDD6FE' : 'rgba(226, 232, 240, 0.5)'}`,
                            borderLeft: `5px solid ${isApproved ? '#16A34A' : isRejected ? '#DC2626' : isSubmitted ? '#7C3AED' : isInProgress ? '#2563EB' : '#2563EB'}`,
                            borderRadius: '16px',
                            padding: '20px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                                  {t.task_title || t.title || 'Task Assignment'}
                                </h4>
                                <span style={{
                                  background: t.task_priority === 'Urgent' ? '#FEF2F2' : t.task_priority === 'High' ? '#EFF6FF' : '#F0FDF4',
                                  color: t.task_priority === 'Urgent' ? '#DC2626' : t.task_priority === 'High' ? '#2563EB' : '#16A34A',
                                  padding: '2px 10px',
                                  borderRadius: '20px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  border: `1px solid ${t.task_priority === 'Urgent' ? '#FCA5A5' : t.task_priority === 'High' ? '#DBEAFE' : '#86EFAC'}`
                                }}>
                                  {t.task_priority || 'Medium'}
                                </span>
                              </div>
                              {t.task_description && (
                                <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                  {t.task_description}
                                </p>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              <div style={{
                                background: '#FFF',
                                border: '1px solid #E2E8F0',
                                padding: '6px 14px',
                                borderRadius: '30px',
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                color: '#2563EB',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                🎁 {t.task_points ?? t.points ?? 0} pts
                              </div>

                              <span style={{
                                background: isApproved ? '#F0FDF4' : isRejected ? '#FEF2F2' : isSubmitted ? '#F5F3FF' : isInProgress ? '#EFF6FF' : '#F8FAFC',
                                color: isApproved ? '#16A34A' : isRejected ? '#DC2626' : isSubmitted ? '#7C3AED' : isInProgress ? '#2563EB' : '#64748B',
                                padding: '6px 16px',
                                borderRadius: '30px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                border: `1px solid ${isApproved ? '#86EFAC' : isRejected ? '#FCA5A5' : isSubmitted ? '#DDD6FE' : isInProgress ? '#DBEAFE' : '#CBD5E1'}`
                              }}>
                                {isApproved ? '✅ Approved & Completed' : isRejected ? '❌ Rejected' : isSubmitted ? '📤 Submitted (Pending Review)' : isInProgress ? '⚡ In Progress' : '🕐 Pending'}
                              </span>
                            </div>
                          </div>

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '12px',
                            paddingTop: '12px',
                            borderTop: '1px solid rgba(226, 232, 240, 0.5)',
                            fontSize: '0.82rem',
                            color: '#64748B'
                          }}>
                            <div>
                              📅 {lang === 'en' ? 'Due Date:' : 'अंतिम तिथि:'} <strong>{t.task_due_date ? new Date(t.task_due_date).toLocaleDateString() : 'N/A'}</strong>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              {isPending && (
                                <>
                                  <button
                                    onClick={() => handleStartTask(t.id)}
                                    style={{
                                      background: '#EFF6FF',
                                      color: '#2563EB',
                                      border: '1px solid #BFDBFE',
                                      padding: '8px 18px',
                                      borderRadius: '30px',
                                      fontWeight: 700,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px'
                                    }}
                                  >
                                    ▶️ {lang === 'en' ? 'Start Task' : 'कार्य शुरू करें'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setProofModal({ isOpen: true, task: t });
                                      setProofText(t.proof_text || '');
                                      setProofFile(null);
                                      setProofVideoUrl(t.video_url || '');
                                    }}
                                    style={{
                                      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                                      color: '#FFF',
                                      border: 'none',
                                      padding: '8px 20px',
                                      borderRadius: '30px',
                                      fontWeight: 700,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      boxShadow: '0 3px 10px rgba(37, 99, 235, 0.3)'
                                    }}
                                  >
                                    📤 {lang === 'en' ? 'Upload Proof' : 'प्रमाण अपलोड करें'}
                                  </button>
                                </>
                              )}

                              {(isInProgress || isRejected || isSubmitted) && (
                                <button
                                  onClick={() => {
                                    setProofModal({ isOpen: true, task: t });
                                    setProofText(t.proof_text || '');
                                    setProofFile(null);
                                    setProofVideoUrl(t.video_url || '');
                                  }}
                                  style={{
                                    background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                                    color: '#FFF',
                                    border: 'none',
                                    padding: '8px 20px',
                                    borderRadius: '30px',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 3px 10px rgba(37, 99, 235, 0.3)'
                                  }}
                                >
                                  📤 {isRejected ? (lang === 'en' ? 'Resubmit Proof' : 'प्रमाण पुनः भेजें') : isSubmitted ? (lang === 'en' ? 'Edit / Update Proof' : 'प्रमाण संपादित करें') : (lang === 'en' ? 'Submit Proof & Complete' : 'प्रमाण अपलोड और पूर्ण करें')}
                                </button>
                              )}

                              {(t.proof_text || t.proof_file || t.video_url) && (
                                <button
                                  onClick={() => setViewProofModal({ isOpen: true, task: t })}
                                  style={{
                                    background: '#FFF',
                                    border: '1px solid #CBD5E1',
                                    color: '#334155',
                                    padding: '8px 16px',
                                    borderRadius: '30px',
                                    fontWeight: 700,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}
                                >
                                  👁️ {lang === 'en' ? 'View Submitted Proof' : 'प्रमाण देखें'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WALLET TAB */}
          {activeDashTab === 'wallet' && (
            <div className="fade-in">
              <div style={{
                background: 'linear-gradient(135deg, #0B2B4A 0%, #1A4B6D 100%)',
                borderRadius: '24px',
                padding: '32px 36px',
                color: '#FFF',
                marginBottom: '28px',
                boxShadow: '0 15px 35px rgba(11, 43, 74, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wallet size={18} color="#38BDF8" /> {lang === 'en' ? 'My Wallet Balance' : 'मेरा वॉलेट बैलेंस'}
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#38BDF8', marginTop: '6px' }}>
                    {walletData.balance ?? 0} <span style={{ fontSize: '1.3rem', color: '#FFF' }}>pts</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', marginTop: '6px' }}>
                    {lang === 'en' ? 'Task reward points credited automatically upon Admin approval.' : 'एडमिन अनुमोदन पर कार्य पुरस्कार पॉइंट स्वचालित रूप से जमा किए जाते हैं।'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(255,255,255,0.12)', padding: '16px 24px', borderRadius: '20px', backdropFilter: 'blur(8px)', minWidth: '140px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ADE80' }}>{walletData.total_credited ?? 0} pts</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', marginTop: '3px', fontWeight: 600 }}>{lang === 'en' ? 'Total Credited' : 'कुल जमा'}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.12)', padding: '16px 24px', borderRadius: '20px', backdropFilter: 'blur(8px)', minWidth: '140px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F87171' }}>{walletData.total_debited ?? 0} pts</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', marginTop: '3px', fontWeight: 600 }}>{lang === 'en' ? 'Total Debited' : 'कुल निकासी'}</div>
                  </div>
                </div>
              </div>

              {/* Transactions Statement Card */}
              <div style={{
                background: '#FFF',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 15px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                      {lang === 'en' ? 'Wallet Transaction & Reward History' : 'वॉलेट लेन-देन और पुरस्कार विवरण'}
                    </h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                      {lang === 'en' ? 'Statement of earned task reward points and transactions.' : 'अर्जित कार्य पुरस्कार पॉइंट और लेन-देन का विवरण।'}
                    </p>
                  </div>
                  <button
                    onClick={fetchWalletData}
                    style={{
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RefreshCw size={14} /> {lang === 'en' ? 'Refresh Balance' : 'ताज़ा करें'}
                  </button>
                </div>

                {(!walletData.transactions || walletData.transactions.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                    <Wallet size={48} color="#CBD5E1" style={{ marginBottom: '12px' }} />
                    <h4 style={{ fontSize: '1.1rem', color: '#334155', margin: '0 0 6px', fontWeight: 700 }}>
                      {lang === 'en' ? 'No wallet transactions yet' : 'अभी तक कोई वॉलेट लेन-देन नहीं है'}
                    </h4>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                      {lang === 'en' ? 'Complete assigned tasks to earn reward points!' : 'पुरस्कार पॉइंट कमाने के लिए सौंपे गए कार्य पूरे करें!'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {walletData.transactions.map((tx, idx) => (
                      <div key={tx.id || idx} style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '16px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        <div>
                          <h5 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0F172A' }}>
                            {tx.task_title || 'Task Reward Credit'}
                          </h5>
                          <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748B' }}>
                            {tx.remarks || '-'}
                          </p>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', display: 'inline-block' }}>
                            {new Date(tx.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{
                            background: tx.transaction_type === 'Credit' ? '#F0FDF4' : '#FEF2F2',
                            color: tx.transaction_type === 'Credit' ? '#16A34A' : '#DC2626',
                            padding: '4px 14px',
                            borderRadius: '20px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            border: `1px solid ${tx.transaction_type === 'Credit' ? '#86EFAC' : '#FCA5A5'}`
                          }}>
                            {tx.transaction_type === 'Credit' ? '➕ Credit' : '➖ Debit'}
                          </span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: tx.transaction_type === 'Credit' ? '#16A34A' : '#DC2626' }}>
                            {tx.transaction_type === 'Credit' ? '+' : '-'}${tx.points} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CREATE TASK TAB (Agency, NGO, Admin only) */}
          {activeDashTab === 'create_task' && (
            <div className="fade-in">
              <div style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                boxShadow: '0 2px 15px rgba(0,0,0,0.02)',
                maxWidth: '780px',
                margin: '0 auto'
              }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid rgba(226, 232, 240, 0.5)', paddingBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <PlusCircle color="#2563EB" size={24} /> {lang === 'en' ? 'Create New Task & Assign to Role' : 'नया कार्य बनाएं और भूमिका को सौंपें'}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                    {lang === 'en' ? 'Create tasks and assign them to specific roles (User, Member, Agency, NGO). Users in that role can start work & submit proof!' : 'कार्य बनाएं और विशिष्ट भूमिकाओं (User, Member, Agency, NGO) को असाइन करें।'}
                  </p>
                </div>

                <form onSubmit={handleCreateTask} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>
                      {lang === 'en' ? 'Task Title *' : 'कार्य का शीर्षक *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'en' ? 'e.g. Swarna Bharat Awareness Drive / Swachhata Abhiyan' : 'जैसे: स्वर्ण भारत जागरूकता अभियान / स्वच्छता अभियान'}
                      value={newTaskData.title}
                      onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(203, 213, 225, 0.5)',
                        fontSize: '0.92rem',
                        outline: 'none',
                        background: 'rgba(248, 250, 252, 0.8)'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>
                      {lang === 'en' ? 'Task Description & Instructions' : 'कार्य विवरण और निर्देश'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={lang === 'en' ? 'Provide clear instructions for members to complete this task...' : 'सदस्यों के लिए स्पष्ट निर्देश प्रदान करें...'}
                      value={newTaskData.description}
                      onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(203, 213, 225, 0.5)',
                        fontSize: '0.92rem',
                        outline: 'none',
                        background: 'rgba(248, 250, 252, 0.8)',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>
                      🎁 {lang === 'en' ? 'Reward Points *' : 'इनाम अंक (Points) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={10000}
                      value={newTaskData.points}
                      onChange={(e) => setNewTaskData({ ...newTaskData, points: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(203, 213, 225, 0.5)',
                        fontSize: '0.92rem',
                        outline: 'none',
                        background: 'rgba(248, 250, 252, 0.8)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>
                      🎯 {lang === 'en' ? 'Priority Level *' : 'प्राथमिकता स्तर *'}
                    </label>
                    <select
                      value={newTaskData.priority}
                      onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(203, 213, 225, 0.5)',
                        fontSize: '0.92rem',
                        outline: 'none',
                        background: 'rgba(248, 250, 252, 0.8)'
                      }}
                    >
                      <option value="Low">🟢 Low Priority</option>
                      <option value="Medium">🟡 Medium Priority</option>
                      <option value="High">🟠 High Priority</option>
                      <option value="Urgent">🔴 Urgent Priority</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>
                      📅 {lang === 'en' ? 'Start Date *' : 'प्रारंभ तिथि *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={newTaskData.start_date}
                      onChange={(e) => setNewTaskData({ ...newTaskData, start_date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(203, 213, 225, 0.5)',
                        fontSize: '0.92rem',
                        outline: 'none',
                        background: 'rgba(248, 250, 252, 0.8)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>
                      📅 {lang === 'en' ? 'Due Date *' : 'अंतिम तिथि *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={newTaskData.due_date}
                      onChange={(e) => setNewTaskData({ ...newTaskData, due_date: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(203, 213, 225, 0.5)',
                        fontSize: '0.92rem',
                        outline: 'none',
                        background: 'rgba(248, 250, 252, 0.8)'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>
                      👥 {lang === 'en' ? 'Assign To Target Role *' : 'किस भूमिका को असाइन करें (Target Role) *'}
                    </label>
                    <select
                      value={newTaskData.target_role}
                      onChange={(e) => setNewTaskData({ ...newTaskData, target_role: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #2563EB',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        outline: 'none',
                        background: '#EFF6FF',
                        color: '#1D4ED8'
                      }}
                    >
                      <option value="User">👤 All Citizen Users (User Role)</option>
                      <option value="Member">🎖️ Members (Member Role)</option>
                      <option value="Agency">🏢 Agencies (Agency Role)</option>
                      <option value="NGO">🤝 NGOs (NGO Role)</option>
                      <option value="Agent">⭐ Agents (Agent Role)</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button
                      type="submit"
                      disabled={creatingTask}
                      style={{
                        background: creatingTask ? '#CBD5E1' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                        color: '#FFF',
                        border: 'none',
                        padding: '12px 32px',
                        borderRadius: '30px',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        cursor: creatingTask ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(37,99,235,0.3)'
                      }}
                    >
                      <PlusCircle size={18} />
                      {creatingTask ? (lang === 'en' ? 'Publishing Task...' : 'प्रकाशन हो रहा है...') : (lang === 'en' ? 'Publish & Assign Task' : 'कार्य प्रकाशित और असाइन करें')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* NETWORK */}
          {activeDashTab === 'network' && (
            <div className="fade-in">
              {selectedMember ? (
                <div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(226, 232, 240, 0.5)',
                      padding: '10px 24px',
                      borderRadius: '30px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: '#0F172A',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ← {lang === 'en' ? 'Back to Network' : 'वापस नेटवर्क पर जाएं'}
                  </button>
                  <ProfilePage partner={selectedMember} setActiveTab={setActiveTab} />
                </div>
              ) : (
                <div style={{
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid rgba(226, 232, 240, 0.5)',
                  boxShadow: '0 2px 15px rgba(0,0,0,0.02)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                        {lang === 'en' ? 'My Connected Network' : 'मेरा जुड़ा नेटवर्क'}
                      </h4>
                      <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                        {lang === 'en' ? `${downlineUsers.length} members connected` : `${downlineUsers.length} सदस्य जुड़े हैं`}
                      </p>
                    </div>
                    <div style={{
                      background: '#EFF6FF',
                      padding: '6px 18px',
                      borderRadius: '30px',
                      border: '1px solid #DBEAFE'
                    }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563EB' }}>
                        {lang === 'en' ? 'Total:' : 'कुल:'} {downlineUsers.length}
                      </span>
                    </div>
                  </div>

                  {/* Search */}
                  <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <Search size={18} color="#94A3B8" style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }} />
                    <input
                      type="text"
                      placeholder={lang === 'en' ? 'Search by name, email, phone...' : 'नाम, ईमेल, फोन से खोजें...'}
                      value={networkSearch}
                      onChange={(e) => setNetworkSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px 12px 44px',
                        borderRadius: '14px',
                        border: '1px solid rgba(226, 232, 240, 0.5)',
                        fontSize: '0.9rem',
                        background: 'rgba(248, 250, 252, 0.8)',
                        color: '#1E293B',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </div>

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
                        <div style={{
                          textAlign: 'center',
                          padding: '60px 20px',
                          background: 'rgba(248, 250, 252, 0.8)',
                          borderRadius: '16px',
                          border: '1px dashed rgba(203, 213, 225, 0.5)'
                        }}>
                          <Users size={48} color="#CBD5E1" style={{ marginBottom: '12px' }} />
                          <h4 style={{ fontSize: '1.1rem', color: '#334155', margin: '0 0 6px', fontWeight: 700 }}>
                            {safeNetwork.length === 0 
                              ? (lang === 'en' ? 'No members connected yet' : 'अभी तक कोई सदस्य नहीं जुड़ा है') 
                              : (lang === 'en' ? 'No matching members found' : 'कोई मेल खाता सदस्य नहीं मिला')}
                          </h4>
                          <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 20px' }}>
                            {lang === 'en'
                              ? 'Share your referral link to invite people to join your network.'
                              : 'अपने नेटवर्क में लोगों को आमंत्रित करने के लिए अपना रेफरल लिंक साझा करें।'}
                          </p>
                          <button
                            onClick={handleCopyRef}
                            style={{
                              background: copiedRef ? '#16A34A' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                              color: '#FFF',
                              border: 'none',
                              padding: '10px 28px',
                              borderRadius: '30px',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                            }}
                          >
                            {copiedRef ? <Check size={16} /> : <Copy size={16} />}
                            {copiedRef ? (lang === 'en' ? 'Copied!' : 'कॉपी हो गया!') : (lang === 'en' ? 'Copy Referral Link' : 'रेफरल लिंक कॉपी करें')}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                          <thead>
                            <tr style={{
                              background: 'rgba(248, 250, 252, 0.8)',
                              borderBottom: '2px solid rgba(226, 232, 240, 0.5)',
                              color: '#64748B',
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              <th style={{ padding: '14px 18px' }}>{lang === 'en' ? 'Member' : 'सदस्य'}</th>
                              <th style={{ padding: '14px 18px' }}>{lang === 'en' ? 'Phone' : 'फोन'}</th>
                              <th style={{ padding: '14px 18px' }}>{lang === 'en' ? 'Email' : 'ईमेल'}</th>
                              <th style={{ padding: '14px 18px', textAlign: 'right' }}>{lang === 'en' ? 'Action' : 'कार्य'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredNetwork.map((m, idx) => {
                              if (!m) return null;
                              const initials = (m.name || 'User').substring(0, 2).toUpperCase();
                              const profileImg = m.profile_image ? getMediaUrl(m.profile_image) : null;

                              return (
                                <tr 
                                  key={m.id || idx} 
                                  style={{
                                    borderBottom: '1px solid rgba(241, 245, 249, 0.8)',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                  }}
                                  onClick={() => setSelectedMember(m)}
                                >
                                  <td style={{ padding: '14px 18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <div style={{
                                        width: '42px',
                                        height: '42px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                                        color: '#FFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '0.85rem',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                      }}>
                                        {profileImg ? (
                                          <img src={profileImg} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                          <span>{initials}</span>
                                        )}
                                      </div>
                                      <div>
                                        <strong style={{ fontSize: '0.9rem', color: '#0F172A', display: 'block' }}>
                                          {m.name || 'N/A'}
                                        </strong>
                                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                                          {m.role_name || 'Member'}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td style={{ padding: '14px 18px', fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>
                                    {m.phone || <span style={{ color: '#94A3B8' }}>N/A</span>}
                                  </td>
                                  <td style={{ padding: '14px 18px', fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>
                                    {m.email || <span style={{ color: '#94A3B8' }}>N/A</span>}
                                  </td>
                                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setSelectedMember(m); }}
                                      style={{
                                        background: '#EFF6FF',
                                        border: '1px solid #DBEAFE',
                                        color: '#2563EB',
                                        padding: '6px 16px',
                                        borderRadius: '30px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <Eye size={14} /> {lang === 'en' ? 'View' : 'देखें'}
                                    </button>
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
              )}
            </div>
          )}

          {/* MEDIA */}
          {activeDashTab === 'media' && (
            <div className="fade-in">
              {/* Upload */}
              <div style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                boxShadow: '0 2px 15px rgba(0,0,0,0.02)',
                marginBottom: '28px'
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <PlusCircle size={22} color="#1D4ED8" />
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                      {lang === 'en' ? 'Upload to Gallery' : 'गैलरी में अपलोड करें'}
                    </h4>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                    {lang === 'en' ? 'Share photos and videos to your public profile' : 'अपनी सार्वजनिक प्रोफ़ाइल पर फ़ोटो और वीडियो साझा करें'}
                  </p>
                </div>

                <form onSubmit={handleGalleryUpload} style={{ display: 'grid', gap: '16px' }}>
                  <input
                    type="text"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    placeholder={lang === 'en' ? 'Caption (optional)' : 'शीर्षक (वैकल्पिक)'}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(226, 232, 240, 0.5)',
                      background: 'rgba(255,255,255,0.8)',
                      color: '#1E293B',
                      outline: 'none',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setMediaFile(e.target.files[0])}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '2px dashed rgba(203, 213, 225, 0.5)',
                      background: 'rgba(248, 250, 252, 0.8)',
                      color: '#64748B',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={uploadingMedia || !mediaFile}
                    style={{
                      background: uploadingMedia || !mediaFile ? '#CBD5E1' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      color: '#FFF',
                      border: 'none',
                      padding: '12px 28px',
                      borderRadius: '12px',
                      cursor: uploadingMedia || !mediaFile ? 'not-allowed' : 'pointer',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: uploadingMedia || !mediaFile ? 'none' : '0 4px 15px rgba(37, 99, 235, 0.3)',
                      width: 'fit-content'
                    }}
                  >
                    <PlusCircle size={18} />
                    {uploadingMedia ? (lang === 'en' ? 'Uploading...' : 'अपलोड हो रहा...') : (lang === 'en' ? 'Post to Gallery' : 'गैलरी में पोस्ट करें')}
                  </button>
                </form>
              </div>

              {/* Gallery */}
              <div style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                boxShadow: '0 2px 15px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                      {lang === 'en' ? 'My Gallery' : 'मेरी गैलरी'} ({filteredMedia.length})
                    </h4>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', background: 'rgba(241, 245, 249, 0.8)', padding: '4px', borderRadius: '12px' }}>
                    {['all', 'image', 'video'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setMediaFilter(filter)}
                        style={{
                          padding: '6px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background: mediaFilter === filter ? '#FFF' : 'transparent',
                          color: mediaFilter === filter ? '#1D4ED8' : '#64748B',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          boxShadow: mediaFilter === filter ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {filter === 'all' && (lang === 'en' ? `All (${userMedia.length})` : `सभी (${userMedia.length})`)}
                        {filter === 'image' && (lang === 'en' ? `Photos (${photosCount})` : `फ़ोटो (${photosCount})`)}
                        {filter === 'video' && (lang === 'en' ? `Videos (${videosCount})` : `वीडियो (${videosCount})`)}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredMedia.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: 'rgba(248, 250, 252, 0.8)',
                    borderRadius: '16px',
                    border: '1px dashed rgba(203, 213, 225, 0.5)'
                  }}>
                    <Image size={44} color="#CBD5E1" style={{ marginBottom: '12px' }} />
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', color: '#94A3B8' }}>
                      {lang === 'en' ? 'No media posts yet' : 'अभी तक कोई मीडिया पोस्ट नहीं'}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#CBD5E1' }}>
                      {lang === 'en' ? 'Upload your first photo or video above' : 'ऊपर अपनी पहली फ़ोटो या वीडियो अपलोड करें'}
                    </p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    {filteredMedia.map(item => {
                      const src = item.src || '';
                      const isVideo = item.type === 'video' || src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');
                      return (
                        <div
                          key={item.id}
                          className="media-grid-item"
                          style={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid rgba(226, 232, 240, 0.5)',
                            background: 'rgba(248, 250, 252, 0.8)',
                            position: 'relative',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <div style={{ height: '160px', position: 'relative', background: '#000' }}>
                            {isVideo ? (
                              <video src={getMediaUrl(src)} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <img src={getMediaUrl(src)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                            <span style={{
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              background: isVideo ? '#3B82F6' : '#1D4ED8',
                              color: '#FFF',
                              fontSize: '0.6rem',
                              fontWeight: 800,
                              padding: '3px 10px',
                              borderRadius: '6px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              {isVideo ? 'VIDEO' : 'PHOTO'}
                            </span>
                          </div>
                          <div style={{
                            padding: '12px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div style={{ flex: 1 }}>
                              <h5 style={{
                                margin: 0,
                                fontSize: '0.85rem',
                                color: '#0F172A',
                                fontWeight: 700,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '130px'
                              }}>
                                {item.title || (lang === 'en' ? 'Untitled' : 'बिना शीर्षक')}
                              </h5>
                            </div>
                            <button
                              onClick={() => handleDeleteMedia(item.id)}
                              style={{
                                background: '#FEE2E2',
                                color: '#DC2626',
                                border: 'none',
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Trash2 size={14} />
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

          {/* PUBLIC PROFILE */}
          {activeDashTab === 'public_profile' && (
            <div className="fade-in">
              <ProfilePage partner={user} setActiveTab={setActiveTab} />
            </div>
          )}

          {/* PROFILE */}
          {activeDashTab === 'profile' && (
            <div className="fade-in">
              <div style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                border: '1px solid rgba(226, 232, 240, 0.5)',
                boxShadow: '0 2px 15px rgba(0,0,0,0.02)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                      {lang === 'en' ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें'}
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                      {lang === 'en' ? 'Update your personal information' : 'अपनी व्यक्तिगत जानकारी अपडेट करें'}
                    </p>
                  </div>
                  <button
                    onClick={handleSave}
                    style={{
                      background: 'linear-gradient(135deg, #16A34A, #15803D)',
                      color: '#FFF',
                      border: 'none',
                      padding: '10px 28px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(22,163,74,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {lang === 'en' ? 'Save Changes' : 'सहेजें'}
                  </button>
                </div>

                <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
                  {/* 1. Personal Information */}
                  <div style={{ background: 'rgba(248, 250, 252, 0.8)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.5)' }}>
                    <h5 style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={16} color="#2563EB" /> {lang === 'en' ? 'Personal Information' : 'व्यक्तिगत जानकारी'}
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                          {lang === 'en' ? 'Full Name' : 'पूरा नाम'}
                        </label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(203, 213, 225, 0.5)', background: '#FFF', color: '#1E293B', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                          {lang === 'en' ? 'Phone Number' : 'फोन नंबर'}
                        </label>
                        <input
                          type="text"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(203, 213, 225, 0.5)', background: '#FFF', color: '#1E293B', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                          {lang === 'en' ? 'Date of Birth' : 'जन्म तिथि'}
                        </label>
                        <input
                          type="date"
                          value={formData.dob || ''}
                          onChange={(e) => setFormData({...formData, dob: e.target.value})}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(203, 213, 225, 0.5)', background: '#FFF', color: '#1E293B', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Address & Location */}
                  <div style={{ background: 'rgba(248, 250, 252, 0.8)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.5)' }}>
                    <h5 style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} color="#2563EB" /> {lang === 'en' ? 'Address & Location' : 'पता और स्थान'}
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                          {lang === 'en' ? 'Full Address' : 'पूरा पता'}
                        </label>
                        <input
                          type="text"
                          value={formData.address || ''}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(203, 213, 225, 0.5)', background: '#FFF', color: '#1E293B', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                          {lang === 'en' ? 'City' : 'शहर'}
                        </label>
                        <input
                          type="text"
                          value={formData.city || ''}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(203, 213, 225, 0.5)', background: '#FFF', color: '#1E293B', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                          {lang === 'en' ? 'State' : 'राज्य'}
                        </label>
                        <input
                          type="text"
                          value={formData.state || ''}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(203, 213, 225, 0.5)', background: '#FFF', color: '#1E293B', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                          {lang === 'en' ? 'Pincode' : 'पिनकोड'}
                        </label>
                        <input
                          type="text"
                          value={formData.pincode || ''}
                          onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(203, 213, 225, 0.5)', background: '#FFF', color: '#1E293B', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Bank & Payment Details */}
                  <div style={{ background: 'rgba(248, 250, 252, 0.8)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(226, 232, 240, 0.5)' }}>
                    <h5 style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Wallet size={16} color="#2563EB" /> {lang === 'en' ? 'Bank & Payment Details' : 'बैंक एवं भुगतान विवरण'}
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                          {lang === 'en' ? 'Bank Name' : 'बैंक का नाम'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. State Bank of India"
                          value={formData.bank_name || ''}
                          onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(203, 213, 225, 0.5)', background: '#FFF', color: '#1E293B', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                          {lang === 'en' ? 'Account Number' : 'खाता संख्या'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 123456789012"
                          value={formData.account_no || ''}
                          onChange={(e) => setFormData({...formData, account_no: e.target.value})}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(203, 213, 225, 0.5)', background: '#FFF', color: '#1E293B', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                          {lang === 'en' ? 'IFSC Code' : 'IFSC कोड'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. SBIN0001234"
                          value={formData.ifsc_code || ''}
                          onChange={(e) => setFormData({...formData, ifsc_code: e.target.value})}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(203, 213, 225, 0.5)', background: '#FFF', color: '#1E293B', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                          {lang === 'en' ? 'UPI ID' : 'UPI आईडी'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. name@upi"
                          value={formData.upi_id || ''}
                          onChange={(e) => setFormData({...formData, upi_id: e.target.value})}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(203, 213, 225, 0.5)', background: '#FFF', color: '#1E293B', outline: 'none', fontSize: '0.9rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>

        {/* PROOF SUBMISSION MODAL */}
        {proofModal.isOpen && proofModal.task && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#FFF',
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                  📤 {lang === 'en' ? 'Submit Work Proof' : 'कार्य का प्रमाण जमा करें'}
                </h3>
                <button onClick={() => setProofModal({ isOpen: false, task: null })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <X size={20} />
                </button>
              </div>

              <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '18px' }}>
                <strong>Task: {proofModal.task.task_title || proofModal.task.title}</strong>
              </p>

              <form onSubmit={handleSubmitProof} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                    {lang === 'en' ? 'Work Summary / Notes *' : 'कार्य विवरण / नोट्स *'}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={lang === 'en' ? 'Describe the work done for this task (optional if file or video link is provided)...' : 'इस कार्य के लिए किए गए कार्य का विवरण लिखें...'}
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                    🖼️ {lang === 'en' ? 'Upload Proof Image / Document (PDF) / Video' : 'प्रमाण फ़ोटो / दस्तावेज़ (PDF) / वीडियो अपलोड करें'}
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf,video/*"
                    onChange={(e) => setProofFile(e.target.files[0] || null)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '12px',
                      border: '2px dashed #CBD5E1',
                      background: '#F8FAFC',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                    🔗 {lang === 'en' ? 'Video / Media URL (Optional)' : 'वीडियो / मीडिया लिंक (वैकल्पिक)'}
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={proofVideoUrl}
                    onChange={(e) => setProofVideoUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setProofModal({ isOpen: false, task: null })}
                    style={{ background: '#F1F5F9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '30px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    {lang === 'en' ? 'Cancel' : 'रद्द करें'}
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProof}
                    style={{
                      background: submittingProof ? '#CBD5E1' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      color: '#FFF',
                      border: 'none',
                      padding: '10px 24px',
                      borderRadius: '30px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: submittingProof ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    {submittingProof ? (lang === 'en' ? 'Uploading...' : 'अपलोड हो रहा...') : (lang === 'en' ? 'Submit Proof' : 'प्रमाण जमा करें')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW PROOF MODAL */}
        {viewProofModal.isOpen && viewProofModal.task && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#FFF',
              borderRadius: '24px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                  👁️ {lang === 'en' ? 'Submitted Work Proof' : 'जमा किया गया कार्य प्रमाण'}
                </h3>
                <button onClick={() => setViewProofModal({ isOpen: false, task: null })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <p style={{ margin: 0, color: '#64748B' }}>
                  <strong>Task:</strong> {viewProofModal.task.task_title || viewProofModal.task.title}
                </p>

                {viewProofModal.task.proof_text && (
                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>📝 Work Notes:</strong>
                    <span style={{ color: '#475569', whiteSpace: 'pre-wrap' }}>{viewProofModal.task.proof_text}</span>
                  </div>
                )}

                {viewProofModal.task.proof_file && (
                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ color: '#0F172A', display: 'block', marginBottom: '8px' }}>🖼️ Proof File:</strong>
                    <a href={getMediaUrl(viewProofModal.task.proof_file)} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <ExternalLink size={16} /> Open Uploaded Proof File
                    </a>
                    {viewProofModal.task.proof_file.match(/\.(jpg|jpeg|png|webp|gif)$/i) && (
                      <img src={getMediaUrl(viewProofModal.task.proof_file)} alt="Proof preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />
                    )}
                  </div>
                )}

                {viewProofModal.task.video_url && (
                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>🔗 Video Link:</strong>
                    <a href={viewProofModal.task.video_url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', fontWeight: 700 }}>
                      {viewProofModal.task.video_url}
                    </a>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={() => setViewProofModal({ isOpen: false, task: null })}
                  style={{ background: '#2563EB', color: '#FFF', border: 'none', padding: '10px 24px', borderRadius: '30px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {lang === 'en' ? 'Close' : 'बंद करें'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}  