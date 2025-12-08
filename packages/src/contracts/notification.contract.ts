import { initContract } from "@ts-rest/core";
import { z } from "zod";

const contract = initContract();

export const notificationContract = contract.router(
    {
        registerToken: {
            method: "POST",
            path: "/register-token",
            body: z.object({
            token: z.string(),
            }),
            responses: {
            200: z.object({
                success: z.boolean(),
            }),
            },
        },
    }, 
    {
        pathPrefix: "/notifications" 
    }
);
