"use client";

import React, { useState } from "react";
import { Domain } from "@/types/domain";
import { DomainConfiguration } from "./DomainConfiguration";

interface DomainConfigurationModalProps {
  domain: Domain | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedDomain: Domain) => void;
}

export function DomainConfigurationModal({
  domain,
  isOpen,
  onClose,
  onSave,
}: DomainConfigurationModalProps) {
  if (!isOpen || !domain) return null;

  return (
    <DomainConfiguration domain={domain} onClose={onClose} onSave={onSave} />
  );
}
