import React from 'react';
import { CustomAddForm } from '@/components/custom/CustomAddForm';
import { createGroupFormConfig } from './GroupFormConfig';

interface AddGroupFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddGroupForm: React.FC<AddGroupFormProps> = ({ onClose, onSuccess }) => {
  const config = createGroupFormConfig(undefined, onClose, onSuccess);

  return (
    <CustomAddForm
      config={config}
    />
  );
};

export default AddGroupForm;
