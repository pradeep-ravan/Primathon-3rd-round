"use client";

import React, { useState } from "react";
import {
  User,
  Key,
  Search,
  Sparkles,
  FileText,
  Shield,
  Plus,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnimatePresence, motion } from "framer-motion";
import { SideTabsLayout } from "@/components/ui/layout/SideTabsLayout";
import { TabContent } from "@/components/ui/layout/TabContent";
import { LucideIcon } from "lucide-react";
import { 
  LoginPolicyTab,
  type LoginPolicyState,
  PasswordPolicyTab,
  type PasswordPolicyState,
  SmartDiscoverTab,
  type SmartDiscoverState,
  FulltextSearchTab,
  type FulltextSearchState,
  OAuthProvidersTab,
  type OAuthProvidersState,
  CertificatesTab,
  type CertificatesState
} from "@/components/server-settings";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { id: "login-policy", label: "Login policy", icon: User },
  { id: "password-policy", label: "Password policy", icon: Key },
  { id: "fulltext-search", label: "Fulltext Search", icon: Search },
  { id: "smartdiscover", label: "SmartDiscover", icon: Sparkles },
  { id: "certificates", label: "Certificates", icon: FileText },
  { id: "oauth-providers", label: "OAuth providers", icon: Shield },
];

export default function ServerSettingsPage() {
  const [activeTab, setActiveTab] = useState("login-policy");

  // Login Policy state - consolidated into single object
  const [loginPolicyState, setLoginPolicyState] = useState<LoginPolicyState>({
    blockFailedAttempts: false,
    failedAttemptsCount: "5",
    blockDuration: "2",
    loginPolicyMode: "Do not block but delay authentication process",
    requireAdminAuth: false,
    usersLoginWith: "usernames",
    convertCharacters: false,
    useAccountLoginIPRestriction: false,
  });

  // Password Policy state - consolidated into single object
  const [passwordPolicyState, setPasswordPolicyState] = useState<PasswordPolicyState>({
    passwordPolicyActive: true,
    passwordCannotContainUsername: true,
    enablePasswordEncryption: true,
    minimalPasswordLength: "12",
    numericCharactersCount: "1",
    nonAlphaNumericCharactersCount: "",
    alphaCharactersCount: "1",
    uppercaseAlphaCharactersCount: "",
    passwordExpirationActive: true,
    passwordExpiresAfter: "",
    notifyBeforeExpiration: false,
    notifyBeforeExpirationDays: "",
    adminAutologoutTimeout: "",
  });

  // Fulltext Search state - consolidated into single object
  const [fulltextSearchState, setFulltextSearchState] = useState<FulltextSearchState>({
    isFulltextSearchModalOpen: false,
    isWarningModalOpen: false,
    enableFulltextSearch: false,
    wizardStep: 1,
    scannerServiceType: "local",
    localScannerPort: "25795",
    remoteScannerUrl: "",
    databaseServiceType: "local",
    localDatabasePort: "25793",
    indexStorageFolder: "/opt/icewarp/mail/_yodaidx/",
    remoteDatabaseUrl: "",
    documentsConversionServiceType: "local",
    localDocumentsConversionPort: "25797",
    remoteDocumentsConversionUrl: "",
  });

  // SmartDiscover state - consolidated into single object
  const [smartDiscoverState, setSmartDiscoverState] = useState<SmartDiscoverState>({
    publicHostname: "icewarpindia.onice.io",
    smtpHostname: "icewarpindia.onice.io",
    smtpStandard: "Standard",
    pop3Hostname: "icewarpindia.onice.io",
    pop3Standard: "Standard",
    imapHostname: "icewarpindia.onice.io",
    imapStandard: "Standard",
    xmppHostname: "icewarpindia.onice.io",
    xmppStandard: "Standard",
    sipHostname: "icewarpindia.onice.io",
    sipStandard: "Standard",
    mobilesyncUrl: "https://icewarpindia.onice.io/Microsoft-Server-ActiveSync/",
    webdavUrl: "https://icewarpindia.onice.io/webdav/",
    webclientUrl: "https://icewarpindia.onice.io/webmail/",
    webadminUrl: "https://icewarpindia.onice.io/admin/",
    freebusyUrl: "https://icewarpindia.onice.io/freebusy/",
    internetCalendarUrl: "https://icewarpindia.onice.io/calendar/",
    smsUrl: "https://icewarpindia.onice.io/sms/",
    antiSpamReportsUrl: "https://icewarpindia.onice.io/reports/",
    installUrl: "https://icewarpindia.onice.io/install/",
    teamchatUrl: "https://icewarpindia.onice.io/teamchatapi/",
    collaborationApiUrl: "https://icewarpindia.onice.io/collaboration/",
    conferenceUrl: "https://icewarpindia.onice.io/conference/",
  });

  // OAuth Providers state - consolidated into single object
  const [oauthProvidersState, setOauthProvidersState] = useState<OAuthProvidersState>({
    oauthProviders: [],
    isOAuthProviderModalOpen: false,
    isOAuthSecretModalOpen: false,
    isDeleteModalOpen: false,
    deletingProviderIndex: null,
    isEditMode: false,
    editingProviderIndex: null,
    oauthSecret: "",
    oauthProviderForm: {
      clientId: "",
      provider: "",
      description: "",
      redirectUri: "",
      authType: "Standard",
    },
  });

  // Certificates state - consolidated into single object
  const [certificatesState, setCertificatesState] = useState<CertificatesState>({
    certificates: [
      {
        id: "1",
        type: "Standard",
        hostname: "*.onice.io, onice.io",
        ipAddress: "All",
        expiration: "2026/08/11",
        isActive: true,
      },
    ],
    selectedCertificates: [],
    isCertificateOptionsModalOpen: false,
    isAddExistingModalOpen: false,
    isIceWarpCertificateModalOpen: false,
    certificateInput: "",
    certificateFileName: "",
    iceWarpCertificateForm: {
      hostnames: ["icewarpindia.onice.io"],
      email: "jan.samek2@icewarp.com",
      organization: "IceWarp India1",
      unit: "Unit",
      city: "Praha",
      state: "",
      country: "CZ",
      validity: "1 year",
      bits: "3072",
    },
  });

  // Generate random OAuth secret
  const generateOAuthSecret = () => {
    const chars = "0123456789ABCDEF";
    let secret = "";
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
  };

  // Generate random Client ID
  const generateClientId = () => {
    const chars = "0123456789ABCDEF";
    let clientId = "";
    for (let i = 0; i < 32; i++) {
      clientId += chars[Math.floor(Math.random() * chars.length)];
    }
    return clientId.toUpperCase();
  };

  const renderTabContent = (activeTab: string) => {
    if (activeTab === "login-policy") {
      return (
        <LoginPolicyTab
          state={loginPolicyState}
          setState={setLoginPolicyState}
        />
      );
    }

    if (activeTab === "password-policy") {
      return (
        <PasswordPolicyTab
          state={passwordPolicyState}
          setState={setPasswordPolicyState}
        />
      );
    }

    if (activeTab === "smartdiscover") {
      return (
        <SmartDiscoverTab
          state={smartDiscoverState}
          updateState={(updates) => setSmartDiscoverState((prev) => ({ ...prev, ...updates }))}
        />
      );
    }

    if (activeTab === "oauth-providers") {
      return (
        <OAuthProvidersTab
          state={oauthProvidersState}
          updateState={(updates) => setOauthProvidersState((prev) => ({ ...prev, ...updates }))}
          generateOAuthSecret={generateOAuthSecret}
          generateClientId={generateClientId}
        />
      );
    }

    if (activeTab === "fulltext-search") {
      return (
        <FulltextSearchTab
          state={fulltextSearchState}
          updateState={(updates) => setFulltextSearchState((prev) => ({ ...prev, ...updates }))}
        />
      );
    }

    if (activeTab === "certificates") {
      return (
        <CertificatesTab
          state={certificatesState}
          updateState={(updates) => setCertificatesState((prev) => ({ ...prev, ...updates }))}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {tabs.find((tab) => tab.id === activeTab)?.label || "Settings"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Configuration options for{" "}
            {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase() ||
              "this section"} will be displayed here.
          </p>
        </div>
      </div>
    );
  };

  return (
    <SideTabsLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      header={
        <div>
          <h1 className="text-xl font-bold text-primary">SERVER SETTINGS</h1>
        </div>
      }
      actions={
        (activeTab === "login-policy" || activeTab === "password-policy") ? (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            SAVE
          </Button>
        ) : undefined
      }
    >
      <TabContent activeTab={activeTab}>
        {(tab) => renderTabContent(tab)}
      </TabContent>
    </SideTabsLayout>
  );
}

