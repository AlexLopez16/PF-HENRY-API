export const formatError = (msg: string) => {
    // formato de respuesta de errrores.
    return {
        errors: [{ msg: msg }],
    };
};
