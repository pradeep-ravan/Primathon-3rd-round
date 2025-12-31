import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
    ChevronLeft, 
    Save, 
    Plus, 
    X, 
    Trash2,
    ChevronUp, 
    ChevronDown
} from 'lucide-react';
import { TopTabs } from '@/components/ui/layout/TopTabs';
import { 
    ContentRule, 
    RuleItem, 
    ConditionConfig, 
    ActionConfig, 
    HeaderConfig 
} from './types';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';


interface RuleEditorProps {
  rule?: ContentRule;
  onSave: (rule: ContentRule) => void;
  onCancel: () => void;
}

export const RuleEditor: React.FC<RuleEditorProps> = ({ rule, onSave, onCancel }) => {
  // --- STATE ---
  const [title, setTitle] = useState(rule?.title || '');
  const [selectedConditions, setSelectedConditions] = useState<RuleItem[]>(rule?.conditions || []);
  const [selectedActions, setSelectedActions] = useState<RuleItem[]>(rule?.actions || []);
  
  // Config state
  const [conditionConfigs, setConditionConfigs] = useState<Record<string, ConditionConfig>>({});
  const [actionConfigs, setActionConfigs] = useState<Record<string, ActionConfig>>({});

  // Tabs
  const [activeConditionTab, setActiveConditionTab] = useState('basic');
  const [activeActionTab, setActiveActionTab] = useState('standard');

  // Logic State (Operators)
  const [firstConditionNot, setFirstConditionNot] = useState(false);
  const [conditionOperators, setConditionOperators] = useState<Record<string, string>>({});
  const [openOperatorDropdown, setOpenOperatorDropdown] = useState<string | null>(null);

  // Expansion State
  const [expandedConditions, setExpandedConditions] = useState<Set<string>>(new Set());
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());

  // Header Config State
  const [isHeaderListOpen, setIsHeaderListOpen] = useState(false);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [isHeaderConfigOpen, setIsHeaderConfigOpen] = useState(false);
  const [currentHeader, setCurrentHeader] = useState<HeaderConfig | null>(null);

  // --- CONSTANTS ---
  const basicConditions: RuleItem[] = [
      { id: 'all', label: 'All messages' },
      { id: 'from-header', label: 'Where From: Message header matches' },
      { id: 'subject-header', label: 'Where subject: Message header matches' },
      { id: 'body-matches', label: 'Where message body matches' },
      { id: 'has-attachment', label: 'Where message contains attachment' },
      { id: 'attachment-name', label: 'Where attachment name matches' },
      { id: 'priority', label: 'Where message priority is' },
      { id: 'size', label: 'Where message size is' },
      { id: 'is-spam', label: 'Where message is spam' },
  ];
  
  const headerConditions: RuleItem[] = [
      { id: 'to-header', label: 'Where To: Message header matches' },
      { id: 'cc-header', label: 'Where Cc: Message header matches' },
      { id: 'replyto-header', label: 'Where Reply To: Message header matches' },
      { id: 'date-header', label: 'Where date: Message header matches' },
      { id: 'custom-header', label: 'Where custom message header matches' },
      { id: 'any-header', label: 'Where any message header matches' },
      { id: 'direct-to-user', label: 'Message sent directly to user' },
  ];

  const advancedConditions: RuleItem[] = [
      { id: 'sender-matches', label: 'Where sender matches' },
      { id: 'recipient-matches', label: 'Where recipient matches' },
      { id: 'local-remote', label: 'Where sender / recipient is local / remote' },
      { id: 'spam-score', label: 'Where spam score is' },
      { id: 'local-time', label: 'Where local time meets' },
      { id: 'rdns', label: 'Where RDNS matches' },
      { id: 'sender-ip', label: "Where sender's IP address matches" },
      { id: 'dnsbl', label: "Where sender's IP address is listed on DNSBL" },
      { id: 'trusted-session', label: 'Where session is trusted' },
      { id: 'smtp-auth', label: 'Where SMTP AUTH' },
  ];

  const standardActions: RuleItem[] = [
      { id: 'moderation', label: 'Accept / Reject / Delete / Spam / Quarantine' },
      { id: 'forward-email', label: 'Forward to email' },
      { id: 'copy-folder', label: 'Copy to folder' },
      { id: 'move-folder', label: 'Move to folder' },
      { id: 'encrypt', label: 'Encrypt message' },
  ];

  const extraActions: RuleItem[] = [
      { id: 'send-new', label: 'Send new message' },
      { id: 'edit-header', label: 'Edit message header' },
      { id: 'set-priority', label: 'Set message priority to' },
      { id: 'set-flags', label: 'Set message flags to' },
      { id: 'stop-processing', label: 'Stop processing more rules' },
  ];

  // --- HANDLERS ---
  
  // Click outside to close operator dropdown
  useEffect(() => {
    const handleClickOutside = () => setOpenOperatorDropdown(null);
    if (openOperatorDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openOperatorDropdown]);

  const handleSave = () => {
    onSave({
      id: rule?.id || Date.now().toString(),
      title: title || 'Untitled Rule',
      conditions: selectedConditions,
      actions: selectedActions,
      enabled: true,
    });
  };

  const addCondition = (item: RuleItem) => {
    if (!selectedConditions.find(c => c.id === item.id)) {
        setSelectedConditions([...selectedConditions, item]);
        // Auto-collapse others: Set expanded conditions to ONLY this new item ID
        setExpandedConditions(new Set([item.id])); 
        if (!conditionConfigs[item.id]) {
            setConditionConfigs(prev => ({
                ...prev,
                [item.id]: {
                  id: item.id,
                  function: 'Contains a value from a list (semi-colon separated)',
                  stringValue: '',
                  matchCase: false,
                  wholeWord: false,
                  parseXml: false,
                  messagePriority: item.id === 'priority' ? 'Highest' : undefined,
                  messageSize: item.id === 'size' ? 'Lower' : undefined,
                  sizeValue: item.id === 'size' ? '' : undefined,
                  sizeUnit: item.id === 'size' ? 'kB' : undefined,
                  userOnlyRecipient: item.id === 'direct-to-user' ? false : undefined,
                  checkUserInToHeader: item.id === 'direct-to-user' ? true : undefined,
                  senderRecipient: item.id === 'local-remote' ? 'SENDER' : undefined,
                  localRemote: item.id === 'local-remote' ? 'LOCAL' : undefined,
                  ignoreUserExists: item.id === 'local-remote' ? 'IGNORE' : undefined,
                  memberOf: item.id === 'local-remote' ? '' : undefined,
                  scoreComparison: item.id === 'spam-score' ? 'Lower' : undefined,
                  scoreValue: item.id === 'spam-score' ? '' : undefined,
                  dnslServer: item.id === 'dnsbl' ? '' : undefined,
                  regex: item.id === 'dnsbl' ? '' : undefined,
                  weekdays: item.id === 'local-time' ? false : undefined,
                  selectedWeekdays: item.id === 'local-time' ? [] : undefined,
                  betweenTimes: item.id === 'local-time' ? false : undefined,
                  startTime: item.id === 'local-time' ? '' : undefined,
                  endTime: item.id === 'local-time' ? '' : undefined,
                  betweenDates: item.id === 'local-time' ? false : undefined,
                  startDate: item.id === 'local-time' ? '' : undefined,
                  endDate: item.id === 'local-time' ? '' : undefined,
                }
            }));
        }
    }
  };

  const removeCondition = (id: string) => {
    setSelectedConditions(prev => prev.filter(c => c.id !== id));
    setExpandedConditions(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
    });
  };

  const toggleConditionExpanded = (id: string) => {
      setExpandedConditions(prev => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
      });
  };

  const updateConditionConfig = (id: string, config: Partial<ConditionConfig>) => {
    setConditionConfigs(prev => ({
        ...prev,
        [id]: { ...prev[id], ...config }
    }));
  };

  const addAction = (item: RuleItem) => {
    if (!selectedActions.find(a => a.id === item.id)) {
        setSelectedActions([...selectedActions, item]);
        // Auto-collapse others
        setExpandedActions(new Set([item.id]));
        if (!actionConfigs[item.id]) {
            setActionConfigs(prev => ({
                ...prev,
                [item.id]: {
                    action: 'accept',
                    messagePriority: 'normal',
                    forwardAsAttachment: false,
                    headers: [],
                }
            }));
        }
    }
  };
  
  const removeAction = (id: string) => {
    setSelectedActions(prev => prev.filter(a => a.id !== id));
     setExpandedActions(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
    });
  };

  const toggleActionExpanded = (id: string) => {
      setExpandedActions(prev => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
      });
  };

  const updateActionConfig = (id: string, config: Partial<ActionConfig>) => {
    setActionConfigs(prev => ({
        ...prev,
        [id]: { ...prev[id], ...config }
    }));
  };

  // Header Logic
  const openHeaderList = (actionId: string) => {
      setEditingActionId(actionId);
      setIsHeaderListOpen(true);
  };
  const openHeaderConfig = (header?: HeaderConfig) => {
      setCurrentHeader(header || { id: Date.now().toString(), action: 'Add', header: '', value: '' });
      setIsHeaderConfigOpen(true);
  };
  const saveHeader = () => {
      if (!editingActionId || !currentHeader) return;
      const currentConfig = actionConfigs[editingActionId] || {};
      const currentHeaders = currentConfig.headers || [];
      const exists = currentHeaders.find(h => h.id === currentHeader.id);
      let newHeaders = exists ? currentHeaders.map(h => h.id === currentHeader.id ? currentHeader : h) : [...currentHeaders, currentHeader];
      updateActionConfig(editingActionId, { headers: newHeaders });
      setIsHeaderConfigOpen(false);
  };
  const deleteHeader = (headerId: string) => {
      if (!editingActionId) return;
      const currentHeaders = actionConfigs[editingActionId]?.headers || [];
      updateActionConfig(editingActionId, { headers: currentHeaders.filter(h => h.id !== headerId) });
  };


  // --- RENDERERS ---

  const renderConditionConfig = (condition: RuleItem) => {
    const config = conditionConfigs[condition.id] || {};
    
    // No config conditions
    if (['all', 'has-attachment', 'is-spam', 'trusted-session', 'smtp-auth'].includes(condition.id)) {
        return <div className="text-sm text-muted-foreground italic">No additional configuration required.</div>;
    }

    if (condition.id === 'priority') {
      return (
        <div className="space-y-1 pt-2">
            <Label className="text-xs text-muted-foreground">MESSAGE PRIORITY</Label>
            <Select value={config.messagePriority} onValueChange={(v) => updateConditionConfig(condition.id, { messagePriority: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                    {['Highest', 'High', 'Normal', 'Low', 'Lowest'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
      )
    }

    if (condition.id === 'size') {
        return (
            <div className="space-y-3 pt-2">
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">MESSAGE SIZE</Label>
                        <Select value={config.messageSize} onValueChange={(v) => updateConditionConfig(condition.id, { messageSize: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Lower">Lower</SelectItem><SelectItem value="Greater">Greater</SelectItem></SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">THAN</Label>
                        <div className="flex gap-2">
                             <Input placeholder="Size" value={config.sizeValue} onChange={(e) => updateConditionConfig(condition.id, { sizeValue: e.target.value })} className="flex-1" />
                             <Select value={config.sizeUnit || 'kB'} onValueChange={(v) => updateConditionConfig(condition.id, { sizeUnit: v })}>
                                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="kB">kB</SelectItem><SelectItem value="MB">MB</SelectItem><SelectItem value="GB">GB</SelectItem></SelectContent>
                            </Select>
                        </div>
                     </div>
                 </div>
            </div>
        )
    }

    if (condition.id === 'direct-to-user') {
        return (
            <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id={`only-rec-${condition.id}`} checked={config.userOnlyRecipient} onCheckedChange={(c) => updateConditionConfig(condition.id, { userOnlyRecipient: !!c })} />
                    <Label htmlFor={`only-rec-${condition.id}`}>User is the only recipient</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id={`check-to-${condition.id}`} checked={config.checkUserInToHeader} onCheckedChange={(c) => updateConditionConfig(condition.id, { checkUserInToHeader: !!c })} />
                    <Label htmlFor={`check-to-${condition.id}`} className="text-purple-600">Check User in To Header</Label>
                </div>
            </div>
        )
    }

    if (condition.id === 'local-remote') {
        return (
            <div className="space-y-4 pt-2">
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">SENDER / RECIPIENT</Label>
                    <div className="flex gap-4">
                        {['SENDER', 'RECIPIENT'].map(opt => (
                            <div key={opt} className="flex items-center space-x-2">
                                <input type="radio" checked={config.senderRecipient === opt} onChange={() => updateConditionConfig(condition.id, { senderRecipient: opt })} className="accent-purple-600" />
                                <Label>{opt}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex gap-4">
                         {['LOCAL', 'REMOTE'].map(opt => (
                            <div key={opt} className="flex items-center space-x-2">
                                <input type="radio" checked={config.localRemote === opt} onChange={() => updateConditionConfig(condition.id, { localRemote: opt })} className="accent-purple-600" />
                                <Label>{opt}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex gap-4 flex-wrap">
                        {['IGNORE', 'USER EXISTS', "USER DOESN'T EXIST"].map(opt => (
                            <div key={opt} className="flex items-center space-x-2">
                                <input type="radio" checked={config.ignoreUserExists === opt} onChange={() => updateConditionConfig(condition.id, { ignoreUserExists: opt })} className="accent-purple-600" />
                                <Label>{opt}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">MEMBER OF</Label>
                    <Input placeholder="Member of group..." value={config.memberOf} onChange={(e) => updateConditionConfig(condition.id, { memberOf: e.target.value })} />
                </div>
            </div>
        )
    }

    if (condition.id === 'spam-score') {
        return (
             <div className="space-y-3 pt-2">
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">SCORE</Label>
                        <Select value={config.scoreComparison} onValueChange={(v) => updateConditionConfig(condition.id, { scoreComparison: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent><SelectItem value="Lower">Lower</SelectItem><SelectItem value="Greater">Greater</SelectItem></SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">THAN</Label>
                        <Input placeholder="Score value" value={config.scoreValue} onChange={(e) => updateConditionConfig(condition.id, { scoreValue: e.target.value })} />
                     </div>
                 </div>
            </div>
        )
    }

    if (condition.id === 'dnsbl') {
        return (
            <div className="space-y-3 pt-2">
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">DNSBL SERVER</Label>
                    <Input placeholder="Server address" value={config.dnslServer} onChange={(e) => updateConditionConfig(condition.id, { dnslServer: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">REGEX</Label>
                    <Input placeholder="Regex pattern" value={config.regex} onChange={(e) => updateConditionConfig(condition.id, { regex: e.target.value })} />
                </div>
            </div>
        )
    }

    if (condition.id === 'local-time') {
         const days = [ {v:'MO',l:'MO'},{v:'TU',l:'TU'},{v:'WE',l:'WE'},{v:'TH',l:'TH'},{v:'FR',l:'FR'},{v:'SA',l:'SA'},{v:'SU',l:'SU'} ];
         return (
             <div className="space-y-4 pt-2">
                 {/* Weekdays */}
                 <div className="space-y-2">
                     <div className="flex items-center space-x-2">
                         <Switch checked={config.weekdays} onCheckedChange={(c) => updateConditionConfig(condition.id, { weekdays: c })} />
                         <Label>WEEKDAYS</Label>
                     </div>
                     {config.weekdays && (
                         <div className="flex gap-2 flex-wrap ml-12">
                             {days.map(day => (
                                 <div key={day.v} className="flex items-center space-x-1">
                                     <Checkbox checked={config.selectedWeekdays?.includes(day.v)} onCheckedChange={(c) => {
                                         const current = config.selectedWeekdays || [];
                                         const next = c ? [...current, day.v] : current.filter(x => x !== day.v);
                                         updateConditionConfig(condition.id, { selectedWeekdays: next });
                                     }} />
                                     <span className="text-xs">{day.l}</span>
                                 </div>
                             ))}
                         </div>
                     )}
                 </div>
                 {/* Times */}
                 <div className="space-y-2">
                     <div className="flex items-center space-x-2">
                         <Switch checked={config.betweenTimes} onCheckedChange={(c) => updateConditionConfig(condition.id, { betweenTimes: c })} />
                         <Label>BETWEEN TIMES</Label>
                     </div>
                     {config.betweenTimes && (
                         <div className="flex gap-2 ml-12">
                             <Input type="time" value={config.startTime} onChange={(e) => updateConditionConfig(condition.id, { startTime: e.target.value })} className="w-32" />
                             <Input type="time" value={config.endTime} onChange={(e) => updateConditionConfig(condition.id, { endTime: e.target.value })} className="w-32" />
                         </div>
                     )}
                 </div>
                 {/* Dates */}
                 <div className="space-y-2">
                     <div className="flex items-center space-x-2">
                         <Switch checked={config.betweenDates} onCheckedChange={(c) => updateConditionConfig(condition.id, { betweenDates: c })} />
                         <Label>BETWEEN DATES</Label>
                     </div>
                     {config.betweenDates && (
                        <div className="flex gap-2 ml-12">
                             <Input type="date" value={config.startDate} onChange={(e) => updateConditionConfig(condition.id, { startDate: e.target.value })} className="w-40" />
                             <Input type="date" value={config.endDate} onChange={(e) => updateConditionConfig(condition.id, { endDate: e.target.value })} className="w-40" />
                        </div>
                     )}
                 </div>
             </div>
         )
    }

    // Default Matcher
    const functionOptions = [
      'Contains a value from a list (semi-colon separated)',
      'Matches (RegEx)',
      'Starts with',
      'Ends with',
      'Equals',
      'Contains a value from a file or pattern',
    ];

    return (
        <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">FUNCTION</Label>
                    <Select value={config.function} onValueChange={(v) => updateConditionConfig(condition.id, { function: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {functionOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">VALUE</Label>
                    <Input value={config.stringValue} onChange={(e) => updateConditionConfig(condition.id, { stringValue: e.target.value })} placeholder="Value..." />
                 </div>
            </div>
            <div className="flex gap-4">
                 <div className="flex items-center space-x-2">
                    <Checkbox id={`mc-${condition.id}`} checked={config.matchCase} onCheckedChange={(c) => updateConditionConfig(condition.id, { matchCase: !!c})} />
                    <Label htmlFor={`mc-${condition.id}`} className="text-xs">Match Case</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id={`ww-${condition.id}`} checked={config.wholeWord} onCheckedChange={(c) => updateConditionConfig(condition.id, { wholeWord: !!c})} />
                    <Label htmlFor={`ww-${condition.id}`} className="text-xs">Whole Word</Label>
                 </div>
                 {condition.id === 'body-matches' && (
                     <div className="flex items-center space-x-2">
                        <Checkbox id={`px-${condition.id}`} checked={config.parseXml} onCheckedChange={(c) => updateConditionConfig(condition.id, { parseXml: !!c})} />
                        <Label htmlFor={`px-${condition.id}`} className="text-xs text-blue-600">Parse XML</Label>
                     </div>
                 )}
            </div>
        </div>
    );
  };

  const renderActionConfig = (action: RuleItem) => {
    // ... Existing logic is mostly correct, just ensuring fidelity ...
    // Using previous implementation as it matches requirements.
    const config = actionConfigs[action.id] || {};
    switch (action.id) {
        case 'moderation':
            return (
                <RadioGroup value={config.action} onValueChange={(v) => updateActionConfig(action.id, { action: v })} className="flex flex-wrap gap-4 pt-2">
                    {['accept', 'reject', 'delete', 'spam', 'quarantine'].map(opt => (
                        <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`act-${opt}`} />
                            <Label htmlFor={`act-${opt}`} className="capitalize">{opt}</Label>
                        </div>
                    ))}
                </RadioGroup>
            );
        case 'forward-email':
            return (
                <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">EMAIL ADDRESS</Label>
                        <Input placeholder="Email Address" value={config.email} onChange={(e) => updateActionConfig(action.id, { email: e.target.value })} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="fwd-att" checked={config.forwardAsAttachment} onCheckedChange={(c) => updateActionConfig(action.id, { forwardAsAttachment: !!c })} />
                        <Label htmlFor="fwd-att">Forward as attachment</Label>
                    </div>
                </div>
            );
        case 'copy-folder':
        case 'move-folder':
            return (
                <div className="space-y-1 pt-2">
                     <Label className="text-xs text-muted-foreground">FOLDER NAME</Label>
                     <Input placeholder="INBOX" value={config.folder} onChange={(e) => updateActionConfig(action.id, { folder: e.target.value })} />
                </div>
            );
        case 'set-priority':
             return (
                 <div className="space-y-1 pt-2">
                    <Label className="text-xs text-muted-foreground">MESSAGE PRIORITY</Label>
                    <Select value={config.messagePriority || 'normal'} onValueChange={(v) => updateActionConfig(action.id, { messagePriority: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                             {['highest', 'high', 'normal', 'low', 'lowest'].map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                 </div>
             );
        case 'send-new':
             return (
                 <div className="space-y-3 pt-2">
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                             <Label className="text-xs text-muted-foreground">FROM</Label>
                             <Input placeholder="From" value={config.from || ''} onChange={(e) => updateActionConfig(action.id, { from: e.target.value })} />
                         </div>
                         <div className="space-y-1">
                             <Label className="text-xs text-muted-foreground">TO</Label>
                             <Input placeholder="To" value={config.to || ''} onChange={(e) => updateActionConfig(action.id, { to: e.target.value })} />
                         </div>
                     </div>
                     <div className="space-y-1">
                         <Label className="text-xs text-muted-foreground">SUBJECT</Label>
                         <Input placeholder="Subject" value={config.subject || ''} onChange={(e) => updateActionConfig(action.id, { subject: e.target.value })} />
                     </div>
                     <div className="space-y-2">
                         <div className="flex items-center space-x-2">
                            <Checkbox id={`${action.id}-text`} checked={config.hasText || false} onCheckedChange={(c) => updateActionConfig(action.id, { hasText: !!c })} />
                            <Label htmlFor={`${action.id}-text`} className="text-xs font-bold text-primary">TEXT</Label>
                         </div>
                         <Textarea placeholder="Message body..." value={config.text || ''} onChange={(e) => updateActionConfig(action.id, { text: e.target.value })} className="min-h-[100px]" />
                     </div>
                 </div>
             );
        case 'edit-header':
             const headers = config.headers || [];
             return (
                 <div className="space-y-3 pt-2">
                     {headers.length > 0 && (
                         <div className="space-y-2 border rounded-md p-3 bg-muted/20">
                             <Label className="text-xs font-medium text-muted-foreground">CONFIGURED HEADERS</Label>
                             <div className="space-y-1">
                                 {headers.map((h, i) => (
                                     <div key={h.id || i} className="text-sm flex justify-between">
                                         <span><span className="font-mono">{h.header}</span>: {h.action} ({h.value})</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     )}
                     <Button variant="outline" size="sm" onClick={() => openHeaderList(action.id)} className="w-full">
                         Configure Headers
                     </Button>
                 </div>
             );
        case 'set-flags':
             return (
                 <div className="space-y-3 pt-2">
                     <div className="flex gap-6">
                         <div className="flex items-center space-x-2">
                             <Checkbox id={`${action.id}-flagged`} checked={config.flagged || false} onCheckedChange={(c) => updateActionConfig(action.id, { flagged: !!c })} />
                             <Label htmlFor={`${action.id}-flagged`}>Flagged</Label>
                         </div>
                         <div className="flex items-center space-x-2">
                             <Checkbox id={`${action.id}-seen`} checked={config.seen || false} onCheckedChange={(c) => updateActionConfig(action.id, { seen: !!c })} />
                             <Label htmlFor={`${action.id}-seen`}>Seen</Label>
                         </div>
                     </div>
                     <div className="space-y-1">
                         <Label className="text-xs text-muted-foreground">CUSTOM FLAGS</Label>
                         <Input placeholder="Custom flags" value={config.customFlags || ''} onChange={(e) => updateActionConfig(action.id, { customFlags: e.target.value })} />
                     </div>
                 </div>
             );
        default:
            return <div className="text-sm text-muted-foreground italic pt-2">No configuration needed.</div>;
    }
  };


  return (
    <div className="min-h-screen bg-background pb-20 pt-0">
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 flex items-center justify-between mb-8 shadow-sm">
         <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon" onClick={onCancel}>
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="h-8 w-[1px] bg-border" />
            <div className="flex-1 max-w-2xl">
                <Input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="h-9 text-2xl font-bold border-none shadow-none bg-transparent hover:bg-muted/50 p-0 focus-visible:ring-0 w-full"
                    placeholder="Rule Name..."
                />
            </div>
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]">
                <Save className="w-4 h-4 mr-2" />
                Save Rule
            </Button>
         </div>
      </div>

      <div className="w-full px-8 pb-8 flex flex-col lg:flex-row gap-8">
        
        {/* IF (Conditions) SECTION */}
        <section className="space-y-4 flex-1 min-w-0">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-1 rounded text-sm font-bold">IF</span>
                    Conditions
                </h2>
                
                <Popover>
                    <PopoverTrigger asChild>
                         <Button variant="secondary" size="sm" className="gap-2">
                            <Plus className="w-4 h-4" /> Add Condition
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="end">
                         <div className="p-2 border-b">
                            <TopTabs 
                                tabs={[{id:'basic',label:'Basic'}, {id:'headers',label:'Headers'}, {id:'advanced',label:'Advanced'}]}
                                activeTab={activeConditionTab}
                                onTabChange={setActiveConditionTab}
                                compact
                            />
                         </div>
                         <div className="max-h-[300px] overflow-y-auto p-2">
                            {(activeConditionTab === 'basic' ? basicConditions : activeConditionTab === 'headers' ? headerConditions : advancedConditions)
                                .filter(item => !selectedConditions.find(c => c.id === item.id))
                                .map(item => (
                                <Button 
                                    key={item.id} 
                                    variant="ghost" 
                                    className="w-full justify-start text-sm font-normal" 
                                    onClick={() => addCondition(item)}
                                >
                                    {item.label}
                                </Button>
                            ))}
                            {(activeConditionTab === 'basic' ? basicConditions : activeConditionTab === 'headers' ? headerConditions : advancedConditions)
                                .filter(item => !selectedConditions.find(c => c.id === item.id)).length === 0 && (
                                <div className="p-4 text-center text-sm text-muted-foreground">All items added</div>
                            )}
                         </div>
                    </PopoverContent>
                </Popover>
             </div>

             <div className="grid gap-4 w-full">
                {selectedConditions.length === 0 ? (
                    <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground bg-muted/20">
                        No conditions set. This rule applies to <span className="font-semibold text-foreground">all messages</span> unless conditions are added.
                    </div>
                ) : (
                    selectedConditions.map((cond, idx) => {
                         const isExpanded = expandedConditions.has(cond.id);
                         const hasConfig = !['all', 'has-attachment', 'is-spam', 'trusted-session', 'smtp-auth'].includes(cond.id);
                         
                         return (
                        <div key={cond.id} className="relative pt-6">
                             {/* CONNECTING LINE for items > 0 */}
                             {idx > 0 && (
                                <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-[2px] h-10 bg-border z-0" />
                             )}

                             {/* OPERATOR / NOT LOGIC */}
                             {idx === 0 && (
                                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-[20]">
                                       <Badge 
                                            variant="secondary" 
                                            className={`text-xs px-3 py-1 cursor-pointer border-2 border-background shadow-md transition-colors ${firstConditionNot ? 'bg-purple-600 text-white' : 'bg-gray-400 text-white'}`}
                                            onClick={() => setFirstConditionNot(!firstConditionNot)}
                                       >
                                           NOT
                                       </Badge>
                                  </div>
                             )}
                             {idx > 0 && (
                                 <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-[20]">
                                     <div className="relative">
                                         <Badge 
                                            variant="secondary" 
                                            className="bg-purple-600 text-white text-xs px-3 py-1 cursor-pointer border-2 border-background shadow-md ring-4 ring-background"
                                            onClick={() => setOpenOperatorDropdown(openOperatorDropdown === `c-${idx}` ? null : `c-${idx}`)}
                                         >
                                            {conditionOperators[`c-${idx}`] || (idx === 1 && selectedConditions.length === 2 ? 'AND' : idx === 1 ? 'NOT' : 'AND')}
                                         </Badge>
                                         {openOperatorDropdown === `c-${idx}` && (
                                              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-background border rounded-md shadow-lg z-[110] min-w-28 overflow-hidden">
                                                 {['AND', 'OR', 'NOT', 'AND NOT', 'OR NOT'].map(op => (
                                                     <div key={op} className="px-3 py-2 text-xs hover:bg-muted cursor-pointer whitespace-nowrap"
                                                        onClick={() => {
                                                            setConditionOperators(prev => ({...prev, [`c-${idx}`]: op}));
                                                            setOpenOperatorDropdown(null);
                                                        }}
                                                     >
                                                         {op}
                                                     </div>
                                                 ))}
                                              </div>
                                         )}
                                     </div>
                                 </div>
                             )}

                            <Card className="relative overflow-hidden group border-l-4 border-l-purple-500 w-full">
                                <CardHeader className="py-3 px-4 bg-muted/30 flex flex-row items-center justify-between space-y-0">
                                    <div className="font-medium text-sm">{cond.label}</div>
                                    <div className="flex items-center gap-2">
                                        {hasConfig && (
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleConditionExpanded(cond.id)}>
                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500" onClick={() => removeCondition(cond.id)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                {hasConfig && isExpanded && (
                                    <CardContent className="p-4 border-t">
                                        {renderConditionConfig(cond)}
                                    </CardContent>
                                )}
                            </Card>
                        </div>
                    )})
                )}
             </div>
        </section>

        <div className="hidden lg:flex flex-col justify-center px-2">
             <div className="w-px h-full bg-border" />
        </div>
        
        <div className="flex lg:hidden justify-center py-4">
             <div className="h-8 w-px bg-border" />
        </div>

        {/* THEN (Actions) SECTION */}
        <section className="space-y-4 flex-1 min-w-0">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded text-sm font-bold">THEN</span>
                    Actions
                </h2>

                <Popover>
                    <PopoverTrigger asChild>
                         <Button variant="secondary" size="sm" className="gap-2">
                            <Plus className="w-4 h-4" /> Add Action
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="end">
                         <div className="p-2 border-b">
                            <TopTabs 
                                tabs={[{id:'standard',label:'Standard'}, {id:'extra',label:'Extra'}]}
                                activeTab={activeActionTab}
                                onTabChange={setActiveActionTab}
                                compact
                            />
                         </div>
                         <div className="max-h-[300px] overflow-y-auto p-2">
                            {(activeActionTab === 'standard' ? standardActions : extraActions)
                                .filter(item => !selectedActions.find(a => a.id === item.id))
                                .map(item => (
                                <Button 
                                    key={item.id} 
                                    variant="ghost" 
                                    className="w-full justify-start text-sm font-normal" 
                                    onClick={() => addAction(item)}
                                >
                                    {item.label}
                                </Button>
                            ))}
                            {(activeActionTab === 'standard' ? standardActions : extraActions)
                                .filter(item => !selectedActions.find(a => a.id === item.id)).length === 0 && (
                                <div className="p-4 text-center text-sm text-muted-foreground">All items added</div>
                            )}
                         </div>
                    </PopoverContent>
                </Popover>
             </div>

             <div className="grid gap-4 w-full">
                {selectedActions.length === 0 ? (
                     <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground bg-muted/20">
                        No actions defined. The system will take <span className="font-semibold text-foreground">no action</span>.
                    </div>
                ) : (
                    selectedActions.map((action, idx) => {
                         const isExpanded = expandedActions.has(action.id);
                         const hasConfig = true; // Most actions have config, simplify for now

                         return (
                         <div key={action.id} className="relative pt-6">
                            {/* CONNECTING LINE for items > 0 */}
                            {idx > 0 && (
                                <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-[2px] h-10 bg-border z-0" />
                            )}

                            {/* OPERATOR LOGIC REMOVED FOR ACTIONS as per request - Just connecting line remains */}

                            <Card className="relative overflow-hidden group border-l-4 border-l-blue-500 w-full">
                                <CardHeader className="py-3 px-4 bg-muted/30 flex flex-row items-center justify-between space-y-0">
                                    <div className="font-medium text-sm">{action.label}</div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleActionExpanded(action.id)}>
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500" onClick={() => removeAction(action.id)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                {isExpanded && (
                                    <CardContent className="p-4 border-t">
                                        {renderActionConfig(action)}
                                    </CardContent>
                                )}
                            </Card>
                         </div>
                    )})
                )}
             </div>
        </section>
      </div>

      {/* HEADER CONFIG DIALOGS */}
      <Dialog open={isHeaderListOpen} onOpenChange={setIsHeaderListOpen}>
          <DialogContent className="max-w-md">
              <DialogHeader>
                  <DialogTitle>Configure Headers</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                   <div className="max-h-[300px] overflow-y-auto border rounded-md">
                       {editingActionId && actionConfigs[editingActionId]?.headers?.map(header => (
                           <div key={header.id} className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-muted/50">
                               <div className="text-sm">
                                   <div className="font-medium">{header.header}</div>
                                   <div className="text-xs text-muted-foreground">{header.action}: {header.value}</div>
                               </div>
                               <div className="flex gap-2">
                                   <Button variant="ghost" size="icon" onClick={() => openHeaderConfig(header)}>
                                       <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1464 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89291L2.10251 12.1929C1.99268 12.4519 2.11503 12.7505 2.37868 12.8795C2.64233 13.0084 2.9566 12.9234 3.129 12.679L4.729 10.279C4.78908 10.1889 4.88703 10.1265 4.99421 10.1032L8.29421 9.38507C8.42035 9.35763 8.53487 9.2926 8.62886 9.19861L16.2796 1.54784C16.4749 1.35258 16.4749 1.03599 16.2796 0.840728L14.1589 1.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                                   </Button>
                                   <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteHeader(header.id)}>
                                       <Trash2 className="w-4 h-4" />
                                   </Button>
                               </div>
                           </div>
                       ))}
                       {(!editingActionId || !actionConfigs[editingActionId]?.headers?.length) && (
                           <div className="p-8 text-center text-muted-foreground text-sm">No headers configured</div>
                       )}
                   </div>
                   <Button onClick={() => openHeaderConfig()} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                       <Plus className="w-4 h-4 mr-2" />
                       Add New Header
                   </Button>
              </div>
          </DialogContent>
      </Dialog>

      <Dialog open={isHeaderConfigOpen} onOpenChange={setIsHeaderConfigOpen}>
          <DialogContent className="max-w-md">
              <DialogHeader>
                  <DialogTitle>{currentHeader?.id ? 'Edit Header' : 'Add Header'}</DialogTitle>
              </DialogHeader>
              {currentHeader && (
                  <div className="space-y-4 py-4">
                      <div className="space-y-2">
                          <Label>Action</Label>
                          <Select 
                            value={currentHeader.action} 
                            onValueChange={(v) => setCurrentHeader({...currentHeader, action: v})}
                          >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {['Add', 'Remove', 'Replace'].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                            </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                          <Label>Header Name</Label>
                          <Input value={currentHeader.header} onChange={(e) => setCurrentHeader({...currentHeader, header: e.target.value})} placeholder="X-Custom-Header" />
                      </div>
                      <div className="space-y-2">
                          <Label>Value</Label>
                          <Input value={currentHeader.value} onChange={(e) => setCurrentHeader({...currentHeader, value: e.target.value})} placeholder="Header Value" />
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                          <Checkbox 
                            id="reg-h" 
                            checked={currentHeader.matchRegex} 
                            onCheckedChange={(c) => setCurrentHeader({...currentHeader, matchRegex: !!c})} 
                          />
                          <Label htmlFor="reg-h">Match Regex</Label>
                      </div>
                      {currentHeader.matchRegex && (
                          <div className="space-y-2">
                             <Label>Regex Value</Label>
                             <Input value={currentHeader.regexValue} onChange={(e) => setCurrentHeader({...currentHeader, regexValue: e.target.value})} placeholder="Pattern" />
                          </div>
                      )}
                  </div>
              )}
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsHeaderConfigOpen(false)}>Cancel</Button>
                  <Button onClick={saveHeader} className="bg-purple-600 hover:bg-purple-700 text-white">Save Header</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
};
