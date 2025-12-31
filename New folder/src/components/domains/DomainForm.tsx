"use client";

import React from "react";
import { CustomAddForm } from "@/components/custom/CustomAddForm";
import { createDomainFormConfig } from "./DomainFormConfig";
import { Domain } from "@/types/domain";

interface DomainFormProps {
  domain?: Domain;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DomainForm({ domain, onClose, onSuccess }: DomainFormProps) {
  const config = createDomainFormConfig(domain, onClose, onSuccess);

  return <CustomAddForm config={config} item={domain} />;
}
