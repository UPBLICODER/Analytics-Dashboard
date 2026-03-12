const express = require("express");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const { feature, age, gender, startDate, endDate } = req.query;

  try {
    const filters = {};

    // date range filtering
    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp.gte = new Date(startDate);
      if (endDate) filters.timestamp.lte = new Date(endDate);
    }

    // user filters go in nested object
    const userFilters = {};
    if (gender) userFilters.gender = gender;
    if (age) {
      if (age === "<18") userFilters.age = { lt: 18 };
      else if (age === "18-40") userFilters.age = { gte: 18, lte: 40 };
      else if (age === ">40") userFilters.age = { gt: 40 };
    }
    if (Object.keys(userFilters).length) {
      filters.user = userFilters;
    }

    // Line chart data (trend)
    if (feature) {
      const clicks = await prisma.featureClick.findMany({
        where: {
          feature_name: feature,
          ...filters,
        },
        select: {
          timestamp: true,
        },
      });

      const grouped = {};

      clicks.forEach((click) => {
        const date = click.timestamp.toISOString().split("T")[0];

        if (!grouped[date]) {
          grouped[date] = 0;
        }

        grouped[date]++;
      });

      let trend = Object.keys(grouped).map((date) => ({
        date,
        count: grouped[date],
      }));

      // sort chronologically by date string
      trend = trend.sort((a, b) => new Date(a.date) - new Date(b.date));

      return res.json(trend);
    }

    // Bar chart data
    const clicks = await prisma.featureClick.findMany({
      where: filters,
      select: {
        feature_name: true,
      },
    });

    const grouped = {};

    clicks.forEach((click) => {
      if (!grouped[click.feature_name]) {
        grouped[click.feature_name] = 0;
      }

      grouped[click.feature_name]++;
    });

    const result = Object.keys(grouped).map((feature) => ({
      feature_name: feature,
      total_clicks: grouped[feature],
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
