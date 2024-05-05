export const base64toJson = (base64: string) => {
  const decodedString = atob(base64.split(",")[1]!);
  console.log(decodedString);
  const jsonObject = JSON.parse(decodedString);
  return jsonObject;
};
