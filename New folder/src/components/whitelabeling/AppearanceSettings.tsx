import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Upload } from "lucide-react";
import { colorOptions, wallpapers } from "./constants";

interface AppearanceSettingsProps {
  selectedBackground: string;
  setSelectedBackground: (v: string) => void;
  backgroundType: 'color' | 'wallpaper';
  setBackgroundType: (v: 'color' | 'wallpaper') => void;
  customBackground: string | null;
  setCustomBackground: (v: string | null) => void;
}

export function AppearanceSettings({
  selectedBackground,
  setSelectedBackground,
  backgroundType,
  setBackgroundType,
  customBackground,
  setCustomBackground,
}: AppearanceSettingsProps) {

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBackground(reader.result as string);
        setBackgroundType('wallpaper');
        setSelectedBackground('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Background Selection */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">BACKGROUND</CardTitle>
          <CardDescription>
            Select the perfect background for your login page, WebClient and mobile apps.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Wallpaper Size Dropdown */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Wallpaper Size</Label>
            <select className="w-full h-9 rounded-md border border-border px-3 py-1 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Cover</option>
              <option>Contain</option>
              <option>Stretch</option>
            </select>
          </div>

          {/* Color Swatches */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Solid Colors</Label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedBackground(option.id);
                    setBackgroundType('color');
                  }}
                  className={`w-10 h-10 rounded-full ${option.color} shadow-sm hover:scale-110 transition-transform relative ring-2 ring-offset-1 ${
                    backgroundType === 'color' && selectedBackground === option.id
                      ? 'ring-primary'
                      : 'ring-transparent'
                  }`}
                >
                  {backgroundType === 'color' && selectedBackground === option.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Custom Background */}
          <div className="space-y-2">
            <Label htmlFor="upload" className="text-sm font-semibold">
              Custom Background
            </Label>
            <div className="relative">
              <Input
                id="upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('upload')?.click()}
                variant="secondary"
                size="sm"
                className="w-full gradient-accent hover:opacity-90 transition-opacity"
              >
                <Upload className="w-4 h-4 mr-2" />
                UPLOAD CUSTOM BACKGROUND
              </Button>
            </div>
          </div>

          {/* Wallpapers Grid */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">WALLPAPERS</Label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {wallpapers.map((wallpaper) => (
                <button
                  key={wallpaper.id}
                  onClick={() => {
                    setSelectedBackground(wallpaper.id);
                    setBackgroundType('wallpaper');
                  }}
                  className={`relative aspect-video rounded-md overflow-hidden shadow-sm hover:scale-105 transition-transform ring-2 ring-offset-1 ${
                    backgroundType === 'wallpaper' && selectedBackground === wallpaper.id
                      ? 'ring-primary'
                      : 'ring-transparent'
                  }`}
                  style={{
                    background: wallpaper.thumbnail,
                    backgroundSize: 'cover',
                  }}
                >
                  {backgroundType === 'wallpaper' && selectedBackground === wallpaper.id && (
                    <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
              {customBackground && (
                <button
                  onClick={() => {
                    setSelectedBackground('custom');
                    setBackgroundType('wallpaper');
                  }}
                  className={`relative aspect-video rounded-md overflow-hidden shadow-sm hover:scale-105 transition-transform ring-2 ring-offset-1 ${
                    selectedBackground === 'custom'
                      ? 'ring-primary'
                      : 'ring-transparent'
                  }`}
                  style={{
                    backgroundImage: `url(${customBackground})`,
                    backgroundSize: 'cover',
                  }}
                >
                  {selectedBackground === 'custom' && (
                    <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface Colors */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">INTERFACE COLORS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center"></div>
            <span className="text-muted-foreground text-xs">
              Automatically generated from background.
            </span>
          </div>
          <div className="flex gap-2 flex-wrap pt-1">
            <button className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:scale-110 transition-transform">
              <span className="text-white text-sm font-bold">+</span>
            </button>
            {colorOptions.map((option) => (
              <button
                key={option.id}
                className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center ring-2 ring-offset-1 ${
                  selectedBackground === option.id ? 'ring-primary' : 'ring-transparent'
                } hover:scale-110 transition-transform`}
              ></button>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
