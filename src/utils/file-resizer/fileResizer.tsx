import ImageResizer from "react-native-image-resizer";

export const fileResizer = async (path: any) => {
  return await ImageResizer.createResizedImage(path, 500, 700, "PNG", 50, 0);
};
