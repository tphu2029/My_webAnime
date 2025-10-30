export const authMe = (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("authMe error", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
