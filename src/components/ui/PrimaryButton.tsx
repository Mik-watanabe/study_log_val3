import { Button } from "@chakra-ui/react";
import type { FC } from "react";

type Props = {
  children: string;
  onClick: () => void;
  loading?: boolean;
};

const PrimaryButton: FC<Props> = ({ children, onClick, loading = false }) => {
  return (
    <Button
      onClick={onClick}
      loading={loading}
      colorPalette="blue"
      variant="surface"
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
