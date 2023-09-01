import ImagePicker from "react-native-image-picker";
// var ImagePicker = require("react-native-image-picker");
export const openGallery = async () => {
  let options: any = {
    storageOptions: {
      skipBackup: true,
      path: "images",
    },
  };
  return await ImagePicker.launchImageLibrary(options, (response: any) => {
    console.log("Response = ", response);
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.error) {
      console.log("ImagePicker Error: ", response.error);
    } else if (response.customButton) {
      console.log("User tapped custom button: ", response.customButton);
      alert(response.customButton);
    } else {
      return response;
    }
  });
};

export const openCamera = async () => {
  let options: any = {
    storageOptions: {
      skipBackup: true,
      path: "images",
    },
  };
  return await ImagePicker.launchCamera(options, (response: any) => {
    console.log("Response = ", response);
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.error) {
      console.log("ImagePicker Error: ", response.error);
    } else if (response.customButton) {
      console.log("User tapped custom button: ", response.customButton);
      alert(response.customButton);
    } else {
      return response;
    }
  });
};
