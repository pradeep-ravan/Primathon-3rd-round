"use client";

import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export interface FulltextSearchState {
  isFulltextSearchModalOpen: boolean;
  isWarningModalOpen: boolean;
  enableFulltextSearch: boolean;
  wizardStep: number;
  scannerServiceType: string;
  localScannerPort: string;
  remoteScannerUrl: string;
  databaseServiceType: string;
  localDatabasePort: string;
  indexStorageFolder: string;
  remoteDatabaseUrl: string;
  documentsConversionServiceType: string;
  localDocumentsConversionPort: string;
  remoteDocumentsConversionUrl: string;
}

interface FulltextSearchTabProps {
  state: FulltextSearchState;
  updateState: (updates: Partial<FulltextSearchState>) => void;
}

export const FulltextSearchTab = memo(function FulltextSearchTab({
  state,
  updateState,
}: FulltextSearchTabProps) {
  const handleUpdate = useCallback((field: keyof FulltextSearchState, value: string | boolean | number) => {
    updateState({ [field]: value });
  }, [updateState]);
  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">
            FULLTEXT SEARCH
          </h2>
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Fulltext Search engine is currently not configured
            </p>
            <Button
              onClick={() => {
                handleUpdate('isFulltextSearchModalOpen', true);
                handleUpdate('wizardStep', 1);
                handleUpdate('enableFulltextSearch', false);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              CONFIGURE FULLTEXT SEARCH
            </Button>
          </div>
        </div>
      </div>

      {/* Fulltext Search Wizard Modal */}
      <AnimatePresence>
        {state.isFulltextSearchModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
                   onClick={() => handleUpdate('isWarningModalOpen', true)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold uppercase">
                  FULLTEXT SEARCH WIZARD
                </h2>
                <button
                   onClick={() => handleUpdate('isWarningModalOpen', true)}
                  className="text-primary-foreground hover:text-primary-foreground/80 transition-colors p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                         {[1, 2, 3, 4, 5].map((step) => {
                           const isCompleted = step < state.wizardStep;
                           const isActive = step === state.wizardStep;
                    
                    return (
                      <React.Fragment key={step}>
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                            isCompleted
                              ? "bg-primary border-primary text-primary-foreground"
                              : isActive
                              ? "bg-primary border-primary text-primary-foreground"
                              : "bg-background border-border text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <span className="text-primary-foreground">✓</span>
                          ) : (
                            <span className="font-semibold">{step}</span>
                          )}
                        </div>
                        {step < 5 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 ${
                              isCompleted || (isActive && step < 5)
                                ? "bg-primary"
                                : "bg-border"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
                     <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                       {state.wizardStep === 1 && (
                  <>
                    <h3 className="text-lg font-bold text-foreground">
                      Fulltext Search
                    </h3>

                    <div className="space-y-4 text-sm text-muted-foreground">
                      <p>
                        IceWarp supports fulltext search that is available to
                        users in WebClient interface, on mobile devices
                        synchronized through ActiveSync and in desktop email
                        clients that can search for emails through IMAP protocol.
                      </p>
                      <p>
                        Fulltext Search engine consists of three components that
                        can run locally or remotely to offload CPU and storage.
                        Please consider carefully how you want to set up your
                        Fulltext Search engine.
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Fulltext Search scanner (yoda-scan)</li>
                        <li>Fulltext Search database (yoda)</li>
                        <li>Documents conversion service (mundi)</li>
                      </ul>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
                             <Switch
                               checked={state.enableFulltextSearch}
                               onCheckedChange={(value) => handleUpdate('enableFulltextSearch', value)}
                             />
                      <Label className="text-sm font-medium text-foreground cursor-pointer flex-1 uppercase">
                        ENABLE FULLTEXT SEARCH IN ICEWARP
                      </Label>
                    </div>
                  </>
                )}

                       {state.wizardStep === 2 && (
                  <>
                    <h3 className="text-lg font-bold text-foreground mb-2 -mt-4">
                      Fulltext Search scanner configuration
                    </h3>

                    <div className="space-y-4 text-sm text-muted-foreground">
                      <p>
                        Scanner service reads data from email storage, parses out
                        text of emails and sends the text to the fulltext search
                        database.Scanner service needs access (at least with read permission)
                        to the email storage of IceWarp.If Scanner is deployed on a remote server, mount the email
                        storage to the same mount point as on the IceWarp server
                        (/mnt/data/mail/).
                      </p>
                    </div>

                    {/* Radio Options */}
                           <RadioGroup
                             value={state.scannerServiceType}
                             onValueChange={(value) => handleUpdate('scannerServiceType', value)}
                             className="space-y-4"
                           >
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                                 <RadioGroupItem value="local" id="local" />
                                 <Label
                                   htmlFor="local"
                                   className="text-sm font-medium text-foreground cursor-pointer uppercase"
                                 >
                                   RUN SCANNER SERVICE LOCALLY
                                 </Label>
                                 {state.scannerServiceType === "local" && (
                                   <>
                                     <Label className="text-sm font-medium text-foreground whitespace-nowrap ml-auto">
                                       LOCAL SCANNER SERVICE PORT
                                     </Label>
                                     <Input
                                       type="number"
                                       value={state.localScannerPort}
                                       onChange={(e) => handleUpdate('localScannerPort', e.target.value)}
                                       className="w-32"
                                     />
                                   </>
                                 )}
                               </div>
                             </div>

                             <div className="space-y-3">
                               <div className={`flex items-center space-x-3 bg-card border border-border rounded-lg p-4 ${state.scannerServiceType === "remote" ? "-mt-3" : ""}`}>
                                 <RadioGroupItem value="remote" id="remote" />
                                 <Label
                                   htmlFor="remote"
                                   className="text-sm font-medium text-foreground cursor-pointer flex-1 uppercase"
                                 >
                                   CONNECT TO REMOTE SCANNER SERVICE
                                 </Label>
                               </div>
                               {state.scannerServiceType === "remote" && (
                                 <div className="ml-8 flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                                   <Label className="text-sm font-medium text-foreground whitespace-nowrap">
                                     REMOTE SCANNER SERVICE URL
                                   </Label>
                                   <Input
                                     type="text"
                                     value={state.remoteScannerUrl}
                                     onChange={(e) => handleUpdate('remoteScannerUrl', e.target.value)}
                                     placeholder="http://127.0.0.1:25795"
                                     className="flex-1"
                                   />
                                 </div>
                               )}
                      </div>
                    </RadioGroup>
                  </>
                )}

                       {state.wizardStep === 3 && (
                  <>
                    <h3 className="text-lg font-bold text-foreground mb-2 -mt-4">
                      Fulltext Search database configuration
                    </h3>

                    <div className="space-y-4 text-sm text-muted-foreground">
                      <p>
                        Database service maintains its own database for fulltext search metadata (index). The index is stored directly on filesystem and will occupy approximately 10-20% of the original size of IceWarp email storage (the actual size varies by the type of data). Database service operates on its own and does not need to have any access to email storage.
                      </p>
                      <p>
                        <strong>Note:</strong> If you are going to change local Index storage folder, you should also manually move the existing index data to the new location (this operation cannot be done automatically).
                      </p>
                    </div>

                    {/* Radio Options */}
                           <RadioGroup
                             value={state.databaseServiceType}
                             onValueChange={(value) => handleUpdate('databaseServiceType', value)}
                             className="space-y-4"
                           >
                             <div className="space-y-3">
                               <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                                 <RadioGroupItem value="local" id="database-local" />
                                 <Label
                                   htmlFor="database-local"
                                   className="text-sm font-medium text-foreground cursor-pointer uppercase"
                                 >
                                   RUN DATABASE SERVICE LOCALLY
                                 </Label>
                                 {state.databaseServiceType === "local" && (
                                   <>
                                     <Label className="text-sm font-medium text-foreground whitespace-nowrap ml-auto">
                                       LOCAL DATABASE SERVICE PORT
                                     </Label>
                                     <Input
                                       type="number"
                                       value={state.localDatabasePort}
                                       onChange={(e) => handleUpdate('localDatabasePort', e.target.value)}
                                       className="w-32"
                                     />
                                   </>
                                 )}
                               </div>
                               {state.databaseServiceType === "local" && (
                                 <div className="ml-8 flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                                   <Label className="text-sm font-medium text-foreground whitespace-nowrap">
                                     INDEX STORAGE FOLDER
                                   </Label>
                                   <Input
                                     type="text"
                                     value={state.indexStorageFolder}
                                     onChange={(e) => handleUpdate('indexStorageFolder', e.target.value)}
                                     className="flex-1"
                                   />
                                 </div>
                               )}
                             </div>

                             <div className="space-y-3">
                               <div className={`flex items-center space-x-3 bg-card border border-border rounded-lg p-4 ${state.databaseServiceType === "remote" ? "-mt-3" : ""}`}>
                                 <RadioGroupItem value="remote" id="database-remote" />
                                 <Label
                                   htmlFor="database-remote"
                                   className="text-sm font-medium text-foreground cursor-pointer flex-1 uppercase"
                                 >
                                   CONNECT TO REMOTE DATABASE SERVICE
                                 </Label>
                               </div>
                               {state.databaseServiceType === "remote" && (
                                 <div className="ml-8 flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                                   <Label className="text-sm font-medium text-foreground whitespace-nowrap">
                                     REMOTE DATABASE SERVICE URL
                                   </Label>
                                   <Input
                                     type="text"
                                     value={state.remoteDatabaseUrl}
                                     onChange={(e) => handleUpdate('remoteDatabaseUrl', e.target.value)}
                                     placeholder="http://127.0.0.1:25793"
                                     className="flex-1"
                                   />
                                 </div>
                               )}
                      </div>
                    </RadioGroup>
                  </>
                )}

                       {state.wizardStep === 4 && (
                  <>
                    <h3 className="text-lg font-bold text-foreground mb-2 -mt-4">
                      Documents conversion service configuration
                    </h3>

                    <div className="space-y-4 text-sm text-muted-foreground">
                      <p>
                        Documents conversion service is responsible for extracting text from email attachments and from documents stored in WebClient or FileSync locations. IceWarp provides a preconfigured virtual server with Documents conversion service that can be deployed externally from server where IceWarp runs [recommended]. Documents conversion service can also run locally on the same IceWarp system, however in such case it may not be able to convert some document types. Documents conversion service operates on its own and does not need to have any access to email storage.
                      </p>
                    </div>

                    {/* Radio Options */}
                    <RadioGroup
                      value={state.documentsConversionServiceType}
                      onValueChange={(value) => handleUpdate('documentsConversionServiceType', value)}
                      className="space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                          <RadioGroupItem value="local" id="documents-local" />
                          <Label
                            htmlFor="documents-local"
                            className="text-sm font-medium text-foreground cursor-pointer uppercase"
                          >
                            RUN DOCUMENTS CONVERSION SERVICE LOCALLY
                          </Label>
                          {state.documentsConversionServiceType === "local" && (
                            <>
                              <Label className="text-sm font-medium text-foreground whitespace-nowrap ml-auto">
                                LOCAL DOCUMENTS CONVERSION SERVICE PORT
                              </Label>
                              <Input
                                type="number"
                                value={state.localDocumentsConversionPort}
                                onChange={(e) => handleUpdate('localDocumentsConversionPort', e.target.value)}
                                className="w-32"
                              />
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className={`flex items-center space-x-3 bg-card border border-border rounded-lg p-4 ${state.documentsConversionServiceType === "remote" ? "-mt-3" : ""}`}>
                          <RadioGroupItem value="remote" id="documents-remote" />
                          <Label
                            htmlFor="documents-remote"
                            className="text-sm font-medium text-foreground cursor-pointer flex-1 uppercase"
                          >
                            CONNECT TO REMOTE DOCUMENTS CONVERSION SERVICE
                          </Label>
                        </div>
                        {state.documentsConversionServiceType === "remote" && (
                          <div className="ml-8 flex items-center gap-4 bg-card border border-border rounded-lg p-4">
                            <Label className="text-sm font-medium text-foreground whitespace-nowrap">
                              REMOTE DOCUMENTS CONVERSION SERVICE URL
                            </Label>
                            <Input
                              type="text"
                              value={state.remoteDocumentsConversionUrl}
                              onChange={(e) => handleUpdate('remoteDocumentsConversionUrl', e.target.value)}
                              placeholder="http://127.0.0.1:25797"
                              className="flex-1"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className={`flex items-center space-x-3 bg-card border border-border rounded-lg p-4 ${state.documentsConversionServiceType === "disabled" ? "-mt-3" : ""}`}>
                          <RadioGroupItem value="disabled" id="documents-disabled" />
                          <Label
                            htmlFor="documents-disabled"
                            className="text-sm font-medium text-foreground cursor-pointer flex-1 uppercase"
                          >
                            DISABLE DOCUMENTS CONVERSION SERVICE
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </>
                )}

                {state.wizardStep === 5 && (
                  <>
                    <h3 className="text-lg font-bold text-foreground mb-2 -mt-4">
                      Fulltext Search configuration summary
                    </h3>

                    <div className="space-y-4 text-sm text-muted-foreground mb-6">
                      <p>
                        You have now finished configuration of Fulltext Search engine components. Below is summary of your current configuration.
                      </p>
                    </div>

                    {/* Summary Items */}
                    <div className="space-y-4">
                      {/* Scanner Service */}
                      <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
                        <Label className="text-sm font-medium text-foreground whitespace-nowrap">
                          FULLTEXT SEARCH SCANNER RUNS LOCALLY
                        </Label>
                        <Input
                          type="text"
                          value={
                            state.scannerServiceType === "local"
                              ? `http://127.0.0.1:${state.localScannerPort}`
                              : state.remoteScannerUrl || "http://127.0.0.1:25795"
                          }
                          readOnly
                          className="flex-1 border-dashed bg-transparent"
                        />
                      </div>

                      {/* Database Service */}
                      <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
                        <Label className="text-sm font-medium text-foreground whitespace-nowrap">
                          FULLTEXT SEARCH DATABASE RUNS LOCALLY
                        </Label>
                        <Input
                          type="text"
                          value={
                            state.databaseServiceType === "local"
                              ? `http://127.0.0.1:${state.localDatabasePort}`
                              : state.remoteDatabaseUrl || "http://127.0.0.1:25793"
                          }
                          readOnly
                          className="flex-1 border-dashed bg-transparent"
                        />
                      </div>

                      {/* Index Storage Folder */}
                      {state.databaseServiceType === "local" && (
                        <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
                          <Label className="text-sm font-medium text-foreground whitespace-nowrap">
                            INDEX STORAGE FOLDER
                          </Label>
                          <Input
                            type="text"
                            value={state.indexStorageFolder}
                            readOnly
                            className="flex-1 border-dashed bg-transparent"
                          />
                        </div>
                      )}

                      {/* Documents Conversion Service */}
                      {state.documentsConversionServiceType !== "disabled" && (
                        <div className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
                          <Label className="text-sm font-medium text-foreground whitespace-nowrap">
                            DOCUMENTS CONVERSION SERVICE RUNS LOCALLY
                          </Label>
                          <Input
                            type="text"
                            value={
                              state.documentsConversionServiceType === "local"
                                ? `http://127.0.0.1:${state.localDocumentsConversionPort}`
                                : state.remoteDocumentsConversionUrl || "http://127.0.0.1:25797"
                            }
                            readOnly
                            className="flex-1 border-dashed bg-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
                {state.wizardStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => handleUpdate('wizardStep', state.wizardStep - 1)}
                    className="bg-muted hover:bg-muted/80 text-foreground border-border"
                  >
                    BACK
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleUpdate('isWarningModalOpen', true)}
                  className="bg-muted hover:bg-muted/80 text-foreground border-border"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={() => {
                    if (state.wizardStep === 1 && state.enableFulltextSearch) {
                      handleUpdate('wizardStep', 2);
                    } else if (state.wizardStep === 1) {
                      handleUpdate('isFulltextSearchModalOpen', false);
                    } else if (state.wizardStep === 2) {
                      handleUpdate('wizardStep', 3);
                    } else if (state.wizardStep === 3) {
                      handleUpdate('wizardStep', 4);
                    } else if (state.wizardStep === 4) {
                      handleUpdate('wizardStep', 5);
                    } else if (state.wizardStep === 5) {
                      // Handle save logic here
                      handleUpdate('isFulltextSearchModalOpen', false);
                    } else {
                      handleUpdate('isFulltextSearchModalOpen', false);
                    }
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {state.wizardStep === 1
                    ? state.enableFulltextSearch
                      ? "CONTINUE"
                      : "SAVE"
                    : state.wizardStep === 5
                    ? "SAVE"
                    : "CONTINUE"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning Modal */}
      <AnimatePresence>
        {state.isWarningModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[110]"
            onClick={() => handleUpdate('isWarningModalOpen', false)}
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
                  onClick={() => handleUpdate('isWarningModalOpen', false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 border-b border-border">
                <p className="text-center text-foreground">
                  Do you want to save the changes?
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleUpdate('isWarningModalOpen', false)}
                  className="bg-muted hover:bg-muted/80 text-foreground border-border"
                >
                  CANCEL
                </Button>
                <Button
                  onClick={() => {
                    handleUpdate('isWarningModalOpen', false);
                    handleUpdate('isFulltextSearchModalOpen', false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  DO NOT SAVE
                </Button>
                <Button
                  onClick={() => {
                    // Handle save logic here
                    handleUpdate('isWarningModalOpen', false);
                    handleUpdate('isFulltextSearchModalOpen', false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
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
