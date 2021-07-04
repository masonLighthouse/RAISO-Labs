const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * GET THE DATABASE PROPERTIES
 */
async function getDatabase() {
  const response = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  return response;
}

/**
 * GET ALL OF THE CURRENT DB ENTRIES
 */
async function getPages() {
  // the default is to sort by the title
  const notionPages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    sorts: [
      { property: process.env.NOTION_DESCRIPTION_ID, direction: "descending" },
    ],
  });
  return notionPages.results.map(fromNotionObject);
}

/**
 * PROCESS THE RETURNED RESULT FROM NOTION
 * LOOK AT THE NOTION DOCUMENTATION FOR OTHER PROPERTIES AND THINGS
 */
function fromNotionObject(notionPage) {
  const propertiesById = notionPropertiesById(notionPage.properties);
  return {
    id: notionPage.id,
    title: propertiesById[process.env.NOTION_TITLE_ID].title[0].plain_text,
    description:
      propertiesById[process.env.NOTION_DESCRIPTION_ID].rich_text[0].text
        .content,
    wasContacted: propertiesById[process.env.NOTION_CONTACTED_ID].checkbox,
    value: propertiesById[process.env.NOTION_VALUE_ID].number,
    organization: propertiesById[
      process.env.NOTION_ORGANIZATION_ID
    ].multi_select.map((option) => {
      return { id: option.id, name: option.name };
    }),
  };
}

/**
 * GET ALL OF THE TAG VALUES AND THE ID's
 */
async function getTags() {
  const database = getDatabase();
  return notionPropertiesById((await database).properties)[
    process.env.NOTION_ORGANIZATION_ID
  ].multi_select.options.map((option) => {
    return { id: option.id, name: option.name };
  });
}

/**
 * ORDERS SUCH THAT NOTION OBJ HAS ITS IDs AS THE KEYS
 */
function notionPropertiesById(properties) {
  return Object.values(properties).reduce((obj, property) => {
    const { id, ...rest } = property;
    return { ...obj, [id]: rest };
  }, {});
}

/**
 * POST THE CREATED SUGGESTION TO THE DB
 */
function createSuggestion({
  title,
  description,
  wasContacted,
  value,
  organization,
}) {
  notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      [process.env.NOTION_TITLE_ID]: {
        title: [
          {
            type: "text",
            text: {
              content: title,
            },
          },
        ],
      },
      [process.env.NOTION_DESCRIPTION_ID]: {
        rich_text: [
          {
            type: "text",
            text: {
              content: String(description),
            },
          },
        ],
      },
      [process.env.NOTION_CONTACTED_ID]: {
        checkbox: wasContacted,
      },
      [process.env.NOTION_VALUE_ID]: {
        number: Number(value),
      },
      [process.env.NOTION_ORGANIZATION_ID]: {
        multi_select: organization.map((tag) => {
          return { id: tag.id };
        }),
      },
    },
  });
}

/**
 * INCREMENT THE VALUE BY 1 ON BUTTON PRESS (REALLY BASIC LOGIC)
 */
async function upVoteSuggestion(pageId) {
  const suggestion = await getSuggestion(pageId);
  const value = suggestion.value + 1;
  await notion.pages.update({
    page_id: pageId,
    properties: {
      [process.env.NOTION_VALUE_ID]: {
        number: value,
      },
    },
  });

  return value;
}

/**
 * GET ONE SPECIFIC ENTRY
 */
async function getSuggestion(pageId) {
  return fromNotionObject(await notion.pages.retrieve({ page_id: pageId }));
}

module.exports = {
  createSuggestion,
  getTags,
  getPages,
  upVoteSuggestion,
};

// if we need to get the DB properties
// getDatabase();
/**
 * getTags().then((tags) => {
  console.log(tags); 
  createSuggestion({  
    title: "Test",
    description: "This is a test to see if this works",
    wasContacted: true,
    value: 34,
    organization: tags,
  });
});
 */

/**
 * getTags().then((res) => { console.log(res); });
 */
