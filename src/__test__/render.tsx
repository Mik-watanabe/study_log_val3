import { ChakraProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { system } from "@chakra-ui/react/preset";

export function renderWithChakra(ui: ReactElement) {
  return render(<ChakraProvider value={system}>{ui}</ChakraProvider>);
}