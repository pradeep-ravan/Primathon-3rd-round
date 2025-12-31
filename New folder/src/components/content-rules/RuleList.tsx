import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { ContentRule } from './types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RuleListProps {
  rules: ContentRule[];
  onAddRule: () => void;
  onEditRule: (rule: ContentRule) => void;
  onDeleteRule: (id: string) => void;
  onToggleEnabled: (id: string) => void;
}

export const RuleList: React.FC<RuleListProps> = ({
  rules,
  onAddRule,
  onEditRule,
  onDeleteRule,
  onToggleEnabled,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            CONTENT RULES
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage email filtering rules and automated message processing.
          </p>
        </div>
        <Button
          onClick={onAddRule}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          ADD RULE
        </Button>
      </div>

      {/* Rules List */}
      <div className="grid gap-4">
        {rules.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Rules Created</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                Create your first content rule to start automating your email processing.
              </p>
              <Button onClick={onAddRule} variant="outline">
                Create First Rule
              </Button>
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => (
            <Card
              key={rule.id}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-purple-500/30 cursor-pointer overflow-hidden relative"
              onClick={() => onEditRule(rule)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardContent className="flex items-center justify-between p-6 relative">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full shadow-[0_0_10px] ${
                      rule.enabled
                        ? 'bg-green-500 shadow-green-500/50'
                        : 'bg-gray-400 shadow-gray-400/50'
                    }`}
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{rule.title}</h3>
                    <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {rule.conditions.length} Conditions
                      </Badge>
                      <Badge variant="secondary" className="text-xs font-normal">
                        {rule.actions.length} Actions
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs font-medium text-muted-foreground">
                      {rule.enabled ? 'Active' : 'Inactive'}
                    </span>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => onToggleEnabled(rule.id)}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="hover:bg-muted">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onEditRule(rule);
                      }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRule(rule.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
