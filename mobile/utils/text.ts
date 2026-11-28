/**
 * Turns a structured destination description ("Introduction:\n...\n\nExperience & activities:\n...")
 * into a plain one-paragraph teaser by dropping the section headings.
 */
export function summarize(description: string) {
  return description
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.endsWith(":"))
    .join(" ");
}
