import { CallIcon, StatusIcon, ProfileIcon, MessagesIcon, SettingIcon } from "@/svgs";

export const MenuSidebarItems = [
    {
        name: 'Chats',
        link: '/chat',
        icons: (props: { width?: string; height?: string; className?: string; color?: string }) => <MessagesIcon {...props} />
    },
    {
        name: 'Calls',
        link: '/calls',
        icons: (props: { width?: string; height?: string; className?: string; color?: string }) => <CallIcon {...props} />
    },
    {
        name: 'Status',
        link: '/status',
        icons: (props: { width?: string; height?: string; className?: string; color?: string }) => <StatusIcon {...props} />
    },
    {
        name: 'Settings',
        link: '/setting',
        icons: (props: { width?: string; height?: string; className?: string; color?: string }) => <SettingIcon {...props} />
    },
    {
        name: 'Profile',
        link: '/profile',
        icons: (props: { width?: string; height?: string; className?: string; color?: string }) => <ProfileIcon {...props} />
    },
]