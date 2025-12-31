'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useImportUsers } from '@/hooks/useUsers';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Download,
  FileText,
  Loader2,
  Settings2,
  Upload,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ImportHistory } from './ImportHistory';

export default function Client() {
  //   const router = useRouter();
  const [view, setView] = useState<'history' | 'import'>('history');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    imported: number;
    failed: number;
    errors: Array<{
      row: number;
      message: string;
      data: Record<string, string>;
    }>;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useImportUsers();
  const isUploading = importMutation.isPending;

  // Extract all available columns from error data
  const availableColumns = useMemo(() => {
    if (!uploadResult?.errors?.length) return [];
    const firstError = uploadResult.errors[0];
    return Object.keys(firstError.data || {});
  }, [uploadResult]);

  // Initialize visible columns when errors change
  useEffect(() => {
    if (availableColumns.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(availableColumns);
    }
  }, [availableColumns, visibleColumns.length]);

  // Simulate progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUploading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);
    } else if (!isUploading && progress > 0 && progress < 100) {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [isUploading]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    // Check file type (allow csv, xls, xlsx)
    // Note: MIME types can be tricky, so we also check extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['csv', 'xls', 'xlsx'];

    if (
      !validExtensions.includes(extension || '') &&
      !validTypes.includes(file.type)
    ) {
      toast.error('Please upload a valid CSV or Excel file');
      return;
    }

    setFile(file);
    setUploadResult(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const result = await importMutation.mutateAsync(file);
      setUploadResult(result);
      toast.success('File processed successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    }
  };

  const downloadErrorFile = () => {
    if (!uploadResult?.errors?.length) return;

    // Get all columns from data + Error Message
    const columns = ['Row', 'Error Message', ...availableColumns];

    // Create CSV content
    const csvContent = [
      columns.join(','),
      ...uploadResult.errors.map((error) => {
        const rowData = availableColumns.map(
          (col) => `"${error.data[col] || ''}"`
        );
        return [`${error.row}`, `"${error.message}"`, ...rowData].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'import_errors.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTemplate = () => {
    const headers = 'username,email,first_name,last_name,password,role';
    const sample = 'jdoe,john.doe@example.com,John,Doe,Password123!,USER';
    const csvContent = `${headers}\n${sample}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (view === 'history') {
    return <ImportHistory onNewImport={() => setView('import')} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView('history')}
          className="h-10 w-10 rounded-full hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bulk User Import
          </h1>
          <p className="text-muted-foreground">
            Import multiple users from a CSV or Excel file
          </p>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${file ? '' : 'md:grid-cols-3'} gap-6`}>
        {/* Main Upload Area */}
        <div className={`${file ? '' : 'md:col-span-2'} space-y-6`}>
          <Card className="p-6 border-dashed border-2 border-border/60 shadow-none bg-card/50">
            {!file ? (
              <div
                className={`flex flex-col items-center justify-center py-12 px-4 transition-colors duration-200 rounded-lg cursor-pointer ${
                  isDragging
                    ? 'bg-primary/10 border-primary/50'
                    : 'hover:bg-accent/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Click or drag file to upload
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
                  Support for CSV, XLS, and XLSX files. Max file size 10MB.
                </p>
                <Button variant="outline" className="mt-2">
                  Select File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="flex items-center gap-4 p-4 bg-accent/30 rounded-lg border border-border w-full max-w-md mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    disabled={isUploading}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {!uploadResult && (
                  <div className="w-full max-w-md space-y-4">
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Uploading...</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="w-full"
                      size="lg"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Import Users
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Results Section */}
          {uploadResult && (
            <Card className="p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold mb-4">Import Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Processed
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {uploadResult.imported + uploadResult.failed}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Successfully Imported
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {uploadResult.imported}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Failed Records
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {uploadResult.failed}
                    </p>
                  </div>
                </div>
              </div>

              {uploadResult.errors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Error Details
                    </h4>
                    <div className="flex items-center gap-2">
                      {availableColumns.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                              <Settings2 className="h-3.5 w-3.5 mr-2" />
                              Columns
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-3" align="end">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm mb-2">
                                Toggle Columns
                              </h4>
                              {availableColumns.map((col) => (
                                <div
                                  key={col}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`col-${col}`}
                                    checked={visibleColumns.includes(col)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setVisibleColumns([
                                          ...visibleColumns,
                                          col,
                                        ]);
                                      } else {
                                        setVisibleColumns(
                                          visibleColumns.filter(
                                            (c) => c !== col
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`col-${col}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {col.charAt(0).toUpperCase() + col.slice(1)}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={downloadErrorFile}
                      >
                        <Download className="h-3.5 w-3.5 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Row</TableHead>
                          <TableHead className="min-w-[200px]">
                            Error Message
                          </TableHead>
                          {visibleColumns.map((col) => (
                            <TableHead key={col} className="whitespace-nowrap">
                              {col.charAt(0).toUpperCase() + col.slice(1)}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploadResult.errors.map((error, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {error.row}
                            </TableCell>
                            <TableCell className="text-destructive font-medium">
                              {error.message}
                            </TableCell>
                            {visibleColumns.map((col) => (
                              <TableCell
                                key={col}
                                className="whitespace-nowrap text-muted-foreground"
                              >
                                {error.data[col] || '-'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button onClick={handleRemoveFile} variant="outline">
                  Import Another File
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar / Instructions */}
        {!file && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Template
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download our CSV template to ensure your data is formatted
                correctly.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={downloadTemplate}
              >
                Download CSV Template
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Instructions</h3>
              <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-4">
                <li>File must be in CSV, XLS, or XLSX format.</li>
                <li>
                  Required columns: <strong>username</strong>,{' '}
                  <strong>email</strong>, <strong>password</strong>.
                </li>
                <li>
                  Optional columns: <strong>first_name</strong>,{' '}
                  <strong>last_name</strong>, <strong>role</strong>.
                </li>
                <li>Maximum file size is 10MB.</li>
                <li>Passwords must meet the security policy requirements.</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
