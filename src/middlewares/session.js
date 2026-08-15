export const anonymousSession = (req, res, next) => {
  let sessionId = req.cookies.sessionId;

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    console.log(`New anonymous session: ${sessionId}`);
  } else {
    console.log(`Existing anonymous session: ${sessionId}`);
  }

  req.sessionId = sessionId;

  console.log("REQ SESSION ID:", req.sessionId);

  next();
};
