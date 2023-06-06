import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

/**
 * Captures an image using the device's camera.
 *
 * @param aspect - The aspect ratio of the image (default: [4, 4]).
 * @param quality - The quality of the captured image (default: 0.4).
 *
 * @returns A promise that resolves to the captured image URI or null if canceled.
 */
export async function captureImage(aspect: [number, number] = [4, 4], quality: number = 0.4): Promise<string | null> {
  let permission = await ImagePicker.requestCameraPermissionsAsync();
  if (permission.status === "granted") {
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect,
      quality,
      allowsMultipleSelection: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!image.canceled) {
      return image.assets[0].uri;
    } else {
      return null;
    }
  } else {
    Alert.alert("Você precisa conceder permissão para o uso da câmera de seu celular.");
    return null;
  }
}
