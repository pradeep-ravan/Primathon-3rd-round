import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { colorOptions } from "./constants";

interface WebClientSettingsProps {
  webclientTitle: string;
  setWebclientTitle: (v: string) => void;
  webclientSkin: string;
  setWebclientSkin: (v: string) => void;
  webadminTitle: string;
  setWebadminTitle: (v: string) => void;
  webadminColor: string;
  setWebadminColor: (v: string) => void;
  conferenceLogo: string | null;
  onConferenceUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  conferenceRedirect: string;
  setConferenceRedirect: (v: string) => void;
}

export function WebClientSettings({
  webclientTitle,
  setWebclientTitle,
  webclientSkin,
  setWebclientSkin,
  webadminTitle,
  setWebadminTitle,
  webadminColor,
  setWebadminColor,
  conferenceLogo,
  onConferenceUpload,
  conferenceRedirect,
  setConferenceRedirect,
}: WebClientSettingsProps) {
  return (
    <div className="space-y-6">
      {/* WebClient Skin */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">WEBCLIENT SKIN</CardTitle>
          <CardDescription>Set up how WebClient looks on the inside.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Page title</Label>
            <p className="text-sm text-muted-foreground -mt-1">
              Change the text your users see in the window title.
            </p>
            <Input
              placeholder="Page title"
              value={webclientTitle}
              onChange={(e) => setWebclientTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2 pt-2">
            <Label className="text-base font-semibold">Skin style</Label>
            <select
              className="w-full h-10 rounded-md border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={webclientSkin}
              onChange={(e) => setWebclientSkin(e.target.value)}
            >
              <option>Default</option>
              <option>Classic</option>
              <option>Compact</option>
              <option>High Contrast</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* WebAdmin Skin */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-xl">WEBADMIN SKIN</CardTitle>
            <CardDescription>Set up how WebAdmin looks on the inside.</CardDescription>
          </div>
          <Button variant="secondary" className="bg-purple-600 text-white">
            SET TO DEFAULT VALUES
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Page title</Label>
            <p className="text-sm text-muted-foreground -mt-1">
              Change the text your users see in the window title.
            </p>
            <Input
              placeholder="Page title"
              value={webadminTitle}
              onChange={(e) => setWebadminTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2 pt-2">
            <Label className="text-base font-semibold">Skin style</Label>
            <div className="flex items-center gap-3 flex-wrap">
              {colorOptions.slice(1).map((c) => (
                <button
                  key={`webadmin-${c.id}`}
                  type="button"
                  onClick={() => setWebadminColor(c.id)}
                  className={`w-8 h-8 rounded-full ${c.color} ring-2 ${
                    webadminColor === c.id ? 'ring-primary' : 'ring-transparent'
                  }`}
                  aria-pressed={webadminColor === c.id}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conferencing */}
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">CONFERENCING</CardTitle>
          <CardDescription>Change the look of the conferencing app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Conferencing logo</Label>
            <p className="text-sm text-muted-foreground">
              Change the logo shown on the conferencing page. Supported image formats: JPG, PNG, GIF. Maximum file size: 20 MB.
            </p>
            <div className="flex items-center gap-3">
              <input
                className="hidden"
                id="conf-logo"
                type="file"
                accept="image/*"
                onChange={onConferenceUpload}
              />
              <Button
                variant="secondary"
                className="bg-purple-600 text-white"
                onClick={() => document.getElementById('conf-logo')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                UPLOAD
              </Button>
            </div>
            <div className="mt-2">
              <Label className="text-sm">PREVIEW</Label>
              <div className="mt-1 h-16 w-64 rounded-md border border-border bg-muted/30 flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
                {conferenceLogo ? 'Image loaded' : 'Preview'}
              </div>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <Label className="text-base font-semibold">Redirect URL</Label>
            <p className="text-sm text-muted-foreground">
              URL to which the user will be redirected after hanging up the conference
            </p>
            <Input
              placeholder="Redirect URL"
              value={conferenceRedirect}
              onChange={(e) => setConferenceRedirect(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
