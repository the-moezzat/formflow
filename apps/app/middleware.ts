import { chain } from "./utils/chain";
import { baseMiddleware } from "./middleware/base-middleware";
// import { formMiddleware } from "./middleware/form-redirect-middleware";

// The formMiddleware is currently commented out and not included in the chain.
export default chain([baseMiddleware
]);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/:formId*",
  ],
};
