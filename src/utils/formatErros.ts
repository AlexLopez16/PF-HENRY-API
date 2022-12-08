export const formatError = (msg: string) => {
    // formato de respuesta de errores.
    return {
        errors: [{ msg: msg }],
    };
};
