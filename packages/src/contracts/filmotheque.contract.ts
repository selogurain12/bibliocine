import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  filmothequeSchema,
  createFilmothequeSchema,
  updateFilmothequeSchema,
} from "../dtos/filmotheque.dto";
import { neverDtoSchema } from "../dtos/delete-request.dto";
import { idSchema } from "../dtos/id.dto";
import { ListResultSchema } from "../dtos/list-result.dto";
import { errorSchema } from "../errors";

const contract = initContract();
export const filmothequeContract = contract.router(
  {
    createFilmotheque: {
      path: "/",
      method: "POST",
      summary: "Create a new filmotheque",
      description: "Create a new filmotheque",
      body: createFilmothequeSchema,
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        201: filmothequeSchema,
        409: errorSchema,
      },
    },
    getFilmotheque: {
      path: "/:id",
      method: "GET",
      summary: "Get a filmotheque by its ID",
      description: "Get a filmotheque by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      responses: {
        200: filmothequeSchema,
        404: errorSchema,
      },
    },
    getAllFilmotheques: {
      path: "/",
      method: "GET",
      summary: "Get all filmotheques",
      description: "Get all filmotheques",
      pathParams: z.object({
        userId: z.string().uuid(),
      }),
      responses: {
        200: ListResultSchema(filmothequeSchema),
        404: errorSchema,
      },
    },
    updateFilmotheque: {
      path: "/:id",
      method: "PATCH",
      summary: "Update a filmotheque by its ID",
      description: "Update a filmotheque by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      body: updateFilmothequeSchema,
      responses: {
        200: filmothequeSchema,
        404: errorSchema,
      },
    },
    deleteMovieFromFilmotheque: {
      path: "/:id/movies/:movieId",
      method: "DELETE",
      summary: "Supprimer un film d'une filmotheque",
      description: "Supprime un film spécifique d'une filmotheque donnée",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
        movieId: z.string(),
      }),
      body: neverDtoSchema,
      responses: {
        200: filmothequeSchema,
        404: errorSchema,
      },
    },
    deleteFilmotheque: {
      path: "/:id",
      method: "DELETE",
      summary: "Delete a filmotheque by its ID",
      description: "Delete a filmotheque by its ID",
      pathParams: idSchema.extend({
        userId: z.string().uuid(),
      }),
      body: neverDtoSchema,

      responses: {
        204: z.undefined(),
        404: errorSchema,
      },
    },
  },
  {
    pathPrefix: "/:userId/filmotheques",
  }
);
