'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RuleList } from '@/components/content-rules/RuleList';
import { ContentRule } from '@/components/content-rules/types';
import { rulesStore } from '@/components/content-rules/store';

export default function ContentRulesPage() {
  const router = useRouter();
  // Initialize with store data. 
  // Note: In a real app with SSR info, this might differ, but for this mock sync store, it works.
  const [rules, setRules] = useState<ContentRule[]>(rulesStore.getAll());

  // Refresh rules when the component mounts or takes focus (simplistic approach for now)
  useEffect(() => {
    setRules(rulesStore.getAll());
  }, []);

  const handleAddRule = () => {
    router.push('/content-rules/add');
  };

  const handleEditRule = (rule: ContentRule) => {
    router.push(`/content-rules/edit/${rule.id}`);
  };

  const handleDeleteRule = (id: string) => {
    rulesStore.delete(id);
    setRules(rulesStore.getAll());
  };

  const handleToggleEnabled = (id: string) => {
    rulesStore.toggleEnabled(id);
    setRules(rulesStore.getAll());
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <RuleList
        rules={rules}
        onAddRule={handleAddRule}
        onEditRule={handleEditRule}
        onDeleteRule={handleDeleteRule}
        onToggleEnabled={handleToggleEnabled}
      />
    </div>
  );
}
