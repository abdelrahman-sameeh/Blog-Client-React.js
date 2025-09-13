import { Button, Spinner, type ButtonProps,  } from "react-bootstrap";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export const LoadingButton = ({
  loading = false,
  children,
  disabled,
  ...rest
}: LoadingButtonProps) => {
  return (
    <Button disabled={loading || disabled} {...rest}>
      {loading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
      ) : (
        children
      )}
    </Button>
  );
};
