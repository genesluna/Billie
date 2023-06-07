import { ViewProps, Image, GestureResponderEvent, Share } from "react-native";

import Container from "../../components/common/Container";
import Button from "../../components/common/Button";

type TransactionImageModalProps = ViewProps & {
  imageURL: string;
  onClose: (event: GestureResponderEvent) => void;
  onNewImage: (event: GestureResponderEvent) => void;
};

/**
 * A modal component for displaying a transaction image.
 * Allows sharing the image and selecting a new image.
 *
 * @param imageURL - The URL of the transaction image to display.
 * @param onClose - A Callback function to handle modal close event.
 * @param onNewImage - A Callback function when a new image is requested.
 * @returns The rendered TransactionImageModal component.
 */
const TransactionImageModal = ({ imageURL, onClose, onNewImage, ...props }: TransactionImageModalProps) => {
  async function handleShare(event: GestureResponderEvent) {
    try {
      await Share.share({
        message: "Link para imagem do seu recibo.\n\n" + imageURL,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  return (
    <Container {...props}>
      <Image source={{ uri: imageURL }} resizeMode="cover" className="h-[60vh] w-full" />
      <Button icon="image" type="primary" className="w-full mt-4" label="nova foto" onPress={onNewImage} />
      <Button icon="share-2" type="accent" className="w-full mt-4" label="compartilhar" onPress={handleShare} />
      <Button icon="arrow-left" type="secondary" className="w-full mt-4" label="voltar" onPress={onClose} />
    </Container>
  );
};

export default TransactionImageModal;
