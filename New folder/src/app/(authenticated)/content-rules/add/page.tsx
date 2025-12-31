'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RuleEditor } from '@/components/content-rules/RuleEditor';
import { ContentRule } from '@/components/content-rules/types';
import { rulesStore } from '@/components/content-rules/store';

export default function AddContentRulePage() {
  const router = useRouter();

  const handleSave = (rule: ContentRule) => {
    rulesStore.add(rule);
    router.push('/content-rules');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <RuleEditor
        onSave={handleSave}
        onCancel={() => router.push('/content-rules')}
      />
    </div>
  );
}
