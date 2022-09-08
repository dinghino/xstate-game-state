/** normalize values */
export function normalize(v: number, min: number, max: number) {
  return (v - min) / (max - min);
}
/**
 * "centers" a value in a range between 0 and max
 * normalizing it between -(max/2) and (max/2).
 * @param reverse if true output range is reversed (m/2) to -(m/2)
 */
export function center(value: number, max: number, reverse = false) {
  return (value * (max * 2) - max) * (reverse ? -1 : 1);
}

/**
 * Calls both `center` and `normalize` to return a normalized centered
 * value for an axis.
 * Common use is to return axis coordinates (i.e. mouse) in a range between -1, 1
 * with 0 at the center of the screen
 * @param value value to center and normalize
 * @param min minimum value {value} can reach
 * @param max max value {value} can reach
 * @param invert reverse output range
 */
export function centerNormalize(
  value: number,
  min: number,
  max: number,
  invert = false
) {
  return center(normalize(value, min, max), 1, invert);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function isNearly(value: number, match: number, precision = 0.05) {
  return match - precision <= value && value <= match + precision;
}
