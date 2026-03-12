const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();

router.post("/", auth, async (req, res) => {
  try {
    // user_id is now taken from the authenticated token
    const user_id = req.userId;
    const { feature_name } = req.body;

    if (!feature_name) {
      return res.status(400).json({ error: "feature_name is required" });
    }

    const click = await prisma.featureClick.create({
      data: {
        feature_name,
        user: {
          connect: {
            id: Number(user_id),
          },
        },
      },
    });

    console.log("[track] saved click", click);
    res.json(click);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
