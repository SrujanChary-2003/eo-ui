import { useAppSelector } from "../../store/hooks";
import { selectGlobalLoadingMessage, selectIsGlobalLoading } from "../../store/selectors";
import BrandLoader from "./BrandLoader";

/** Redux-driven full-screen brand spinner for API / route / manual loading. */
export default function GlobalBrandLoader() {
  const loading = useAppSelector(selectIsGlobalLoading);
  const message = useAppSelector(selectGlobalLoadingMessage);

  if (!loading) return null;

  return <BrandLoader overlay label={message || "Loading EventSphere..."} />;
}
