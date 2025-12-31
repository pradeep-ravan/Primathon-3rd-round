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
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, Edit, Trash2 } from "lucide-react";

export interface OAuthProvider {
  clientId?: string;
  provider?: string;
  description?: string;
  redirectUri?: string;
  authType?: string;
}

export interface OAuthProviderForm {
  clientId: string;
  provider: string;
  description: string;
  redirectUri: string;
  authType: string;
}

export interface OAuthProvidersState {
  oauthProviders: OAuthProvider[];
  isOAuthProviderModalOpen: boolean;
  isOAuthSecretModalOpen: boolean;
  isDeleteModalOpen: boolean;
  deletingProviderIndex: number | null;
  isEditMode: boolean;
  editingProviderIndex: number | null;
  oauthSecret: string;
  oauthProviderForm: OAuthProviderForm;
}

interface OAuthProvidersTabProps {
  state: OAuthProvidersState;
  updateState: (updates: Partial<OAuthProvidersState>) => void;
  generateOAuthSecret: () => string;
  generateClientId: () => string;
}

export const OAuthProvidersTab = memo(function OAuthProvidersTab({
  state,
  updateState,
  generateOAuthSecret,
  generateClientId,
}: OAuthProvidersTabProps) {
  const handleUpdate = useCallback((field: keyof OAuthProvidersState, value: any) => {
    updateState({ [field]: value });
  }, [updateState]);

  const handleUpdateForm = useCallback((field: keyof OAuthProviderForm, value: string) => {
    updateState({ 
      oauthProviderForm: { ...state.oauthProviderForm, [field]: value }
    });
  }, [state.oauthProviderForm, updateState]);
  return (
    <>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-end mb-6">
            <Button
              onClick={() => {
                handleUpdate('isOAuthProviderModalOpen', true);
                handleUpdate('oauthProviderForm', {
                  clientId: "",
                  provider: "",
                  description: "",
                  redirectUri: "",
                  authType: "Standard",
                });
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              ADD
            </Button>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground uppercase">
                      CLIENT ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground uppercase">
                      OAUTH PROVIDER
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground uppercase">
                      DESCRIPTION
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground uppercase">
                      REDIRECT URI
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground uppercase">
                      AUTH TYPE
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground uppercase">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                         {state.oauthProviders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                      >
                        No OAuth providers configured
                      </td>
                    </tr>
                  ) : (
                           state.oauthProviders.map((provider, index) => (
                      <tr
                        key={index}
                        className="border-b border-border hover:bg-muted/20"
                      >
                        <td className="px-4 py-3 text-sm text-foreground">
                          {provider.clientId || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {provider.provider || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {provider.description || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {provider.redirectUri || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {provider.authType || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                                   <button
                                     onClick={() => {
                                       handleUpdate('isEditMode', true);
                                       handleUpdate('editingProviderIndex', index);
                                       handleUpdate('oauthProviderForm', {
                                         clientId: provider.clientId || "",
                                         provider: provider.provider || "",
                                         description: provider.description || "",
                                         redirectUri: provider.redirectUri || "",
                                         authType: provider.authType || "Standard",
                                       });
                                       handleUpdate('isOAuthProviderModalOpen', true);
                                     }}
                                     className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                                     aria-label="Edit"
                                   >
                                     <Edit className="h-4 w-4" />
                                   </button>
                                   <button
                                     onClick={() => {
                                       handleUpdate('deletingProviderIndex', index);
                                       handleUpdate('isDeleteModalOpen', true);
                                     }}
                                     className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                                     aria-label="Delete"
                                   >
                                     <Trash2 className="h-4 w-4" />
                                   </button>
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

      {/* OAuth Provider Wizard Modal */}
      <AnimatePresence>
        {state.isOAuthProviderModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
            onClick={() => handleUpdate('isOAuthProviderModalOpen', false)}
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
                         {state.isEditMode ? "EDIT OAUTH PROVIDER" : "OAUTH PROVIDER WIZARD"}
                       </h2>
                       <button
                         onClick={() => {
                           handleUpdate('isOAuthProviderModalOpen', false);
                           handleUpdate('isEditMode', false);
                           handleUpdate('editingProviderIndex', null);
                         }}
                         className="text-primary-foreground hover:text-primary-foreground/80 transition-colors p-1"
                       >
                         <X className="h-5 w-5" />
                       </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                       {/* Client ID - Only show in edit mode */}
                       {state.isEditMode && (
                         <div className="space-y-2">
                           <Label className="text-sm font-medium text-foreground">
                             CLIENT ID
                           </Label>
                           <Input
                             type="text"
                             value={state.oauthProviderForm.clientId}
                             readOnly
                             className="w-full border-dashed bg-transparent"
                           />
                         </div>
                       )}

                       {/* OAuth Provider */}
                       <div className="space-y-2">
                         <Label className="text-sm font-medium text-foreground">
                           OAUTH PROVIDER
                         </Label>
                         <Input
                           type="text"
                           placeholder="OAuth provider"
                           value={state.oauthProviderForm.provider}
                           onChange={(e) => handleUpdateForm('provider', e.target.value)}
                           className="w-full"
                         />
                       </div>

                       {/* Description */}
                       <div className="space-y-2">
                         <Label className="text-sm font-medium text-foreground">
                           DESCRIPTION
                         </Label>
                         <Input
                           type="text"
                           placeholder="Description"
                           value={state.oauthProviderForm.description}
                           onChange={(e) => handleUpdateForm('description', e.target.value)}
                           className="w-full"
                         />
                       </div>

                       {/* Redirect URI */}
                       <div className="space-y-2">
                         <Label className="text-sm font-medium text-foreground">
                           REDIRECT URI
                         </Label>
                         <Input
                           type="text"
                           placeholder="Redirect URI"
                           value={state.oauthProviderForm.redirectUri}
                           onChange={(e) => handleUpdateForm('redirectUri', e.target.value)}
                           className="w-full"
                         />
                       </div>

                       {/* Auth Type */}
                       <div className="space-y-2">
                         <Label className="text-sm font-medium text-foreground">
                           AUTH TYPE
                         </Label>
                         <Select
                           value={state.oauthProviderForm.authType}
                           onValueChange={(value) => handleUpdateForm('authType', value)}
                         >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Single Page">Single Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleUpdate('isOAuthProviderModalOpen', false);
                    handleUpdate('isEditMode', false);
                    handleUpdate('editingProviderIndex', null);
                  }}
                  className="bg-muted hover:bg-muted/80 text-foreground border-border"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={() => {
                    if (state.isEditMode && state.editingProviderIndex !== null) {
                      // Update existing provider
                      const updated = [...state.oauthProviders];
                      updated[state.editingProviderIndex] = {
                        ...state.oauthProviderForm,
                      };
                      handleUpdate('oauthProviders', updated);
                      handleUpdate('isOAuthProviderModalOpen', false);
                      handleUpdate('isEditMode', false);
                      handleUpdate('editingProviderIndex', null);
                    } else {
                      // Generate secret and open OAuth Secret modal for new provider
                      const secret = generateOAuthSecret();
                      handleUpdate('oauthSecret', secret);
                      handleUpdate('isOAuthProviderModalOpen', false);
                      handleUpdate('isOAuthSecretModalOpen', true);
                    }
                  }}
                  className={state.isEditMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"}
                >
                  SAVE
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OAuth Secret Modal */}
      <AnimatePresence>
        {state.isOAuthSecretModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[110]"
            onClick={() => handleUpdate('isOAuthSecretModalOpen', false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold uppercase">
                  OAUTH SECRET
                </h2>
                <button
                  onClick={() => handleUpdate('isOAuthSecretModalOpen', false)}
                  className="text-white hover:text-white/80 transition-colors p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-muted border border-border rounded-lg p-4">
                  <p className="text-sm font-mono text-foreground break-all">
                    {state.oauthSecret}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
                <Button
                  onClick={() => {
                    // Add provider to table and close modal
                    const newProvider = {
                      clientId: generateClientId(),
                      provider: state.oauthProviderForm.provider,
                      description: state.oauthProviderForm.description,
                      redirectUri: state.oauthProviderForm.redirectUri,
                      authType: state.oauthProviderForm.authType,
                    };
                    handleUpdate('oauthProviders', [...state.oauthProviders, newProvider]);
                    handleUpdate('isOAuthSecretModalOpen', false);
                    // Reset form
                    handleUpdate('oauthProviderForm', {
                      clientId: "",
                      provider: "",
                      description: "",
                      redirectUri: "",
                      authType: "Standard",
                    });
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  CONTINUE
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Warning Modal */}
      <AnimatePresence>
        {state.isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[110]"
            onClick={() => handleUpdate('isDeleteModalOpen', false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold uppercase text-yellow-500">
                  WARNING
                </h2>
                <button
                  onClick={() => handleUpdate('isDeleteModalOpen', false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 border-b border-border">
                <p className="text-center text-foreground">
                  Do you want to delete selected OAuth clients? (1)
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleUpdate('isDeleteModalOpen', false)}
                  className="bg-muted hover:bg-muted/80 text-foreground border-border"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={() => {
                    if (state.deletingProviderIndex !== null) {
                      handleUpdate('oauthProviders', 
                        state.oauthProviders.filter((_, index) => index !== state.deletingProviderIndex)
                      );
                      handleUpdate('isDeleteModalOpen', false);
                      handleUpdate('deletingProviderIndex', null);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  DELETE
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
