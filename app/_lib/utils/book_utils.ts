export function getShortTitle(title: string) {
  const verticalLineSeparatorIndex = title.indexOf("|");
  const parenthesisSeparatorIndex = title.indexOf("(");
  let separatorIndex = -1;
  if (verticalLineSeparatorIndex !== -1 && parenthesisSeparatorIndex !== -1) {
    separatorIndex = Math.min(
      verticalLineSeparatorIndex,
      parenthesisSeparatorIndex
    );
  } else {
    separatorIndex = Math.max(
      verticalLineSeparatorIndex,
      parenthesisSeparatorIndex
    );
  }

  if (separatorIndex === -1) return title;

  return title.substring(0, separatorIndex);
}
