import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";

// const isProd = process.env.NODE_ENV === "production";
// const redirectUri = isProd ? "https://cs144-25s-gpayton787.uw.r.appspot.com/login/google/callback" : "http://localhost:5173/login/google/callback";

export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	"https://cs144-25s-gpayton787.uw.r.appspot.com/login/google/callback"
);