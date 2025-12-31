import React from 'react';
import { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: 'Bulk Group Import | EMOR',
  description: 'Import multiple groups at once using CSV or Excel files.',
};

export default function BulkImportPage() {
  return <Client />;
}
