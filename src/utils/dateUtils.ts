export const formatDualDateWithMonthNames = (dateString?: string) => {
    if (!dateString) return '-'
    
    try {
        const date = new Date(dateString)
        const hijriDate = toHijri(date)
        
        // أسماء الأشهر الهجرية
        const hijriMonths = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 
            'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 
            'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ]
        
        const gregorian = format(date, 'dd MMMM yyyy')
        const hijri = `${hijriDate.day} ${hijriMonths[hijriDate.month - 1]} ${hijriDate.year} هـ`
        
        return `${gregorian} (${hijri})`
    } catch {
        return dateString
    }
}