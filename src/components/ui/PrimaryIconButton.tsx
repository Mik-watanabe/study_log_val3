import { IconButton } from "@chakra-ui/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  color: string;
};

const PrimaryIconButton = ({ children, label, onClick, color = "blue" }: Props) => {
  return (
    <IconButton
      aria-label={label}
      variant="ghost"
      size="md"
      colorPalette={color}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
};

export default PrimaryIconButton;
