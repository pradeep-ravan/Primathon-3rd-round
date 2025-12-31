import { ContentRule } from './types';

// Initial mock data
let rules: ContentRule[] = [
  {
    id: '1',
    title: 'Block Spam Messages',
    conditions: [{ id: 'is-spam', label: 'Where message is spam' }],
    actions: [
      {
        id: 'moderation',
        label: 'Accept / Reject / Delete / Spam / Quarantine',
      },
    ],
    enabled: true,
  },
  {
    id: '2',
    title: 'Forward Important Emails',
    conditions: [
      { id: 'from-header', label: 'Where From: Message header matches' },
    ],
    actions: [{ id: 'forward-email', label: 'Forward to email' }],
    enabled: false,
  },
];

export const rulesStore = {
  getAll: () => [...rules],
  getById: (id: string) => rules.find((r) => r.id === id),
  add: (rule: ContentRule) => {
    rules = [...rules, rule];
  },
  update: (rule: ContentRule) => {
    rules = rules.map((r) => (r.id === rule.id ? rule : r));
  },
  delete: (id: string) => {
    rules = rules.filter((r) => r.id !== id);
  },
  toggleEnabled: (id: string) => {
    rules = rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
  }
};
