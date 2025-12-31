'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RuleEditor } from '@/components/content-rules/RuleEditor';
import { ContentRule } from '@/components/content-rules/types';
import { rulesStore } from '@/components/content-rules/store';

export default function EditContentRulePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  // Decode the ID in case of special chars, though unlikely for IDs
  const id = params.id; 
  const rule = rulesStore.getById(id);

  const handleSave = (updatedRule: ContentRule) => {
    rulesStore.update(updatedRule);
    router.push('/content-rules');
  };

  if (!rule) {
      return <div>Rule not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <RuleEditor
        rule={rule}
        onSave={handleSave}
        onCancel={() => router.push('/content-rules')}
      />
    </div>
  );
}
