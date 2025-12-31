import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Upload } from "lucide-react";

interface LoginOptions {
  language: boolean;
  remember: boolean;
  autofill: boolean;
  signup: boolean;
  guest: boolean;
  support: boolean;
  search: boolean;
}

interface CustomFields {
  nickname: boolean;
  company: boolean;
  job: boolean;
  profession: boolean;
  mobile: boolean;
  workphone: boolean;
  homephone: boolean;
  im: boolean;
  gender: boolean;
  birthday: boolean;
  homepage: boolean;
}

interface LoginScreenSettingsProps {
  loginOptions: LoginOptions;
  setLoginOptions: React.Dispatch<React.SetStateAction<LoginOptions>>;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  customFields: CustomFields;
  setCustomFields: React.Dispatch<React.SetStateAction<CustomFields>>;
  verificationEnabled: boolean;
  setVerificationEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  verificationMethod: string;
  setVerificationMethod: (v: string) => void;
}

export function LoginScreenSettings({
  loginOptions,
  setLoginOptions,
  searchQuery,
  setSearchQuery,
  customFields,
  setCustomFields,
  verificationEnabled,
  setVerificationEnabled,
  verificationMethod,
  setVerificationMethod,
}: LoginScreenSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Login Screen Skin */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">LOGIN SCREEN SKIN</CardTitle>
          <CardDescription>Set up how the login page looks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className="bg-purple-600 text-white w-full mt-2">
            SET TO DEFAULT VALUES
          </Button>
        </CardContent>
      </Card>

      {/* Login Logo & Favicon */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Login logo</CardTitle>
          <CardDescription>
            Change the logo shown on your login page. Supported image formats: JPG, PNG, GIF, SVG. Maximum file size: 20 MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="secondary" className="bg-purple-600 text-white w-full">
            <Upload className="w-4 h-4 mr-2" />
            UPLOAD
          </Button>
          <Button variant="secondary" className="bg-purple-600 text-white w-full">
            SET DEFAULT LOGIN LOGO
          </Button>
        </CardContent>
        <CardHeader className="pt-6">
          <CardTitle className="text-xl">Favicon</CardTitle>
          <CardDescription>
            Change icon shown in the browser tab. Supported image format is PNG. Image should be square.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="secondary" className="bg-purple-600 text-white w-full">
            <Upload className="w-4 h-4 mr-2" />
            UPLOAD
          </Button>
          <div className="mt-2">
            <Label className="text-sm">PREVIEW</Label>
            <div className="w-16 h-16 rounded-lg border border-border bg-muted/30 mt-1 flex items-center justify-center overflow-hidden">
              {/* Favicon preview image here */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Server Language & Login Page Options */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Server language</CardTitle>
          <CardDescription>Set language preferences for your users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className="text-base font-semibold">SERVER LANGUAGE</Label>
          <select className="w-full h-10 rounded-md border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Czech</option>
            <option>English</option>
            <option>German</option>
            <option>Spanish</option>
          </select>
          <hr className="my-4 border-border" />
          <Label className="text-base font-semibold">Login page options</Label>
          <div className="space-y-3 pt-2">
            {[
              { key: 'language', label: 'LANGUAGE SELECTION' },
              { key: 'remember', label: 'REMEMBER ME' },
              { key: 'autofill', label: 'USERNAME / PASSWORD AUTOFILL' },
              { key: 'signup', label: 'SIGN UP' },
              { key: 'guest', label: 'GUEST SIGNIN' },
              { key: 'support', label: 'SUPPORT LINK' },
              { key: 'search', label: 'SEARCH' },
            ].map((opt) => (
              <div key={opt.key} className="flex items-center gap-3">
                <button
                  type="button"
                  className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                    loginOptions[opt.key as keyof LoginOptions] ? 'bg-purple-600' : 'bg-muted/30'
                  } focus:outline-none`}
                  aria-pressed={loginOptions[opt.key as keyof LoginOptions]}
                  onClick={() =>
                    setLoginOptions((prev) => ({
                      ...prev,
                      [opt.key]: !prev[opt.key as keyof LoginOptions],
                    }))
                  }
                >
                  <span
                    className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                      loginOptions[opt.key as keyof LoginOptions] ? 'translate-x-5' : ''
                    }`}
                  ></span>
                </button>
                <span
                  className={`text-sm font-medium ${
                    loginOptions[opt.key as keyof LoginOptions] ? 'text-purple-600' : 'text-muted-foreground'
                  }`}
                >
                  {opt.label}
                </span>
              </div>
            ))}
            {/* Search input and info */}
            {loginOptions.search && (
              <div className="pt-2">
                <Input
                  placeholder="Search query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-1"
                />
                <p className="text-xs text-muted-foreground">
                  Provide link to search engine of your choice where %%query%% will be replaced by search phrase entered by users. Example: https://www.google.com/search?q=%%query%%+site:icewarp.com.
                </p>
              </div>
            )}
          </div>
          <hr className="my-4 border-border" />
          <Label className="text-base font-semibold">Custom sign up fields</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Select which vCard fields will be required during sign up.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries({
              nickname: 'NICKNAME',
              company: 'COMPANY',
              job: 'JOB',
              profession: 'PROFESSION',
              mobile: 'MOBILE PHONE',
              workphone: 'WORK PHONE',
              homephone: 'HOME PHONE',
              im: 'IM',
              gender: 'GENDER',
              birthday: 'BIRTHDAY',
              homepage: 'HOMEPAGE',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <button
                  type="button"
                  className={`w-8 h-5 rounded-full flex items-center transition-colors ${
                    customFields[key as keyof CustomFields] ? 'bg-purple-600' : 'bg-muted/30'
                  } focus:outline-none`}
                  aria-pressed={customFields[key as keyof CustomFields]}
                  onClick={() =>
                    setCustomFields((prev) => ({
                      ...prev,
                      [key]: !prev[key as keyof CustomFields],
                    }))
                  }
                >
                  <span
                    className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                      customFields[key as keyof CustomFields] ? 'translate-x-4' : ''
                    }`}
                  ></span>
                </button>
                <span
                  className={`text-xs font-medium ${
                    customFields[key as keyof CustomFields] ? 'text-purple-600' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <hr className="my-4 border-border" />
          <Label className="text-base font-semibold">Sign up verification</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Select verification method when users sign up.
          </p>
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                verificationEnabled ? 'bg-purple-600' : 'bg-muted/30'
              } focus:outline-none`}
              aria-pressed={verificationEnabled}
              onClick={() => setVerificationEnabled((v) => !v)}
            >
              <span
                className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                  verificationEnabled ? 'translate-x-5' : ''
                }`}
              ></span>
            </button>
            <span
              className={`text-sm font-medium ${
                verificationEnabled ? 'text-purple-600' : 'text-muted-foreground'
              }`}
            >
              VERIFICATION METHOD
            </span>
          </div>
          <select
            className="w-full h-10 rounded-md border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={verificationMethod}
            onChange={(e) => setVerificationMethod(e.target.value)}
            disabled={!verificationEnabled}
          >
            <option value="">Select method</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="captcha">Captcha</option>
          </select>
        </CardContent>
      </Card>
    </div>
  );
}
