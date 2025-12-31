"use client";

import React from "react";
import { CustomAddForm } from "@/components/custom/CustomAddForm";
import { createUserFormConfig } from "./UserFormConfig";
import { User } from "@/types/user";

interface UserFormProps {
  user?: User;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UserForm({ user, onClose, onSuccess }: UserFormProps) {
  const config = createUserFormConfig(user, onClose, onSuccess);

  return <CustomAddForm config={config} item={user} />;
}
