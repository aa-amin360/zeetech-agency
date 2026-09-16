/**
 * JSDoc Type Definitions and Data Contracts
 */

/**
 * @typedef {Object} Project
 * @property {number} id
 * @property {string} title
 * @property {string} category
 * @property {string} description
 * @property {string} client_name
 * @property {string} client_role
 * @property {string} client_avatar
 * @property {string} project_type
 * @property {string} duration
 * @property {string} bg_color
 * @property {string} text_color
 * @property {string} image_url
 * @property {number} sort_order
 */

/**
 * @typedef {Object} Brand
 * @property {number} id
 * @property {string} name
 * @property {string} logo_url
 * @property {number} row - 1 (Right->Left) or 2 (Left->Right)
 * @property {number} sort_order
 */

/**
 * @typedef {Object} Testimonial
 * @property {number} id
 * @property {string} client_name
 * @property {string} client_role
 * @property {string} client_company
 * @property {string} avatar_url
 * @property {string} quote
 * @property {number} rating
 * @property {string} platform
 * @property {boolean} is_featured
 */

/**
 * @typedef {Object} Statistic
 * @property {number} id
 * @property {number} value
 * @property {string} prefix
 * @property {string} suffix
 * @property {string} label
 * @property {number} sort_order
 */

export {};
