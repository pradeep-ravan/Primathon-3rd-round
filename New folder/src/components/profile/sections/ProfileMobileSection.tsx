'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Tablet, Wifi, Shield } from 'lucide-react';

export interface MobileDevice {
  id: string;
  name: string;
  type: 'phone' | 'tablet';
  lastSeen: string;
  status: 'active' | 'inactive' | 'blocked';
  location: string;
}

export interface ProfileMobileSectionProps {
  devices: MobileDevice[];
  onManageDevice: (deviceId: string) => void;
  onBlockDevice: (deviceId: string) => void;
  onUnblockDevice: (deviceId: string) => void;
}

export function ProfileMobileSection({
  devices,
  onManageDevice,
  onBlockDevice,
  onUnblockDevice,
}: ProfileMobileSectionProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'inactive':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'blocked':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'blocked':
        return 'Blocked';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile Devices Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            MOBILE DEVICES
          </CardTitle>
          <CardDescription className="text-foreground">
            Manage connected mobile devices and their permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-muted/50 rounded-lg p-4 border border-border/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {device.type === 'phone' ? (
                      <Smartphone className="h-5 w-5 text-blue-400" />
                    ) : (
                      <Tablet className="h-5 w-5 text-purple-400" />
                    )}
                    <span className="text-foreground font-medium">
                      {device.name}
                    </span>
                  </div>
                  <Badge className={getStatusColor(device.status)}>
                    {getStatusText(device.status)}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Wifi className="h-4 w-4" />
                    <span>Last seen: {device.lastSeen}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>{device.location}</span>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onManageDevice(device.id)}
                    className="border-border text-foreground hover:bg-muted text-xs"
                  >
                    Manage
                  </Button>
                  {device.status === 'blocked' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUnblockDevice(device.id)}
                      className="border-green-600 text-green-300 hover:bg-green-600 text-xs"
                    >
                      Unblock
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onBlockDevice(device.id)}
                      className="border-red-600 text-red-300 hover:bg-red-600 text-xs"
                    >
                      Block
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {devices.length === 0 && (
            <div className="text-center py-8">
              <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No mobile devices connected
              </p>
              <p className="text-sm text-muted-foreground">
                Connect a device to manage it here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Device Management Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-xl font-bold">
            DEVICE MANAGEMENT
          </CardTitle>
          <CardDescription className="text-foreground">
            Configure device policies and security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-foreground font-medium mb-2">
                Security Policies
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Configure device security requirements
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-foreground hover:bg-muted"
              >
                Configure
              </Button>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-foreground font-medium mb-2">Remote Wipe</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Remotely wipe data from lost devices
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-red-600 text-red-300 hover:bg-red-600"
              >
                Wipe Device
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
