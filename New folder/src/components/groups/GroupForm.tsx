import React from 'react';
import { CustomAddForm } from '@/components/custom/CustomAddForm';
import { createGroupFormConfig } from './GroupFormConfig';
import { GroupData } from '@/types/groups';

interface GroupFormProps {
  item?: GroupData;
  onClose: () => void;
  onSuccess: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ item, onClose, onSuccess }) => {
  const config = createGroupFormConfig(item, onClose, onSuccess);

  return (
    <CustomAddForm
      config={config}
      item={item}
    />
  );
};

export default GroupForm;
