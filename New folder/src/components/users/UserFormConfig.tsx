import React, { useMemo } from "react";
import { Save, User } from "lucide-react";
import { User as UserType } from "@/types/user";
import {
  CustomAddFormConfig,
  FieldType,
} from "@/components/custom/CustomAddForm";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { useDomains } from "@/hooks/useDomains";
import toast from "react-hot-toast";

// Password generation function
const generatePassword = (): string => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  return password.split("").sort(() => Math.random() - 0.5).join("");
};

export const createUserFormConfig = (
  user?: UserType,
  onClose?: () => void,
  onSuccess?: () => void
): CustomAddFormConfig<UserType> => {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  // Fetch domains for the domain dropdown
  const { data: domainsData } = useDomains({
    page: 0,
    limit: 250,
    search_query: "",
    sort: "name:asc",
  });

  const domains = useMemo(() => domainsData?.items || [], [domainsData?.items]);
  const domainOptions = useMemo(
    () =>
      domains.map((domain) => ({
        value: domain.id,
        label: domain.name,
      })),
    [domains]
  );

  const handleSubmit = async (data: any) => {
    try {
      // Get selected domain and construct email
      const selectedDomain = domains.find((d) => d.id === data.domain_id);
      const displayEmail = selectedDomain
        ? `${data.alias}@${selectedDomain.name}`
        : data.alias;

      if (user) {
        // Update existing user
        await updateUserMutation.mutateAsync({
          id: user.id,
          data: {
            alias: data.alias,
            display_email: displayEmail,
            first_name: data.first_name,
            last_name: data.last_name,
          },
        });
        toast.success("User updated successfully", {
          duration: 4000,
          style: {
            background: "#10b981",
            color: "#fff",
          },
        });
      } else {
        // Create new user - validate domain_id is provided
        if (!data.domain_id) {
          toast.error("Please select a domain", {
            duration: 4000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          });
          throw new Error("Domain is required");
        }

        // Create new user using domain-specific endpoint
        await createUserMutation.mutateAsync({
          alias: data.alias,
          display_email: displayEmail,
          type: "ACCOUNT",
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
          domain_id: data.domain_id, // Pass domain_id to use domain-specific endpoint
          send_welcome_email: false,
        });
        toast.success("User created successfully", {
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

  // Find user's domain if editing
  const userDomain = user
    ? domains.find((d) => user.display_email?.endsWith(`@${d.name}`))
    : null;

  return {
    title: user ? "EDIT USER" : "CREATE NEW USER",
    description: user
      ? "Update the user information and settings"
      : "Create a new user with the required information",
    fields: [
      {
        name: "first_name",
        label: "FIRST NAME",
        type: FieldType.TEXT,
        placeholder: "Name",
        required: true,
        validation: {
          minLength: 2,
        },
        gridCols: 1,
      },
      {
        name: "last_name",
        label: "LAST NAME",
        type: FieldType.TEXT,
        placeholder: "Last Name",
        required: true,
        validation: {
          minLength: 2,
        },
        gridCols: 1,
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
      {
        name: "password",
        label: "PASSWORD",
        type: FieldType.PASSWORD_WITH_GENERATE,
        required: !user, // Required only for new users
        validation: {
          minLength: 12,
        },
        showPasswordConditions: true,
        passwordConditions: [
          "Password cannot contain username or alias",
          "Minimal password length: 12",
          "Number of numeric characters in password [0-9]: 1",
          "Number of alpha characters in password [a-z][A-Z]: 1",
        ],
        gridCols: 2,
      },
      {
        name: "must_change_password",
        label: "",
        type: FieldType.CHECKBOX,
        checkboxLabel:
          "USER NEEDS TO CHANGE THE PASSWORD AFTER THE FIRST LOGIN",
        gridCols: 2,
      },
    ],
    submitText: user ? "UPDATE USER" : "CREATE USER",
    cancelText: "CANCEL",
    onSubmit: handleSubmit,
    onCancel: onClose || (() => {}),
    isLoading: createUserMutation.isPending || updateUserMutation.isPending,
    defaultValues: user
      ? {
          first_name: user.v_card?.first_name || "",
          last_name: user.v_card?.surname || "",
          alias: user.alias || "",
          domain_id: userDomain?.id || domains[0]?.id || "",
          password: "",
          must_change_password: false,
        }
      : {
          first_name: "",
          last_name: "",
          alias: "",
          domain_id: domains[0]?.id || "",
          password: "",
          must_change_password: false,
        },
    submitButtonVariant: "default",
    submitButtonIcon: <Save className="h-4 w-4" />,
    cancelButtonVariant: "outline",
    showHeader: true,
    showActions: true,
  };
};
