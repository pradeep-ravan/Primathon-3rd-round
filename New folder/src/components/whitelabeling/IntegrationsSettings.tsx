import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";

type BannerMode = 'disable' | 'static' | 'adsense';
type BannerKey = 'loginFull' | 'loginMobile' | 'wcTop' | 'wcRight';

interface SocialLinks {
  website: boolean;
  facebook: boolean;
  twitter: boolean;
  linkedin: boolean;
}

interface SocialUrls {
  website: string;
  facebook: string;
  twitter: string;
  linkedin: string;
}

interface IntegrationsSettingsProps {
  socialLinks: SocialLinks;
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinks>>;
  socialUrls: SocialUrls;
  setSocialUrls: React.Dispatch<React.SetStateAction<SocialUrls>>;
  adsenseEnabled: boolean;
  setAdsenseEnabled: (v: boolean) => void;
  adsenseClientId: string;
  setAdsenseClientId: (v: string) => void;
  bannerModes: Record<BannerKey, BannerMode>;
  setBannerModes: React.Dispatch<React.SetStateAction<Record<BannerKey, BannerMode>>>;
  staticImages: Record<BannerKey, string | null>;
  setStaticImages: React.Dispatch<React.SetStateAction<Record<BannerKey, string | null>>>;
}

export function IntegrationsSettings({
  socialLinks,
  setSocialLinks,
  socialUrls,
  setSocialUrls,
  adsenseEnabled,
  setAdsenseEnabled,
  adsenseClientId,
  setAdsenseClientId,
  bannerModes,
  setBannerModes,
  staticImages,
  setStaticImages,
}: IntegrationsSettingsProps) {

  const handleStaticUpload = (
    key: BannerKey,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setStaticImages((prev) => ({ ...prev, [key]: reader.result as string }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Social integrations */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Social integrations</CardTitle>
          <CardDescription>Set up links to social media.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { key: 'website', label: 'WEBSITE', placeholder: 'Website URL' },
              { key: 'facebook', label: 'FACEBOOK INTEGRATION', placeholder: 'Facebook page URL' },
              { key: 'twitter', label: 'TWITTER INTEGRATION', placeholder: 'Twitter page URL' },
              { key: 'linkedin', label: 'LINKEDIN INTEGRATION', placeholder: 'LinkedIn page URL' },
            ].map((opt) => (
              <div key={opt.key} className="flex items-center gap-3">
                <button
                  type="button"
                  className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                    socialLinks[opt.key as keyof SocialLinks] ? 'bg-purple-600' : 'bg-muted/30'
                  } focus:outline-none`}
                  aria-pressed={socialLinks[opt.key as keyof SocialLinks]}
                  onClick={() =>
                    setSocialLinks((prev) => ({
                      ...prev,
                      [opt.key]: !prev[opt.key as keyof SocialLinks],
                    }))
                  }
                >
                  <span
                    className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                      socialLinks[opt.key as keyof SocialLinks] ? 'translate-x-5' : ''
                    }`}
                  ></span>
                </button>
                <span
                  className={`text-sm font-medium ${
                    socialLinks[opt.key as keyof SocialLinks] ? 'text-purple-600' : 'text-muted-foreground'
                  }`}
                >
                  {opt.label}
                </span>
                <Input
                  placeholder={opt.placeholder}
                  value={socialUrls[opt.key as keyof SocialUrls]}
                  onChange={(e) =>
                    setSocialUrls((prev) => ({
                      ...prev,
                      [opt.key]: e.target.value,
                    }))
                  }
                  className="flex-1"
                  disabled={!socialLinks[opt.key as keyof SocialLinks]}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Banner Ads */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">BANNER ADS</CardTitle>
          <CardDescription>
            Place banner ads on your login screen and into WebClient.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AdSense settings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">AdSense settings</Label>
              <Switch checked={adsenseEnabled} onCheckedChange={(v) => setAdsenseEnabled(!!v)} />
            </div>
            <Input
              placeholder="AdSense client ID"
              value={adsenseClientId}
              onChange={(e) => setAdsenseClientId(e.target.value)}
              disabled={!adsenseEnabled}
            />
            <p className="text-xs text-muted-foreground">Enter your AdSense customer ID.</p>
          </div>

          {/* Login page banners */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Login page</Label>
            {([
              { key: 'loginFull', label: 'FULL RESOLUTION (728x90 px)' },
              { key: 'loginMobile', label: 'MOBILE RESOLUTION (300x100 px)' },
            ] as const).map((sec) => (
              <div key={sec.key} className="space-y-2">
                <p className="text-sm text-foreground font-medium">{sec.label}</p>
                <div className="flex items-center gap-4">
                  <RadioGroup
                    value={bannerModes[sec.key]}
                    onValueChange={(v) =>
                      setBannerModes((prev) => ({
                        ...prev,
                        [sec.key]: v as BannerMode,
                      }))
                    }
                    className="grid grid-cols-3 gap-4"
                  >
                    {[
                      { id: 'disable', label: 'DISABLE' },
                      { id: 'static', label: 'STATIC IMAGE' },
                      { id: 'adsense', label: 'ADSENSE' },
                    ].map((mode) => (
                      <div key={mode.id} className="flex items-center space-x-2">
                        <RadioGroupItem id={`${sec.key}-${mode.id}`} value={mode.id} />
                        <Label htmlFor={`${sec.key}-${mode.id}`} className="text-sm">
                          {mode.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                {bannerModes[sec.key] === 'static' && (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id={`${sec.key}-upload`}
                        className="hidden"
                        onChange={(e) => handleStaticUpload(sec.key, e)}
                      />
                      <Button
                        variant="secondary"
                        className="bg-purple-600 text-white"
                        onClick={() => document.getElementById(`${sec.key}-upload`)?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        UPLOAD
                      </Button>
                    </div>
                    <div className="h-16 w-full rounded-md border border-border bg-muted/30 flex items-center justify-center text-xs text-muted-foreground">
                      {staticImages[sec.key] ? 'Image loaded' : 'Preview'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* WebClient banners */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">WebClient</Label>
            {([
              { key: 'wcTop', label: 'TOP BANNER' },
              { key: 'wcRight', label: 'RIGHT BANNER' },
            ] as const).map((sec) => (
              <div key={sec.key} className="space-y-2">
                <p className="text-sm text-foreground font-medium">{sec.label}</p>
                <div className="flex items-center gap-4">
                  <RadioGroup
                    value={bannerModes[sec.key]}
                    onValueChange={(v) =>
                      setBannerModes((prev) => ({
                        ...prev,
                        [sec.key]: v as BannerMode,
                      }))
                    }
                    className="grid grid-cols-3 gap-4"
                  >
                     {[
                      { id: 'disable', label: 'DISABLE' },
                      { id: 'static', label: 'STATIC IMAGE' },
                      { id: 'adsense', label: 'ADSENSE' },
                    ].map((mode) => (
                      <div key={mode.id} className="flex items-center space-x-2">
                        <RadioGroupItem id={`${sec.key}-${mode.id}`} value={mode.id} />
                        <Label htmlFor={`${sec.key}-${mode.id}`} className="text-sm">
                          {mode.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                {bannerModes[sec.key] === 'static' && (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                       <input
                        type="file"
                        accept="image/*"
                        id={`${sec.key}-upload`}
                        className="hidden"
                        onChange={(e) => handleStaticUpload(sec.key, e)}
                      />
                      <Button
                        variant="secondary"
                        className="bg-purple-600 text-white"
                        onClick={() => document.getElementById(`${sec.key}-upload`)?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        UPLOAD
                      </Button>
                    </div>
                    <div className="h-16 w-full rounded-md border border-border bg-muted/30 flex items-center justify-center text-xs text-muted-foreground">
                      {staticImages[sec.key] ? 'Image loaded' : 'Preview'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
