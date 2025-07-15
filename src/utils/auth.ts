// utils/auth.ts

export const hasPermission = (
    userAuthority: string[], // الصلاحيات أو الأدوار التي يمتلكها المستخدم
    requiredAuthority?: (string | string[])[] // الصلاحيات المطلوبة للعنصر
): boolean => {
    if (!requiredAuthority || requiredAuthority.length === 0) {
        return true // إذا لم يكن هناك صلاحيات مطلوبة، يعتبر مسموحاً للجميع
    }

    return requiredAuthority.some((auth) => {
        if (Array.isArray(auth)) {
            return auth.every((subAuth) => userAuthority.includes(subAuth))
        }
        return userAuthority.includes(auth)
    })
}