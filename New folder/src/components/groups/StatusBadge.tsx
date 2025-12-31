import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { StatusBadgeProps, TypeBadgeProps, PermissionsBadgeProps } from '@/types/groups';

// Status badge component with domain-like styling
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Handle undefined/null status gracefully
  if (!status) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <span className="text-gray-500 font-medium">Unknown</span>
      </div>
    );
  }
  
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'active':
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-500 font-medium">Active</span>
        </div>
      );
    case 'inactive':
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-red-500 font-medium">Inactive</span>
        </div>
      );
    case 'suspended':
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-orange-500 font-medium">Suspended</span>
        </div>
      );
    case 'pending':
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-yellow-500 font-medium">Pending</span>
        </div>
      );
    case 'none':
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <span className="text-gray-500 font-medium">None</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <span className="text-gray-500 font-medium">{status}</span>
        </div>
      );
  }
};

// User type badge component
export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  switch (type) {
    case 'admin':
      return <Badge className="bg-red-500 hover:bg-red-600 text-white">Admin</Badge>;
    case 'regular':
      return <Badge className="bg-teal-500 hover:bg-teal-600 text-white">Regular</Badge>;
    case 'guest':
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Guest</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

// Permissions badge component
export const PermissionsBadge: React.FC<PermissionsBadgeProps> = ({ permissions }) => {
  const permissionsList = [
    { key: 'meetingsupport', label: 'Meeting' },
    { key: 'desktopsupport', label: 'Desktop' },
    { key: 'activesyncsupport', label: 'ActiveSync' },
    { key: 'recordingsupport', label: 'Recording' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {permissionsList.map(({ key, label }) => (
        <Badge
          key={key}
          className={
            permissions && permissions[key] === '1'
              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-red-700/50 text-red-300 hover:bg-red-600/70'
          }
        >
          {permissions && permissions[key] === '1' ? (
            <CheckCircle2 className="h-3 w-3 mr-1" />
          ) : (
            <XCircle className="h-3 w-3 mr-1" />
          )}
          {label}
        </Badge>
      ))}
    </div>
  );
};
