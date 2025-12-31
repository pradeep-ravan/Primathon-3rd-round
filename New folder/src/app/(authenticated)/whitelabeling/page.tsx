'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Palette, LogIn, Monitor, Share2, Save, GripVertical } from 'lucide-react';
import { PreviewPanel } from '@/components/whitelabeling/PreviewPanel';
import { AppearanceSettings } from '@/components/whitelabeling/AppearanceSettings';
import { LoginScreenSettings } from '@/components/whitelabeling/LoginScreenSettings';
import { WebClientSettings } from '@/components/whitelabeling/WebClientSettings';
import { IntegrationsSettings } from '@/components/whitelabeling/IntegrationsSettings';

type BannerMode = 'disable' | 'static' | 'adsense';
type BannerKey = 'loginFull' | 'loginMobile' | 'wcTop' | 'wcRight';

export default function WhiteLabelingPage() {
  const [activeSection, setActiveSection] = useState<'appearance' | 'login' | 'webclient' | 'integrations'>('appearance');

  // Switch states for advanced options
  const [loginOptions, setLoginOptions] = useState({
    language: true,
    remember: true,
    autofill: true,
    signup: false,
    guest: true,
    support: false,
    search: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [customFields, setCustomFields] = useState({
    nickname: false,
    company: false,
    job: false,
    profession: false,
    mobile: false,
    workphone: false,
    homephone: false,
    im: false,
    gender: false,
    birthday: false,
    homepage: false,
  });
  const [verificationEnabled, setVerificationEnabled] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    website: true,
    facebook: true,
    twitter: true,
    linkedin: true,
  });
  const [socialUrls, setSocialUrls] = useState({
    website: '',
    facebook: '',
    twitter: '',
    linkedin: '',
  });
  // WebClient skin
  const [webclientTitle, setWebclientTitle] = useState('');
  const [webclientSkin, setWebclientSkin] = useState('Default');
  // WebAdmin skin
  const [webadminTitle, setWebadminTitle] = useState('');
  const [webadminColor, setWebadminColor] = useState('purple');
  // Banner Ads
  const [adsenseEnabled, setAdsenseEnabled] = useState(true);
  const [adsenseClientId, setAdsenseClientId] = useState('');
  
  const [bannerModes, setBannerModes] = useState<Record<BannerKey, BannerMode>>({
    loginFull: 'disable',
    loginMobile: 'disable',
    wcTop: 'disable',
    wcRight: 'disable',
  });
  const [staticImages, setStaticImages] = useState<Record<BannerKey, string | null>>({
    loginFull: null,
    loginMobile: null,
    wcTop: null,
    wcRight: null,
  });

  // Conferencing
  const [conferenceLogo, setConferenceLogo] = useState<string | null>(null);
  const [conferenceRedirect, setConferenceRedirect] = useState('');

  const onConferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onloadend = () => setConferenceLogo(r.result as string);
    r.readAsDataURL(f);
  };

  const [selectedBackground, setSelectedBackground] = useState<string>('gradient2');
  const [backgroundType, setBackgroundType] = useState<'color' | 'wallpaper'>('wallpaper');
  const [customBackground, setCustomBackground] = useState<string | null>(null);

  const [previewWidth, setPreviewWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX - 48; // 48px for padding/gap approx
      if (newWidth > 300 && newWidth < 800) {
        setPreviewWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const navItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Background & Colors' },
    { id: 'login', label: 'Login Screen', icon: LogIn, description: 'Logo, Fields & Privacy' },
    { id: 'webclient', label: 'WebClient', icon: Monitor, description: 'Skin & Conferencing' },
    { id: 'integrations', label: 'Integrations', icon: Share2, description: 'Social & Ads' },
  ] as const;

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6 min-h-screen flex flex-col">
      {/* Header */}
      <div className="gradient-header rounded-xl p-6 shadow-lg border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            WHITE LABELING
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize the appearance of your login page, WebClient and mobile apps
          </p>
        </div>
        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg px-8 shrink-0">
          <Save className="w-4 h-4 mr-2" />
          SAVE CHANGES
        </Button>
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="flex items-center gap-2 p-1 bg-muted/40 rounded-lg overflow-x-auto border border-border/50 shrink-0">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-200 whitespace-nowrap font-medium ${
              activeSection === item.id 
                ? 'bg-background text-primary shadow-sm ring-1 ring-border' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start relative">
        {/* Left Panel - Active Settings Area */}
        <div className="flex-1 w-full bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden min-w-0">
          <div className="p-6">
             {activeSection === 'appearance' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <AppearanceSettings 
                      selectedBackground={selectedBackground}
                      setSelectedBackground={setSelectedBackground}
                      backgroundType={backgroundType}
                      setBackgroundType={setBackgroundType}
                      customBackground={customBackground}
                      setCustomBackground={setCustomBackground}
                   />
                </div>
             )}
             {activeSection === 'login' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <LoginScreenSettings 
                    loginOptions={loginOptions}
                    setLoginOptions={setLoginOptions}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    customFields={customFields}
                    setCustomFields={setCustomFields}
                    verificationEnabled={verificationEnabled}
                    setVerificationEnabled={setVerificationEnabled}
                    verificationMethod={verificationMethod}
                    setVerificationMethod={setVerificationMethod}
                  />
                </div>
             )}
             {activeSection === 'webclient' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <WebClientSettings 
                    webclientTitle={webclientTitle}
                    setWebclientTitle={setWebclientTitle}
                    webclientSkin={webclientSkin}
                    setWebclientSkin={setWebclientSkin}
                    webadminTitle={webadminTitle}
                    setWebadminTitle={setWebadminTitle}
                    webadminColor={webadminColor}
                    setWebadminColor={setWebadminColor}
                    conferenceLogo={conferenceLogo}
                    onConferenceUpload={onConferenceUpload}
                    conferenceRedirect={conferenceRedirect}
                    setConferenceRedirect={setConferenceRedirect}
                  />
                </div>
             )}
            {activeSection === 'integrations' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <IntegrationsSettings 
                    socialLinks={socialLinks}
                    setSocialLinks={setSocialLinks}
                    socialUrls={socialUrls}
                    setSocialUrls={setSocialUrls}
                    adsenseEnabled={adsenseEnabled}
                    setAdsenseEnabled={setAdsenseEnabled}
                    adsenseClientId={adsenseClientId}
                    setAdsenseClientId={setAdsenseClientId}
                    bannerModes={bannerModes}
                    setBannerModes={setBannerModes}
                    staticImages={staticImages}
                    setStaticImages={setStaticImages}
                  />
                </div>
            )}
          </div>
        </div>

        {/* Resizer Handle */}
        <div 
           className="hidden lg:flex w-6 cursor-ew-resize flex-col items-center justify-center hover:bg-primary/5 transition-colors self-stretch relative group z-10"
           onMouseDown={() => setIsResizing(true)}
           title="Drag to resize preview"
        >
           {/* Visible divider line */}
           <div className="absolute inset-y-4 left-1/2 -translate-x-1/2 w-[2px] bg-border/50 group-hover:bg-primary/50 rounded-full transition-colors" />
           
           {/* Grip Handle */}
           <div className="z-10 bg-background border border-border shadow-sm rounded-md p-1 group-hover:border-primary/50 group-hover:text-primary transition-all">
             <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
           </div>
        </div>

        {/* Right Panel - Sticky Preview */}
        <div 
          className="shrink-0 sticky top-6"
          style={{ width: `${previewWidth}px` }}
        >
           <PreviewPanel 
              selectedBackground={selectedBackground}
              backgroundType={backgroundType}
              customBackground={customBackground}
           />
        </div>
      </div>
    </div>
  );
}
