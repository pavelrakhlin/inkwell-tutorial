import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// TODO: When Clerk is configured, replace ConvexProvider with:
// import { ClerkProvider, useAuth } from "@clerk/clerk-react";
// import { ConvexProviderWithClerk } from "convex/react-clerk";
// <ClerkProvider publishableKey={clerkPubKey}>
//   <ConvexProviderWithClerk client={convex} useAuth={useAuth}>

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL as string
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </BrowserRouter>
  </StrictMode>
);
