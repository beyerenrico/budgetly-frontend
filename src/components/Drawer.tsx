import * as React from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import { useEffect } from "react";

type Anchor = "top" | "left" | "bottom" | "right";

type Props = {
  children: React.ReactNode;
  buttonLabel: string;
  anchor?: Anchor;
  open?: boolean;
  onToggle?: (open: boolean) => void;
};

export default function SwipeableTemporaryDrawer({
  children,
  buttonLabel,
  anchor = "right",
  open = false,
  onToggle,
}: Props) {
  const [state, setState] = React.useState(open);

  const toggleDrawer =
    (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(isOpen);
      onToggle && onToggle(isOpen);
    };

  useEffect(() => {
    setState(open);
  }, [open]);

  return (
    <React.Fragment>
      <Button onClick={toggleDrawer(true)} variant="contained">
        {buttonLabel}
      </Button>
      <SwipeableDrawer
        anchor={anchor}
        open={state}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {children}
      </SwipeableDrawer>
    </React.Fragment>
  );
}
