import { Backdrop, CircularProgress } from "@mui/material"

/**
 * 
 * @param {import("react").PropsWithChildren<{ loading?: boolean }>} props 
 */
const LoadingPageContainer = (props) => {
  return props.loading
    ? <Backdrop open>
      <CircularProgress color="info" />
    </Backdrop>
    : <>{props.children}</>
}

export default LoadingPageContainer;
