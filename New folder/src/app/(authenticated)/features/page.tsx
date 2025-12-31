'use client';

import React, { useMemo, useState } from 'react';
import Image, { StaticImageData } from 'next/image';

import { PageHeader } from '@/components/ui/layout/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

// Static assets (Next.js optimizes these at build time)
import filesModernImg from '@/assets/modern_features_files_documents.jpg';
import filesLegacyImg from '@/assets/features_files_documents_legacy.jpg';
import notesModernImg from '@/assets/features_notes_modern.jpg';
import notesLegacyImg from '@/assets/features_notes_legacy.jpg';

type FeatureToggleKey =
  | 'contacts'
  | 'calendars'
  | 'files'
  | 'notes'
  | 'tasks'
  | 'quarantine'
  | 'marketplace';

export default function FeaturesPage() {
  const [featureToggles, setFeatureToggles] = useState<
    Record<FeatureToggleKey, boolean>
  >({
    contacts: true,
    calendars: true,
    files: true,
    notes: true,
    tasks: true,
    quarantine: true,
    marketplace: true,
  });

  const [filesMode, setFilesMode] = useState<'modern' | 'legacy'>('legacy');
  const [notesMode, setNotesMode] = useState<'modern' | 'legacy'>('modern');

  const availableFeatures = useMemo(
    () =>
      [
        { key: 'contacts', label: 'Contacts' },
        { key: 'calendars', label: 'Calendars' },
        { key: 'files', label: 'Files & Documents' },
        { key: 'notes', label: 'Notes' },
        { key: 'tasks', label: 'Tasks' },
        { key: 'quarantine', label: 'Quarantine' },
        { key: 'marketplace', label: 'Marketplace' },
      ] as Array<{ key: FeatureToggleKey; label: string }>,
    []
  );

  const onSave = () => {
    // Placeholder: integrate with API when available
    // Keeping UI responsive and themed; no network call yet.
    console.log({ featureToggles, filesMode, notesMode });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Features"
        subtitle="Choose between the redesigned Files & Documents or Notes with a modern interface and secure cloud-based processing, or the legacy version with a classic look and fully local data handling."
        onSave={onSave}
        saveButtonText="Save"
      />

      {/* Available Features */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Available Features</CardTitle>
          <CardDescription>
            Here is a list of features available to all your end users in the
            WebClient. You can choose which features to activate or deactivate
            based on your needs.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableFeatures.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border gradient-card bg-card/90 p-4"
            >
              <span className="font-semibold text-foreground tracking-tight">
                {label}
              </span>
              <Switch
                checked={featureToggles[key]}
                onCheckedChange={(checked) =>
                  setFeatureToggles((prev) => ({ ...prev, [key]: checked }))
                }
                aria-label={`${label} toggle`}
                className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-muted/30"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modern vs Legacy selections */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Features</CardTitle>
          <CardDescription>
            Choose between Modern and Legacy experiences for specific modules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Files & Documents */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold">Files & Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureChoiceCard
                title="Modern"
                description="Redesigned UI, enhanced performance, cloud-ready"
                selected={filesMode === 'modern'}
                onSelect={() => setFilesMode('modern')}
                imageSrc={filesModernImg}
              />
              <FeatureChoiceCard
                title="Legacy"
                description="Classic UI with local-only handling"
                selected={filesMode === 'legacy'}
                onSelect={() => setFilesMode('legacy')}
                imageSrc={filesLegacyImg}
              />
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold">Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureChoiceCard
                title="Modern"
                description="Fresh editor, better collaboration"
                selected={notesMode === 'modern'}
                onSelect={() => setNotesMode('modern')}
                imageSrc={notesModernImg}
              />
              <FeatureChoiceCard
                title="Legacy"
                description="Stable classic editor"
                selected={notesMode === 'legacy'}
                onSelect={() => setNotesMode('legacy')}
                imageSrc={notesLegacyImg}
              />
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              onClick={onSave}
              className="px-6 bg-green-600 hover:bg-green-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ChoiceProps {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  imageSrc: StaticImageData; // Next.js static import type
}

function FeatureChoiceCard({
  title,
  description,
  selected,
  onSelect,
  imageSrc,
}: ChoiceProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full text-left rounded-xl border gradient-card bg-card/90 overflow-hidden shadow-md transition-all duration-200 backdrop-blur-sm ${
        selected
          ? 'ring-2 ring-primary border-primary/50 shadow-primary/30'
          : 'hover:border-primary/40 hover:shadow-lg'
      }`}
    >
      <div className="relative w-full h-48">
        <Image
          src={imageSrc}
          alt={`${title} preview`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {selected && (
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20" />
        )}
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                selected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-input border-border'
              }`}
            >
              {selected && (
                <span className="block h-2.5 w-2.5 rounded-full bg-primary-foreground" />
              )}
            </span>
            <span className="font-semibold tracking-tight">{title}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          variant={selected ? 'default' : 'outline'}
          className="px-4"
          onClick={onSelect}
        >
          {selected ? 'Selected' : 'Choose'}
        </Button>
      </div>
    </button>
  );
}
