import { Button } from "@chakra-ui/react";

type Props = {
  children: string;
  onClick: () => void;
  loading?: boolean;
};

const PrimaryButton= ({ children, onClick, loading = false } : Props) => {
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
