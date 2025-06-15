import {
    HiColorSwatch,
    HiDesktopComputer,
    HiTemplate,
    HiViewGridAdd,
    HiOutlineUserGroup,
    HiOutlineUserAdd,
    HiPlusCircle,
    HiClipboardList,
    HiViewList
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    clients: <HiOutlineUserGroup />,
    createService: <HiPlusCircle />,
    iconService: <HiClipboardList />,
    listService: <HiViewList />,
    createClient: <HiOutlineUserAdd />,
    singleMenu: <HiViewGridAdd />,
    collapseMenu: <HiTemplate />,
    groupSingleMenu: <HiDesktopComputer />,
    groupCollapseMenu: <HiColorSwatch />,
}

export default navigationIcon
