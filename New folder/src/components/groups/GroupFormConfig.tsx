import React, { useMemo } from "react";
import { Save, Users } from "lucide-react";
import { GroupData } from "@/types/groups";
import {
  CustomAddFormConfig,
  FieldType,
} from "@/components/custom/CustomAddForm";
import { useCreateGroup, useUpdateGroup } from "@/hooks/useGroups";
import { groupsApi } from "@/services/groupsApi";
import toast from "react-hot-toast";
import { useDomains } from "@/hooks/useDomains";

// Form data interface that includes the alias field
interface GroupFormData {
  name: string;
  alias: string;
  domain_id?: string;
}

export const createGroupFormConfig = (
  group?: GroupData,
  onClose?: () => void,
  onSuccess?: () => void
): CustomAddFormConfig<GroupFormData> => {
  const createGroupMutation = useCreateGroup();
  const updateGroupMutation = useUpdateGroup();

  const handleSubmit = async (data: GroupFormData) => {
    try {
      console.log("form submitted:",data)
      if (group) {
        // Update existing group
        await updateGroupMutation.mutateAsync({
          id: group.id,
          data: {
            name: data.name,
            email: data.alias ? `${data.alias}@icewarpind1.onice.io` : group.email,
            memberCount: group.memberCount,
            status: group.status,
            permissions: group.permissions,
          },
        });
        toast.success("Group updated successfully", {
          duration: 4000,
          style: {
            background: "#10b981",
            color: "#fff",
          },
        });
      } else {
        // Create new group
      
        
        const result = await createGroupMutation.mutateAsync({
          name: data.name,
          email: `${data.alias}@${domainName}`,
          domain_id: data.domain_id || 'icewarpind1.onice.io',
          type: 'group',
          status: 'active',
          memberCount: 0,
          permissions: {
            meetingsupport: '0',
            desktopsupport: '0',
            activesyncsupport: '0',
            recordingsupport: '0',
          },
        });
        console.log("result:",result);

        toast.success("Group created successfully", {
          duration: 4000,
          style: {
            background: "#10b981",
            color: "#fff",
          },
        });
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      throw error;
    }
  };

const {data:domainsData}=useDomains({
  page:0,
  limit:250,
  search_query:"",
  sort:"name:asc",
})

const domains=useMemo(()=>domainsData?.items || [],[domainsData?.items]);

  const domainOptions=useMemo(()=>
  domains.map((domain)=>({
    value:domain.id,
    label:domain.name
  })),[domains]
  )

  return {
    title: group ? "Edit Group" : "Add New Group",
    description: group 
      ? "Update group information and settings" 
      : "Create a new group with settings and permissions",
    fields: [
      {
        name: "name",
        label: "GROUP NAME",
        type: FieldType.TEXT,
        placeholder: "Name",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 50,
        },
      },
      {
        name: "alias",
        label: "ALIAS",
        type: FieldType.ALIAS_WITH_DOMAIN,
        placeholder: "Alias",
        required: true,
        validation: {
          pattern: /^[a-zA-Z0-9._-]+$/,
          minLength: 3,
          maxLength: 50,
        },
        domainOptions: domainOptions,
        domainFieldName: "domain_id",
        gridCols: 2,
      },
      // {
      //   name: "alias",
      //   label: "ALIAS",
      //   type: FieldType.TEXT,
      //   placeholder: "Alias",
      //   required: true,
      //   validation: {
      //     minLength: 2,
      //     maxLength: 50,
      //   },
      //   domainOptions: domainOptions,
      //   domainFieldName: "domain_id",
      //   gridCols: 2,
      //   // description: "@icewarpind1.onice.io",
      // },
    ],
    submitText: group ? "Update Group" : "Create Group",
    cancelText: "Cancel",
    onSubmit: handleSubmit,
    onCancel: onClose || (() => {}),
    submitButtonIcon: <Save className="h-4 w-4" />,
    defaultValues: group ? {
      name: group.name || "",
      alias: group.email ? group.email.split('@')[0] : "",
    } : {
      name: "",
      alias: "",
    },
  };
};