"use client";

import React, { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SmartDiscoverState {
  publicHostname: string;
  smtpHostname: string;
  smtpStandard: string;
  pop3Hostname: string;
  pop3Standard: string;
  imapHostname: string;
  imapStandard: string;
  xmppHostname: string;
  xmppStandard: string;
  sipHostname: string;
  sipStandard: string;
  mobilesyncUrl: string;
  webdavUrl: string;
  webclientUrl: string;
  webadminUrl: string;
  freebusyUrl: string;
  internetCalendarUrl: string;
  smsUrl: string;
  antiSpamReportsUrl: string;
  installUrl: string;
  teamchatUrl: string;
  collaborationApiUrl: string;
  conferenceUrl: string;
}

interface SmartDiscoverTabProps {
  state: SmartDiscoverState;
  updateState: (updates: Partial<SmartDiscoverState>) => void;
}

export const SmartDiscoverTab = memo(function SmartDiscoverTab({
  state,
  updateState,
}: SmartDiscoverTabProps) {
  const handleUpdate = useCallback((field: keyof SmartDiscoverState, value: string) => {
    updateState({ [field]: value });
  }, [updateState]);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">
          SMARTDISCOVER
        </h2>

        <div className="space-y-6">
          {/* Public Hostname */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">
              PUBLIC HOSTNAME
            </Label>
            <Input
              type="text"
              value={state.publicHostname}
              onChange={(e) => handleUpdate('publicHostname', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Protocol Sections */}
          <div className="space-y-4">
            {/* SMTP */}
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-20">
                SMTP
              </Label>
              <Input
                type="text"
                value={state.smtpHostname}
                onChange={(e) => handleUpdate('smtpHostname', e.target.value)}
                className="flex-1"
              />
              <Select value={state.smtpStandard} onValueChange={(value) => handleUpdate('smtpStandard', value)}>
                <SelectTrigger className="w-48 border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="TLS / SSL">TLS / SSL</SelectItem>
                  <SelectItem value="2nd basic port (no SSL)">
                    2nd basic port (no SSL)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* POP3 */}
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-20">
                POP3
              </Label>
              <Input
                type="text"
                value={state.pop3Hostname}
                onChange={(e) => handleUpdate('pop3Hostname', e.target.value)}
                className="flex-1"
              />
              <Select value={state.pop3Standard} onValueChange={(value) => handleUpdate('pop3Standard', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="TLS / SSL">TLS / SSL</SelectItem>
                  <SelectItem value="2nd basic port (no SSL)">
                    2nd basic port (no SSL)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* IMAP */}
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-20">
                IMAP
              </Label>
              <Input
                type="text"
                value={state.imapHostname}
                onChange={(e) => handleUpdate('imapHostname', e.target.value)}
                className="flex-1"
              />
              <Select value={state.imapStandard} onValueChange={(value) => handleUpdate('imapStandard', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="TLS / SSL">TLS / SSL</SelectItem>
                  <SelectItem value="2nd basic port (no SSL)">
                    2nd basic port (no SSL)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* XMPP */}
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-20">
                XMPP
              </Label>
              <Input
                type="text"
                value={state.xmppHostname}
                onChange={(e) => handleUpdate('xmppHostname', e.target.value)}
                className="flex-1"
              />
              <Select value={state.xmppStandard} onValueChange={(value) => handleUpdate('xmppStandard', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="TLS / SSL">TLS / SSL</SelectItem>
                  <SelectItem value="2nd basic port (no SSL)">
                    2nd basic port (no SSL)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SIP */}
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-20">
                SIP
              </Label>
              <Input
                type="text"
                value={state.sipHostname}
                onChange={(e) => handleUpdate('sipHostname', e.target.value)}
                className="flex-1"
              />
              <Select value={state.sipStandard} onValueChange={(value) => handleUpdate('sipStandard', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="TLS / SSL">TLS / SSL</SelectItem>
                  <SelectItem value="2nd basic port (no SSL)">
                    2nd basic port (no SSL)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Service URLs */}
          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                MOBILESYNC (ACTIVESYNC)
              </Label>
              <Input
                type="text"
                value={state.mobilesyncUrl}
                onChange={(e) => handleUpdate('mobilesyncUrl', e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                WEBDAV & SMARTATTACH
              </Label>
              <Input
                type="text"
                value={state.webdavUrl}
                onChange={(e) => handleUpdate('webdavUrl', e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                WEBCLIENT
              </Label>
              <Input
                type="text"
                value={state.webclientUrl}
                onChange={(e) => handleUpdate('webclientUrl', e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                WEBADMIN
              </Label>
              <Input
                type="text"
                value={state.webadminUrl}
                onChange={(e) => handleUpdate('webadminUrl', e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                FREE / BUSY
              </Label>
              <Input
                type="text"
                value={state.freebusyUrl}
                onChange={(e) => handleUpdate('freebusyUrl', e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                INTERNET CALENDAR
              </Label>
              <Input
                type="text"
                value={state.internetCalendarUrl}
                onChange={(e) => handleUpdate('internetCalendarUrl', e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                SMS
              </Label>
              <Input
                type="text"
                value={state.smsUrl}
                onChange={(e) => handleUpdate('smsUrl', e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                ANTI-SPAM REPORTS
              </Label>
              <Input
                type="text"
                value={state.antiSpamReportsUrl}
                onChange={(e) => handleUpdate('antiSpamReportsUrl', e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                INSTALL
              </Label>
              <Input
                type="text"
                value={state.installUrl}
                onChange={(e) => handleUpdate('installUrl', e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                TEAMCHAT
              </Label>
              <Input
                type="text"
                value={state.teamchatUrl}
                onChange={(e) => handleUpdate('teamchatUrl', e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                COLLABORATION API URL
              </Label>
              <Input
                type="text"
                value={state.collaborationApiUrl}
                onChange={(e) => handleUpdate('collaborationApiUrl', e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-foreground w-48">
                CONFERENCE URL
              </Label>
              <Input
                type="text"
                value={state.conferenceUrl}
                onChange={(e) => handleUpdate('conferenceUrl', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
