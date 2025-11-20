type ActionsAlignment = "center" | "fill" | "left" | "right" | undefined;

export const mapUiAlignmentToFormAlignment = (
  alignment: ActionsAlignment
): string | undefined => {
  if (alignment === "fill") {
    return "filled";
  }

  return alignment;
};
