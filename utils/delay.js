/**
 * @param {number} timeMs
 * @returns {Promise<undefined>}
 */
export default timeMs => new Promise(resolve => setTimeout(() => resolve(), timeMs));
