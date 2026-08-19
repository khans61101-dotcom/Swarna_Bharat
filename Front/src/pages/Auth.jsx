import React, { useState, useRef, memo } from 'react';
import { 
  User, Lock, Mail, Phone, LogIn, UserPlus, CheckCircle, 
  Building, Users, Shield, ArrowLeft, ArrowRight, Sparkles, 
  Crown, Star, Award, Globe, Briefcase, Heart,
  FileText, CheckSquare, Clock, ShieldCheck, BarChart3,
  TrendingUp, Zap, Target, Layers, Monitor, Key, Fingerprint,
  Smartphone, Bell, Gift, Ticket, Calendar, MapPin
} from 'lucide-react';
import { useLang } from '../LanguageContext';
import { API_URL } from '../config';

// 👇 बाकी इनपुट्स को री-रेंडर से बचाने के लिए (Typing और Photo Upload के लिए)
const UncontrolledInput = memo(({ defaultValue, onInput, placeholder, type = "text", required, style, onFocus, onBlur }) => {
  return (
    <input 
      type={type}
      required={required}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onInput={onInput}
      style={style}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
});

export default function AuthPage({ initialMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // 👇 Role के लिए State (ताकि Button click पर UI तुरंत बदले)
  const [role, setRole] = useState('User');

  // 👇 बाकी डेटा के लिए useRef (ताकि Photo Upload पर डेटा न मिटे)
  const formRef = useRef({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referral_code: '',
    profile_image: '',
    otp: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // OTP Verification States
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [devOtpNote, setDevOtpNote] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Forgot Password States
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotDevOtp, setForgotDevOtp] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const { lang, t } = useLang();
  const a = t.authPage;

  const handleForgotSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!forgotEmail) {
      alert(lang === 'en' ? 'Please enter your registered email' : 'कृपया अपना पंजीकृत ईमेल दर्ज करें');
      return;
    }
    setIsForgotLoading(true);
    setForgotDevOtp('');
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.otpLogged) setForgotDevOtp(`Dev OTP Code: ${data.otpLogged}`);
        setForgotStep(2);
      } else {
        alert(data.error || (lang === 'en' ? 'User account not found with this email' : 'इस ईमेल के साथ कोई खाता नहीं मिला'));
      }
    } catch (err) {
      alert(lang === 'en' ? 'Network error sending OTP' : 'ओटीपी भेजने में नेटवर्क त्रुटि');
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleForgotResetPassword = async (e) => {
    if (e) e.preventDefault();
    if (!forgotOtp || !newPassword || !confirmNewPassword) {
      alert(lang === 'en' ? 'Please fill all required fields' : 'कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert(lang === 'en' ? 'Passwords do not match' : 'पासवर्ड मेल नहीं खाते');
      return;
    }
    if (newPassword.length < 6) {
      alert(lang === 'en' ? 'Password must be at least 6 characters long' : 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए');
      return;
    }
    setIsForgotLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert(lang === 'en' ? 'Password reset successfully! You can now login with your new password.' : 'पासवर्ड सफलतापूर्वक रीसेट हो गया! अब आप अपने नए पासवर्ड से लॉगिन कर सकते हैं।');
        setMode('login');
        setForgotStep(1);
        setForgotEmail('');
        setForgotOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        alert(data.error || (lang === 'en' ? 'Failed to reset password' : 'पासवर्ड रीसेट करने में विफल'));
      }
    } catch (err) {
      alert(lang === 'en' ? 'Network error resetting password' : 'पासवर्ड रीसेट करने में नेटवर्क त्रुटि');
    } finally {
      setIsForgotLoading(false);
    }
  };

  React.useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async () => {
    const userEmail = formRef.current.email;
    if (!userEmail) return false;
    setIsSendingOtp(true);
    setOtpMessage('');
    try {
      const res = await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpMessage(data.message || (lang === 'en' ? 'OTP sent successfully' : 'ओटीपी सफलतापूर्वक भेजा गया'));
        if (data.otpLogged) {
          setDevOtpNote(`Dev OTP Code: ${data.otpLogged}`);
        } else {
          setDevOtpNote('');
        }
        setResendTimer(30);
        return true;
      } else {
        alert(data.error || (lang === 'en' ? 'Failed to send OTP' : 'ओटीपी भेजने में विफल'));
        return false;
      }
    } catch (err) {
      alert(lang === 'en' ? 'Network error sending OTP' : 'ओटीपी भेजने में नेटवर्क त्रुटि');
      return false;
    } finally {
      setIsSendingOtp(false);
    }
  };

  const roleOptions = [
    { 
      value: 'User', 
      label: 'User', 
      icon: <User size={20} />, 
      color: '#3B82F6', 
      bg: '#EFF6FF',
      borderColor: '#93C5FD',
      desc: 'General Citizen',
      fullDesc: 'Access citizen services, apply for schemes, track applications, and receive government updates.',
      features: ['Apply for schemes', 'Track applications', 'Get notifications', 'Access services']
    },
    { 
      value: 'Member', 
      label: 'Member', 
      icon: <Users size={20} />, 
      color: '#8B5CF6', 
      bg: '#F5F3FF',
      borderColor: '#C4B5FD',
      desc: 'Community Member',
      fullDesc: 'Active community participant with additional privileges for group activities and local initiatives.',
      features: ['Community projects', 'Local events', 'Group discussions', 'Resource sharing']
    },
    { 
      value: 'NGO', 
      label: 'NGO', 
      icon: <Heart size={20} />, 
      color: '#EC4899', 
      bg: '#FDF2F8',
      borderColor: '#F9A8D4',
      desc: 'Non-Profit Organization',
      fullDesc: 'Register your NGO to manage projects, receive funding, collaborate with government, and track social impact.',
      features: ['Project management', 'Funding opportunities', 'Impact tracking', 'Government collaboration']
    },
    { 
      value: 'Agency', 
      label: 'Agency', 
      icon: <Building size={20} />, 
      color: '#F59E0B', 
      bg: '#FFFBEB',
      borderColor: '#FCD34D',
      desc: 'Government Agency',
      fullDesc: 'Official government agency account with administrative access, policy management, and service delivery oversight.',
      features: ['Policy management', 'Service delivery', 'Data analytics', 'Administrative access']
    }
  ];

  const loginFeatures = [
    { icon: <ShieldCheck size={16} />, text: 'Secure & Encrypted' },
    { icon: <Clock size={16} />, text: '24/7 Access' },
    { icon: <Bell size={16} />, text: 'Real-time Updates' },
    { icon: <Smartphone size={16} />, text: 'Mobile Friendly' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'register' && !formRef.current.otp) {
      alert(lang === 'en' ? 'Please enter the OTP sent to your email' : 'कृपया अपने ईमेल पर भेजा गया ओटीपी दर्ज करें');
      return;
    }
    try {
      const endpoint = mode === 'login' ? 'login' : 'register';
      
      let finalFormData = { 
        ...formRef.current, 
        role: role 
      };
      console.log("Selected Role:", role);
      console.log("Final Form Data:", finalFormData);      

      if (mode === 'register' && imageFile) {
        setIsUploading(true);
        const imgData = new FormData();
        imgData.append('image', imageFile);
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: imgData
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.url) {
          finalFormData.profile_image = uploadData.url;
        }
        setIsUploading(false);
      }

      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData)
      });
      const data = await response.json();
      if (response.ok) {
        setIsSuccess(true);
        if (mode === 'login' && data.accessToken) {
          localStorage.setItem('userToken', data.accessToken);
        }
        if (onAuthSuccess) {
          setTimeout(() => {
            onAuthSuccess(data.name || formRef.current.name || 'User');
          }, 1500);
        }
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      alert('Network error connecting to the server.');
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const nextStep = async () => {
    if (currentStep === 1 && !formRef.current.name) {
      alert(lang === 'en' ? 'Please enter your full name' : 'कृपया अपना पूरा नाम दर्ज करें');
      return;
    }
    if (currentStep === 2 && (!formRef.current.email || !formRef.current.phone)) {
      alert(lang === 'en' ? 'Please fill all contact details' : 'कृपया सभी संपर्क विवरण भरें');
      return;
    }
    if (currentStep === 3 && (!formRef.current.password || !formRef.current.confirmPassword)) {
      alert(lang === 'en' ? 'Please set your password' : 'कृपया अपना पासवर्ड सेट करें');
      return;
    }
    if (currentStep === 3 && formRef.current.password !== formRef.current.confirmPassword) {
      alert(lang === 'en' ? 'Passwords do not match' : 'पासवर्ड मेल नहीं खाते');
      return;
    }

    if (currentStep === 3) {
      const sent = await handleSendOtp();
      if (!sent) return;
    }

    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: lang === 'en' ? 'Personal' : 'व्यक्तिगत', icon: <User size={14} /> },
      { number: 2, label: lang === 'en' ? 'Contact' : 'संपर्क', icon: <Mail size={14} /> },
      { number: 3, label: lang === 'en' ? 'Security' : 'सुरक्षा', icon: <Lock size={14} /> },
      { number: 4, label: lang === 'en' ? 'Verify OTP' : 'ओटीपी सत्यापन', icon: <ShieldCheck size={14} /> }
    ];

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', position: 'relative', padding: '0 10px' }}>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '15%', 
          right: '15%', 
          height: '3px', 
          background: 'linear-gradient(to right, #E2E8F0, #E2E8F0)',
          transform: 'translateY(-50%)',
          zIndex: 0,
          borderRadius: '2px'
        }} />
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '15%', 
          height: '3px', 
          background: 'linear-gradient(to right, #2563EB, #1D4ED8)',
          transform: 'translateY(-50%)',
          zIndex: 0,
          width: `${((currentStep - 1) / (steps.length - 1)) * 70}%`,
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '2px'
        }} />
        {steps.map((step, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            zIndex: 1,
            position: 'relative'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: currentStep >= step.number 
                ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' 
                : '#F1F5F9',
              color: currentStep >= step.number ? '#FFF' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              border: `3px solid ${currentStep >= step.number ? '#2563EB' : '#E2E8F0'}`,
              boxShadow: currentStep >= step.number 
                ? '0 4px 15px rgba(37, 99, 235, 0.3)' 
                : 'none',
              transform: currentStep === step.number ? 'scale(1.1)' : 'scale(1)'
            }}>
              {currentStep > step.number ? <CheckCircle size={20} /> : step.icon}
            </div>
            <span style={{ 
              marginTop: '8px', 
              fontSize: '0.7rem', 
              color: currentStep >= step.number ? '#2563EB' : '#94A3B8',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'color 0.3s ease'
            }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    const inputStyle = {
      width: '100%',
      padding: '12px 16px 12px 44px',
      borderRadius: '10px',
      border: '2px solid #E2E8F0',
      outline: 'none',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      background: '#FAFBFC',
      color: '#1A2238',
      caretColor: '#2563EB'
    }; 

    switch(currentStep) {
      case 1:
        return (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#1E293B' }}>
                {a.fullName} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                  <User size={18} />
                </div>
                <UncontrolledInput 
                  type="text"
                  required
                  placeholder={lang === 'en' ? 'Enter your full name' : 'अपना पूरा नाम दर्ज करें'}
                  defaultValue={formRef.current.name}
                  onInput={(e) => formRef.current.name = e.target.value}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '12px', color: '#1E293B' }}>
                {lang === 'en' ? 'Select Account Role' : 'खाता भूमिका चुनें'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {roleOptions.map((roleItem) => {
                  // 👇 अब State से तुलना करें
                  const isSelected = role === roleItem.value;
                  return (
                    <button
                      key={roleItem.value}
                      type="button"
                      onClick={() => setRole(roleItem.value)} // 👇 State अपडेट करें
                      style={{
                        padding: '14px 10px',
                        border: `2px solid ${isSelected ? roleItem.color : '#E2E8F0'}`,
                        borderRadius: '12px',
                        background: isSelected ? roleItem.bg : '#FFF',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: isSelected ? roleItem.color : '#64748B',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                        position: 'relative'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        marginBottom: '2px'
                      }}>
                        {roleItem.icon}
                        <span>{roleItem.label}</span>
                      </div>
                      <span style={{ 
                        fontSize: '0.6rem', 
                        opacity: 0.7,
                        fontWeight: 400
                      }}>
                        {roleItem.desc}
                      </span>
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          background: roleItem.color,
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFF'
                        }}>
                          <CheckCircle size={12} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Image / Logo Upload */}
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#1E293B' }}>
                {lang === 'en' ? 'Profile Image / Logo (Optional)' : 'प्रोफ़ाइल छवि / लोगो (वैकल्पिक)'}
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0] || null)}
                  style={{
                    ...inputStyle,
                    padding: '8px 12px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {imageFile && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px 14px',
                  background: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <img 
                      src={URL.createObjectURL(imageFile)} 
                      alt="Selected preview" 
                      style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #86EFAC', flexShrink: 0 }} 
                    />
                    <div style={{ overflow: 'hidden' }}>
                      <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#166534', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        ✓ {imageFile.name}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#15803D' }}>
                        {(imageFile.size / 1024).toFixed(1)} KB • {lang === 'en' ? 'Selected & Ready to upload' : 'चयनित और अपलोड के लिए तैयार'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    title={lang === 'en' ? 'Remove image' : 'छवि हटाएं'}
                    style={{
                      background: '#DC2626',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {(role === 'User' || role === 'Member') && (
              <div style={{ marginTop: '20px', animation: 'fadeIn 0.3s ease' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#1E293B' }}>
                  {lang === 'en' ? 'Referral Code (Optional)' : 'रेफरल कोड (वैकल्पिक)'}
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                    <Gift size={18} />
                  </div>
                  <UncontrolledInput 
                    type="text"
                    placeholder={lang === 'en' ? 'Enter referral code' : 'रेफरल कोड दर्ज करें'}
                    defaultValue={formRef.current.referral_code}
                    onInput={(e) => formRef.current.referral_code = e.target.value.toUpperCase()}
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                    onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                  />
                </div>
                <p style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '6px' }}>
                  {lang === 'en' ? 'Enter a valid code to join under an existing member.' : 'किसी मौजूदा सदस्य के नीचे जुड़ने के लिए एक वैध कोड दर्ज करें।'}
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#1E293B' }}>
                {a.email} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                  <Mail size={18} />
                </div>
                <UncontrolledInput 
                  type="email"
                  required
                  placeholder="name@domain.com"
                  defaultValue={formRef.current.email}
                  onInput={(e) => formRef.current.email = e.target.value}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#1E293B' }}>
                {a.phone} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                  <Phone size={18} />
                </div>
                <UncontrolledInput 
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  defaultValue={formRef.current.phone}
                  onInput={(e) => formRef.current.phone = e.target.value}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#1E293B' }}>
                {a.password} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                  <Lock size={18} />
                </div>
                <UncontrolledInput 
                  type="password"
                  required
                  placeholder="Create strong password"
                  defaultValue={formRef.current.password}
                  onInput={(e) => formRef.current.password = e.target.value}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#1E293B' }}>
                {a.confirmPassword} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                  <Lock size={18} />
                </div>
                <UncontrolledInput 
                  type="password"
                  required
                  placeholder="Confirm your password"
                  defaultValue={formRef.current.confirmPassword}
                  onInput={(e) => formRef.current.confirmPassword = e.target.value}
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '54px',
                height: '54px',
                margin: '0 auto 10px',
                background: '#eff6ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
                border: '2px solid #bfdbfe'
              }}>
                <ShieldCheck size={28} />
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                {lang === 'en' ? 'Enter Email OTP Code' : 'ईमेल ओटीपी कोड दर्ज करें'}
              </h4>

              <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '0 0 6px 0' }}>
                {lang === 'en' ? 'An OTP has been sent to your email address:' : 'आपके ईमेल पते पर एक ओटीपी भेजा गया है:'}
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#F1F5F9',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0F172A'
              }}>
                <Mail size={14} color="#2563EB" />
                <span>{formRef.current.email}</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'underline', marginLeft: '4px' }}
                >
                  {lang === 'en' ? 'Edit' : 'बदलें'}
                </button>
              </div>
            </div>

            {devOtpNote && (
              <div style={{
                background: '#EFF6FF',
                border: '1.5px dashed #93C5FD',
                borderRadius: '10px',
                padding: '8px 12px',
                marginBottom: '16px',
                textAlign: 'center',
                fontSize: '0.82rem',
                color: '#1E40AF',
                fontWeight: 700
              }}>
                ℹ️ {devOtpNote}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#1E293B', textAlign: 'center' }}>
                {lang === 'en' ? '6-Digit Verification Code' : '6-अंकीय सत्यापन कोड'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative', maxWidth: '280px', margin: '0 auto' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                  <Key size={18} />
                </div>
                <UncontrolledInput 
                  type="text"
                  required
                  placeholder="123456"
                  defaultValue={formRef.current.otp}
                  onInput={(e) => formRef.current.otp = e.target.value.trim()}
                  style={{
                    ...inputStyle,
                    padding: '10px 16px 10px 44px',
                    fontSize: '1.15rem',
                    fontWeight: '800',
                    letterSpacing: '4px',
                    textAlign: 'center'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              {resendTimer > 0 ? (
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  {lang === 'en' ? `Resend OTP in ${resendTimer}s` : `${resendTimer} सेकंड में ओटीपी पुनः भेजें`}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={isSendingOtp}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563EB',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {isSendingOtp ? (lang === 'en' ? 'Sending OTP...' : 'ओटीपी भेजा जा रहा है...') : (lang === 'en' ? 'Didn’t receive OTP? Resend' : 'ओटीपी प्राप्त नहीं हुआ? पुनः भेजें')}
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Login Info Component for Left Side
  const LoginInfo = () => (
    <div style={{
      padding: '40px 30px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            padding: '10px',
            borderRadius: '12px',
            color: '#FFF'
          }}>
            <Crown size={28} />
          </div>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Swarna Bharat Portal
          </h2>
        </div>
        <p style={{
          color: '#64748B',
          fontSize: '1rem',
          lineHeight: '1.6',
          margin: '4px 0 0 0'
        }}>
          {lang === 'en' 
            ? 'Welcome back! Login to access all government services' 
            : 'वापस स्वागत है! सभी सरकारी सेवाओं तक पहुंचने के लिए लॉगिन करें'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="responsive-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2563EB' }}>50+</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
            {lang === 'en' ? 'Active Services' : 'सक्रिय सेवाएं'}
          </div>
        </div>
        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8B5CF6' }}>10M+</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
            {lang === 'en' ? 'Citizens Served' : 'नागरिक सेवित'}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid #bfdbfe'
      }}>
        <h4 style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#1A2238',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Key size={18} color="#2563EB" />
          {lang === 'en' ? 'Why Login?' : 'क्यों लॉगिन करें?'}
        </h4>
        <div style={{ display: 'grid', gap: '10px' }}>
          {loginFeatures.map((feature, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '8px'
            }}>
              <div style={{ color: '#2563EB' }}>{feature.icon}</div>
              <span style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: 500 }}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleRegister}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          border: '2px solid #E2E8F0',
          background: '#FFF',
          color: '#1A2238',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontWeight: 600,
          fontSize: '0.95rem',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#2563EB';
          e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.15)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = '#E2E8F0';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        <svg width="22" height="22" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        <span>{lang === 'en' ? 'Continue with Google' : 'Google के साथ जारी रखें'}</span>
      </button>

      <p style={{
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#94A3B8',
        marginTop: '12px'
      }}>
        {lang === 'en' 
          ? 'Secure login powered by government authentication' 
          : 'सरकारी प्रमाणीकरण द्वारा संचालित सुरक्षित लॉगिन'}
      </p>
    </div>
  );

  // Registration Info Component for Left Side
  const RegistrationInfo = () => (
    <div style={{
      padding: '40px 30px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            padding: '10px',
            borderRadius: '12px',
            color: '#FFF'
          }}>
            <Crown size={28} />
          </div>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Swarna Bharat Portal
          </h2>
        </div>
        <p style={{
          color: '#64748B',
          fontSize: '1rem',
          lineHeight: '1.6',
          margin: '4px 0 0 0'
        }}>
          {lang === 'en' 
            ? 'Create your account to access all government services' 
            : 'सभी सरकारी सेवाओं तक पहुंचने के लिए अपना खाता बनाएं'}
        </p>
      </div>

      {/* Role Description */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid #bfdbfe'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px'
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${roleOptions.find(r => r.value === role)?.color || '#2563EB'}, ${roleOptions.find(r => r.value === role)?.color || '#1D4ED8'})`,
            padding: '8px',
            borderRadius: '10px',
            color: '#FFF'
          }}>
            {roleOptions.find(r => r.value === role)?.icon || <User size={18} />}
          </div>
          <div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#1A2238',
              margin: 0
            }}>
              {roleOptions.find(r => r.value === role)?.label} Account
            </h3>
            <p style={{
              fontSize: '0.85rem',
              color: '#64748B',
              margin: 0
            }}>
              {roleOptions.find(r => r.value === role)?.desc}
            </p>
          </div>
        </div>
        <p style={{
          fontSize: '0.9rem',
          color: '#475569',
          lineHeight: '1.6',
          margin: '8px 0 0 0'
        }}>
          {roleOptions.find(r => r.value === role)?.fullDesc}
        </p>
      </div>

      {/* Features Grid */}
      <div className="responsive-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '24px'
      }}>
        {roleOptions.find(r => r.value === role)?.features.map((feature, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E2E8F0'
          }}>
            <CheckCircle size={14} color="#22C55E" />
            <span style={{
              fontSize: '0.8rem',
              color: '#1E293B',
              fontWeight: 500
            }}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Google Register Button */}
      <button
        type="button"
        onClick={handleGoogleRegister}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          border: '2px solid #E2E8F0',
          background: '#FFF',
          color: '#1A2238',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontWeight: 600,
          fontSize: '0.95rem',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = '#2563EB';
          e.target.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.15)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = '#E2E8F0';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        <svg width="22" height="22" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        <span>{lang === 'en' ? 'Continue with Google' : 'Google के साथ जारी रखें'}</span>
      </button>

      <p style={{
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#94A3B8',
        marginTop: '12px'
      }}>
        {lang === 'en' 
          ? 'By continuing, you agree to our Terms & Privacy Policy' 
          : 'जारी रखने से, आप हमारी शर्तों और गोपनीयता नीति से सहमत हैं'}
      </p>
    </div>
  );

  // Form Component for Right Side
  const FormSection = () => (
    <div style={{
      padding: '35px 30px 30px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {isSuccess ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '30px 10px',
          animation: 'fadeIn 0.6s ease',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
            animation: 'scaleIn 0.6s ease'
          }}>
            <CheckCircle size={40} color="#FFF" />
          </div>
          <h3 style={{ 
            color: '#1A2238', 
            fontSize: '1.6rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            {mode === 'login' ? (lang === 'en' ? 'Welcome Back!' : 'वापस स्वागत है!') : (lang === 'en' ? 'Registration Successful!' : 'पंजीकरण सफल!')}
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '8px', lineHeight: '1.6' }}>
            {mode === 'login'
              ? (lang === 'en' ? 'You have successfully logged into Swarna Bharat Portal.' : 'आप Swarna Bharat पोर्टल में सफलतापूर्वक लॉग इन हो गए हैं।')
              : (lang === 'en' ? `Your ${role} account has been created successfully.` : `आपका ${role} खाता सफलतापूर्वक बना लिया गया है।`)}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {mode === 'forgot-password' ? (
            /* Forgot Password 2-Step Flow */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: 'auto 0',
              padding: '20px 0',
              animation: 'fadeIn 0.4s ease'
            }}>
              {forgotStep === 1 ? (
                /* Step 1: Email Input Page */
                <div>
                  <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#eff6ff',
                      padding: '8px 20px',
                      borderRadius: '30px',
                      border: '1px solid #bfdbfe',
                      marginBottom: '12px'
                    }}>
                      <Key size={20} color="#2563EB" />
                      <span style={{ color: '#2563EB', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        {lang === 'en' ? 'Forgot Password' : 'पासवर्ड भूल गए'}
                      </span>
                    </div>
                    <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                      {lang === 'en' ? 'Enter your registered email address to identify your account and receive an OTP' : 'सत्यापन ओटीपी प्राप्त करने के लिए अपना पंजीकृत ईमेल दर्ज करें'}
                    </p>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#1E293B' }}>
                      {a.email} <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email"
                        required
                        placeholder="name@domain.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '13px 16px 13px 44px',
                          borderRadius: '12px',
                          border: '2px solid #E2E8F0',
                          outline: 'none',
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease',
                          background: '#FAFBFC'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                      />
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleForgotSendOtp}
                    disabled={isForgotLoading}
                    style={{ 
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      color: '#FFF',
                      cursor: isForgotLoading ? 'wait' : 'pointer',
                      fontWeight: 700,
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    {isForgotLoading 
                      ? (lang === 'en' ? 'Sending OTP...' : 'ओटीपी भेजा जा रहा है...')
                      : (lang === 'en' ? 'Send Verification OTP' : 'सत्यापन ओटीपी भेजें')}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      ← {lang === 'en' ? 'Back to Login' : 'लॉगिन पर वापस जाएं'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: OTP + New Password & Confirm Password */
                <div>
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#eff6ff',
                      padding: '6px 16px',
                      borderRadius: '30px',
                      border: '1px solid #bfdbfe',
                      marginBottom: '10px'
                    }}>
                      <ShieldCheck size={18} color="#2563EB" />
                      <span style={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: 800 }}>
                        {lang === 'en' ? 'Set New Password' : 'नया पासवर्ड सेट करें'}
                      </span>
                    </div>

                    <p style={{ color: '#64748B', fontSize: '0.82rem', margin: '0 0 6px 0' }}>
                      {lang === 'en' ? 'Enter the OTP sent to your email:' : 'आपके ईमेल पर भेजा गया ओटीपी दर्ज करें:'}
                    </p>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#F1F5F9',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#0F172A'
                    }}>
                      <Mail size={14} color="#2563EB" />
                      <span>{forgotEmail}</span>
                      <button
                        type="button"
                        onClick={() => setForgotStep(1)}
                        style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'underline', marginLeft: '4px' }}
                      >
                        {lang === 'en' ? 'Edit' : 'बदलें'}
                      </button>
                    </div>
                  </div>

                  {forgotDevOtp && (
                    <div style={{
                      background: '#EFF6FF',
                      border: '1.5px dashed #93C5FD',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      marginBottom: '14px',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      color: '#1E40AF',
                      fontWeight: 700
                    }}>
                      ℹ️ {forgotDevOtp}
                    </div>
                  )}

                  {/* Input 1: 6-Digit OTP */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '6px', color: '#1E293B' }}>
                      {lang === 'en' ? '6-Digit Email OTP' : '6-अंकीय ईमेल ओटीपी'} <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                        <Key size={18} />
                      </div>
                      <input 
                        type="text"
                        required
                        placeholder="123456"
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.trim())}
                        style={{
                          width: '100%',
                          padding: '10px 16px 10px 44px',
                          borderRadius: '10px',
                          border: '2px solid #E2E8F0',
                          outline: 'none',
                          fontSize: '1.1rem',
                          fontWeight: '800',
                          letterSpacing: '3px',
                          background: '#FAFBFC'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                      />
                    </div>
                  </div>

                  {/* Input 2: New Password */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '6px', color: '#1E293B' }}>
                      {lang === 'en' ? 'New Password' : 'नया पासवर्ड'} <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                        <Lock size={18} />
                      </div>
                      <input 
                        type="password"
                        required
                        placeholder="Enter new strong password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 16px 10px 44px',
                          borderRadius: '10px',
                          border: '2px solid #E2E8F0',
                          outline: 'none',
                          fontSize: '0.92rem',
                          background: '#FAFBFC'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                      />
                    </div>
                  </div>

                  {/* Input 3: Confirm New Password */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', marginBottom: '6px', color: '#1E293B' }}>
                      {lang === 'en' ? 'Confirm New Password' : 'नए पासवर्ड की पुष्टि करें'} <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                        <Lock size={18} />
                      </div>
                      <input 
                        type="password"
                        required
                        placeholder="Re-enter new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 16px 10px 44px',
                          borderRadius: '10px',
                          border: '2px solid #E2E8F0',
                          outline: 'none',
                          fontSize: '0.92rem',
                          background: '#FAFBFC'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                        onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                      />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleForgotResetPassword}
                    disabled={isForgotLoading}
                    style={{ 
                      width: '100%',
                      padding: '13px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      color: '#FFF',
                      cursor: isForgotLoading ? 'wait' : 'pointer',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    <Sparkles size={18} /> {isForgotLoading 
                      ? (lang === 'en' ? 'Saving Password...' : 'पासवर्ड सहेजा जा रहा है...')
                      : (lang === 'en' ? 'Save & Reset Password' : 'सहेजें और पासवर्ड रीसेट करें')}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      ← {lang === 'en' ? 'Back to Login' : 'लॉगिन पर वापस जाएं'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : mode === 'register' ? (
            <>
              {/* Step Indicator */}
              {renderStepIndicator()}

              {/* Step Content */}
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '24px' }}>
                {currentStep > 1 && (
                  <button 
                    type="button"
                    onClick={prevStep}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '10px',
                      border: '2px solid #E2E8F0',
                      background: '#FFF',
                      color: '#64748B',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 600,
                      flex: 1,
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#2563EB';
                      e.target.style.color = '#2563EB';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.color = '#64748B';
                    }}
                  >
                    <ArrowLeft size={18} /> {lang === 'en' ? 'Back' : 'पीछे'}
                  </button>
                )}
                {currentStep < 4 ? (
                  <button 
                    type="button"
                    onClick={nextStep}
                    disabled={isSendingOtp}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      color: '#FFF',
                      cursor: isSendingOtp ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 600,
                      flex: currentStep === 1 ? '1' : '2',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                      opacity: isSendingOtp ? 0.8 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isSendingOtp) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
                    }}
                  >
                    {currentStep === 3 ? (
                      isSendingOtp 
                        ? (lang === 'en' ? 'Sending OTP...' : 'ओटीपी भेजा जा रहा है...')
                        : (lang === 'en' ? 'Send OTP & Next' : 'ओटीपी भेजें और आगे बढ़ें')
                    ) : (
                      lang === 'en' ? 'Next' : 'अगला'
                    )} <ArrowRight size={18} />
                  </button>
                ) : (
                  <button 
                    type="submit"
                    style={{ 
                      width: '100%',
                      padding: '14px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      color: '#FFF',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
                    }}
                  >
                    <Sparkles size={18} /> {lang === 'en' ? 'Verify OTP & Register' : 'ओटीपी सत्यापित करें और पंजीकरण करें'}
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Login Form */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              margin: 'auto 0',
              padding: '20px 0',
              animation: 'fadeIn 0.4s ease'
            }}>
              <div style={{ marginBottom: '25px', textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#eff6ff',
                  padding: '8px 20px',
                  borderRadius: '30px',
                  border: '1px solid #bfdbfe',
                  marginBottom: '12px'
                }}>
                  <Crown size={20} color="#2563EB" />
                  <span style={{ 
                    color: '#2563EB', 
                    fontSize: '0.9rem', 
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    {lang === 'en' ? 'Access Portal' : ' पोर्टल एक्सेस करें'} 
                  </span>
                </div>
                <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                  {lang === 'en' ? 'Enter your registered credentials to access services' : 'सेवाओं तक पहुंचने के लिए अपने पंजीकृत क्रेडेंशियल दर्ज करें'}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#1E293B' }}>
                  {a.email} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                    <Mail size={18} />
                  </div>
                  <UncontrolledInput 
                    type="email"
                    required
                    placeholder="name@domain.com"
                    defaultValue={formRef.current.email}
                    onInput={(e) => formRef.current.email = e.target.value}
                    style={{
                      width: '100%',
                      padding: '13px 16px 13px 44px',
                      borderRadius: '12px',
                      border: '2px solid #E2E8F0',
                      outline: 'none',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      background: '#FAFBFC'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563EB';
                      e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#1E293B' }}>
                  {a.password} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                    <Lock size={18} />
                  </div>
                  <UncontrolledInput 
                    type="password"
                    required
                    placeholder="••••••••"
                    defaultValue={formRef.current.password}
                    onInput={(e) => formRef.current.password = e.target.value}
                    style={{
                      width: '100%',
                      padding: '13px 16px 13px 44px',
                      borderRadius: '12px',
                      border: '2px solid #E2E8F0',
                      outline: 'none',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      background: '#FAFBFC'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563EB';
                      e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot-password'); setForgotStep(1); }}
                    style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {lang === 'en' ? 'Forgot Password?' : 'पासवर्ड भूल गए?'}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                style={{ 
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  color: '#FFF',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
                }}
              >
                <LogIn size={20} /> {a.loginBtn}
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-light)',
      color: 'var(--text-dark)',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(37, 99, 235,0.08) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(29, 78, 216,0.06) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      <div className="auth-layout-grid" style={{ 
        display: 'grid',
        gridTemplateColumns: mode === 'register' ? '1fr 1.2fr' : '1fr 1.2fr',
        maxWidth: '1000px',
        width: '100%',
        background: 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        border: '1px solid var(--card-border)',
        position: 'relative',
        zIndex: 1,
        minHeight: '620px'
      }}>
        {/* Left Side - Info Panel (for both login and register) */}
        <div style={{
          background: 'var(--bg-alt)',
          borderRight: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {(mode === 'login' || mode === 'forgot-password') ? <LoginInfo /> : <RegistrationInfo />}
        </div>

        {/* Right Side - Form */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: (mode === 'login' || mode === 'forgot-password') ? 'transparent' : 'white'
        }}>
          {/* Header Tabs */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            background: (mode === 'login' || mode === 'forgot-password') ? 'rgba(248, 250, 252, 0.8)' : 'transparent',
            borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
            backdropFilter: (mode === 'login' || mode === 'forgot-password') ? 'blur(10px)' : 'none'
          }}>
            <button 
              onClick={() => { setMode('login'); setIsSuccess(false); setCurrentStep(1); }}
              style={{
                padding: '18px',
                border: 'none',
                background: (mode === 'login' || mode === 'forgot-password') ? '#FFF' : 'transparent',
                color: (mode === 'login' || mode === 'forgot-password') ? '#2563EB' : '#64748B',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                borderBottom: (mode === 'login' || mode === 'forgot-password') ? '3px solid #2563EB' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <LogIn size={20} /> {a.loginTitle}
              {(mode === 'login' || mode === 'forgot-password') && (
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  background: '#2563EB',
                  borderRadius: '50%'
                }} />
              )}
            </button>
            <button 
              onClick={() => { setMode('register'); setIsSuccess(false); setCurrentStep(1); }}
              style={{
                padding: '18px',
                border: 'none',
                background: mode === 'register' ? '#FFF' : 'transparent',
                color: mode === 'register' ? '#2563EB' : '#64748B',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                borderBottom: mode === 'register' ? '3px solid #2563EB' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <UserPlus size={20} /> {a.registerTitle}
              {mode === 'register' && (
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  background: '#2563EB',
                  borderRadius: '50%'
                }} />
              )}
            </button>
          </div>

          {/* Form Section */}
          <FormSection />
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}  