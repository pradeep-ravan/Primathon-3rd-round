'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { X, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { useDomainDKIMMutations, useCheckDKIMSetup, useGetDKIM } from '@/hooks/useDomains';
import { DKIMCreationResponse } from '@/types/domain';
import toast from 'react-hot-toast';

interface DKIMWizardProps {
  domainId: string;
  domainName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DKIMWizard({
  domainId,
  domainName,
  isOpen,
  onClose,
  onSuccess,
}: DKIMWizardProps) {
  const [step, setStep] = useState(1);
  const [selector, setSelector] = useState('');
  const [dkimData, setDkimData] = useState<DKIMCreationResponse | null>(null);
  const [active, setActive] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { generateKeys, updateActive, resetDKIM } = useDomainDKIMMutations();

  // Check if DKIM is setup when modal opens
  const { data: setupCheck, isLoading: isLoadingSetup } = useCheckDKIMSetup(
    domainId,
    isOpen
  );

  // Get DKIM data if setup is true
  const { data: dkimGetData, isLoading: isLoadingDKIM } = useGetDKIM(
    domainId,
    isOpen && setupCheck?.setup === true
  );

  // Load DKIM data when available
  useEffect(() => {
    if (!isOpen) {
      // Reset when modal closes
      setStep(1);
      setSelector('');
      setDkimData(null);
      setActive(true);
      setCopiedField(null);
      return;
    }

    if (isOpen && setupCheck?.setup === true && dkimGetData) {
      // Convert DKIMGetResponse to DKIMCreationResponse format
      setDkimData({
        active: dkimGetData.active,
        hostname: dkimGetData.hostname,
        selector_record: dkimGetData.selector_record,
      });
      setActive(dkimGetData.active);
      setSelector(dkimGetData.selector);
      setStep(2); // Go directly to step 2 if DKIM is setup
    } else if (isOpen && !isLoadingSetup && setupCheck?.setup === false) {
      // Reset to step 1 if DKIM is not setup
      setStep(1);
      setSelector('');
      setDkimData(null);
      setActive(true);
    }
  }, [isOpen, setupCheck, dkimGetData, isLoadingSetup]);

  const handleGenerateKey = async () => {
    if (!selector.trim()) {
      toast.error('Please enter a selector', {
        duration: 3000,
      });
      return;
    }

    try {
      const response = await generateKeys.mutateAsync({
        id: domainId,
        selector: selector.trim(),
      });

      setDkimData(response);
      setActive(response.active);
      setStep(2);
      
      toast.success('DKIM keys generated successfully', {
        duration: 4000,
      });
    } catch (error) {
      toast.error('Failed to generate DKIM keys', {
        duration: 4000,
      });
    }
  };

  const handleCopyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('Copied to clipboard', {
        duration: 2000,
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard', {
        duration: 3000,
      });
    }
  };

  const handleSave = async () => {
    if (!dkimData) return;

    try {
      await updateActive.mutateAsync({
        id: domainId,
        active,
      });

      toast.success('DKIM settings saved successfully', {
        duration: 4000,
      });

      onSuccess?.();
      handleCancel();
    } catch (error) {
      toast.error('Failed to save DKIM settings', {
        duration: 4000,
      });
    }
  };

  const handleReset = async () => {
    try {
      await resetDKIM.mutateAsync(domainId);

      toast.success('DKIM settings reset successfully', {
        duration: 4000,
      });

      // Reset local state
      setStep(1);
      setSelector('');
      setDkimData(null);
      setActive(true);
      setCopiedField(null);

      // Close modal after reset
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Failed to reset DKIM settings', {
        duration: 4000,
      });
    }
  };

  const handleCancel = () => {
    setStep(1);
    setSelector('');
    setDkimData(null);
    setActive(true);
    setCopiedField(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Container with proper spacing */}
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        {/* Modal */}
        <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[calc(100vh-9rem)] overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h2 className="text-xl font-semibold text-primary">DKIM</h2>
          <button
            onClick={handleCancel}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="h-5 w-5 cursor-pointer" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <h1 className="text-3xl font-bold text-foreground mb-4">DKIM WIZARD</h1>
          
          {/* Loading State */}
          {isLoadingSetup && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoadingSetup && (
            <>
              <p className="text-muted-foreground mb-6">
                DKIM is used by remote servers for verification that emails sent from this domain are not spoofed. 
                In order to use DKIM, DNS TXT record &lt;Selector&gt;._domainkey.&lt;domainname&gt; has to be created.
              </p>

              {/* Progress Indicator */}
              <div className="flex items-center gap-4 mb-8">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${
                step >= 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              1
            </div>
            <div className="flex-1 h-0.5 bg-muted" />
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm ${
                step >= 2
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              2
            </div>
          </div>

          {/* Step 1: Selector Input */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Domain key selector
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Any text, if you set DKIM for this domain on multiple servers, each server has to have unique selector.
                </p>
                <Label htmlFor="selector" className="text-sm font-medium text-foreground">
                  SELECTOR
                </Label>
                <Input
                  id="selector"
                  value={selector}
                  onChange={(e) => setSelector(e.target.value)}
                  placeholder="Unique arbitrary string"
                  className="mt-1 bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Step 2: Selector Record Configuration */}
          {step === 2 && dkimData && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="h-5 w-5" />
                <p className="text-sm text-muted-foreground">
                  Configure your DNS server with the public key. You need to add the following entry into your DNS server for e.g. icecream._domainkey.www.icewarp.com.
                </p>
              </div>

              {/* Selector Record Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Selector record
                </h3>

                {/* Hostname Input */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hostname" className="text-sm font-medium text-foreground">
                      HOSTNAME
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(dkimData.hostname, 'hostname')}
                      className="bg-muted hover:bg-muted/80 text-foreground border-border whitespace-nowrap"
                    >
                      {copiedField === 'hostname' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          COPY TO CLIPBOARD
                        </>
                      )}
                    </Button>
                  </div>
                  <Input
                    id="hostname"
                    value={dkimData.hostname}
                    readOnly
                    className="bg-muted border-border text-foreground rounded-lg w-full"
                  />
                </div>

                {/* Selector Record Textarea */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="selector_record" className="text-sm font-medium text-foreground">
                      SELECTOR RECORD
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyToClipboard(dkimData.selector_record, 'selector_record')}
                      className="bg-muted hover:bg-muted/80 text-foreground border-border whitespace-nowrap"
                    >
                      {copiedField === 'selector_record' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          COPY TO CLIPBOARD
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="selector_record"
                    value={dkimData.selector_record}
                    readOnly
                    rows={6}
                    className="bg-muted border-border text-foreground rounded-lg font-mono text-sm w-full"
                  />
                </div>

                {/* Sign Outgoing Mails Toggle */}
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                  <Switch
                    checked={active}
                    onCheckedChange={setActive}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label htmlFor="sign-outgoing" className="text-sm font-medium text-foreground cursor-pointer">
                    SIGN OUTGOING MAILS WITH DKIM
                  </Label>
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/50 flex-shrink-0">
          {step === 1 && (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="bg-muted hover:bg-muted/80 text-foreground border-border"
              >
                CANCEL
              </Button>
              <Button
                onClick={handleGenerateKey}
                disabled={generateKeys.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {generateKeys.isPending ? 'Generating...' : 'GENERATE NEW KEY'}
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={resetDKIM.isPending}
                className="bg-muted hover:bg-muted/80 text-foreground border-border"
              >
                {resetDKIM.isPending ? 'Resetting...' : 'RESET DKIM SETTINGS'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateActive.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {updateActive.isPending ? 'Saving...' : 'SAVE'}
              </Button>
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
