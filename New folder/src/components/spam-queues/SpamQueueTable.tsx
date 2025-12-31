'use client';

import React from 'react';

export interface SpamQueueEntry {
  sender: string;
  date: string;
  owner: string;
  domain: string;
}

interface SpamQueueTableProps {
  data: SpamQueueEntry[];
  onSelectAll?: (selected: boolean) => void;
  onSelectRow?: (index: number, selected: boolean) => void;
}

export const SpamQueueTable: React.FC<SpamQueueTableProps> = ({
  data,
  onSelectAll,
  onSelectRow,
}) => {
  return (
    <div className="bg-card/50 border border-border rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary"
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                SENDER
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                DATE
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                OWNER
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                DOMAIN
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-border text-primary focus:ring-primary"
                    onChange={(e) => onSelectRow?.(index, e.target.checked)}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {row.sender}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {row.date}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {row.owner}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {row.domain}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

