import crypto from "crypto";

export const anonymousSession = (req, res, next) => {
  // Check if session already exists
  let sessionId = req.cookies.poll_session;

  // If not, generate one
  if (!sessionId) {
    sessionId = crypto.randomUUID();

    res.cookie("poll_session", sessionId, {
      httpOnly: true, // JavaScript cannot access it
      sameSite: "lax", // Helps protect against CSRF
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    console.log(`New anonymous session: ${sessionId}`);
  } else {
    console.log(`Existing anonymous session: ${sessionId}`);
  }

  // Make it available to the rest of the app
  req.poll_session = poll_session;

  next();
};
