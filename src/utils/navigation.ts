// utils/navigation.ts
import { NAV_ITEM_TYPE_COLLAPSE } from '@/constants/navigation.constant'
import { hasPermission } from './auth'
import type { NavigationTree } from '@/@types/navigation'

export const filterNavigation = (
    navigation: NavigationTree[],
    userAuthority: string[]
): NavigationTree[] => {
    return navigation.reduce<NavigationTree[]>((filtered, item) => {
        const hasItemPermission = hasPermission(userAuthority, item.authority)

        if (!hasItemPermission) {
            return filtered
        }

        // تصفية subMenu إذا كان العنصر من نوع COLLAPSE
        if (item.subMenu && item.subMenu.length > 0) {
            const filteredSubMenu = filterNavigation(item.subMenu, userAuthority)
            if (filteredSubMenu.length === 0 && item.type === NAV_ITEM_TYPE_COLLAPSE) {
                return filtered
            }
            filtered.push({
                ...item,
                subMenu: filteredSubMenu,
            })
        } else {
            filtered.push(item)
        }

        return filtered
    }, [])
}