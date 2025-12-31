'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

interface FeaturesModalProps {
  domainId: string;
  domainName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

type TabType = 'features' | 'system-options';

interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
  enabled: boolean;
}

export function FeaturesModal({
  domainId,
  domainName,
  isOpen,
  onClose,
  onSave,
}: FeaturesModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('features');
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 'conferences',
      title: 'Conferences',
      description: 'Secure Conferences support up to 200 participants and run in the browser without installing anything.',
      category: '',
      enabled: true,
    },
    {
      id: 'recording',
      title: 'Recording',
      description: 'Record your conference calls and share the captured videos with colleagues who couldn\'t make it.',
      category: '',
      enabled: false,
    },
    {
      id: 'activesync',
      title: 'ActiveSync',
      description: 'Mobile synchronization of personal and public/group data including emails, contacts, calendars, tasks or notes. Exchange ActiveSync is the gold standard, supported by nearly every mobile platform including iOS and Android.',
      category: '',
      enabled: true,
    },
    {
      id: 'desktop-client',
      title: 'Desktop Client',
      description: 'Complete desktop suite for Windows and MacOS. You won\'t need any additional 3rd party tools. Users can easily work with email, calendar, contacts, chat and conferences in one application.',
      category: '',
      enabled: true,
    },
  ]);

  const [systemOptions, setSystemOptions] = useState<Feature[]>([
    // Email
    {
      id: 'archive',
      title: 'Archive',
      description: 'Archiving saves all incoming and outgoing email and text messages and provides users read-only access to the Archive folder to restore lost messages.',
      category: 'Email',
      enabled: false,
    },
    // Security
    {
      id: 'anti-spam',
      title: 'Anti-Spam',
      description: 'Select whether this user will receive spam reports, will receive reports as set in Anti-Spam - Action - Reports, reports with new spam items listed or reports with all spam items listed. Also select whether a spam folder is to be used.',
      category: 'Security',
      enabled: false,
    },
    {
      id: 'anti-virus',
      title: 'Anti-Virus',
      description: 'Enterprise Anti-Virus scans and validates every file going in or out of the account, be it email, calendar attachments, documents and file transfers.',
      category: 'Security',
      enabled: false,
    },
    {
      id: 'quarantine',
      title: 'Quarantine',
      description: 'Quarantine allows you to place suspect incoming messages in a pending queue awaiting manual authorization by administrators or users themselves.',
      category: 'Security',
      enabled: false,
    },
    // Messaging
    {
      id: 'instant-messaging',
      title: 'Instant Messaging',
      description: 'Real-time messaging or Chat enables instant communication among users, lets them share files and see each other\'s presence in the contact roster.',
      category: 'Messaging',
      enabled: false,
    },
    {
      id: 'text-messaging',
      title: 'Text Messaging',
      description: 'Built-in text messaging (SMS) lets users send text messages from WebClient, reply to received messages and manage them as emails in the Inbox.',
      category: 'Messaging',
      enabled: false,
    },
    {
      id: 'teamchat',
      title: 'TeamChat',
      description: 'TeamChat is a modern collaboration tool for teams & projects. It lets you get in touch with other people on the team, organize your conversations around one topic, share files or create ad-hoc meetings.',
      category: 'Messaging',
      enabled: true,
    },
    // Storage
    {
      id: 'file-transfer',
      title: 'File Transfer (FTP)',
      description: 'FTP lets users transfer large files to a dedicated storage on the server. Using a standard FTP client, users can browse, manage, upload or download files.',
      category: 'Storage',
      enabled: false,
    },
    // WebDocuments
    {
      id: 'webdocuments',
      title: 'WebDocuments',
      description: 'Online editors of Microsoft Office and OpenOffice file formats. Create documents with beautiful formatting, stunning presentations, spreadsheets with formulas, all without leaving the WebClient.',
      category: 'WebDocuments',
      enabled: true,
    },
  ]);

  const handleToggleFeature = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === featureId
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  const handleToggleSystemOption = (optionId: string) => {
    setSystemOptions((prev) =>
      prev.map((option) =>
        option.id === optionId
          ? { ...option, enabled: !option.enabled }
          : option
      )
    );
  };

  const handleSave = () => {
    // TODO: Integrate API when available
    console.log('Saving features:', features);
    console.log('Saving system options:', systemOptions);
    onSave?.();
    onClose();
  };

  // Group system options by category
  const groupedSystemOptions = systemOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, Feature[]>);

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        {/* Modal */}
        <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[calc(100vh-9rem)] overflow-hidden">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0 bg-primary/10">
            <h2 className="text-2xl font-bold text-primary">FEATURES</h2>
            <button
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="h-5 w-5 cursor-pointer" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Left Navigation */}
            <div className="w-48 border-r border-border bg-muted/30 flex-shrink-0">
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('features')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'features'
                      ? 'bg-background text-foreground font-semibold border-l-4 border-primary'
                      : 'text-primary hover:bg-muted/50'
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => setActiveTab('system-options')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'system-options'
                      ? 'bg-background text-foreground font-semibold border-l-4 border-primary'
                      : 'text-primary hover:bg-muted/50'
                  }`}
                >
                  System options
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'features' && (
                <div className="space-y-4">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-background border border-border rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground mb-2">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 pt-1">
                          <Switch
                            checked={feature.enabled}
                            onCheckedChange={() => handleToggleFeature(feature.id)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'system-options' && (
                <div className="space-y-8">
                  {Object.entries(groupedSystemOptions).map(([category, categoryOptions]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">
                        {category}
                      </h3>
                      <div className="space-y-4">
                        {categoryOptions.map((option) => (
                          <div
                            key={option.id}
                            className="bg-background border border-border rounded-lg p-5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-foreground mb-2">
                                  {option.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {option.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0 pt-1">
                                <Switch
                                  checked={option.enabled}
                                  onCheckedChange={() => handleToggleSystemOption(option.id)}
                                  className="data-[state=checked]:bg-primary"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-muted/50 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-muted hover:bg-muted/80 text-foreground border-border"
            >
              CANCEL
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              SAVE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

