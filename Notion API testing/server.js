require("dotenv").config();
const express = require("express");
const app = express();
const {
  getTags,
  createSuggestion,
  getPages,
  upVoteSuggestion,
} = require("./notion");

// specify view engine
app.set("views", "./views");
app.set("view engine", "ejs");
// parse params from URL and read from body respectively
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// public folder
app.use(express.static("public"));

// tags var
let tags = [];
getTags().then((data) => {
  tags = data;
});

// getting the new set of tags every once and awhile
setInterval(async () => {
  tags = await getTags();
}, 1000 * 60 * 60);

/**
 * GET
 */
app.get("/", async (req, res) => {
  const pages = await getPages();
  console.log(pages);
  res.render("index", { tags, pages });
});

/**
 * POST
 */
app.post("/create-entry", async (req, res) => {
  const { title, description, contacted, value, tagIds = [] } = req.body;
  createSuggestion({
    title: title,
    description: description,
    wasContacted: contacted != null,
    value: value,
    organization: (Array.isArray(tagIds) ? tagIds : [tagIds]).map((tagId) => {
      return { id: tagId };
    }),
  });
  res.redirect("/");
});
/**
 * POST AN UPDATE TO THE VALUE PROPERTY
 */
app.post("/increase-value", async (req, res) => {
  const value = await upVoteSuggestion(req.body.pageId);
  res.json(value);
});
/**
 * PORT IN .env
 */
app.listen(process.env.PORT);
