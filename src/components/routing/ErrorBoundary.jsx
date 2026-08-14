import { Component } from "react";
import { useLocation } from "react-router-dom";
import NotFoundPage from "../../pages/NotFoundPage";

class ErrorBoundaryInner extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <NotFoundPage
          code="Error"
          title="Something went wrong"
          subtitle="This screen hit an unexpected snag. Refresh, go back, or head home — your work in EventSphere is still here."
        />
      );
    }
    return this.props.children;
  }
}

export default function ErrorBoundary({ children }) {
  const location = useLocation();
  return <ErrorBoundaryInner key={location.key}>{children}</ErrorBoundaryInner>;
}
