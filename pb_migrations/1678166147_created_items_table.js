migrate((db) => {
  const collection = new Collection({
    "id": "3t9frc4izac9ye3",
    "created": "2023-03-07 05:15:47.963Z",
    "updated": "2023-03-07 05:15:47.963Z",
    "name": "items_table",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "o9dlcsg3",
        "name": "access_token",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "etnjok8f",
        "name": "item_id",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "raqcn6np",
        "name": "institution_id",
        "type": "text",
        "required": false,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "sfbgrlgi",
        "name": "transaction_cursor",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("3t9frc4izac9ye3");

  return dao.deleteCollection(collection);
})
