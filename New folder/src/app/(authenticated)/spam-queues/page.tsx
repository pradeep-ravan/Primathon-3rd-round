"use client";

import React, { useState } from "react";
import { Shield, Ban, Archive, ChevronDown, Plus, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpamQueueFilters } from "@/components/spam-queues/SpamQueueFilters";
import {
  SpamQueueTable,
  SpamQueueEntry,
} from "@/components/spam-queues/SpamQueueTable";
import {
  AccountSelectionModal,
  Account,
} from "@/components/spam-queues/AccountSelectionModal";
import { SideTabsLayout } from "@/components/ui/layout/SideTabsLayout";
import { TabContent } from "@/components/ui/layout/TabContent";
import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { id: "quarantine", label: "Quarantine", icon: Archive },
  { id: "whitelist", label: "Whitelist", icon: Shield },
  { id: "blacklist", label: "Blacklist", icon: Ban },
];

export default function SpamQueuesPage() {
  const [activeTab, setActiveTab] = useState("whitelist");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    sender: "",
    owner: "admin@icewarpindia.onice.io",
  });

  // Sample data for each tab
  const quarantineData: SpamQueueEntry[] = [
    {
      sender: "suspicious@spam.com",
      date: "2025/11/09 16:45:33",
      owner: "admin@icewarpindia.onice.io",
      domain: "icewarpindia.onice.io",
    },
    {
      sender: "phishing@malware.net",
      date: "2025/11/09 15:20:15",
      owner: "kamal-emor@icewarpindia.onice.io",
      domain: "icewarpindia.onice.io",
    },
  ];

  const whitelistData: SpamQueueEntry[] = [
    {
      sender: "test@gmail.com",
      date: "2025/11/09 14:07:37",
      owner: "kamal-emor@icewarpindia.onice.io",
      domain: "icewarpindia.onice.io",
    },
    {
      sender: "test@gmail.com",
      date: "2025/11/09 14:04:49",
      owner: "admin@icewarpindia.onice.io",
      domain: "icewarpindia.onice.io",
    },
  ];

  const blacklistData: SpamQueueEntry[] = [
    {
      sender: "blocked@example.com",
      date: "2025/11/09 15:30:22",
      owner: "admin@icewarpindia.onice.io",
      domain: "icewarpindia.onice.io",
    },
    {
      sender: "spam@malicious.com",
      date: "2025/11/09 14:15:10",
      owner: "kamal-emor@icewarpindia.onice.io",
      domain: "icewarpindia.onice.io",
    },
  ];

  const availableDomains = ["icewarpindia.onice.io", "newdm.com"];

  const handleFilter = (filters: {
    sender: string;
    owner: string;
    domain: string;
  }) => {
    // Handle filter logic here
    console.log("Filter applied", filters);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setAddFormData({
      sender: "",
      owner: "admin@icewarpindia.onice.io",
    });
  };

  const handleSaveAdd = () => {
    // Handle save logic here
    console.log("Saving entry", addFormData);
    // TODO: Add API call to save the entry
    handleCloseAddModal();
  };

  const handleAccountSelect = (account: Account) => {
    setAddFormData((prev) => ({
      ...prev,
      owner: account.email,
    }));
    setIsAccountModalOpen(false);
  };

  const renderTabContent = (activeTab: string) => {
    let data: SpamQueueEntry[] = [];
    
    switch (activeTab) {
      case "quarantine":
        data = quarantineData;
        break;
      case "whitelist":
        data = whitelistData;
        break;
      case "blacklist":
        data = blacklistData;
        break;
      default:
        data = quarantineData;
    }

    return (
      <div className="space-y-6">
        <SpamQueueFilters
          key={activeTab}
          domains={availableDomains}
          onFilter={handleFilter}
        />
        <SpamQueueTable data={data} />
      </div>
    );
  };

  return (
    <>
      <SideTabsLayout
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        header={
          <div>
            <h1 className="text-xl font-bold text-primary">SPAM QUEUES</h1>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-muted hover:bg-muted/80 text-foreground border-border"
            >
              SELECT ACTION
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={handleAddClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              ADD
            </Button>
          </div>
        }
      >
        <TabContent activeTab={activeTab}>
          {(tab) => renderTabContent(tab)}
        </TabContent>
      </SideTabsLayout>

      {/* ADD Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-4">
          <div className="flex h-auto min-h-[400px] max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-background shadow-2xl">
            <div className="shrink-0 flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] text-primary">
                  ADD
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="rounded-full p-2 text-muted-foreground transition hover:bg-muted"
                aria-label="Close add modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 px-6 py-6 min-h-0">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  SENDER
                </label>
                <input
                  type="text"
                  placeholder="Sender"
                  value={addFormData.sender}
                  onChange={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      sender: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  OWNER
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Owner"
                    value={addFormData.owner}
                    onChange={(e) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        owner: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-border bg-background px-4 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setIsAccountModalOpen(true)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"
                    aria-label="Select account"
                  >
                    <User className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="shrink-0 border-t border-border px-6 py-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSaveAdd}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Selection Modal */}
      <AccountSelectionModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSelect={handleAccountSelect}
        domainName="ICEWARPINDIA.ONICE.IO"
      />
    </>
  );
}

