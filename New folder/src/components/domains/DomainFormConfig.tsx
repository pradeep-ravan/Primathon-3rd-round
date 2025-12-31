import React from "react";
import { Save, Globe } from "lucide-react";
import { Domain } from "@/types/domain";
import {
  CustomAddFormConfig,
  FieldType,
} from "@/components/custom/CustomAddForm";
import { useCreateDomain, useUpdateDomain } from "@/hooks/useDomains";
import { domainApi } from "@/services/domainApi";
import toast from "react-hot-toast";

export const createDomainFormConfig = (
  domain?: Domain,
  onClose?: () => void,
  onSuccess?: () => void
): CustomAddFormConfig<Domain> => {
  const createDomainMutation = useCreateDomain();
  const updateDomainMutation = useUpdateDomain();

  const handleSubmit = async (data: Domain) => {
    try {
      if (domain) {
        // Update existing domain
        await updateDomainMutation.mutateAsync({
          id: domain.id,
          data: {
            name: data.name,
            domain_type: domain.domain_type, // Keep existing domain type
            description: domain.description || "", // Keep existing description
          },
        });
        toast.success("Domain updated successfully", {
          duration: 4000,
          style: {
            background: "#10b981",
            color: "#fff",
          },
        });
        
        // Call success callback to refetch data
        onSuccess?.();
        
        // Close modal after a short delay to ensure toast is visible
        setTimeout(() => {
          onClose?.();
        }, 100);
      } else {
        // Create new domain - send only name field
        const newDomain = await createDomainMutation.mutateAsync({
          name: data.name,
        });
        
        // Show success toast
        toast.success("Domain created successfully", {
          duration: 4000,
          style: {
            background: "#10b981",
            color: "#fff",
          },
        });
        
        // Call success callback to refetch data
        onSuccess?.();
        
        // Close modal after a short delay to ensure toast is visible
        setTimeout(() => {
          onClose?.();
        }, 100);
      }
    } catch (error) {
      // Re-throw error so CustomAddForm can handle it
      throw error;
    }
  };

  return {
    title: domain ? "Edit Domain" : "Add New Domain",
    description: domain
      ? "Update the domain information and settings"
      : "Create a new domain with the required information",
    fields: [
      {
        name: "name",
        label: "Domain Name",
        type: FieldType.TEXT,
        placeholder: "Enter domain name (e.g., example.com)",
        required: true,
        validation: {
          pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/,
          minLength: 3,
          maxLength: 253,
          custom: (value: string) => {
            if (!domainApi.isValidDomainName(value)) {
              return "Invalid domain name format";
            }
            return true;
          },
        },
        description:
          "Enter the full domain name including the top-level domain",
        gridCols: 2,
      },
    ],
    submitText: domain ? "Update Domain" : "Create Domain",
    cancelText: "Cancel",
    onSubmit: handleSubmit,
    onCancel: onClose || (() => {}),
    isLoading: createDomainMutation.isPending || updateDomainMutation.isPending,
    defaultValues: domain
      ? {
          name: domain.name,
        }
      : {},
    submitButtonVariant: "default",
    submitButtonIcon: <Save className="h-4 w-4" />,
    cancelButtonVariant: "outline",
    showHeader: true,
    showActions: true,
  };
};
