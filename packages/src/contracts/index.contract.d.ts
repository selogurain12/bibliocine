export declare const biblioCineContract: {
    auth: {
        register: {
            summary: "Create an account";
            description: "Create an account";
            method: "POST";
            body: import("zod").ZodObject<{
                firstName: import("zod").ZodString;
                lastName: import("zod").ZodString;
                email: import("zod").ZodString;
                username: import("zod").ZodString;
                password: import("zod").ZodString;
                avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                firstName?: string;
                lastName?: string;
                email?: string;
                username?: string;
                password?: string;
                avatarUrl?: string;
            }, {
                firstName?: string;
                lastName?: string;
                email?: string;
                username?: string;
                password?: string;
                avatarUrl?: string;
            }>;
            path: "/auth/create";
            responses: {
                201: import("zod").ZodObject<{
                    token: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    token?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    token?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                409: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        login: {
            summary: "Login to account";
            description: "Login to account";
            method: "POST";
            body: import("zod").ZodObject<{
                email: import("zod").ZodOptional<import("zod").ZodString>;
                username: import("zod").ZodOptional<import("zod").ZodString>;
                password: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                email?: string;
                username?: string;
                password?: string;
            }, {
                email?: string;
                username?: string;
                password?: string;
            }>;
            path: "/auth/login";
            responses: {
                201: import("zod").ZodObject<{
                    token: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    token?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    token?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
    bibliotheque: {
        createBibliotheque: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Create a new bibliotheque";
            description: "Create a new bibliotheque";
            method: "POST";
            body: import("zod").ZodObject<{
                name: import("zod").ZodString;
                books: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                name?: string;
                books?: string[];
            }, {
                name?: string;
                books?: string[];
            }>;
            path: "/:userId/bibliotheques/";
            responses: {
                201: import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    books: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                    id: import("zod").ZodString;
                    users: import("zod").ZodArray<import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>, "many">;
                }, "strip", import("zod").ZodTypeAny, {
                    name?: string;
                    books?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }, {
                    name?: string;
                    books?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }>;
                409: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getBibliotheque: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Get a bibliotheque by its ID";
            description: "Get a bibliotheque by its ID";
            method: "GET";
            path: "/:userId/bibliotheques/:id";
            responses: {
                200: import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    books: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                    id: import("zod").ZodString;
                    users: import("zod").ZodArray<import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>, "many">;
                }, "strip", import("zod").ZodTypeAny, {
                    name?: string;
                    books?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }, {
                    name?: string;
                    books?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getAllBibliotheques: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Get all bibliotheques";
            description: "Get all bibliotheques";
            method: "GET";
            path: "/:userId/bibliotheques/";
            responses: {
                200: import("zod").ZodType<{
                    data: {
                        name?: string;
                        books?: string[];
                        id?: string;
                        users?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        }[];
                    }[];
                    total: number;
                }, import("zod").ZodTypeDef, {
                    data: {
                        name?: string;
                        books?: string[];
                        id?: string;
                        users?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        }[];
                    }[];
                    total: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        updateBibliotheque: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Update a bibliotheque by its ID";
            description: "Update a bibliotheque by its ID";
            method: "PATCH";
            body: import("zod").ZodObject<{
                name: import("zod").ZodOptional<import("zod").ZodString>;
                books: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                id: import("zod").ZodOptional<import("zod").ZodString>;
                users: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodLazy<import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    email: import("zod").ZodString;
                    firstName: import("zod").ZodString;
                    lastName: import("zod").ZodString;
                    username: import("zod").ZodString;
                    avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                    password: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }>>, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                name?: string;
                books?: string[];
                id?: string;
                users?: {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }[];
            }, {
                name?: string;
                books?: string[];
                id?: string;
                users?: {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }[];
            }>;
            path: "/:userId/bibliotheques/:id";
            responses: {
                200: import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    books: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                    id: import("zod").ZodString;
                    users: import("zod").ZodArray<import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>, "many">;
                }, "strip", import("zod").ZodTypeAny, {
                    name?: string;
                    books?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }, {
                    name?: string;
                    books?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        deleteBibliotheque: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Delete a bibliotheque by its ID";
            description: "Delete a bibliotheque by its ID";
            method: "DELETE";
            body: never;
            path: "/:userId/bibliotheques/:id";
            responses: {
                200: import("zod").ZodUndefined;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
    filmotheque: {
        createFilmotheque: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Create a new filmotheque";
            description: "Create a new filmotheque";
            method: "POST";
            body: import("zod").ZodObject<{
                name: import("zod").ZodString;
                movies: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                name?: string;
                movies?: string[];
            }, {
                name?: string;
                movies?: string[];
            }>;
            path: "/:userId/filmotheques/";
            responses: {
                201: import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    movies: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                    id: import("zod").ZodString;
                    users: import("zod").ZodArray<import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>, "many">;
                }, "strip", import("zod").ZodTypeAny, {
                    name?: string;
                    movies?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }, {
                    name?: string;
                    movies?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }>;
                409: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getFilmotheque: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Get a filmotheque by its ID";
            description: "Get a filmotheque by its ID";
            method: "GET";
            path: "/:userId/filmotheques/:id";
            responses: {
                200: import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    movies: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                    id: import("zod").ZodString;
                    users: import("zod").ZodArray<import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>, "many">;
                }, "strip", import("zod").ZodTypeAny, {
                    name?: string;
                    movies?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }, {
                    name?: string;
                    movies?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getAllFilmotheques: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Get all filmotheques";
            description: "Get all filmotheques";
            method: "GET";
            path: "/:userId/filmotheques/";
            responses: {
                200: import("zod").ZodType<{
                    data: {
                        name?: string;
                        movies?: string[];
                        id?: string;
                        users?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        }[];
                    }[];
                    total: number;
                }, import("zod").ZodTypeDef, {
                    data: {
                        name?: string;
                        movies?: string[];
                        id?: string;
                        users?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        }[];
                    }[];
                    total: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        updateFilmotheque: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Update a filmotheque by its ID";
            description: "Update a filmotheque by its ID";
            method: "PATCH";
            body: import("zod").ZodObject<{
                name: import("zod").ZodOptional<import("zod").ZodString>;
                movies: import("zod").ZodOptional<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                id: import("zod").ZodOptional<import("zod").ZodString>;
                users: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodLazy<import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    email: import("zod").ZodString;
                    firstName: import("zod").ZodString;
                    lastName: import("zod").ZodString;
                    username: import("zod").ZodString;
                    avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                    password: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }>>, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                name?: string;
                movies?: string[];
                id?: string;
                users?: {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }[];
            }, {
                name?: string;
                movies?: string[];
                id?: string;
                users?: {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }[];
            }>;
            path: "/:userId/filmotheques/:id";
            responses: {
                200: import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    movies: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                    id: import("zod").ZodString;
                    users: import("zod").ZodArray<import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>, "many">;
                }, "strip", import("zod").ZodTypeAny, {
                    name?: string;
                    movies?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }, {
                    name?: string;
                    movies?: string[];
                    id?: string;
                    users?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        deleteFilmotheque: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Delete a filmotheque by its ID";
            description: "Delete a filmotheque by its ID";
            method: "DELETE";
            body: never;
            path: "/:userId/filmotheques/:id";
            responses: {
                204: import("zod").ZodUndefined;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
    stats: {
        simpleStats: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Get simple statistics for a user";
            description: "Get simple statistics for a user";
            method: "GET";
            path: "/:userId/stats";
            responses: {
                200: import("zod").ZodObject<{
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                    timeSeen: import("zod").ZodNumber;
                    pagesRead: import("zod").ZodNumber;
                    id: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                    timeSeen?: number;
                    pagesRead?: number;
                    id?: string;
                }, {
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                    timeSeen?: number;
                    pagesRead?: number;
                    id?: string;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        allStats: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Get all statistics for a user";
            description: "Get all statistics for a user";
            method: "GET";
            path: "/:userId/stats/allStats";
            responses: {
                200: import("zod").ZodObject<Omit<{
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                    timeSeen: import("zod").ZodNumber;
                    pagesRead: import("zod").ZodNumber;
                    id: import("zod").ZodString;
                    filmotheque: import("zod").ZodNumber;
                    finishedMovies: import("zod").ZodNumber;
                    moviesInProgress: import("zod").ZodNumber;
                    finishedBooks: import("zod").ZodNumber;
                    booksInProgress: import("zod").ZodNumber;
                    bibliotheque: import("zod").ZodNumber;
                }, "user">, "strip", import("zod").ZodTypeAny, {
                    id?: string;
                    bibliotheque?: number;
                    filmotheque?: number;
                    timeSeen?: number;
                    pagesRead?: number;
                    finishedMovies?: number;
                    moviesInProgress?: number;
                    finishedBooks?: number;
                    booksInProgress?: number;
                }, {
                    id?: string;
                    bibliotheque?: number;
                    filmotheque?: number;
                    timeSeen?: number;
                    pagesRead?: number;
                    finishedMovies?: number;
                    moviesInProgress?: number;
                    finishedBooks?: number;
                    booksInProgress?: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        updateStats: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Update statistics for a user";
            description: "Update statistics for a user";
            method: "PATCH";
            body: import("zod").ZodObject<{
                user: import("zod").ZodOptional<import("zod").ZodLazy<import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    email: import("zod").ZodString;
                    firstName: import("zod").ZodString;
                    lastName: import("zod").ZodString;
                    username: import("zod").ZodString;
                    avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                    password: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }>>>;
                timeSeen: import("zod").ZodOptional<import("zod").ZodNumber>;
                pagesRead: import("zod").ZodOptional<import("zod").ZodNumber>;
            }, "strip", import("zod").ZodTypeAny, {
                user?: {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                };
                timeSeen?: number;
                pagesRead?: number;
            }, {
                user?: {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                };
                timeSeen?: number;
                pagesRead?: number;
            }>;
            path: "/:userId/stats/:id";
            responses: {
                200: import("zod").ZodObject<{
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                    timeSeen: import("zod").ZodNumber;
                    pagesRead: import("zod").ZodNumber;
                    id: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                    timeSeen?: number;
                    pagesRead?: number;
                    id?: string;
                }, {
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                    timeSeen?: number;
                    pagesRead?: number;
                    id?: string;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
    books: {
        getBook: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
            }, {
                id?: string;
            }>;
            summary: "Get a book by its ID";
            description: "Get a book by its ID";
            method: "GET";
            path: "/books/book/:id";
            responses: {
                200: import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    title: import("zod").ZodString;
                    authors: import("zod").ZodArray<import("zod").ZodString, "many">;
                    publisher: import("zod").ZodString;
                    imageLink: import("zod").ZodString;
                    publisherDate: import("zod").ZodString;
                    description: import("zod").ZodString;
                    industryIdentifiersType: import("zod").ZodOptional<import("zod").ZodString>;
                    industryIdentifieridentyfier: import("zod").ZodOptional<import("zod").ZodString>;
                    pageCount: import("zod").ZodNumber;
                    categories: import("zod").ZodArray<import("zod").ZodString, "many">;
                    retailPriceAmount: import("zod").ZodOptional<import("zod").ZodNumber>;
                    retailPricecurrencyCode: import("zod").ZodOptional<import("zod").ZodString>;
                    retailPricebuyLink: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    id?: string;
                    title?: string;
                    authors?: string[];
                    publisher?: string;
                    imageLink?: string;
                    publisherDate?: string;
                    description?: string;
                    industryIdentifiersType?: string;
                    industryIdentifieridentyfier?: string;
                    pageCount?: number;
                    categories?: string[];
                    retailPriceAmount?: number;
                    retailPricecurrencyCode?: string;
                    retailPricebuyLink?: string;
                }, {
                    id?: string;
                    title?: string;
                    authors?: string[];
                    publisher?: string;
                    imageLink?: string;
                    publisherDate?: string;
                    description?: string;
                    industryIdentifiersType?: string;
                    industryIdentifieridentyfier?: string;
                    pageCount?: number;
                    categories?: string[];
                    retailPriceAmount?: number;
                    retailPricecurrencyCode?: string;
                    retailPricebuyLink?: string;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getAllBooks: {
            pathParams: import("zod").ZodObject<{
                search: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                search?: string;
            }, {
                search?: string;
            }>;
            summary: "Get all books";
            description: "Get a list of all books";
            method: "GET";
            path: "/books/:search";
            responses: {
                200: import("zod").ZodType<{
                    data: {
                        id?: string;
                        title?: string;
                        authors?: string[];
                        publisher?: string;
                        imageLink?: string;
                        publisherDate?: string;
                        description?: string;
                        industryIdentifiersType?: string;
                        industryIdentifieridentyfier?: string;
                        pageCount?: number;
                        categories?: string[];
                        retailPriceAmount?: number;
                        retailPricecurrencyCode?: string;
                        retailPricebuyLink?: string;
                    }[];
                    total: number;
                }, import("zod").ZodTypeDef, {
                    data: {
                        id?: string;
                        title?: string;
                        authors?: string[];
                        publisher?: string;
                        imageLink?: string;
                        publisherDate?: string;
                        description?: string;
                        industryIdentifiersType?: string;
                        industryIdentifieridentyfier?: string;
                        pageCount?: number;
                        categories?: string[];
                        retailPriceAmount?: number;
                        retailPricecurrencyCode?: string;
                        retailPricebuyLink?: string;
                    }[];
                    total: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
    movies: {
        getMovie: {
            pathParams: import("zod").ZodObject<{
                movieId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                movieId?: string;
            }, {
                movieId?: string;
            }>;
            summary: "Get a movie by its ID";
            description: "Get a movie by its ID";
            method: "GET";
            path: "/movies/movie/:movieId";
            responses: {
                200: import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    backdropPath: import("zod").ZodNullable<import("zod").ZodString>;
                    genreIds: import("zod").ZodArray<import("zod").ZodString, "many">;
                    originalLanguage: import("zod").ZodString;
                    originalTitle: import("zod").ZodString;
                    overview: import("zod").ZodString;
                    posterPath: import("zod").ZodNullable<import("zod").ZodString>;
                    releaseDate: import("zod").ZodString;
                    title: import("zod").ZodString;
                    budget: import("zod").ZodNumber;
                    homepage: import("zod").ZodNullable<import("zod").ZodString>;
                    revenue: import("zod").ZodNumber;
                    runtime: import("zod").ZodNullable<import("zod").ZodNumber>;
                    voteAverage: import("zod").ZodNumber;
                }, "strip", import("zod").ZodTypeAny, {
                    id?: string;
                    backdropPath?: string;
                    genreIds?: string[];
                    originalLanguage?: string;
                    originalTitle?: string;
                    overview?: string;
                    posterPath?: string;
                    releaseDate?: string;
                    title?: string;
                    budget?: number;
                    homepage?: string;
                    revenue?: number;
                    runtime?: number;
                    voteAverage?: number;
                }, {
                    id?: string;
                    backdropPath?: string;
                    genreIds?: string[];
                    originalLanguage?: string;
                    originalTitle?: string;
                    overview?: string;
                    posterPath?: string;
                    releaseDate?: string;
                    title?: string;
                    budget?: number;
                    homepage?: string;
                    revenue?: number;
                    runtime?: number;
                    voteAverage?: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getAllMovies: {
            pathParams: import("zod").ZodObject<{
                search: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                search?: string;
            }, {
                search?: string;
            }>;
            summary: "Get all movies";
            description: "Get a list of all movies";
            method: "GET";
            path: "/movies/:search";
            responses: {
                200: import("zod").ZodType<{
                    data: {
                        id?: string;
                        backdropPath?: string;
                        genreIds?: string[];
                        originalLanguage?: string;
                        originalTitle?: string;
                        overview?: string;
                        posterPath?: string;
                        releaseDate?: string;
                        title?: string;
                        budget?: number;
                        homepage?: string;
                        revenue?: number;
                        runtime?: number;
                        voteAverage?: number;
                    }[];
                    total: number;
                }, import("zod").ZodTypeDef, {
                    data: {
                        id?: string;
                        backdropPath?: string;
                        genreIds?: string[];
                        originalLanguage?: string;
                        originalTitle?: string;
                        overview?: string;
                        posterPath?: string;
                        releaseDate?: string;
                        title?: string;
                        budget?: number;
                        homepage?: string;
                        revenue?: number;
                        runtime?: number;
                        voteAverage?: number;
                    }[];
                    total: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
    moviesInProgress: {
        createMovieInProgress: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Create a new movie in progress";
            description: "Create a new movie in progress";
            method: "POST";
            body: import("zod").ZodObject<{
                movieId: import("zod").ZodString;
                viewingTime: import("zod").ZodNumber;
            }, "strip", import("zod").ZodTypeAny, {
                movieId?: string;
                viewingTime?: number;
            }, {
                movieId?: string;
                viewingTime?: number;
            }>;
            path: "/:userId/movies-in-progress/";
            responses: {
                201: import("zod").ZodObject<{
                    movieId: import("zod").ZodString;
                    viewingTime: import("zod").ZodNumber;
                    id: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    movieId?: string;
                    viewingTime?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    movieId?: string;
                    viewingTime?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                409: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getMovieInProgress: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Get a movie in progress by its ID";
            description: "Get a movie in progress by its ID";
            method: "GET";
            path: "/:userId/movies-in-progress/:id";
            responses: {
                200: import("zod").ZodObject<{
                    movieId: import("zod").ZodString;
                    viewingTime: import("zod").ZodNumber;
                    id: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    movieId?: string;
                    viewingTime?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    movieId?: string;
                    viewingTime?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getAllMoviesInProgress: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Get all movies in progress";
            description: "Get all movies in progress";
            method: "GET";
            path: "/:userId/movies-in-progress/";
            responses: {
                200: import("zod").ZodType<{
                    data: {
                        movieId?: string;
                        viewingTime?: number;
                        id?: string;
                        user?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        };
                    }[];
                    total: number;
                }, import("zod").ZodTypeDef, {
                    data: {
                        movieId?: string;
                        viewingTime?: number;
                        id?: string;
                        user?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        };
                    }[];
                    total: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        updateMovieInProgress: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Update a movie in progress by its ID";
            description: "Update a movie in progress by its ID";
            method: "PATCH";
            body: import("zod").ZodObject<{
                movieId: import("zod").ZodOptional<import("zod").ZodString>;
                viewingTime: import("zod").ZodOptional<import("zod").ZodNumber>;
            }, "strip", import("zod").ZodTypeAny, {
                movieId?: string;
                viewingTime?: number;
            }, {
                movieId?: string;
                viewingTime?: number;
            }>;
            path: "/:userId/movies-in-progress/:id";
            responses: {
                200: import("zod").ZodObject<{
                    movieId: import("zod").ZodString;
                    viewingTime: import("zod").ZodNumber;
                    id: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    movieId?: string;
                    viewingTime?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    movieId?: string;
                    viewingTime?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        deleteMovieInProgress: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Delete a movie in progress by its ID";
            description: "Delete a movie in progress by its ID";
            method: "DELETE";
            body: never;
            path: "/:userId/movies-in-progress/:id";
            responses: {
                204: import("zod").ZodUndefined;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
    booksInProgress: {
        createBookInProgress: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Create a new book in progress";
            description: "Create a new book in progress";
            method: "POST";
            body: import("zod").ZodObject<{
                bookId: import("zod").ZodString;
                currentPage: import("zod").ZodNumber;
            }, "strip", import("zod").ZodTypeAny, {
                bookId?: string;
                currentPage?: number;
            }, {
                bookId?: string;
                currentPage?: number;
            }>;
            path: "/:userId/books-in-progress/";
            responses: {
                201: import("zod").ZodObject<{
                    bookId: import("zod").ZodString;
                    currentPage: import("zod").ZodNumber;
                    id: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    bookId?: string;
                    currentPage?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    bookId?: string;
                    currentPage?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                409: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getBookInProgress: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Get a book in progress by its ID";
            description: "Get a book in progress by its ID";
            method: "GET";
            path: "/:userId/books-in-progress/:id";
            responses: {
                200: import("zod").ZodObject<{
                    bookId: import("zod").ZodString;
                    currentPage: import("zod").ZodNumber;
                    id: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    bookId?: string;
                    currentPage?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    bookId?: string;
                    currentPage?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getAllBooksInProgress: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Get all books in progress";
            description: "Get all books in progress";
            method: "GET";
            path: "/:userId/books-in-progress/";
            responses: {
                200: import("zod").ZodType<{
                    data: {
                        bookId?: string;
                        currentPage?: number;
                        id?: string;
                        user?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        };
                    }[];
                    total: number;
                }, import("zod").ZodTypeDef, {
                    data: {
                        bookId?: string;
                        currentPage?: number;
                        id?: string;
                        user?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        };
                    }[];
                    total: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        updateBookInProgress: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Update a book in progress by its ID";
            description: "Update a book in progress by its ID";
            method: "PATCH";
            body: import("zod").ZodObject<{
                bookId: import("zod").ZodOptional<import("zod").ZodString>;
                currentPage: import("zod").ZodOptional<import("zod").ZodNumber>;
            }, "strip", import("zod").ZodTypeAny, {
                bookId?: string;
                currentPage?: number;
            }, {
                bookId?: string;
                currentPage?: number;
            }>;
            path: "/:userId/books-in-progress/:id";
            responses: {
                200: import("zod").ZodObject<{
                    bookId: import("zod").ZodString;
                    currentPage: import("zod").ZodNumber;
                    id: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    bookId?: string;
                    currentPage?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    bookId?: string;
                    currentPage?: number;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        deleteBookInProgress: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Delete a book in progress by its ID";
            description: "Delete a book in progress by its ID";
            method: "DELETE";
            body: never;
            path: "/:userId/books-in-progress/:id";
            responses: {
                204: import("zod").ZodUndefined;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
    finishedBook: {
        createFinishedBook: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Create a new finished book";
            description: "Create a new finished book";
            method: "POST";
            body: import("zod").ZodObject<{
                bookId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                bookId?: string;
            }, {
                bookId?: string;
            }>;
            path: "/:userId/finished-books/";
            responses: {
                201: import("zod").ZodObject<{
                    bookId: import("zod").ZodString;
                    id: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    bookId?: string;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    bookId?: string;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                409: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getFinishedBook: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Get a finished book by its ID";
            description: "Get a finished book by its ID";
            method: "GET";
            path: "/:userId/finished-books/:id";
            responses: {
                200: import("zod").ZodObject<{
                    bookId: import("zod").ZodString;
                    id: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    bookId?: string;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    bookId?: string;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getAllFinishedBooks: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Get all finished books";
            description: "Get all finished books";
            method: "GET";
            path: "/:userId/finished-books/";
            responses: {
                200: import("zod").ZodType<{
                    data: {
                        bookId?: string;
                        id?: string;
                        user?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        };
                    }[];
                    total: number;
                }, import("zod").ZodTypeDef, {
                    data: {
                        bookId?: string;
                        id?: string;
                        user?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        };
                    }[];
                    total: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        deleteFinishedBook: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Delete a finished book";
            description: "Delete a finished book";
            method: "DELETE";
            path: "/:userId/finished-books/:id";
            responses: {
                204: import("zod").ZodUndefined;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
    finishedMovie: {
        createFinishedMovie: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Create a new finished movie";
            description: "Create a new finished movie";
            method: "POST";
            body: import("zod").ZodObject<{
                movieId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                movieId?: string;
            }, {
                movieId?: string;
            }>;
            path: "/:userId/finished-movies/";
            responses: {
                201: import("zod").ZodObject<{
                    movieId: import("zod").ZodString;
                    id: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    movieId?: string;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    movieId?: string;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                409: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getFinishedMovie: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Get a finished movie by its ID";
            description: "Get a finished movie by its ID";
            method: "GET";
            path: "/:userId/finished-movies/:id";
            responses: {
                200: import("zod").ZodObject<{
                    movieId: import("zod").ZodString;
                    id: import("zod").ZodString;
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                }, "strip", import("zod").ZodTypeAny, {
                    movieId?: string;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }, {
                    movieId?: string;
                    id?: string;
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        getAllFinishedMovies: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Get all finished movies";
            description: "Get all finished movies";
            method: "GET";
            path: "/:userId/finished-movies/";
            responses: {
                200: import("zod").ZodType<{
                    data: {
                        movieId?: string;
                        id?: string;
                        user?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        };
                    }[];
                    total: number;
                }, import("zod").ZodTypeDef, {
                    data: {
                        movieId?: string;
                        id?: string;
                        user?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        };
                    }[];
                    total: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        deleteFinishedMovie: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Delete a finished movie";
            description: "Delete a finished movie";
            method: "DELETE";
            path: "/:userId/finished-movies/:id";
            responses: {
                204: import("zod").ZodUndefined;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
    friendlist: {
        getAllFriendlist: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Get all of the friend list of a user";
            description: "Get all of the friend list of a user";
            method: "GET";
            path: "/:userId/friendlist";
            responses: {
                200: import("zod").ZodType<{
                    data: {
                        user?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        };
                        friends?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        }[];
                        id?: string;
                    }[];
                    total: number;
                }, import("zod").ZodTypeDef, {
                    data: {
                        user?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        };
                        friends?: {
                            id?: string;
                            email?: string;
                            firstName?: string;
                            lastName?: string;
                            username?: string;
                            avatarUrl?: string;
                            password?: string;
                        }[];
                        id?: string;
                    }[];
                    total: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        updateFriendlist: {
            pathParams: import("zod").ZodObject<{
                id: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                id?: string;
                userId?: string;
            }, {
                id?: string;
                userId?: string;
            }>;
            summary: "Update the friend list of a user";
            description: "Update the friend list of a user";
            method: "PATCH";
            body: import("zod").ZodObject<{
                user: import("zod").ZodOptional<import("zod").ZodLazy<import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    email: import("zod").ZodString;
                    firstName: import("zod").ZodString;
                    lastName: import("zod").ZodString;
                    username: import("zod").ZodString;
                    avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                    password: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }>>>;
                friends: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodLazy<import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    email: import("zod").ZodString;
                    firstName: import("zod").ZodString;
                    lastName: import("zod").ZodString;
                    username: import("zod").ZodString;
                    avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                    password: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }>>, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                user?: {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                };
                friends?: {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }[];
            }, {
                user?: {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                };
                friends?: {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }[];
            }>;
            path: "/:userId/friendlist/:id";
            responses: {
                200: import("zod").ZodObject<{
                    user: import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>;
                    friends: import("zod").ZodArray<import("zod").ZodLazy<import("zod").ZodObject<{
                        id: import("zod").ZodString;
                        email: import("zod").ZodString;
                        firstName: import("zod").ZodString;
                        lastName: import("zod").ZodString;
                        username: import("zod").ZodString;
                        avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                        password: import("zod").ZodOptional<import("zod").ZodString>;
                    }, "strip", import("zod").ZodTypeAny, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }, {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }>>, "many">;
                    id: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                    friends?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                    id?: string;
                }, {
                    user?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    };
                    friends?: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                    id?: string;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        deleteFriend: {
            pathParams: import("zod").ZodObject<{
                friendId: import("zod").ZodString;
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                friendId?: string;
                userId?: string;
            }, {
                friendId?: string;
                userId?: string;
            }>;
            summary: "Delete friend from friend list of a user";
            description: "Delete friend from friend list of a user";
            method: "DELETE";
            body: never;
            path: "/:userId/friendlist/:friendId";
            responses: {
                204: import("zod").ZodUndefined;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
    user: {
        getAll: {
            query: import("zod").ZodObject<{
                page: import("zod").ZodEffects<import("zod").ZodOptional<import("zod").ZodNumber>, number, unknown>;
                itemsPerPage: import("zod").ZodEffects<import("zod").ZodOptional<import("zod").ZodNumber>, number, unknown>;
                search: import("zod").ZodOptional<import("zod").ZodString>;
                orderBy: import("zod").ZodEffects<import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodTypeAny>, import("zod").ZodArray<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodTypeAny>, "many">]>>, Record<string, any> | Record<string, any>[], unknown>;
                disablePagination: import("zod").ZodEffects<import("zod").ZodOptional<import("zod").ZodBoolean>, boolean, unknown>;
            }, "strip", import("zod").ZodTypeAny, {
                page?: number;
                itemsPerPage?: number;
                search?: string;
                orderBy?: Record<string, any> | Record<string, any>[];
                disablePagination?: boolean;
            }, {
                page?: unknown;
                itemsPerPage?: unknown;
                search?: string;
                orderBy?: unknown;
                disablePagination?: unknown;
            }>;
            summary: "Get all users";
            description: "Get all users";
            method: "GET";
            path: "/";
            responses: {
                200: import("zod").ZodType<{
                    data: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                    total: number;
                }, import("zod").ZodTypeDef, {
                    data: {
                        id?: string;
                        email?: string;
                        firstName?: string;
                        lastName?: string;
                        username?: string;
                        avatarUrl?: string;
                        password?: string;
                    }[];
                    total: number;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        get: {
            pathParams: import("zod").ZodObject<{
                username: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                username?: string;
            }, {
                username?: string;
            }>;
            summary: "Get user with his username";
            description: "Get user with his username";
            method: "GET";
            path: "/:username";
            responses: {
                200: import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    email: import("zod").ZodString;
                    firstName: import("zod").ZodString;
                    lastName: import("zod").ZodString;
                    username: import("zod").ZodString;
                    avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                    password: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
        update: {
            pathParams: import("zod").ZodObject<{
                userId: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                userId?: string;
            }, {
                userId?: string;
            }>;
            summary: "Update a user by its ID";
            description: "Update a user by its ID";
            method: "PATCH";
            body: import("zod").ZodObject<{
                avatarUrl: import("zod").ZodOptional<import("zod").ZodString>;
                username: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                avatarUrl?: string;
                username?: string;
            }, {
                avatarUrl?: string;
                username?: string;
            }>;
            path: "/:userId";
            responses: {
                200: import("zod").ZodObject<{
                    id: import("zod").ZodString;
                    email: import("zod").ZodString;
                    firstName: import("zod").ZodString;
                    lastName: import("zod").ZodString;
                    username: import("zod").ZodString;
                    avatarUrl: import("zod").ZodNullable<import("zod").ZodString>;
                    password: import("zod").ZodOptional<import("zod").ZodString>;
                }, "strip", import("zod").ZodTypeAny, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }, {
                    id?: string;
                    email?: string;
                    firstName?: string;
                    lastName?: string;
                    username?: string;
                    avatarUrl?: string;
                    password?: string;
                }>;
                404: import("zod").ZodObject<{
                    error: import("zod").ZodString;
                    message: import("zod").ZodString;
                }, "strip", import("zod").ZodTypeAny, {
                    error?: string;
                    message?: string;
                }, {
                    error?: string;
                    message?: string;
                }>;
            };
        };
    };
};
