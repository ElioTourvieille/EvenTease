import { ReactNode, useState } from 'react';

interface SidebarLinkGroupProps {
    children: (handleClick: () => void) => ReactNode;
}

const SidebarLinkGroup = ({
                              children,
                              activeCondition,
                          }: SidebarLinkGroupProps) => {
    const [open, setOpen] = useState(activeCondition);

    const handleClick = () => {
        setOpen(!open);
    };

    return <li>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;
