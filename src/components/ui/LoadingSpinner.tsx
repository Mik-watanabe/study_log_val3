import { VStack, Spinner, Text} from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
    <VStack colorPalette="blue">
      <Spinner color="colorPalette.600" />
      <Text color="colorPalette.600">Loading...</Text>
    </VStack>
  );
};

export default LoadingSpinner;
