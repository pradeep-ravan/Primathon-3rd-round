import React from 'react';
import { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: 'Bulk User Import | EMOR',
  description: 'Import multiple users at once using CSV or Excel files.',
};

export default function BulkImportPage() {
  return <Client />;
}
