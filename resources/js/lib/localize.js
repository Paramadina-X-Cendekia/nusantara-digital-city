/**
 * Localize a field from a data object based on current language.
 * 
 * If lang is 'en' and a '_en' version of the field exists, return that.
 * Otherwise return the original field value.
 * 
 * Usage: loc(item, 'description', lang)
 *   → returns item.description_en if lang === 'en' and it exists
 *   → returns item.description otherwise
 * 
 * @param {Object} item - The data object (e.g., landmark, destination)
 * @param {string} field - The field name (e.g., 'description', 'artName')
 * @param {string} lang - Current language ('id' or 'en')
 * @returns {string} The localized value
 */
export function loc(item, field, lang) {
    if (!item) return '';
    
    if (lang === 'en') {
        const enField = field + '_en';
        if (item[enField] && item[enField].trim() !== '') {
            return item[enField];
        }
    }
    
    return item[field] || '';
}

/**
 * Shorthand: create a localization function bound to a specific language.
 * 
 * Usage:
 *   const l = createLoc(lang);
 *   l(item, 'description')
 */
export function createLoc(lang) {
    return (item, field) => loc(item, field, lang);
}
