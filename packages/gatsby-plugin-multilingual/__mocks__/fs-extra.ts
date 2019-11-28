export const emptyDir = async (dir: string): Promise<string> => dir

export const outputJSON = async (
  file: string,
  data: object,
): Promise<{ file: string; data: object }> => ({
  file,
  data,
})
