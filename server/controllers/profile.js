import { pool } from "../config/database.js";

const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_CLIENT_URL
    : "http://localhost:5173";

const updateUserProfile = async (req, res) => {
  try {
    //get user data from the request
    const { user } = req;

    //check if the user is authenticated. if they are not, then return a 401 unauthorized error
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //access the users ID from the user object if it's stored in session or token
    const userId = user.id;

    //verify the user is updating their own profile by checking the user ID
    if (userId != req.params.userId) {
      return res
        .status(403)
        .json({ error: "Forbiden. You can only update your own profile." });
    }

    //update the users email:
    const { newEmail } = req.body; //assuming the new email is sent in the request body

    //update user's email in the database:
    const updateQuery = "UPDATE users SET email = $1 WHERE id = $2";
    const updateValues = [newEmail, userId];

    const result = await pool.query(updateQuery, updateValues);

    if (result.rowCount > 0) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Profile update failed." });
    }

    res.json({ message: "Profile updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Internal server error " });
  }
};

const updateUserProfilePhoto = async (req, res) => {
  try {
    //update the users email:
    const { id, image_url } = req.body; //assuming the new email is sent in the request body

    //update user's email in the database:
    const updateQuery = "UPDATE users SET image_url = $1 WHERE id = $2";
    const updateValues = [image_url, id];
    await pool.query("BEGIN"); // Start a transaction
    const result = await pool.query(updateQuery, updateValues);

    if (result.rowCount > 0) {
      await pool.query("COMMIT"); // Commit the transaction on success
      const updatedUserQuery = "SELECT id FROM users WHERE id = $1";
      const updatedUserResult = await pool.query(updatedUserQuery, [id]);

      const updatedUserId = updatedUserResult.rows[0].id;

      res.status(200).json({
        message: "Profile updated successfully.",
        id: updatedUserId,
        redirect: `https://${CLIENT_URL}/profile/${updatedUserId}`,
      });
    } else {
      console.error("Profile update failed:", result);
      await pool.query("ROLLBACK"); // Rollback the transaction on failure
      res.status(500).json({ error: "Profile update failed." });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    await pool.query("ROLLBACK"); // Rollback on error
    res.status(500).json({ error: "Internal server error." });
  }
};

export default {
  updateUserProfile,
  updateUserProfilePhoto,
};
