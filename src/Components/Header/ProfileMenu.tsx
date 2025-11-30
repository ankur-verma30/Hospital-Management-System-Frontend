import { Menu, Text, Avatar } from '@mantine/core';
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight
} from '@tabler/icons-react';
import AvatarImage from '../../assets/avatar.png';
import { useSelector } from 'react-redux';

const ProfileMenu=()=> {
  const user=useSelector((state:any)=> state.user);
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <div className='flex items-center gap-3 cursor-pointer'>
          <span className='font-medium text-lg text-neutral-900'>{user.name}</span>
          <Avatar variant='filled' src={AvatarImage} size={45} alt="it's me"/>
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
        <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
        <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
        <Menu.Item
          icon={<IconSearch size={14} />}
          rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
        >
          Search
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
        <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default ProfileMenu;