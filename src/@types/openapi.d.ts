declare type OpenAPI = {
  "openapi": "3.0.3",
  "info": {
    "title": "API de gestion des utilisateurs",
    "description": "API pour gérer les utilisateurs d'une application.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:8080/api/v1",
      "description": "Serveur de développement"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "Récupérer tous les utilisateurs",
        "operationId": "getUsers",
        "tags": [
          "Utilisateurs"
        ],
        "responses": {
          "200": {
            "description": "Liste des utilisateurs",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Non autorisé",
          }
        }
      },
      "post": {
        "summary": "Ajouter un nouvel utilisateur",
        "operationId": "addUser",
        "tags": [
          "Utilisateurs"
        ],
        "requestBody": {
          "description": "Données de l'utilisateur à ajouter",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/User"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Utilisateur créé",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          },
          "401": {
            "description": "Non autorisé"
          },
          "422": {
            "description": "Données de l'utilisateur non valides"
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "nom": {
            "type": "string"
          },
          "prenom": {
            "type": "string"
          },
          "email": {
            "type": "string",
            "format": "email"
          }
        },
        "required": [
          "id"
        ]
      }
    }
  }
};