"use client";

import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCw, Star, Trash2, X, FileText, Lock, Shield, Upload, Award, ArrowLeft, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface Certificate {
  id: string;
  type: string;
  hostname: string;
  ipAddress: string;
  expiration: string;
  isActive: boolean;
}

export interface CertificatesState {
  certificates: Certificate[];
  selectedCertificates: string[];
  isCertificateOptionsModalOpen: boolean;
  isAddExistingModalOpen: boolean;
  certificateInput: string;
  certificateFileName: string;
}

interface CertificatesTabProps {
  state: CertificatesState;
  updateState: (updates: Partial<CertificatesState>) => void;
}

export const CertificatesTab = memo(function CertificatesTab({
  state,
  updateState,
}: CertificatesTabProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpdate = useCallback((field: keyof CertificatesState, value: any) => {
    updateState({ [field]: value });
  }, [updateState]);

  const handleOpenModal = useCallback(() => {
    handleUpdate('isCertificateOptionsModalOpen', true);
  }, [handleUpdate]);

  const handleCloseModal = useCallback(() => {
    handleUpdate('isCertificateOptionsModalOpen', false);
  }, [handleUpdate]);

  const handleOpenAddExistingModal = useCallback(() => {
    handleUpdate('isCertificateOptionsModalOpen', false);
    handleUpdate('isAddExistingModalOpen', true);
  }, [handleUpdate]);

  const handleCloseAddExistingModal = useCallback(() => {
    handleUpdate('isAddExistingModalOpen', false);
    handleUpdate('certificateInput', '');
    handleUpdate('certificateFileName', '');
    handleUpdate('isCertificateOptionsModalOpen', true);
  }, [handleUpdate]);

  const handleOpenIceWarpCertificateModal = useCallback(() => {
    handleUpdate('isCertificateOptionsModalOpen', false);
    handleUpdate('isIceWarpCertificateModalOpen', true);
  }, [handleUpdate]);

  const handleCloseIceWarpCertificateModal = useCallback(() => {
    handleUpdate('isIceWarpCertificateModalOpen', false);
    handleUpdate('isCertificateOptionsModalOpen', true);
  }, [handleUpdate]);

  const handleAddHostname = useCallback(() => {
    const currentHostnames = state.iceWarpCertificateForm.hostnames;
    updateState({
      iceWarpCertificateForm: {
        ...state.iceWarpCertificateForm,
        hostnames: [...currentHostnames, ''],
      },
    });
  }, [state.iceWarpCertificateForm, updateState]);

  const handleUpdateIceWarpForm = useCallback((field: keyof IceWarpCertificateForm, value: any) => {
    updateState({
      iceWarpCertificateForm: {
        ...state.iceWarpCertificateForm,
        [field]: value,
      },
    });
  }, [state.iceWarpCertificateForm, updateState]);

  const handleUpdateHostname = useCallback((index: number, value: string) => {
    const newHostnames = [...state.iceWarpCertificateForm.hostnames];
    newHostnames[index] = value;
    updateState({
      iceWarpCertificateForm: {
        ...state.iceWarpCertificateForm,
        hostnames: newHostnames,
      },
    });
  }, [state.iceWarpCertificateForm, updateState]);

  const handleRemoveHostname = useCallback((index: number) => {
    const newHostnames = state.iceWarpCertificateForm.hostnames.filter((_, i) => i !== index);
    updateState({
      iceWarpCertificateForm: {
        ...state.iceWarpCertificateForm,
        hostnames: newHostnames.length > 0 ? newHostnames : [''],
      },
    });
  }, [state.iceWarpCertificateForm, updateState]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file name immediately
      updateState({ 
        certificateFileName: file.name,
        certificateInput: '' // Clear previous content while reading
      });
      
      // Read the file content (store it but don't display it)
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        handleUpdate('certificateInput', content);
      };
      reader.readAsText(file);
    }
    // Reset the file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [updateState, handleUpdate]);

  return (
    <>
      <div className="space-y-6">
        <div>
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mb-4">
            <Button
              onClick={handleOpenModal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              ADD
            </Button>
          </div>

        {/* Separator */}
        <div className="border-b border-border mb-0" />

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground uppercase">
                    TYPE
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground uppercase">
                    HOSTNAME
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground uppercase">
                    IP ADDRESS
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground uppercase">
                    EXPIRATION
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.certificates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-muted-foreground"
                    >
                      No certificates configured
                    </td>
                  </tr>
                ) : (
                  state.certificates.map((certificate) => (
                    <tr
                      key={certificate.id}
                      className="border-b border-border hover:bg-muted/20 last:border-b-0"
                    >
                      <td className="px-4 py-3 text-sm text-foreground">
                        {certificate.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {certificate.hostname}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {certificate.ipAddress}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {certificate.expiration}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Reissue Icon */}
                          <div className="relative group">
                            <button
                              className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-muted/50"
                              onClick={() => {
                                // Handle reissue action
                                console.log('Reissue certificate:', certificate.id);
                              }}
                            >
                              <RotateCw className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-border">
                              Reissue
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                <div className="w-2 h-2 bg-popover border-r border-b border-border transform rotate-45"></div>
                              </div>
                            </div>
                          </div>

                          {/* Set as Default Icon */}
                          <div className="relative group">
                            <button
                              className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-muted/50"
                              onClick={() => {
                                // Handle set as default action
                                console.log('Set as default certificate:', certificate.id);
                              }}
                            >
                              <Star className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-border">
                              Set as Default
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                <div className="w-2 h-2 bg-popover border-r border-b border-border transform rotate-45"></div>
                              </div>
                            </div>
                          </div>

                          {/* Delete Icon */}
                          <div className="relative group">
                            <button
                              className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded hover:bg-muted/50"
                              onClick={() => {
                                // Handle delete action
                                console.log('Delete certificate:', certificate.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-border">
                              Delete
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                <div className="w-2 h-2 bg-popover border-r border-b border-border transform rotate-45"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    {/* Certificate Options Modal */}
    <AnimatePresence>
      {state.isCertificateOptionsModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[79vh]"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase">
                CERTIFICATE OPTIONS
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-primary-foreground hover:text-primary-foreground/80 transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Option 1: Add existing */}
              <div className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Add existing
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose if you already have an SSL server certificate ready.
                  </p>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                  onClick={handleOpenAddExistingModal}
                >
                  CONTINUE
                </Button>
              </div>

              {/* Option 2: Request IceWarp certificate */}
              <div className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Request IceWarp certificate
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Purchase a trusted SSL server certificate from IceWarp in a few simple steps. Reissue if expiration is due or more domains are added.
                  </p>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                  onClick={handleOpenIceWarpCertificateModal}
                >
                  CONTINUE
                </Button>
              </div>

              {/* Option 3: Request authority certificate */}
              <div className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <div className="relative">
                    <FileText className="h-6 w-6 text-primary" />
                    <Shield className="h-3 w-3 text-primary absolute -top-1 -right-1" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Request authority certificate
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Generate a certificate request for use with your favorite certificate provider. Reissue if expiration is due or more domains are added.
                  </p>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                  onClick={() => {
                    // Handle continue action
                    console.log('Request authority certificate');
                    handleCloseModal();
                  }}
                >
                  CONTINUE
                </Button>
              </div>

              {/* Option 4: Free Let's Encrypt certificate */}
              <div className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Free Let's Encrypt certificate
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Generate a free certificate from Let's Encrypt certification authority. Certificate is automatically reissued before expiration, reissue manually if domains need to be added or removed.
                  </p>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                  onClick={() => {
                    // Handle continue action
                    console.log('Free Let\'s Encrypt certificate');
                    handleCloseModal();
                  }}
                >
                  CONTINUE
                </Button>
              </div>

              {/* Option 5: Free self-signed certificate */}
              <div className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    Free self-signed certificate
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Generate a free certificate not verified by any certification authority. Use if security is not a big concern. Reissue as often as needed.
                  </p>
                </div>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                  onClick={() => {
                    // Handle continue action
                    console.log('Free self-signed certificate');
                    handleCloseModal();
                  }}
                >
                  CONTINUE
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="bg-transparent hover:bg-muted text-muted-foreground border-border"
              >
                CANCEL
              </Button>
              <Button
                disabled
                className="bg-muted text-muted-foreground border-border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SAVE
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Add Existing Certificate Modal */}
    <AnimatePresence>
      {state.isAddExistingModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={handleCloseAddExistingModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase">
                ADD
              </h2>
              <button
                onClick={handleCloseAddExistingModal}
                className="text-primary-foreground hover:text-primary-foreground/80 transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground uppercase">
                  CERTIFICATE
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    placeholder="Certificate"
                    value={state.certificateFileName}
                    readOnly
                    className="flex-1 border-dashed"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pem"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleUploadClick}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    UPLOAD
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleCloseAddExistingModal}
                className="bg-transparent hover:bg-muted text-muted-foreground border-border"
              >
                CANCEL
              </Button>
              <Button
                disabled={!state.certificateInput.trim()}
                className={state.certificateInput.trim() 
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                  : "bg-muted text-muted-foreground border-border disabled:opacity-50 disabled:cursor-not-allowed"}
              >
                SAVE
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* IceWarp Certificate Modal */}
    <AnimatePresence>
      {state.isIceWarpCertificateModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={handleCloseIceWarpCertificateModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[79vh]"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseIceWarpCertificateModal}
                  className="text-primary-foreground hover:text-primary-foreground/80 transition-colors p-1"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold uppercase">
                  ICEWARP CERTIFICATE
                </h2>
              </div>
              <button
                onClick={handleCloseIceWarpCertificateModal}
                className="text-primary-foreground hover:text-primary-foreground/80 transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Hostnames Section */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  Hostnames
                </h3>
                <div className="space-y-3">
                  {state.iceWarpCertificateForm.hostnames.map((hostname, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Label className="text-sm font-medium text-foreground w-24">
                        HOSTNAME
                      </Label>
                      <Input
                        type="text"
                        value={hostname}
                        onChange={(e) => handleUpdateHostname(index, e.target.value)}
                        className="flex-1"
                        placeholder="icewarpindia.onice.io"
                      />
                      {state.iceWarpCertificateForm.hostnames.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveHostname(index)}
                          className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors rounded hover:bg-muted/50 flex-shrink-0"
                          aria-label="Remove hostname"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={handleAddHostname}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      ADD ANOTHER HOSTNAME
                    </Button>
                  </div>
                </div>
              </div>

              {/* Company details Section */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  Company details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-foreground w-32">
                      EMAIL
                    </Label>
                    <Input
                      type="email"
                      value={state.iceWarpCertificateForm.email}
                      onChange={(e) => handleUpdateIceWarpForm('email', e.target.value)}
                      className="flex-1"
                      placeholder="jan.samek2@icewarp.com"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-foreground w-32">
                      ORGANIZATION
                    </Label>
                    <Input
                      type="text"
                      value={state.iceWarpCertificateForm.organization}
                      onChange={(e) => handleUpdateIceWarpForm('organization', e.target.value)}
                      className="flex-1"
                      placeholder="IceWarp India1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-foreground w-32">
                      UNIT
                    </Label>
                    <Input
                      type="text"
                      value={state.iceWarpCertificateForm.unit}
                      onChange={(e) => handleUpdateIceWarpForm('unit', e.target.value)}
                      className="flex-1"
                      placeholder="Unit"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-foreground w-32">
                      CITY
                    </Label>
                    <Input
                      type="text"
                      value={state.iceWarpCertificateForm.city}
                      onChange={(e) => handleUpdateIceWarpForm('city', e.target.value)}
                      className="flex-1"
                      placeholder="Praha"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-foreground w-32">
                      STATE
                    </Label>
                    <Input
                      type="text"
                      value={state.iceWarpCertificateForm.state}
                      onChange={(e) => handleUpdateIceWarpForm('state', e.target.value)}
                      className="flex-1"
                      placeholder="State"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-foreground w-32">
                      COUNTRY
                    </Label>
                    <Input
                      type="text"
                      value={state.iceWarpCertificateForm.country}
                      onChange={(e) => handleUpdateIceWarpForm('country', e.target.value)}
                      className="flex-1"
                      placeholder="CZ"
                    />
                  </div>
                </div>
              </div>

              {/* Certificate settings Section */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">
                  Certificate settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-foreground w-32">
                      VALIDITY
                    </Label>
                    <Select
                      value={state.iceWarpCertificateForm.validity}
                      onValueChange={(value) => handleUpdateIceWarpForm('validity', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 year">1 year</SelectItem>
                        <SelectItem value="2 years">2 years</SelectItem>
                        <SelectItem value="3 years">3 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-foreground w-32">
                      BITS
                    </Label>
                    <Input
                      type="text"
                      value={state.iceWarpCertificateForm.bits}
                      onChange={(e) => handleUpdateIceWarpForm('bits', e.target.value)}
                      className="flex-1"
                      placeholder="3072"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleCloseIceWarpCertificateModal}
                className="bg-transparent hover:bg-muted text-muted-foreground border-border"
              >
                CANCEL
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => {
                  // Handle save action
                  console.log('Save IceWarp certificate', state.iceWarpCertificateForm);
                  handleCloseIceWarpCertificateModal();
                }}
              >
                SAVE
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
});
