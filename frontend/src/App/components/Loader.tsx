import * as React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface Props {
  open: boolean;
}
const Loader: React.FC<Props> = ({ open }) => {
  return (
    <Backdrop open={open} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="info" size={120} variant="indeterminate" />
    </Backdrop>
  );
};
export default Loader;
