/**
 * Custom logger (adds a prefix to the message)
 * @param message
 */
function log (...message: string[]) {
  console.log('[wp-update-version]', ...message);
}

export default log;
