export const getISOString = (dateVal: string | number) => {
  return new Date(dateVal).toISOString()
}
