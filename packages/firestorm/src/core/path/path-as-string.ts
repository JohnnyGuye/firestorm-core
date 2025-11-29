/**
 * Builds a path object by agregating a collection of segments
 * 
 * @param segments Segments to aggregate
 * 
 * @returns Path aggregated
 */
export function buildPath(...segments: string[]) {
  return segments
    .map(segment => segment.trim()
    .replace(/\\/g, "/")
    .replace(/(^\/*)|(\/*$)/g, ""))
    .filter(segment => segment !== "")
    .join("/")
}

/**
 * Split the path into segments
 * 
 * @param path Path to convert to segments
 * 
 * @returns Segmented path
 */
export function toSegments(path: string) {
  return path
    .replace(/\\/g,"/")
    .split("/")
}