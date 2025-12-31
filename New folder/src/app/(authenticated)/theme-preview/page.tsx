"use client";

import React from "react";
import ThemeSettings from "@/components/ui/settings/ThemeSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function ThemePreviewPage() {
  return (
    <div className="container mx-auto p-6 space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Theme Customization</h1>
        <p className="text-muted-foreground mt-2">
          Choose a preset theme or customize your own color palette. Changes are applied instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Column */}
        <div className="lg:col-span-5 space-y-6">
           <ThemeSettings />
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-7">
           <div className="sticky top-6 space-y-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-semibold">Live Preview</h2>
                 <Badge variant="outline" className="text-xs">Component Gallery</Badge>
              </div>
              
              <div className="grid gap-6">
                 {/* Card Preview */}
                 <Card>
                   <CardHeader>
                     <CardTitle>Card Component</CardTitle>
                     <CardDescription>This is how a standard card looks.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Input Field</Label>
                          <Input placeholder="Type something..." />
                        </div>
                        <div className="space-y-2">
                           <Label>Select Option</Label>
                           <Select>
                             <SelectTrigger>
                               <SelectValue placeholder="Select..." />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="1">Option 1</SelectItem>
                               <SelectItem value="2">Option 2</SelectItem>
                               <SelectItem value="3">Option 3</SelectItem>
                             </SelectContent>
                           </Select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="airplane-mode" />
                        <Label htmlFor="airplane-mode">Toggle Switch</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                         <Checkbox id="terms" />
                         <Label htmlFor="terms">Accept terms and conditions</Label>
                      </div>
                   </CardContent>
                   <CardFooter className="flex justify-between">
                     <Button variant="ghost">Cancel</Button>
                     <Button>Submit Action</Button>
                   </CardFooter>
                 </Card>

                 {/* Colors Preview */}
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-primary text-primary-foreground flex flex-col items-center justify-center text-center">
                       <span className="font-bold text-sm">Primary</span>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary text-secondary-foreground flex flex-col items-center justify-center text-center">
                       <span className="font-bold text-sm">Secondary</span>
                    </div>
                    <div className="p-4 rounded-lg bg-accent text-accent-foreground flex flex-col items-center justify-center text-center">
                       <span className="font-bold text-sm">Accent</span>
                    </div>
                    <div className="p-4 rounded-lg bg-muted text-muted-foreground flex flex-col items-center justify-center text-center">
                       <span className="font-bold text-sm">Muted</span>
                    </div>
                 </div>
                 
                 <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                       <Calendar size={24} />
                    </div>
                    <div>
                       <h4 className="font-medium text-foreground">Accent Usage</h4>
                       <p className="text-sm text-muted-foreground mt-1">
                          This demonstrates how the primary color interacts with backgrounds and icons.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
